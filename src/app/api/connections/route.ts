// app/api/connections/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { socialConnectionsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Pobierz userId z query params
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    console.log("📤 Fetching connections for user:", userId);

    // Pobierz aktywne połączenia używając Drizzle
    const connections = await db
      .select({
        id: socialConnectionsTable.id,
        platform: socialConnectionsTable.platform,
        platform_username: socialConnectionsTable.platform_username,
        platform_user_id: socialConnectionsTable.platform_user_id,
        is_active: socialConnectionsTable.is_active,
        connected_at: socialConnectionsTable.connected_at,
        page_id: socialConnectionsTable.page_id,
        instagram_account_id: socialConnectionsTable.instagram_account_id,
      })
      .from(socialConnectionsTable)
      .where(
        and(
          eq(socialConnectionsTable.user_id, userId),
          eq(socialConnectionsTable.is_active, true)
        )
      );

    console.log("✅ Found connections:", connections.length);

    return NextResponse.json({
      connections,
      count: connections.length,
    });
  } catch (error: any) {
    console.error("❌ Error fetching connections:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Optional: POST endpoint to update connection status
export async function POST(request: NextRequest) {
  try {
    const { connectionId, isActive } = await request.json();

    if (!connectionId) {
      return NextResponse.json(
        { error: "Missing connectionId" },
        { status: 400 }
      );
    }

    // Update connection status
    const [updated] = await db
      .update(socialConnectionsTable)
      .set({
        is_active: isActive,
        last_used_at: new Date(),
      })
      .where(eq(socialConnectionsTable.id, connectionId))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Connection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      connection: updated,
    });
  } catch (error: any) {
    console.error("❌ Error updating connection:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
