// app/api/get-video-captions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { videosTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json(
        { error: "Missing videoId parameter" },
        { status: 400 }
      );
    }

    // Pobierz video z bazy wraz z AI-generated captions
    const [video] = await db
      .select()
      .from(videosTable)
      .where(eq(videosTable.id, videoId))
      .limit(1);

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Parsuj ai_captions z JSONB
    const aiCaptions = (video.ai_captions as any) || {};

    // Przygotuj captiony dla różnych platform z ai_captions
    const captions = {
      instagram: {
        text: aiCaptions.instagram?.text || video.caption || "",
        hashtags:
          aiCaptions.instagram?.hashtags ||
          (Array.isArray(video.hashtags)
            ? video.hashtags.join(" ")
            : video.hashtags || ""),
      },
      facebook: {
        title: aiCaptions.facebook?.title || video.caption || "",
        text: aiCaptions.facebook?.text || video.caption || "",
      },
      youtube: {
        title: aiCaptions.youtube?.title || video.caption || "",
        description: aiCaptions.youtube?.description || video.caption || "",
      },
      tiktok: {
        text: aiCaptions.tiktok?.text || video.caption || "",
      },
      linkedin: {
        title: aiCaptions.facebook?.title || video.caption || "", // Użyj Facebook jako fallback
        text: aiCaptions.facebook?.text || video.caption || "",
      },
    };

    console.log("📋 Loaded AI captions for video:", videoId);
    console.log("🎯 Available platforms:", Object.keys(aiCaptions));

    return NextResponse.json({
      success: true,
      captions,
      video: {
        id: video.id,
        caption: video.caption,
        hashtags: video.hashtags,
        ai_captions: aiCaptions,
      },
    });
  } catch (error: any) {
    console.error("Error fetching video captions:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
