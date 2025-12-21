// app/api/post-video/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  socialConnectionsTable,
  scheduledPostsTable,
  videosTable,
  projectsTable,
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

    // Pobierz video z bazy
    const [videoData] = await db
      .select()
      .from(videosTable)
      .where(eq(videosTable.id, videoId))
      .limit(1);

    if (!videoData) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Pobierz ai_captions z JSONB
    const aiCaptions = (videoData.ai_captions as any) || {};

    const video: VideoData = {
      id: videoData.id,
      video_url: videoData.video_url,
      caption: videoData.caption,
      hashtags: videoData.hashtags,
      style: videoData.style,
      project_id: videoData.project_id,
      user_id: videoData.user_id,
    };

    console.log("🎬 Posting video with AI captions");
    console.log("📋 Available AI captions:", Object.keys(aiCaptions));
    console.log("🎯 Target platforms:", platforms);

    const results = [];

    // Dla każdej platformy
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

        // Pobierz custom caption z modala lub użyj AI caption z bazy
        const normalizedPlatform =
          platform === "youtube_shorts" ? "youtube" : platform;

        let platformCaption;

        if (providedCaptions && providedCaptions[platform]) {
          // Użyj edytowanych captionów z modala
          platformCaption = providedCaptions[platform];
          console.log(`✏️ Using edited caption for ${platform}`);
        } else if (aiCaptions[normalizedPlatform]) {
          // Użyj AI-generated captionów z bazy
          platformCaption = aiCaptions[normalizedPlatform];
          console.log(`🤖 Using AI caption for ${platform}`);
        } else {
          // Fallback do podstawowych danych
          platformCaption = {
            text: video.caption || "",
            title: video.caption || "",
            description: video.caption || "",
            hashtags: video.hashtags || [],
          };
          console.log(`⚠️ Using fallback caption for ${platform}`);
        }

        // ========================================
        // SPECJALNA OBSŁUGA DLA FACEBOOKA
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

              // Przygotuj hashtagi
              let hashtagsArray: string[] = [];
              if (typeof platformCaption.hashtags === "string") {
                hashtagsArray = platformCaption.hashtags
                  .split(/\s+/)
                  .filter((h) => h.startsWith("#"));
              } else if (Array.isArray(platformCaption.hashtags)) {
                hashtagsArray = platformCaption.hashtags;
              } else if (Array.isArray(video.hashtags)) {
                hashtagsArray = video.hashtags;
              }

              await db.insert(scheduledPostsTable).values({
                user_id: userId,
                video_id: videoId,
                connection_id: connection.id,
                platform: "facebook" as any,
                scheduled_for: new Date(),
                status: postResult?.success ? "posted" : "failed",
                caption: `${
                  platformCaption.text ||
                  platformCaption.title ||
                  video.caption ||
                  ""
                } [${postType.toUpperCase()}]`,
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

        // Przygotuj dane do postowania z odpowiednim captionem
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
          // Dla YouTube przekaż tytuł i opis
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

        // Przygotuj hashtagi
        let hashtagsArray: string[] = [];
        if (typeof platformCaption.hashtags === "string") {
          hashtagsArray = platformCaption.hashtags
            .split(/\s+/)
            .filter((h) => h.startsWith("#"));
        } else if (Array.isArray(platformCaption.hashtags)) {
          hashtagsArray = platformCaption.hashtags;
        } else if (Array.isArray(video.hashtags)) {
          hashtagsArray = video.hashtags;
        }

        // Zapisz scheduled post
        await db.insert(scheduledPostsTable).values({
          user_id: userId,
          video_id: videoId,
          connection_id: connection.id,
          platform: platform as any,
          scheduled_for: new Date(),
          status: postResult?.success ? "posted" : "failed",
          caption:
            platformCaption.text ||
            platformCaption.title ||
            video.caption ||
            "",
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
// INSTAGRAM POSTING (REELS)
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

    // Create media container
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

    // Poll for status
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

    // Publish
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
// FACEBOOK POSTING - REELS LUB FEED
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

// Funkcja do postowania na Facebook Reels
async function postToFacebookReels(
  pageId: string,
  accessToken: string,
  video: VideoData
): Promise<PostResult> {
  console.log("🎬 Creating Facebook Reel...");

  // Step 1: Initialize upload session
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

  // Step 2: Upload video file
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

  // Step 3: Finalize and publish
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

// Funkcja do postowania na Facebook Feed (zwykły post)
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
// TIKTOK POSTING (TODO)
// ============================================
async function postToTikTok(
  connection: any,
  video: VideoData
): Promise<PostResult> {
  console.log("🎵 TikTok not implemented yet");
  return {
    success: false,
    error: "TikTok posting not implemented yet",
  };
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

    // Krok 1: Pobierz plik wideo
    const videoResponse = await fetch(video.video_url);
    const videoBlob = await videoResponse.blob();
    const videoBuffer = Buffer.from(await videoBlob.arrayBuffer());

    // Krok 2: Przygotuj metadata dla YouTube
    const title = video.caption
      ? video.caption.slice(0, 100)
      : "Short Video #Shorts";

    const description = video.description || video.caption || "";

    const snippet = {
      title: title,
      description: description,
      tags: video.hashtags || [],
      categoryId: "22", // 22 = People & Blogs
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

    // Krok 3: Utwórz resumable upload session
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

      // Jeśli token wygasł, spróbuj odświeżyć
      if (initResponse.status === 401 && refreshToken) {
        console.log("🔄 Token expired, refreshing...");
        const newAccessToken = await refreshYouTubeToken(
          refreshToken,
          connection.id
        );
        // Retry z nowym tokenem
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

    // Krok 4: Upload pliku wideo
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
// REFRESH YOUTUBE TOKEN
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
    const expiresIn = data.expires_in; // seconds

    // Zaktualizuj token w bazie danych
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
