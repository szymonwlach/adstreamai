// app/api/auth/tiktok/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { socialConnectionsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      console.error("❌ TikTok OAuth error:", error);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=tiktok_auth_failed#connect`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=missing_params#connect`
      );
    }

    console.log("🔑 Exchanging TikTok code for tokens...");

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/tiktok/callback`;

    const tokenResponse = await fetch(
      "https://open.tiktokapis.com/v2/oauth/token/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_key: process.env.TIKTOK_CLIENT_KEY!,
          client_secret: process.env.TIKTOK_CLIENT_SECRET!,
          code: code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error || !tokenData.data) {
      console.error("❌ Token exchange error:", tokenData);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=token_failed#connect`
      );
    }

    const { access_token, refresh_token, expires_in, open_id } = tokenData.data;

    console.log("✅ TikTok tokens received for open_id:", open_id);

    // Get user info
    const userInfoResponse = await fetch(
      "https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const userInfo = await userInfoResponse.json();

    if (userInfo.error || !userInfo.data) {
      console.error("❌ Failed to get user info:", userInfo);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=user_info_failed#connect`
      );
    }

    const { display_name } = userInfo.data.user;

    console.log("✅ TikTok user info:", display_name);

    // Check if connection exists
    const [existing] = await db
      .select()
      .from(socialConnectionsTable)
      .where(
        and(
          eq(socialConnectionsTable.user_id, state),
          eq(socialConnectionsTable.platform, "tiktok")
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
          platform_username: display_name || "TikTok User",
          platform_user_id: open_id,
          is_active: true,
          last_used_at: new Date(),
          last_token_refresh: new Date(),
        })
        .where(eq(socialConnectionsTable.id, existing.id));

      console.log("✅ Updated TikTok connection");
    } else {
      // Create new connection
      await db.insert(socialConnectionsTable).values({
        user_id: state,
        platform: "tiktok",
        platform_user_id: open_id,
        platform_username: display_name || "TikTok User",
        access_token,
        refresh_token: refresh_token || "",
        token_expires_at: expiresAt,
        is_active: true,
        connected_at: new Date(),
        last_used_at: new Date(),
        last_token_refresh: new Date(),
      });

      console.log("✅ Created new TikTok connection");
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?tiktok=connected#connect`
    );
  } catch (error: any) {
    console.error("❌ TikTok callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=tiktok_failed#connect`
    );
  }
}
