// app/api/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviewsTable, reviewResponsesTable, usersTable } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

// GET - Fetch all published reviews
export async function GET(request: NextRequest) {
  try {
    console.log("[Reviews API] GET request received");

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    console.log(
      "[Reviews API] Fetching reviews with limit:",
      limit,
      "offset:",
      offset,
    );

    const reviews = await db
      .select({
        id: reviewsTable.id,
        user_name: reviewsTable.user_name,
        user_avatar: reviewsTable.user_avatar,
        rating: reviewsTable.rating,
        title: reviewsTable.title,
        content: reviewsTable.content,
        is_verified: reviewsTable.is_verified,
        created_at: reviewsTable.created_at,
      })
      .from(reviewsTable)
      .where(eq(reviewsTable.is_published, true))
      .orderBy(desc(reviewsTable.created_at))
      .limit(limit)
      .offset(offset);

    console.log("[Reviews API] Found", reviews.length, "reviews");

    // Get average rating
    const allReviews = await db
      .select({ rating: reviewsTable.rating })
      .from(reviewsTable)
      .where(eq(reviewsTable.is_published, true));

    const averageRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

    console.log("[Reviews API] Average rating:", averageRating);

    return NextResponse.json({
      reviews,
      total: allReviews.length,
      average_rating: parseFloat(averageRating.toFixed(1)),
      has_more: reviews.length === limit,
    });
  } catch (error) {
    console.error("[Reviews API] Error fetching reviews:", error);
    // Return proper JSON error response
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        reviews: [],
        total: 0,
        average_rating: 0,
        has_more: false,
      },
      { status: 500 },
    );
  }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      user_email,
      user_name,
      user_avatar,
      rating,
      title,
      content,
    } = body;

    // Validation
    if (!user_id || !user_email || !rating || !title || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    // Check if user already has a review
    const existingReview = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.user_id, user_id))
      .limit(1);

    if (existingReview.length > 0) {
      return NextResponse.json(
        {
          error:
            "You have already submitted a review. You can edit your existing review instead.",
        },
        { status: 409 },
      );
    }

    // Create review
    const [newReview] = await db
      .insert(reviewsTable)
      .values({
        user_id,
        user_email,
        user_name: user_name || user_email.split("@")[0],
        user_avatar,
        rating,
        title,
        content,
        is_published: true,
        is_verified: false,
      })
      .returning();

    return NextResponse.json({
      success: true,
      review: newReview,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
