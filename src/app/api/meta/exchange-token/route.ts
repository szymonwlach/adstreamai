// app/api/meta/exchange-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { socialConnectionsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Starting Meta OAuth exchange...");

    const { code, userId } = await request.json();

    if (!code || !userId) {
      console.error("❌ Missing code or userId");
      return NextResponse.json(
        { error: "Missing code or userId" },
        { status: 400 }
      );
    }

    console.log("✅ Received code and userId");

    // Check environment variables
    if (!process.env.NEXT_PUBLIC_META_APP_ID || !process.env.META_APP_SECRET) {
      console.error("❌ Missing META_APP_ID or META_APP_SECRET in environment");
      return NextResponse.json(
        { error: "Server configuration error: Missing Meta credentials" },
        { status: 500 }
      );
    }

    const redirectUri = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/auth/meta/callback`;
    console.log("🔗 Redirect URI:", redirectUri);

    // 1. Wymień code na access token
    console.log("1️⃣ Exchanging code for access token...");
    const tokenUrl =
      `https://graph.facebook.com/v21.0/oauth/access_token?` +
      `client_id=${process.env.NEXT_PUBLIC_META_APP_ID}&` +
      `client_secret=${process.env.META_APP_SECRET}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `code=${code}`;

    const tokenResponse = await fetch(tokenUrl);
    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("❌ Meta token error:", tokenData.error);
      return NextResponse.json(
        { error: tokenData.error.message || "Failed to get access token" },
        { status: 400 }
      );
    }

    console.log("✅ Got access token");

    // 2. Pobierz Facebook Pages użytkownika
    console.log("2️⃣ Fetching user's Facebook Pages...");
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?` +
        `access_token=${tokenData.access_token}&` +
        `fields=id,name,access_token,category`
    );
    const pagesData = await pagesResponse.json();

    if (pagesData.error) {
      console.error("❌ Pages error:", pagesData.error);
      return NextResponse.json(
        { error: pagesData.error.message || "Failed to get Facebook Pages" },
        { status: 400 }
      );
    }

    if (!pagesData.data || pagesData.data.length === 0) {
      console.error("❌ No Facebook Pages found");
      return NextResponse.json(
        {
          error:
            "No Facebook Page found. You need to create a Facebook Page and connect it to an Instagram Business Account.",
        },
        { status: 400 }
      );
    }

    console.log(`✅ Found ${pagesData.data.length} Facebook Page(s)`);
    const page = pagesData.data[0];
    const pageAccessToken = page.access_token;

    // 3. Pobierz Instagram Business Account połączony z Facebook Page
    console.log("3️⃣ Fetching Instagram Business Account...");
    const igResponse = await fetch(
      `https://graph.facebook.com/v21.0/${page.id}?` +
        `fields=instagram_business_account&` +
        `access_token=${pageAccessToken}`
    );
    const igData = await igResponse.json();

    if (igData.error) {
      console.error("❌ Instagram fetch error:", igData.error);
      return NextResponse.json(
        { error: igData.error.message || "Failed to fetch Instagram account" },
        { status: 400 }
      );
    }

    if (!igData.instagram_business_account?.id) {
      console.error("❌ No Instagram Business Account found for this Page");
      return NextResponse.json(
        {
          error:
            "No Instagram Business Account found. Please connect an Instagram Business Account to your Facebook Page in your Facebook settings.",
        },
        { status: 400 }
      );
    }

    const instagramAccountId = igData.instagram_business_account.id;
    console.log("✅ Found Instagram account:", instagramAccountId);

    // 4. Pobierz username Instagrama
    console.log("4️⃣ Fetching Instagram profile...");
    const igProfileResponse = await fetch(
      `https://graph.facebook.com/v21.0/${instagramAccountId}?` +
        `fields=username,name,profile_picture_url&` +
        `access_token=${pageAccessToken}`
    );
    const igProfile = await igProfileResponse.json();

    if (igProfile.error) {
      console.error("❌ Instagram profile error:", igProfile.error);
      return NextResponse.json(
        {
          error: igProfile.error.message || "Failed to fetch Instagram profile",
        },
        { status: 400 }
      );
    }

    console.log("✅ Got Instagram profile:", igProfile.username);

    // 5. Zamień na long-lived token (60 dni)
    console.log("5️⃣ Converting to long-lived token...");
    const longLivedResponse = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?` +
        `grant_type=fb_exchange_token&` +
        `client_id=${process.env.NEXT_PUBLIC_META_APP_ID}&` +
        `client_secret=${process.env.META_APP_SECRET}&` +
        `fb_exchange_token=${pageAccessToken}`
    );
    const longLivedData = await longLivedResponse.json();

    if (longLivedData.error) {
      console.error("⚠️ Long-lived token error:", longLivedData.error);
      console.log("Using short-lived token instead");
    } else {
      console.log("✅ Got long-lived token");
    }

    const finalPageToken = longLivedData.access_token || pageAccessToken;
    const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // 60 dni

    // 6. Zapisz/zaktualizuj w bazie danych
    console.log("6️⃣ Saving to database...");
    const existing = await db
      .select()
      .from(socialConnectionsTable)
      .where(
        and(
          eq(socialConnectionsTable.user_id, userId),
          eq(socialConnectionsTable.platform, "instagram")
        )
      )
      .limit(1);

    if (existing.length > 0) {
      console.log("Updating existing connection");
      await db
        .update(socialConnectionsTable)
        .set({
          platform_user_id: instagramAccountId,
          platform_username: igProfile.username || null,
          access_token: tokenData.access_token,
          page_access_token: finalPageToken,
          page_id: page.id,
          instagram_account_id: instagramAccountId,
          token_expires_at: expiresAt,
          is_active: true,
          last_token_refresh: new Date(),
          platform_metadata: {
            page_name: page.name,
            page_category: page.category,
            instagram_username: igProfile.username,
            instagram_name: igProfile.name,
            profile_picture: igProfile.profile_picture_url,
          },
        })
        .where(eq(socialConnectionsTable.id, existing[0].id));
    } else {
      console.log("Creating new connection");
      await db.insert(socialConnectionsTable).values({
        user_id: userId,
        platform: "instagram",
        platform_user_id: instagramAccountId,
        platform_username: igProfile.username || null,
        access_token: tokenData.access_token,
        page_access_token: finalPageToken,
        page_id: page.id,
        instagram_account_id: instagramAccountId,
        token_expires_at: expiresAt,
        is_active: true,
        last_token_refresh: new Date(),
        platform_metadata: {
          page_name: page.name,
          page_category: page.category,
          instagram_username: igProfile.username,
          instagram_name: igProfile.name,
          profile_picture: igProfile.profile_picture_url,
        },
      });
    }

    console.log("✅ Successfully connected Instagram!");

    return NextResponse.json({
      success: true,
      username: igProfile.username,
      instagramId: instagramAccountId,
    });
  } catch (error: any) {
    console.error("❌ Exchange token error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to connect Instagram" },
      { status: 500 }
    );
  }
}
