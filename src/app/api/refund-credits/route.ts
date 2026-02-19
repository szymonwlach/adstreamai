import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const { user_id, project_id, amount } = await req.json();

    // Pobierz aktualne kredyty użytkownika
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("credits")
      .eq("id", user_id)
      .single();

    if (userError) throw userError;

    // Dodaj kredyty z powrotem
    const { error: updateError } = await supabase
      .from("users")
      .update({ credits: userData.credits + amount })
      .eq("id", user_id);

    if (updateError) throw updateError;

    console.log(
      `✅ Refunded ${amount} credits to user ${user_id} for project ${project_id}`,
    );

    return NextResponse.json({ success: true, refunded: amount });
  } catch (error) {
    console.error("❌ Error refunding credits:", error);
    return NextResponse.json(
      { error: "Failed to refund credits" },
      { status: 500 },
    );
  }
}
