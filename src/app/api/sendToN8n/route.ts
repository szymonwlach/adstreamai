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
      selected_styles,
      language,
      quality,
      duration,
      plan,
    } = body;

    // Walidacja
    if (!user_id || !project_id) {
      return NextResponse.json(
        { error: "User ID and Project ID required" },
        { status: 400 }
      );
    }

    // ⚠️ UWAGA: To jest localhost - zmień na production URL!
    const n8nWebhookUrl =
      "http://localhost:5678/webhook-test/9b62101c-52a8-489d-8df7-935b41e93b14";

    // Prepare payload - always include all fields, use null if undefined
    const payload = {
      project_id,
      campaign_id: campaign_id || null,
      user_id,
      product_name: product_name || null, // Always send, null if empty
      description: description || null, // Always send, null if empty
      product_image,
      selected_styles,
      language: language || "English",
      quality: quality || "720p",
      duration: duration || 10,
      plan: plan?.plan || "free",
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
      throw new Error(`n8n returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      data,
      project_id,
      campaign_id,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { error: "Failed to send to n8n" },
      { status: 500 }
    );
  }
}
