// app/api/sendToN8n/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      project_id,
      campaign_id,
      user_id,
      product_name,
      description,
      product_image,
      product_image_url,
      product_images,
      selected_styles,
      language,
      quality,
      duration,
      plan,
      subtitles_enabled,
      subtitle_style,
      music_enabled,
      color_scheme,
      // ✅ NEW CREATIVE FIELDS
      tone_of_voice,
      custom_hook,
      key_message,
      call_to_action,
      target_audience,
      key_selling_points,
    } = body;

    console.log("📦 Received body:", JSON.stringify(body, null, 2));

    // Walidacja
    if (!user_id || !project_id) {
      console.error("❌ Missing required fields:", { user_id, project_id });
      return NextResponse.json(
        { error: "User ID and Project ID required" },
        { status: 400 },
      );
    }

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
      console.error("❌ N8N_WEBHOOK_URL not configured!");
      return NextResponse.json(
        { error: "n8n webhook URL not configured" },
        { status: 500 },
      );
    }

    // Obsługa obrazów
    let imageUrls;
    if (product_images && Array.isArray(product_images)) {
      imageUrls = product_images;
    } else if (product_image || product_image_url) {
      imageUrls = [product_image || product_image_url];
    } else {
      imageUrls = [];
    }

    console.log(
      `📸 Processing ${imageUrls.length} images for project ${project_id}`,
    );

    // Przygotowanie finalnego payloadu do n8n
    const payload = {
      project_id,
      campaign_id: campaign_id || null,
      user_id,
      product_name: product_name || null,
      description: description || null,
      product_images: imageUrls,
      product_image_url: imageUrls[0] || null,
      selected_styles,
      language: language || "English",
      quality: quality || "720p",
      duration: duration || 10,
      plan: plan?.plan || plan || "free",
      // Audio/Visual settings
      // subtitles_enabled: !!subtitles_enabled,
      // subtitle_style: subtitles_enabled ? subtitle_style : null,
      // music_enabled: !!music_enabled,
      // color_scheme: subtitles_enabled ? color_scheme : null,
      // ✅ NEW CREATIVE FIELDS
      tone_of_voice: tone_of_voice || "casual",
      custom_hook: custom_hook || null,
      key_message: key_message || null,
      call_to_action: call_to_action || null,
      target_audience: target_audience || null,
      key_selling_points: key_selling_points || null,
    };

    console.log(`🚀 Sending to n8n webhook: ${n8nWebhookUrl}`);
    console.log("📦 Payload:", JSON.stringify(payload, null, 2));

    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log(
      `📡 n8n response status: ${response.status} ${response.statusText}`,
    );

    // ✅ FIXED: Corrected Error constructor syntax
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ n8n error response:", errorText);
      console.error("❌ n8n status:", response.status);
      console.error(
        "❌ n8n headers:",
        Object.fromEntries(response.headers.entries()),
      );

      // ✅ IMPROVED: Return detailed error to frontend
      return NextResponse.json(
        {
          error: "n8n webhook failed",
          details: errorText || `n8n returned status ${response.status}`,
          status: response.status,
          statusText: response.statusText,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    console.log("✅ n8n success response:", data);

    return NextResponse.json({
      success: true,
      data,
      project_id,
      campaign_id,
    });
  } catch (error) {
    console.error("❌ Error sending to n8n:", error);
    console.error(
      "❌ Error stack:",
      error instanceof Error ? error.stack : "No stack trace",
    );

    return NextResponse.json(
      {
        error: "Failed to send to n8n",
        details: error instanceof Error ? error.message : "Unknown error",
        type: error instanceof Error ? error.constructor.name : typeof error,
      },
      { status: 500 },
    );
  }
}
