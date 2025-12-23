// app/api/disconnect-platform/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // Twoje połączenie z Drizzle
import { socialConnectionsTable } from "@/db/schema"; // Import schematu
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { userId, platform } = await req.json();

    if (!userId || !platform) {
      return NextResponse.json(
        { error: "Missing userId or platform" },
        { status: 400 }
      );
    }

    // Usuń połączenie z bazy używając Drizzle
    await db
      .delete(socialConnectionsTable)
      .where(
        and(
          eq(socialConnectionsTable.user_id, userId),
          eq(socialConnectionsTable.platform, platform)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error disconnecting platform:", error);
    return NextResponse.json(
      { error: "Failed to disconnect platform" },
      { status: 500 }
    );
  }
}
