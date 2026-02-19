import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: NextRequest) {
  try {
    const { videoId, projectId, userId } = await request.json();
    console.log("🔄 Retry request:", { videoId, projectId, userId });

    if (!projectId || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing projectId or userId" },
        { status: 400 },
      );
    }

    // 1. Pobierz dane projektu i kampanii
    console.log("📥 Fetching project data for:", projectId);
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select(
        `
        *,
        campaigns (
          name,
          description,
          product_image_url
        )
      `,
      )
      .eq("id", projectId)
      .single();

    if (projectError) {
      console.error("❌ Error fetching project:", projectError);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch project: ${projectError.message}`,
        },
        { status: 500 },
      );
    }

    if (!project) {
      console.error("❌ Project not found:", projectId);
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 },
      );
    }

    console.log("✅ Fetched project data:", project);

    // 2. Usuń failed video z bazy
    if (videoId) {
      console.log("🗑️ Deleting failed video:", videoId);
      const { error: deleteVideoError } = await supabase
        .from("videos")
        .delete()
        .eq("id", videoId);

      if (deleteVideoError) {
        console.error("❌ Error deleting video:", deleteVideoError);
      } else {
        console.log("✅ Deleted failed video:", videoId);
      }
    } else {
      console.log("🗑️ Deleting all failed videos from project:", projectId);
      const { error: deleteVideosError } = await supabase
        .from("videos")
        .delete()
        .eq("project_id", projectId)
        .eq("status", "failed");

      if (deleteVideosError) {
        console.error("⚠️ Error deleting failed videos:", deleteVideosError);
      } else {
        console.log("✅ Deleted all failed videos from project");
      }
    }

    // 3. Ustaw projekt na "processing"
    console.log("🔄 Updating project status to processing:", projectId);
    const { data: updatedProject, error: updateProjectError } = await supabase
      .from("projects")
      .update({
        status: "processing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .select()
      .single();

    if (updateProjectError) {
      console.error("❌ Error updating project status:", updateProjectError);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to update project status: ${updateProjectError.message}`,
        },
        { status: 500 },
      );
    }

    console.log("✅ Successfully reset project to processing:", updatedProject);

    // 4. Przygotuj dane dla sendtoN8n
    const campaign = project.campaigns;
    const n8nPayload = {
      project_id: projectId,
      campaign_id: project.campaign_id,
      user_id: userId,
      product_name: campaign?.name || null,
      description: campaign?.description || null,
      product_image_url: campaign?.product_image_url || null,
      product_images: campaign?.product_image_url
        ? [campaign.product_image_url]
        : [],
      selected_styles: project.selected_styles || [],
      language: project.language || "English",
      quality: project.quality || "720p",
      duration: project.duration || 10,
      plan: project.plan || "free",
      // subtitles_enabled: project.subtitles_enabled || false,
      // subtitle_style: project.subtitle_style || null,
      // music_enabled: project.music_enabled || false,
      // color_scheme: project.color_scheme || null,
      tone_of_voice: project.tone_of_voice || "casual",
      custom_hook: project.custom_hook || null,
      key_message: project.key_message || null,
      call_to_action: project.call_to_action || null,
      target_audience: project.target_audience || null,
      key_selling_points: project.key_selling_points || null,
    };

    console.log("🚀 Payload to send:", n8nPayload);

    // 5. ✅ Wywołaj endpoint sendtoN8n używając LOKALNEGO URL
    const baseUrl = request.url.includes("localhost")
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const sendToN8nUrl = `${baseUrl}/api/sendtoN8n`;
    console.log("📡 Calling sendtoN8n at:", sendToN8nUrl);

    let n8nResponse;
    try {
      n8nResponse = await fetch(sendToN8nUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(n8nPayload),
      });
    } catch (fetchError: any) {
      console.error("❌ Fetch failed:", fetchError.message);
      return NextResponse.json(
        {
          success: false,
          error: `Connection failed: ${fetchError.message}. Is the server running?`,
        },
        { status: 500 },
      );
    }

    console.log("📡 Response status:", n8nResponse.status);

    const responseText = await n8nResponse.text();
    console.log("📡 Response body:", responseText);

    if (!n8nResponse.ok) {
      let errorMessage = `sendtoN8n failed with status ${n8nResponse.status}`;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorData.details || errorMessage;
      } catch (e) {
        errorMessage = responseText || errorMessage;
      }

      console.error("❌ sendtoN8n error:", errorMessage);
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 500 },
      );
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log("✅ Parsed response:", responseData);
    } catch (parseError) {
      console.warn("⚠️ Non-JSON response, using as text");
      responseData = { message: responseText };
    }

    console.log("✅ Video generation restarted successfully");

    return NextResponse.json({
      success: true,
      message: "Video generation restarted successfully",
      data: responseData,
    });
  } catch (error: any) {
    console.error("❌ Retry error:", error);
    console.error("❌ Stack:", error.stack);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to retry video generation",
      },
      { status: 500 },
    );
  }
}
