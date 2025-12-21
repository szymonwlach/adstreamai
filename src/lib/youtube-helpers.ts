// lib/youtube-helpers.ts
import { db } from "@/db";
import { socialConnectionsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

interface YouTubeTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

/**
 * Refresh YouTube access token if expired
 */
export async function refreshYouTubeToken(
  connectionId: string
): Promise<string> {
  try {
    const [connection] = await db
      .select()
      .from(socialConnectionsTable)
      .where(eq(socialConnectionsTable.id, connectionId))
      .limit(1);

    if (!connection) {
      throw new Error("Connection not found");
    }

    // Check if token is still valid (with 5 min buffer)
    const now = new Date();
    const expiresAt = new Date(connection.token_expires_at || 0);
    const bufferTime = 5 * 60 * 1000; // 5 minutes

    if (expiresAt.getTime() - now.getTime() > bufferTime) {
      console.log("✅ Token still valid");
      return connection.access_token;
    }

    console.log("🔄 Refreshing YouTube token...");

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET,
        refresh_token: connection.refresh_token,
        grant_type: "refresh_token",
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("❌ Token refresh failed:", data.error);
      throw new Error(`Token refresh failed: ${data.error_description}`);
    }

    const newExpiresAt = new Date(Date.now() + data.expires_in * 1000);

    // Update token in database
    await db
      .update(socialConnectionsTable)
      .set({
        access_token: data.access_token,
        token_expires_at: newExpiresAt,
        last_token_refresh: new Date(),
      })
      .where(eq(socialConnectionsTable.id, connectionId));

    console.log("✅ Token refreshed successfully");
    return data.access_token;
  } catch (error: any) {
    console.error("❌ Error refreshing YouTube token:", error);
    throw error;
  }
}

/**
 * Get valid YouTube access token (refreshes if needed)
 */
export async function getValidYouTubeToken(
  connectionId: string
): Promise<string> {
  return await refreshYouTubeToken(connectionId);
}

/**
 * Upload video to YouTube
 */
export async function uploadToYouTube(
  accessToken: string,
  videoUrl: string,
  title: string,
  description: string,
  tags: string[] = []
): Promise<{
  success: boolean;
  videoId?: string;
  url?: string;
  error?: string;
}> {
  try {
    console.log("📹 Starting YouTube upload...");

    // Download video file
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error("Failed to download video");
    }
    const videoBlob = await videoResponse.blob();

    console.log("✅ Video downloaded, size:", videoBlob.size);

    // Prepare metadata
    const metadata = {
      snippet: {
        title: title.slice(0, 100), // Max 100 chars
        description: description.slice(0, 5000), // Max 5000 chars
        tags: [...tags, "Shorts", "Short"].slice(0, 500), // Max 500 tags
        categoryId: "22", // People & Blogs (safest default)
      },
      status: {
        privacyStatus: "public", // public, unlisted, private
        selfDeclaredMadeForKids: false,
      },
    };

    // Create form data for multipart upload
    const boundary = "-------314159265358979323846";
    const delimiter = "\r\n--" + boundary + "\r\n";
    const closeDelim = "\r\n--" + boundary + "--";

    const metadataPart =
      delimiter +
      "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
      JSON.stringify(metadata);

    const videoPart = delimiter + "Content-Type: video/mp4\r\n\r\n";

    // Convert blob to array buffer
    const videoArrayBuffer = await videoBlob.arrayBuffer();

    // Create multipart body
    const body = new Uint8Array(
      metadataPart.length +
        videoPart.length +
        videoArrayBuffer.byteLength +
        closeDelim.length
    );

    let offset = 0;

    // Add metadata part
    new TextEncoder().encodeInto(metadataPart, body.subarray(offset));
    offset += metadataPart.length;

    // Add video part header
    new TextEncoder().encodeInto(videoPart, body.subarray(offset));
    offset += videoPart.length;

    // Add video data
    body.set(new Uint8Array(videoArrayBuffer), offset);
    offset += videoArrayBuffer.byteLength;

    // Add closing delimiter
    new TextEncoder().encodeInto(closeDelim, body.subarray(offset));

    console.log("📤 Uploading to YouTube...");

    // Upload video
    const uploadResponse = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body: body,
      }
    );

    const uploadData = await uploadResponse.json();

    if (uploadData.error) {
      console.error("❌ YouTube upload error:", uploadData.error);
      throw new Error(uploadData.error.message);
    }

    const videoId = uploadData.id;
    console.log("✅ Video uploaded! ID:", videoId);

    return {
      success: true,
      videoId,
      url: `https://www.youtube.com/shorts/${videoId}`,
    };
  } catch (error: any) {
    console.error("❌ YouTube upload error:", error);
    return {
      success: false,
      error: error.message || "Failed to upload to YouTube",
    };
  }
}
