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
        { status: 400 },
      );
    }

    // Pobieramy rekord z bazy
    const [video] = await db
      .select()
      .from(videosTable)
      .where(eq(videosTable.id, videoId))
      .limit(1);

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Parsujemy ai_captions. Jeśli pole w bazie jest puste, używamy pustego obiektu.
    // video.ai_captions odpowiada strukturze JSON, którą podałeś.
    const ai = (video.ai_captions as any) || {};

    // Mapujemy strukturę z bazy na ujednolicony format dla frontendu
    const captions = {
      instagram: {
        text: ai.instagram?.text || "",
        hashtags: ai.instagram?.hashtags || "",
      },
      facebook: {
        title: ai.facebook?.title || "",
        text: ai.facebook?.text || "",
      },
      youtube: {
        // Mapujemy z youtube_shorts zgodnie z Twoim formatem
        title: ai.youtube?.title || "",
        description: ai.youtube?.description || "",
      },
      tiktok: {
        text: ai.tiktok?.text || "",
      },
      linkedin: {
        title: ai.linkedin?.title || "",
        text: ai.linkedin?.text || "",
      },
      x: {
        text: ai.x?.text || "",
      },
    };

    console.log("📋 Loaded AI captions for video:", videoId);

    return NextResponse.json({
      success: true,
      captions,
      video: {
        id: video.id,
        ai_captions: ai,
      },
    });
  } catch (error: any) {
    console.error("Error fetching video captions:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
