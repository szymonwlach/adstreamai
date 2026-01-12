// app/api/post-video/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  socialConnectionsTable,
  scheduledPostsTable,
  videosTable,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";

interface VideoData {
  id: string;
  video_url: string;
  caption?: string | null;
  hashtags?: string[] | null;
  style: string;
  project_id: string;
  user_id: string;
}

interface VideoDataWithDescription extends VideoData {
  description?: string;
}

interface PostResult {
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
}

interface PostOptions {
  facebookPostTypes?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const {
      videoId,
      platforms,
      userId,
      options,
      captions: providedCaptions,
    } = await request.json();

    if (!videoId || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [videoData] = await db
      .select()
      .from(videosTable)
      .where(eq(videosTable.id, videoId))
      .limit(1);

    if (!videoData) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const aiCaptions = (videoData.ai_captions as any) || {};

    const video: VideoData = {
      id: videoData.id,
      video_url: videoData.video_url,
      style: videoData.style,
      project_id: videoData.project_id,
      user_id: videoData.user_id,
    };

    console.log("🎬 Posting video with AI captions");
    console.log("📋 Available AI captions:", Object.keys(aiCaptions));
    console.log("🎯 Target platforms:", platforms);

    const results = [];

    for (const platform of platforms) {
      try {
        const [connection] = await db
          .select()
          .from(socialConnectionsTable)
          .where(
            and(
              eq(socialConnectionsTable.user_id, userId),
              eq(socialConnectionsTable.platform, platform),
              eq(socialConnectionsTable.is_active, true)
            )
          )
          .limit(1);

        if (!connection) {
          results.push({
            platform,
            success: false,
            error: "Platform not connected",
          });
          continue;
        }

        const normalizedPlatform =
          platform === "youtube_shorts" ? "youtube" : platform;

        let platformCaption;

        if (providedCaptions && providedCaptions[platform]) {
          platformCaption = providedCaptions[platform];
          console.log(`✏️ Using edited caption for ${platform}`);
        } else if (aiCaptions[normalizedPlatform]) {
          platformCaption = aiCaptions[normalizedPlatform];
          console.log(`🤖 Using AI caption for ${platform}`);
        } else {
          platformCaption = {
            text: video.caption || "",
            title: video.caption || "",
            description: video.caption || "",
            hashtags: video.hashtags || [],
          };
          console.log(`⚠️ Using fallback caption for ${platform}`);
        }

        // Przygotuj hashtagi
        let hashtagsArray: string[] = [];
        if (typeof platformCaption.hashtags === "string") {
          hashtagsArray = platformCaption.hashtags
            .split(/\s+/)
            .filter((h: string) => h.startsWith("#"));
        } else if (Array.isArray(platformCaption.hashtags)) {
          hashtagsArray = platformCaption.hashtags;
        } else if (Array.isArray(video.hashtags)) {
          hashtagsArray = video.hashtags;
        }

        // ========================================
        // FACEBOOK
        // ========================================
        if (platform === "facebook") {
          const postTypes = options?.facebookPostTypes || ["reels"];
          console.log(`👥 Facebook: Posting to ${postTypes.join(" + ")}`);

          for (const postType of postTypes) {
            try {
              const postResult = await postToFacebook(
                connection,
                {
                  ...video,
                  caption:
                    platformCaption.text ||
                    platformCaption.title ||
                    video.caption,
                },
                postType as "feed" | "reels"
              );

              // ✅ POPRAWIONE: captions zamiast caption
              await db.insert(scheduledPostsTable).values({
                user_id: userId,
                video_id: videoId,
                connection_id: connection.id,
                platform: "facebook" as any,
                scheduled_for: new Date(),
                status: postResult?.success ? "posted" : "failed",
                captions: {
                  facebook: {
                    title: `${postType.toUpperCase()}: ${
                      platformCaption.title ||
                      platformCaption.text ||
                      video.caption ||
                      ""
                    }`,
                    text:
                      platformCaption.text ||
                      platformCaption.title ||
                      video.caption ||
                      "",
                  },
                },
                hashtags: hashtagsArray,
                platform_post_id: postResult?.postId || null,
                platform_url: postResult?.url || null,
                error_message: postResult?.error || null,
                posted_at: postResult?.success ? new Date() : null,
              });

              results.push({
                platform: `facebook_${postType}`,
                success: postResult?.success || false,
                postId: postResult?.postId,
                url: postResult?.url,
                error: postResult?.error,
              });
            } catch (error: any) {
              console.error(`Error posting Facebook ${postType}:`, error);
              results.push({
                platform: `facebook_${postType}`,
                success: false,
                error: error.message || "Unknown error",
              });
            }
          }

          continue;
        }

        // ========================================
        // POZOSTAŁE PLATFORMY
        // ========================================
        let postResult: PostResult | undefined;

        const videoWithCaption = {
          ...video,
          caption:
            platformCaption.text ||
            platformCaption.title ||
            video.caption ||
            "",
        };

        if (platform === "instagram") {
          postResult = await postToInstagram(connection, videoWithCaption);
        } else if (platform === "tiktok") {
          postResult = await postToTikTok(connection, videoWithCaption);
        } else if (platform === "youtube_shorts") {
          const youtubeVideo: VideoDataWithDescription = {
            ...video,
            caption: platformCaption.title || video.caption || "",
            description: platformCaption.description || video.caption || "",
          };
          postResult = await postToYouTube(connection, youtubeVideo);
        } else {
          postResult = {
            success: false,
            error: "Platform not supported yet",
          };
        }

        // ✅ POPRAWIONE: captions z odpowiednim formatem dla każdej platformy
        const captionsObject: any = {};

        if (platform === "youtube_shorts") {
          captionsObject.youtube = {
            title: platformCaption.title || video.caption || "",
            description: platformCaption.description || video.caption || "",
          };
        } else if (platform === "instagram") {
          captionsObject.instagram = {
            text: platformCaption.text || video.caption || "",
            hashtags:
              typeof platformCaption.hashtags === "string"
                ? platformCaption.hashtags
                : (platformCaption.hashtags || []).join(" "),
          };
        } else if (platform === "tiktok") {
          captionsObject.tiktok = {
            text: platformCaption.text || video.caption || "",
          };
        }

        await db.insert(scheduledPostsTable).values({
          user_id: userId,
          video_id: videoId,
          connection_id: connection.id,
          platform: platform as any,
          scheduled_for: new Date(),
          status: postResult?.success ? "posted" : "failed",
          captions: captionsObject,
          hashtags: hashtagsArray,
          platform_post_id: postResult?.postId || null,
          platform_url: postResult?.url || null,
          error_message: postResult?.error || null,
          posted_at: postResult?.success ? new Date() : null,
        });

        results.push({
          platform,
          success: postResult?.success || false,
          postId: postResult?.postId,
          url: postResult?.url,
          error: postResult?.error,
        });
      } catch (error: any) {
        console.error(`Error posting to ${platform}:`, error);
        results.push({
          platform,
          success: false,
          error: error.message || "Unknown error",
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Error posting video:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// INSTAGRAM POSTING
// ============================================
async function postToInstagram(
  connection: any,
  video: VideoData
): Promise<PostResult> {
  try {
    const accessToken = connection.page_access_token || connection.access_token;
    const igAccountId = connection.instagram_account_id;

    if (!igAccountId) {
      throw new Error("Instagram account ID not found");
    }

    console.log("📸 Posting to Instagram Reels...");

    const containerResponse = await fetch(
      `https://graph.facebook.com/v21.0/${igAccountId}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          media_type: "REELS",
          video_url: video.video_url,
          caption: video.caption || "",
          access_token: accessToken,
        }),
      }
    );

    const containerData = await containerResponse.json();

    if (containerData.error) {
      throw new Error(`Instagram API Error: ${containerData.error.message}`);
    }

    const containerId = containerData.id;

    let status = "IN_PROGRESS";
    let attempts = 0;
    const maxAttempts = 30;

    while (status === "IN_PROGRESS" && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const statusResponse = await fetch(
        `https://graph.facebook.com/v21.0/${containerId}?fields=status_code&access_token=${accessToken}`
      );
      const statusData = await statusResponse.json();

      if (statusData.status_code) {
        status = statusData.status_code;
      }

      attempts++;
    }

    if (status !== "FINISHED") {
      throw new Error(`Video processing failed. Status: ${status}`);
    }

    const publishResponse = await fetch(
      `https://graph.facebook.com/v21.0/${igAccountId}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: accessToken,
        }),
      }
    );

    const publishData = await publishResponse.json();

    if (publishData.error) {
      throw new Error(`Instagram Publish Error: ${publishData.error.message}`);
    }

    return {
      success: true,
      postId: publishData.id,
      url: `https://www.instagram.com/reel/${publishData.id}/`,
    };
  } catch (error: any) {
    console.error("❌ Instagram error:", error);
    return {
      success: false,
      error: error.message || "Failed to post to Instagram",
    };
  }
}

// ============================================
// FACEBOOK POSTING
// ============================================
async function postToFacebook(
  connection: any,
  video: VideoData,
  postType: "feed" | "reels" = "reels"
): Promise<PostResult> {
  try {
    const accessToken = connection.page_access_token || connection.access_token;
    const pageId = connection.page_id;

    if (!pageId) {
      throw new Error("Facebook Page ID not found");
    }

    console.log(
      `👥 Posting to Facebook ${postType === "reels" ? "Reels" : "Feed"}...`
    );

    if (postType === "reels") {
      return await postToFacebookReels(pageId, accessToken, video);
    } else {
      return await postToFacebookFeed(pageId, accessToken, video);
    }
  } catch (error: any) {
    console.error("❌ Facebook error:", error);
    return {
      success: false,
      error: error.message || "Failed to post to Facebook",
    };
  }
}

async function postToFacebookReels(
  pageId: string,
  accessToken: string,
  video: VideoData
): Promise<PostResult> {
  console.log("🎬 Creating Facebook Reel...");

  const initResponse = await fetch(
    `https://graph.facebook.com/v21.0/${pageId}/video_reels`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        upload_phase: "start",
        access_token: accessToken,
      }),
    }
  );

  const initData = await initResponse.json();

  if (initData.error) {
    throw new Error(`Reels Init Error: ${initData.error.message}`);
  }

  const videoId = initData.video_id;
  const uploadUrl = initData.upload_url;

  console.log("✅ Upload session created:", videoId);

  const videoResponse = await fetch(video.video_url);
  const videoBlob = await videoResponse.blob();

  const uploadResponse = await fetch(uploadUrl, {
    method: "POST",
    body: videoBlob,
    headers: {
      "Content-Type": "video/mp4",
      Authorization: `OAuth ${accessToken}`,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error(`Upload failed: ${uploadResponse.statusText}`);
  }

  console.log("✅ Video uploaded");

  const publishResponse = await fetch(
    `https://graph.facebook.com/v21.0/${pageId}/video_reels`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        video_id: videoId,
        upload_phase: "finish",
        video_state: "PUBLISHED",
        description: video.caption || "",
        access_token: accessToken,
      }),
    }
  );

  const publishData = await publishResponse.json();

  if (publishData.error) {
    throw new Error(`Reels Publish Error: ${publishData.error.message}`);
  }

  console.log("🎉 Facebook Reel published:", publishData.id);

  return {
    success: true,
    postId: publishData.id,
    url: `https://www.facebook.com/reel/${publishData.id}`,
  };
}

async function postToFacebookFeed(
  pageId: string,
  accessToken: string,
  video: VideoData
): Promise<PostResult> {
  console.log("📰 Creating Facebook Feed post...");

  const response = await fetch(
    `https://graph.facebook.com/v21.0/${pageId}/videos`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file_url: video.video_url,
        description: video.caption || "",
        published: true,
        access_token: accessToken,
      }),
    }
  );

  const data = await response.json();

  if (data.error) {
    const errorMessage = data.error.message;
    const errorCode = data.error.code;

    console.error("❌ Facebook Feed Error:", {
      code: errorCode,
      message: errorMessage,
    });

    if (errorCode === 200 || errorCode === 190) {
      throw new Error(
        "Permission Error: Missing 'pages_manage_posts' permission"
      );
    } else if (errorCode === 10) {
      throw new Error(
        "Permission Error: Cannot post to this page. Check permissions."
      );
    } else {
      throw new Error(`Facebook API Error (${errorCode}): ${errorMessage}`);
    }
  }

  console.log("🎉 Posted to Facebook Feed:", data.id);

  return {
    success: true,
    postId: data.id,
    url: `https://www.facebook.com/${pageId}/videos/${data.id}`,
  };
}

