import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase env vars");
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

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
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select(`*, campaigns (name, description, product_image_url)`)
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      console.error("❌ Error fetching project:", projectError);
      return NextResponse.json(
        {
          success: false,
          error: `Project not found: ${projectError?.message}`,
        },
        { status: 404 },
      );
    }

    console.log("✅ Fetched project:", project);

    // 2. Usuń failed video(s) z bazy
    if (videoId) {
      await supabase.from("videos").delete().eq("id", videoId);
      console.log("🗑️ Deleted failed video:", videoId);
    } else {
      await supabase
        .from("videos")
        .delete()
        .eq("project_id", projectId)
        .eq("status", "failed");
      console.log("🗑️ Deleted all failed videos for project:", projectId);
    }

    // 3. Ustaw projekt na "processing"
    const { error: updateError } = await supabase
      .from("projects")
      .update({ status: "processing", updated_at: new Date().toISOString() })
      .eq("id", projectId);

    if (updateError) {
      console.error("❌ Error updating project status:", updateError);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to update project: ${updateError.message}`,
        },
        { status: 500 },
      );
    }

    console.log("✅ Project reset to processing");

    // 4. Obsłuż product_image_url — może być string, string z przecinkami, lub array
    const campaign = project.campaigns;
    let productImages: string[] = [];

    if (campaign?.product_image_url) {
      if (Array.isArray(campaign.product_image_url)) {
        productImages = campaign.product_image_url;
      } else if (typeof campaign.product_image_url === "string") {
        productImages = campaign.product_image_url.includes(",")
          ? campaign.product_image_url.split(",").map((u: string) => u.trim())
          : [campaign.product_image_url];
      }
    }

    // 5. Pobierz plan usera z tabeli users
    const { data: userData } = await supabase
      .from("users")
      .select("plan")
      .eq("id", userId)
      .single();

    const userPlan = userData?.plan ?? "free";
    console.log("👤 User plan:", userPlan);

    // 6. Przygotuj payload — taki sam format jak generateAd wysyła do sendToN8n
    const n8nPayload = {
      project_id: projectId,
      campaign_id: project.campaign_id ?? null,
      user_id: userId,
      product_name: campaign?.name ?? null,
      description: campaign?.description ?? null,
      product_images: productImages,
      selected_styles: project.selected_styles ?? [],
      language: project.language ?? "English",
      quality: project.quality ?? "720p",
      duration: project.duration ?? 10,
      plan: userPlan,
      tone_of_voice: project.tone_of_voice ?? "casual",
      custom_hook: project.custom_hook ?? null,
      call_to_action: project.call_to_action ?? null,
    };

    console.log(
      "🚀 Payload for sendToN8n:",
      JSON.stringify(n8nPayload, null, 2),
    );

    // 7. ✅ POPRAWKA: origin pobieramy z request.url zamiast hardkodować
    //    Na Vercelu zwraca: https://adstreamai.com
    //    Na localhost zwraca: http://localhost:3000
    const { origin } = new URL(request.url);
    const sendToN8nUrl = `${origin}/api/sendToN8n`;
    console.log("📡 Calling:", sendToN8nUrl);

    const n8nResponse = await fetch(sendToN8nUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(n8nPayload),
    });

    const responseText = await n8nResponse.text();
    console.log("📡 sendToN8n status:", n8nResponse.status);
    console.log("📡 sendToN8n body:", responseText);

    if (!n8nResponse.ok) {
      let errorMessage = `sendToN8n failed with status ${n8nResponse.status}`;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorData.details || errorMessage;
      } catch {
        errorMessage = responseText || errorMessage;
      }
      console.error("❌ sendToN8n error:", errorMessage);
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 500 },
      );
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: responseText };
    }

    console.log("✅ Video generation restarted successfully");

    return NextResponse.json({
      success: true,
      message: "Video generation restarted successfully",
      data: responseData,
    });
  } catch (error: any) {
    console.error("❌ Retry error:", error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to retry video generation",
      },
      { status: 500 },
    );
  }
}
