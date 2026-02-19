// app/api/reviews/my-review/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviewsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET - Fetch user's own review
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const [review] = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.user_id, user_id))
      .limit(1);

    if (!review) {
      return NextResponse.json(
        { has_review: false, review: null },
        { status: 200 },
      );
    }

    return NextResponse.json({
      has_review: true,
      review,
    });
  } catch (error) {
    console.error("Error fetching user review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
