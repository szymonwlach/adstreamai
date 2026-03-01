import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// Mapowanie Price ID ze Stripe na nazwy planów
const PLAN_MAP: Record<string, string> = {
  // Plan STARTER
  price_1T2WB5Cm9MZJpse9yE1y7sw2: "starter", // Miesięczny
  price_1T2WlbCm9MZJpse9q9ZlPw5N: "starter", // Roczny

  // Plan PRO
  price_1T2WFPCm9MZJpse9vbN0mGFa: "pro", // Miesięczny
  price_1T2WnXCm9MZJpse9D7tcXiZ7: "pro", // Roczny

  // Plan SCALE
  price_1T2WHFCm9MZJpse9SF11AL1f: "scale", // Miesięczny
  price_1T2XCZCm9MZJpse9jOy2V7Kw: "scale", // Roczny
};

// Ile kredytów dodajemy przy zakupie/odnowieniu
const CREDITS_MAP: Record<string, number> = {
  starter: 300,
  pro: 750,
  scale: 2000,
};

function safeDate(timestamp: any): string | null {
  if (!timestamp || isNaN(Number(timestamp))) return null;
  try {
    return new Date(Number(timestamp) * 1000).toISOString();
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!supabaseUrl || !supabaseKey || !stripeKey || !webhookSecret) {
    console.error("Missing env vars");
    return NextResponse.json(
      { message: "Server misconfiguration." },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const stripe = new Stripe(stripeKey);

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig)
    return NextResponse.json({ message: "No signature." }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return NextResponse.json(
      { message: "Invalid signature." },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        let userId = session.metadata?.userId;

        if (!userId) {
          const customerEmail = session.customer_details?.email;
          if (!customerEmail) break;
          const { data: userByEmail } = await supabase
            .from("users")
            .select("id")
            .eq("email", customerEmail)
            .single();
          userId = userByEmail?.id;
        }

        if (!userId) break;

        const subscriptionId = session.subscription as string;
        const subscription = (await stripe.subscriptions.retrieve(
          subscriptionId,
        )) as any;
        const priceId = subscription.items.data[0].price.id;
        const plan = PLAN_MAP[priceId] ?? "starter";
        const periodEnd = safeDate(subscription.current_period_end);

        // 1. Aktualizacja subskrypcji
        const { error: subError } = await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: session.customer as string,
            stripe_price_id: priceId,
            status: "active",
            ...(periodEnd ? { current_period_end: periodEnd } : {}),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );
        if (subError)
          console.error("Supabase upsert subscription error:", subError);

        // 2. Pobierz stare kredyty i dodaj nowe
        const { data: user, error: userFetchError } = await supabase
          .from("users")
          .select("credits")
          .eq("id", userId)
          .single();
        if (userFetchError)
          console.error("Supabase fetch user error:", userFetchError);

        const currentCredits = user?.credits || 0;
        const addedCredits = CREDITS_MAP[plan] || 0;

        const { error: userUpdateError } = await supabase
          .from("users")
          .update({
            plan,
            credits: currentCredits + addedCredits,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
        if (userUpdateError)
          console.error("Supabase update user error:", userUpdateError);

        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;

        // ✅ FIX: Pomiń pierwszą fakturę — kredyty już dodane przez checkout.session.completed
        if (invoice.billing_reason === "subscription_create") break;

        const subId =
          invoice.subscription ||
          invoice.parent?.subscription_details?.subscription;
        if (!subId) break;

        const sub = (await stripe.subscriptions.retrieve(subId)) as any;
        const priceId = sub.items.data[0].price.id;
        const plan = PLAN_MAP[priceId] ?? "starter";
        const periodEnd = safeDate(sub.current_period_end);

        const { data: existingSub } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", subId)
          .single();
        if (!existingSub?.user_id) break;

        const { error: subUpdateError } = await supabase
          .from("subscriptions")
          .update({
            status: "active",
            stripe_price_id: priceId,
            ...(periodEnd ? { current_period_end: periodEnd } : {}),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subId);
        if (subUpdateError)
          console.error("Supabase update subscription error:", subUpdateError);

        // Dodanie kredytów przy odnowieniu (monthly/yearly)
        const { data: user, error: userFetchError } = await supabase
          .from("users")
          .select("credits")
          .eq("id", existingSub.user_id)
          .single();
        if (userFetchError)
          console.error("Supabase fetch user error:", userFetchError);

        const renewedCredits = (user?.credits || 0) + (CREDITS_MAP[plan] || 0);

        const { error: userUpdateError } = await supabase
          .from("users")
          .update({
            plan,
            credits: renewedCredits,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingSub.user_id);
        if (userUpdateError)
          console.error("Supabase update user error:", userUpdateError);

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        const subId = invoice.subscription;
        if (subId) {
          const { error } = await supabase
            .from("subscriptions")
            .update({
              status: "past_due",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subId);
          if (error) console.error("Supabase update past_due error:", error);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        const { data: existingSub } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", sub.id)
          .single();

        if (existingSub?.user_id) {
          const { error: subError } = await supabase
            .from("subscriptions")
            .update({
              status: "cancelled",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", sub.id);
          if (subError)
            console.error("Supabase cancel subscription error:", subError);

          // Użytkownik wraca na free - nie zerujemy mu kredytów, które już kupił, ale zmieniamy plan
          const { error: userError } = await supabase
            .from("users")
            .update({
              plan: "free",
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingSub.user_id);
          if (userError)
            console.error("Supabase update user to free error:", userError);
        }
        break;
      }
    }
  } catch (err) {
    console.error("Webhook Error:", err);
    return NextResponse.json(
      { message: "Webhook handler failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
