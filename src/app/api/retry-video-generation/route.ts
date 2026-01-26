import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { videoId, projectId, userId } = await request.json();

    console.log("🔄 Retry request:", { videoId, projectId, userId });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // 1. Usuń failed video z bazy
    const { error: deleteVideoError } = await supabase
      .from("videos")
      .delete()
      .eq("id", videoId);

    if (deleteVideoError) {
      console.error("Error deleting video:", deleteVideoError);
      throw new Error("Failed to delete old video");
    }

    // 2. Ustaw projekt z powrotem na "pending" (żeby został ponownie przetworzony)
    const { error: updateProjectError } = await supabase
      .from("projects")
      .update({
        status: "pending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    if (updateProjectError) {
      console.error("Error updating project:", updateProjectError);
      throw new Error("Failed to update project status");
    }

    console.log("✅ Successfully reset project to pending");

    // 3. Wywołaj endpoint do generowania video ponownie
    const generateResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/generate-videos`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: projectId,
          userId: userId,
        }),
      },
    );

    if (!generateResponse.ok) {
      const errorData = await generateResponse.json();
      console.error("Error calling generate-videos:", errorData);
      throw new Error("Failed to restart video generation");
    }

    console.log("✅ Video generation restarted successfully");

    return NextResponse.json({
      success: true,
      message: "Video generation restarted successfully",
    });
  } catch (error: any) {
    console.error("❌ Retry error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to retry video generation",
      },
      { status: 500 },
    );
  }
}