// ============================================
// TIKTOK POSTING
// ============================================
async function postToTikTok(
  connection: any,
  video: VideoData
): Promise<PostResult> {
  try {
    let accessToken = connection.access_token;

    if (!accessToken) {
      throw new Error("TikTok access token not found");
    }

    console.log("🎵 === STARTING TIKTOK POST ===");
    console.log("👤 Username:", connection.platform_username);
    console.log(
      "🔑 Token (first 20 chars):",
      accessToken.substring(0, 20) + "..."
    );

    // ✅ KROK 1: Pobierz info o użytkowniku (sprawdź czy token działa)
    console.log("📋 Fetching user info to verify token...");
    const userInfoResponse = await fetch(
      "https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const userInfo = await userInfoResponse.json();
    console.log("👤 User info response:", JSON.stringify(userInfo, null, 2));

    // TikTok zwraca error.code === "ok" gdy wszystko jest OK
    if (userInfo.error && userInfo.error.code !== "ok") {
      console.error("❌ Token invalid or expired");

      // Próba odświeżenia tokenu
      if (connection.refresh_token) {
        console.log("🔄 Attempting token refresh...");
        const newToken = await refreshTikTokToken(
          connection.refresh_token,
          connection.id
        );

        if (!newToken) {
          throw new Error(
            "Token expired. Please reconnect your TikTok account."
          );
        }

        accessToken = newToken;
        console.log("✅ Token refreshed successfully");
      } else {
        throw new Error("Token invalid and no refresh token available");
      }
    } else {
      console.log("✅ Token valid, user:", userInfo.data?.display_name);
    }

    // ✅ KROK 2: Pobierz video i sprawdź jego rozmiar
    console.log("📥 Fetching video to get size...");
    const videoResponse = await fetch(video.video_url);

    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch video: ${videoResponse.statusText}`);
    }

    const videoBlob = await videoResponse.blob();
    const videoSize = videoBlob.size;

    console.log(
      "📦 Video size:",
      videoSize,
      "bytes (",
      (videoSize / 1024 / 1024).toFixed(2),
      "MB)"
    );

    // Sprawdź limity TikTok
    const MAX_SIZE = 287 * 1024 * 1024; // 287 MB
    const MIN_SIZE = 1024 * 1024; // 1 MB

    if (videoSize > MAX_SIZE) {
      throw new Error(
        `Video too large: ${(videoSize / 1024 / 1024).toFixed(2)}MB (max 287MB)`
      );
    }

    if (videoSize < MIN_SIZE) {
      throw new Error(
        `Video too small: ${(videoSize / 1024).toFixed(2)}KB (min 1MB)`
      );
    }

    // ✅ KROK 3: Oblicz chunk size
    const chunkSize = Math.min(videoSize, 10000000); // Max 10MB per chunk
    const totalChunkCount = Math.ceil(videoSize / chunkSize);

    console.log(
      "📦 Chunks:",
      totalChunkCount,
      "x",
      (chunkSize / 1024 / 1024).toFixed(2),
      "MB"
    );

    // ✅ KROK 4: Przygotuj caption (max 150 znaków dla TikTok)
    const title = video.caption?.slice(0, 150) || "Video Post";
    console.log("📝 Title:", title);

    // ✅ KROK 5: Przygotuj payload - SELF_ONLY dla sandbox mode
    const initPayload = {
      post_info: {
        title: title,
        privacy_level: "SELF_ONLY", // ⚠️ SELF_ONLY dla sandbox - zmień na PUBLIC_TO_EVERYONE po weryfikacji
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false,
        video_cover_timestamp_ms: 1000,
      },
      source_info: {
        source: "FILE_UPLOAD",
        video_size: videoSize,
        chunk_size: chunkSize,
        total_chunk_count: totalChunkCount,
      },
    };

    console.log("📦 Init payload:", JSON.stringify(initPayload, null, 2));

    // ✅ KROK 6: Initialize upload
    console.log("📤 Step 1: Initializing TikTok upload...");

    const initResponse = await fetch(
      "https://open.tiktokapis.com/v2/post/publish/video/init/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(initPayload),
      }
    );

    console.log("📥 Init response status:", initResponse.status);

    const initData = await initResponse.json();
    console.log("📥 Init response data:", JSON.stringify(initData, null, 2));

    if (initData.error) {
      console.error("❌ TikTok Init Error:", initData.error);

      // Konkretne komunikaty błędów
      if (
        initData.error.code ===
        "unaudited_client_can_only_post_to_private_accounts"
      ) {
        throw new Error(
          "⚠️ SANDBOX MODE: Your app is not verified. Change your TikTok account to PUBLIC + BUSINESS/CREATOR, " +
            "then reconnect. Video will be saved as DRAFT. To post publicly, submit app for review at: " +
            "https://developers.tiktok.com"
        );
      } else if (
        initData.error.code === "invalid_token" ||
        initData.error.code === "access_token_invalid"
      ) {
        throw new Error("Token expired. Please reconnect your TikTok account.");
      } else {
        throw new Error(`TikTok Init Error: ${JSON.stringify(initData.error)}`);
      }
    }

    if (
      !initData.data ||
      !initData.data.publish_id ||
      !initData.data.upload_url
    ) {
      console.error("❌ Missing data in init response:", initData);
      throw new Error("TikTok API returned invalid init data");
    }

    const { publish_id, upload_url } = initData.data;

    console.log("✅ Upload session created!");
    console.log("🆔 Publish ID:", publish_id);
    console.log(
      "🔗 Upload URL (first 50 chars):",
      upload_url.substring(0, 50) + "..."
    );

    // ✅ KROK 7: Upload video
    console.log("📤 Step 2: Uploading video file...");
    console.log("⏳ This may take a while for large videos...");

    const uploadResponse = await fetch(upload_url, {
      method: "PUT",
      body: videoBlob,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": videoSize.toString(),
      },
    });

    console.log("📥 Upload response status:", uploadResponse.status);

    if (!uploadResponse.ok) {
      const uploadError = await uploadResponse.text();
      console.error("❌ Upload failed:", uploadError);
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }

    console.log("✅ Video uploaded successfully!");

    // ✅ KROK 8: Check status with detailed logging
    console.log("📤 Step 3: Checking publish status...");
    console.log(
      "⏳ Waiting for video processing (checking every 3 seconds for up to 60 seconds)..."
    );

    let processingAttempts = 0;
    const maxAttempts = 20; // 60 seconds total
    let videoStatus = "PROCESSING_UPLOAD";
    let statusData: any = null;

    while (processingAttempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const statusResponse = await fetch(
        "https://open.tiktokapis.com/v2/post/publish/status/fetch/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ publish_id: publish_id }),
        }
      );

      statusData = await statusResponse.json();
      processingAttempts++;

      console.log(
        `\n📊 Status check #${processingAttempts}/${maxAttempts} (${
          processingAttempts * 3
        }s elapsed):`
      );
      console.log(JSON.stringify(statusData, null, 2));

      if (statusData.error) {
        console.error("❌ Status check error:", statusData.error);
        break;
      }

      if (statusData.data && statusData.data.status) {
        videoStatus = statusData.data.status;
        console.log(`🎬 Current status: ${videoStatus}`);

        if (videoStatus === "PUBLISH_COMPLETE") {
          console.log("✅ Video published successfully!");
          break;
        } else if (videoStatus === "FAILED") {
          console.log("❌ Video publishing failed!");
          if (statusData.data.fail_reason) {
            console.log("❌ Fail reason:", statusData.data.fail_reason);
          }
          throw new Error(
            `Publishing failed: ${
              statusData.data.fail_reason || "Unknown reason"
            }`
          );
        } else if (
          videoStatus === "PROCESSING_UPLOAD" ||
          videoStatus === "PROCESSING_DOWNLOAD"
        ) {
          console.log("⏳ Still processing...");
        } else {
          console.log("ℹ️ Unexpected status:", videoStatus);
        }
      } else {
        console.log("⚠️ No status in response");
      }
    }

    // ✅ KROK 9: Final report
    console.log("\n📊 === FINAL STATUS REPORT ===");
    console.log("Publish ID:", publish_id);
    console.log("Final Status:", videoStatus);
    console.log("Processing Attempts:", processingAttempts);
    console.log("Time Elapsed:", processingAttempts * 3, "seconds");

    // Detailed instructions based on status
    if (videoStatus === "PUBLISH_COMPLETE") {
      console.log("\n✅ SUCCESS!");
      console.log("📱 Check your TikTok profile:");
      console.log("   1. Open TikTok app");
      console.log("   2. Go to Profile");
      console.log("   3. Tap ☰ (hamburger menu top-right)");
      console.log("   4. Creator tools → Drafts (or Content)");
      console.log("   5. Video should be there as DRAFT/PRIVATE");
    } else if (
      videoStatus === "PROCESSING_UPLOAD" ||
      videoStatus === "PROCESSING_DOWNLOAD"
    ) {
      console.log("\n⏳ VIDEO STILL PROCESSING");
      console.log(
        "This is normal - TikTok can take 5-30 minutes to process video."
      );
      console.log("\n📱 Where to check:");
      console.log("   1. Open TikTok app");
      console.log("   2. Profile → ☰ (hamburger menu top-right)");
      console.log("   3. Creator tools → Drafts");
      console.log("   4. Or check: Profile → Videos (may appear as private)");
      console.log(
        "\n⏰ If not visible after 30 minutes, the upload may have failed."
      );
    } else if (videoStatus === "FAILED") {
      console.log("\n❌ UPLOAD FAILED");
      console.log("Reason:", statusData?.data?.fail_reason || "Unknown");
    }

    console.log("\n🔗 Publish ID for tracking:", publish_id);
    console.log("🎉 === TIKTOK POST COMPLETED ===\n");

    return {
      success:
        videoStatus === "PUBLISH_COMPLETE" ||
        videoStatus === "PROCESSING_UPLOAD" ||
        videoStatus === "PROCESSING_DOWNLOAD",
      postId: publish_id,
      url: `https://www.tiktok.com/@${connection.platform_username}/video/${publish_id}`,
    };
  } catch (error: any) {
    console.error("\n❌ === TIKTOK POST FAILED ===");
    console.error("❌ Error:", error.message);
    console.error("❌ Stack:", error.stack);
    return {
      success: false,
      error: error.message || "Failed to post to TikTok",
    };
  }
}
// ============================================
// YOUTUBE SHORTS POSTING
// ============================================
async function postToYouTube(
  connection: any,
  video: VideoDataWithDescription
): Promise<PostResult> {
  try {
    const accessToken = connection.access_token;
    const refreshToken = connection.refresh_token;

    if (!accessToken) {
      throw new Error("YouTube access token not found");
    }

    console.log("▶️ Posting to YouTube Shorts...");

    const videoResponse = await fetch(video.video_url);
    const videoBlob = await videoResponse.blob();
    const videoBuffer = Buffer.from(await videoBlob.arrayBuffer());

    const title = video.caption
      ? video.caption.slice(0, 100)
      : "Short Video #Shorts";

    const description = video.description || video.caption || "";

    const snippet = {
      title: title,
      description: description,
      tags: video.hashtags || [],
      categoryId: "22",
    };

    const status = {
      privacyStatus: "public",
      selfDeclaredMadeForKids: false,
    };

    console.log("📝 YouTube metadata:", {
      title: title,
      descriptionLength: description.length,
      tagsCount: (video.hashtags || []).length,
    });

    const initResponse = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Upload-Content-Length": videoBuffer.length.toString(),
          "X-Upload-Content-Type": "video/*",
        },
        body: JSON.stringify({
          snippet,
          status,
        }),
      }
    );

    if (!initResponse.ok) {
      const errorData = await initResponse.json();

      if (initResponse.status === 401 && refreshToken) {
        console.log("🔄 Token expired, refreshing...");
        const newAccessToken = await refreshYouTubeToken(
          refreshToken,
          connection.id
        );
        return await postToYouTube(
          { ...connection, access_token: newAccessToken },
          video
        );
      }

      throw new Error(
        `YouTube Init Error: ${errorData.error?.message || "Unknown error"}`
      );
    }

    const uploadUrl = initResponse.headers.get("location");
    if (!uploadUrl) {
      throw new Error("No upload URL received from YouTube");
    }

    console.log("✅ Upload session created");

    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "video/*",
      },
      body: videoBuffer,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }

    const uploadData = await uploadResponse.json();
    console.log("✅ Video uploaded to YouTube");

    const videoId = uploadData.id;

    console.log("🎉 YouTube Short published:", videoId);

    return {
      success: true,
      postId: videoId,
      url: `https://www.youtube.com/shorts/${videoId}`,
    };
  } catch (error: any) {
    console.error("❌ YouTube error:", error);
    return {
      success: false,
      error: error.message || "Failed to post to YouTube Shorts",
    };
  }
}

