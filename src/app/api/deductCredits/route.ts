// app/api/deductCredits/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { usersTable } from "@/db/schema"; // Upewnij się że masz tabelę users w schema

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    const { user_id, credits_to_deduct, project_ids } = body;

    console.log("💳 Deduct Credits Request:", {
      user_id,
      credits_to_deduct,
      project_ids,
    });

    if (!user_id || !credits_to_deduct || credits_to_deduct <= 0) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 },
      );
    }

    // 1. Pobierz aktualne kredyty użytkownika
    const [userData] = await db
      .select({ credits: usersTable.credits })
      .from(usersTable)
      .where(eq(usersTable.id, user_id))
      .limit(1);

    if (!userData) {
      console.error("❌ User not found:", user_id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("👤 Current user credits:", userData.credits);

    // 2. Sprawdź czy ma wystarczająco kredytów
    if (userData.credits < credits_to_deduct) {
      console.error("❌ Insufficient credits");
      return NextResponse.json(
        {
          error: "Insufficient credits",
          current_credits: userData.credits,
          required_credits: credits_to_deduct,
        },
        { status: 402 },
      );
    }

    // 3. Odejmij kredyty
    const newCredits = userData.credits - credits_to_deduct;

    await db
      .update(usersTable)
      .set({ credits: newCredits })
      .where(eq(usersTable.id, user_id));

    console.log(`✅ Credits deducted: ${userData.credits} → ${newCredits}`);

    return NextResponse.json({
      success: true,
      new_credits: newCredits,
      deducted: credits_to_deduct,
      previous_credits: userData.credits,
    });
  } catch (error: any) {
    console.error("❌ Error in deductCredits:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
