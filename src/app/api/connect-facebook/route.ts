// app/api/connect-facebook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { socialConnectionsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    console.log("🔗 Connecting Facebook for user:", userId);

    // Sprawdź czy użytkownik ma połączony Instagram z page_id
    const [instagramConnection] = await db
      .select()
      .from(socialConnectionsTable)
      .where(
        and(
          eq(socialConnectionsTable.user_id, userId),
          eq(socialConnectionsTable.platform, "instagram"),
          eq(socialConnectionsTable.is_active, true)
        )
      )
      .limit(1);

    if (!instagramConnection || !instagramConnection.page_id) {
      return NextResponse.json(
        {
          error:
            "You need to connect Instagram first. Facebook posting requires a Facebook Page connected through Instagram.",
        },
        { status: 400 }
      );
    }

    console.log(
      "✅ Found Instagram connection with page_id:",
      instagramConnection.page_id
    );

    // Sprawdź czy Facebook już nie jest połączony
    const [existingFacebook] = await db
      .select()
      .from(socialConnectionsTable)
      .where(
        and(
          eq(socialConnectionsTable.user_id, userId),
          eq(socialConnectionsTable.platform, "facebook"),
          eq(socialConnectionsTable.is_active, true)
        )
      )
      .limit(1);

    if (existingFacebook) {
      console.log("ℹ️ Facebook already connected");
      return NextResponse.json(
        {
          message: "Facebook is already connected",
          connection: existingFacebook,
        },
        { status: 200 }
      );
    }

    // Utwórz połączenie Facebook używając danych z Instagram
    const [newFacebookConnection] = await db
      .insert(socialConnectionsTable)
      .values({
        user_id: userId,
        platform: "facebook",
        platform_user_id: instagramConnection.page_id,
        platform_username: instagramConnection.platform_username,
        access_token: instagramConnection.access_token,
        refresh_token: instagramConnection.refresh_token,
        token_expires_at: instagramConnection.token_expires_at,
        page_id: instagramConnection.page_id,
        page_access_token: instagramConnection.page_access_token,
        instagram_account_id: instagramConnection.instagram_account_id,
        platform_metadata: instagramConnection.platform_metadata,
        is_active: true,
        connected_at: new Date(),
      })
      .returning();

    console.log("🎉 Facebook connection created successfully!");

    return NextResponse.json({
      success: true,
      connection: newFacebookConnection,
    });
  } catch (error: any) {
    console.error("❌ Error connecting Facebook:", error);
    return NextResponse.json(
      { error: "Failed to connect Facebook", details: error.message },
      { status: 500 }
    );
  }
}
