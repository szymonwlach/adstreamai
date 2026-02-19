import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const PLAN_MAP: Record<string, string> = {
  // ⚠️ Zamień na swoje prawdziwe Price IDs ze Stripe Dashboard
  price_starter_monthly_placeholder: "starter",
  price_starter_yearly_placeholder: "starter",
  price_pro_monthly_placeholder: "pro",
  price_pro_yearly_placeholder: "pro",
  price_scale_monthly_placeholder: "scale",
  price_scale_yearly_placeholder: "scale",
};

const CREDITS_MAP: Record<string, number> = {
  starter: 300,
  pro: 750,
  scale: 2000,
};

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

  if (!sig) {
    return NextResponse.json({ message: "No signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature error:", err);
    return NextResponse.json(
      { message: "Invalid signature." },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      // ────────────────────────────────────────────
      // Nowa subskrypcja
      // ────────────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId) {
          console.error("checkout.session.completed: brak userId w metadata");
          break;
        }

        const subscriptionId = session.subscription as string;
        const subscription = (await stripe.subscriptions.retrieve(
          subscriptionId,
        )) as any;
        const priceId = subscription.items.data[0].price.id;
        const plan = PLAN_MAP[priceId] ?? "starter";

        const { error: subError } = await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: session.customer as string,
            stripe_price_id: priceId,
            status: "active",
            current_period_end: new Date(
              subscription.current_period_end * 1000,
            ).toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );

        if (subError) throw subError;

        const { error: userError } = await supabase
          .from("users")
          .update({
            plan,
            credits: CREDITS_MAP[plan],
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (userError) throw userError;

        console.log(
          `✅ checkout.session.completed: userId=${userId}, plan=${plan}`,
        );
        break;
      }

      // ────────────────────────────────────────────
      // Odnowienie subskrypcji — odśwież kredyty
      // ────────────────────────────────────────────
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = (invoice as any).subscription as string | undefined;

        if (!subId) {
          console.log("invoice.payment_succeeded: brak subId, pomijam");
          break;
        }

        const sub = (await stripe.subscriptions.retrieve(subId)) as any;
        const priceId = sub.items.data[0].price.id;
        const plan = PLAN_MAP[priceId] ?? "starter";

        const { data: existingSub, error: findError } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", subId)
          .single();

        if (findError || !existingSub?.user_id) {
          console.log(
            "invoice.payment_succeeded: nie znaleziono subskrypcji w bazie",
          );
          break;
        }

        const { error: subError } = await supabase
          .from("subscriptions")
          .update({
            status: "active",
            stripe_price_id: priceId,
            current_period_end: new Date(
              sub.current_period_end * 1000,
            ).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subId);

        if (subError) throw subError;

        const { error: userError } = await supabase
          .from("users")
          .update({
            plan,
            credits: CREDITS_MAP[plan],
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingSub.user_id);

        if (userError) throw userError;

        console.log(
          `✅ invoice.payment_succeeded: userId=${existingSub.user_id}, credits=${CREDITS_MAP[plan]}`,
        );
        break;
      }

      // ────────────────────────────────────────────
      // Nieudana płatność
      // ────────────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = (invoice as any).subscription as string | undefined;

        if (!subId) break;

        const { error } = await supabase
          .from("subscriptions")
          .update({ status: "past_due", updated_at: new Date().toISOString() })
          .eq("stripe_subscription_id", subId);

        if (error) throw error;

        console.log(`⚠️ invoice.payment_failed: subId=${subId}`);
        break;
      }

      // ────────────────────────────────────────────
      // Upgrade / downgrade planu
      // ────────────────────────────────────────────
      case "customer.subscription.updated": {
        const sub = event.data.object as any;
        const priceId = sub.items.data[0].price.id;
        const plan = PLAN_MAP[priceId] ?? "starter";

        const { data: existingSub, error: findError } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", sub.id)
          .single();

        if (findError || !existingSub?.user_id) break;

        const { error: subError } = await supabase
          .from("subscriptions")
          .update({
            stripe_price_id: priceId,
            status: sub.status as any,
            current_period_end: new Date(
              sub.current_period_end * 1000,
            ).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", sub.id);

        if (subError) throw subError;

        const { error: userError } = await supabase
          .from("users")
          .update({ plan, updated_at: new Date().toISOString() })
          .eq("id", existingSub.user_id);

        if (userError) throw userError;

        console.log(
          `✅ customer.subscription.updated: userId=${existingSub.user_id}, plan=${plan}`,
        );
        break;
      }

      // ────────────────────────────────────────────
      // Anulowanie subskrypcji
      // ────────────────────────────────────────────
      case "customer.subscription.deleted": {
        const sub = event.data.object as any;

        const { data: existingSub, error: findError } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", sub.id)
          .single();

        if (findError || !existingSub?.user_id) break;

        const { error: subError } = await supabase
          .from("subscriptions")
          .update({ status: "cancelled", updated_at: new Date().toISOString() })
          .eq("stripe_subscription_id", sub.id);

        if (subError) throw subError;

        const { error: userError } = await supabase
          .from("users")
          .update({
            plan: "free",
            credits: 50,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingSub.user_id);

        if (userError) throw userError;

        console.log(
          `✅ customer.subscription.deleted: userId=${existingSub.user_id}`,
        );
        break;
      }

      default:
        console.log(`Nieobsługiwany event: ${event.type}`);
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
