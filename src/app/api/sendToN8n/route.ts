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
    } = body;

    console.log("📦 Received body:", body);

    // Walidacja
    if (!user_id || !project_id) {
      return NextResponse.json(
        { error: "User ID and Project ID required" },
        { status: 400 }
      );
    }

    // 🔥 WAŻNE: Ustaw prawidłowy URL webhooka z n8n
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      console.error("❌ N8N_WEBHOOK_URL not configured!");
      return NextResponse.json(
        { error: "n8n webhook URL not configured" },
        { status: 500 }
      );
    }

    // Obsłuż zarówno single image jak i array
    let imageUrls;
    if (product_images && Array.isArray(product_images)) {
      imageUrls = product_images;
    } else if (product_image || product_image_url) {
      imageUrls = [product_image || product_image_url];
    } else {
      imageUrls = [];
    }

    if (imageUrls.length === 0) {
      console.warn("⚠️ WARNING: No product images provided!");
    }

    console.log(`📸 Processing ${imageUrls.length} image(s):`, imageUrls);

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
    };

    console.log("🚀 Sending to n8n:", payload);

    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("✅ n8n response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ n8n error:", errorText);
      throw new Error(`n8n returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      data,
      project_id,
      campaign_id,
    });
  } catch (error) {
    console.error("❌ Error sending to n8n:", error);
    return NextResponse.json(
      {
        error: "Failed to send to n8n",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
