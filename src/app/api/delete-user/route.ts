// app/api/delete-user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user from the request
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Update user status to inactive using Drizzle
    await db
      .update(usersTable)
      .set({
        is_active: false,
        deleted_at: new Date(), // Save when user requested deletion
        updated_at: new Date(),
      })
      .where(eq(usersTable.email, email));

    return NextResponse.json({
      success: true,
      message: "Account marked for deletion",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