// ============================================
// REFRESH TOKENS
// ============================================
async function refreshYouTubeToken(
  refreshToken: string,
  connectionId: string
): Promise<string> {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.YOUTUBE_CLIENT_ID!,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`Token refresh failed: ${data.error_description}`);
    }

    const newAccessToken = data.access_token;
    const expiresIn = data.expires_in;

    await db
      .update(socialConnectionsTable)
      .set({
        access_token: newAccessToken,
        token_expires_at: new Date(Date.now() + expiresIn * 1000),
        last_token_refresh: new Date(),
      })
      .where(eq(socialConnectionsTable.id, connectionId));

    console.log("✅ YouTube token refreshed");

    return newAccessToken;
  } catch (error: any) {
    console.error("❌ Failed to refresh YouTube token:", error);
    throw error;
  }
}

async function refreshTikTokToken(
  refreshToken: string,
  connectionId: string
): Promise<string | null> {
  try {
    if (!refreshToken) {
      console.error("❌ No refresh token available");
      return null;
    }

    console.log("🔄 Refreshing TikTok token...");

    const response = await fetch(
      "https://open.tiktokapis.com/v2/oauth/token/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_key: process.env.TIKTOK_CLIENT_KEY!,
          client_secret: process.env.TIKTOK_CLIENT_SECRET!,
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      }
    );

    const data = await response.json();

    if (data.error || !data.data) {
      console.error("❌ Token refresh failed:", data.error);
      return null;
    }

    const newAccessToken = data.data.access_token;
    const newRefreshToken = data.data.refresh_token;
    const expiresIn = data.data.expires_in;

    await db
      .update(socialConnectionsTable)
      .set({
        access_token: newAccessToken,
        refresh_token: newRefreshToken || refreshToken,
        token_expires_at: new Date(Date.now() + expiresIn * 1000),
        last_token_refresh: new Date(),
      })
      .where(eq(socialConnectionsTable.id, connectionId));

    console.log("✅ TikTok token refreshed successfully");

    return newAccessToken;
  } catch (error: any) {
    console.error("❌ Failed to refresh TikTok token:", error);
    return null;
  }
}
