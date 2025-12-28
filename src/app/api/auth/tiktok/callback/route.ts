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

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (error) {
      console.error("❌ TikTok OAuth error:", error);
      return NextResponse.redirect(
        `${baseUrl}/dashboard?error=tiktok_auth_failed#connect`
      );
    }

    if (!code || !state) {
      console.error("❌ Missing code or state");
      return NextResponse.redirect(
        `${baseUrl}/dashboard?error=missing_params#connect`
      );
    }

    console.log("🔑 Exchanging TikTok code for tokens...");

    const redirectUri = `${baseUrl}/api/auth/tiktok/callback`;

    // UWAGA: Upewnij się, że nazwy zmiennych w .env są zgodne
    const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;

    const tokenResponse = await fetch(
      "https://open.tiktokapis.com/v2/oauth/token/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cache-Control": "no-cache",
        },
        body: new URLSearchParams({
          client_key: clientKey!,
          client_secret: clientSecret!,
          code: code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    // TikTok zwraca błędy w polu 'error' lub jeśli 'data' nie istnieje
    if (tokenData.error || !tokenData.access_token) {
      console.error("❌ Token exchange error:", tokenData);
      return NextResponse.redirect(
        `${baseUrl}/dashboard?error=token_failed#connect`
      );
    }

    const { access_token, refresh_token, expires_in, open_id } = tokenData;

    console.log("✅ TikTok tokens received for open_id:", open_id);

    // Get user info z API v2
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
    let displayName = "TikTok User";

    if (userInfo.data && userInfo.data.user) {
      displayName = userInfo.data.user.display_name || "TikTok User";
      console.log("✅ TikTok user info fetched:", displayName);
    } else {
      console.warn("⚠️ Could not fetch user display name, using default");
    }

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

    const expiresAt = new Date(Date.now() + (expires_in || 86400) * 1000);

    if (existing) {
      // Update existing connection
      await db
        .update(socialConnectionsTable)
        .set({
          access_token,
          refresh_token: refresh_token || existing.refresh_token,
          token_expires_at: expiresAt,
          platform_username: displayName,
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
        platform_username: displayName,
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
      `${baseUrl}/dashboard?tiktok=connected#connect`
    );
  } catch (error: any) {
    console.error("❌ TikTok callback error:", error);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(
      `${baseUrl}/dashboard?error=tiktok_failed#connect`
    );
  }
}
