// app/api/auth/youtube/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { socialConnectionsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state"); // user_id
    const error = searchParams.get("error");

    if (error) {
      console.error("❌ YouTube OAuth error:", error);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=youtube_auth_failed`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=missing_params`
      );
    }

    console.log("🔑 Exchanging YouTube code for tokens...");

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        client_id: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/youtube/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("❌ Token exchange error:", tokenData);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=token_failed`
      );
    }

    const { access_token, refresh_token, expires_in } = tokenData;

    // Get channel info
    const channelResponse = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const channelData = await channelResponse.json();

    if (!channelData.items || channelData.items.length === 0) {
      console.error("❌ No YouTube channel found");
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=no_channel`
      );
    }

    const channel = channelData.items[0];
    const channelId = channel.id;
    const channelTitle = channel.snippet.title;

    console.log("✅ YouTube channel found:", channelTitle);

    // Check if connection exists
    const [existing] = await db
      .select()
      .from(socialConnectionsTable)
      .where(
        and(
          eq(socialConnectionsTable.user_id, state),
          eq(socialConnectionsTable.platform, "youtube_shorts")
        )
      )
      .limit(1);

    const expiresAt = new Date(Date.now() + expires_in * 1000);

    if (existing) {
      // Update existing connection
      await db
        .update(socialConnectionsTable)
        .set({
          access_token,
          refresh_token: refresh_token || existing.refresh_token,
          token_expires_at: expiresAt,
          platform_username: channelTitle,
          platform_user_id: channelId,
          is_active: true,
          last_used_at: new Date(),
          last_token_refresh: new Date(),
        })
        .where(eq(socialConnectionsTable.id, existing.id));

      console.log("✅ Updated YouTube connection");
    } else {
      // Create new connection
      await db.insert(socialConnectionsTable).values({
        user_id: state,
        platform: "youtube_shorts",
        platform_user_id: channelId,
        platform_username: channelTitle,
        access_token,
        refresh_token: refresh_token || "",
        token_expires_at: expiresAt,
        is_active: true,
        connected_at: new Date(),
        last_used_at: new Date(),
        last_token_refresh: new Date(),
      });

      console.log("✅ Created new YouTube connection");
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?youtube=connected#connect`
    );
  } catch (error: any) {
    console.error("❌ YouTube callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=youtube_failed`
    );
  }
}
