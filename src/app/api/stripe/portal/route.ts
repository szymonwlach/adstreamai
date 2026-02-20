import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!supabaseUrl || !supabaseKey || !stripeKey || !appUrl) {
    return NextResponse.json(
      { message: "Server misconfiguration." },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const stripe = new Stripe(stripeKey);

  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Missing userId." }, { status: 400 });
    }

    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (error || !subscription?.stripe_customer_id) {
      return NextResponse.json(
        { message: "No active subscription found." },
        { status: 404 },
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${appUrl}/dashboard/billing`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err) {
    console.error("Portal error:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
