import { getPlan } from "@/lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 },
      );
    }

    // Po naprawie getPlan zwróci { plan: "free", credits: 100 }
    const planData = await getPlan(user_id);

    console.log("✅ Plan data:", planData);

    // Zwróć bezpośrednio obiekt (bez zagnieżdżania w "plan")
    return NextResponse.json(planData);
  } catch (error) {
    console.error("❌ Error in /api/getPlan:", error);
    return NextResponse.json({ plan: "free", credits: 0 }, { status: 500 });
  }
}
