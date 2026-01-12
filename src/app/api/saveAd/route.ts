// app/api/saveAd/route.ts
import { NextRequest, NextResponse } from "next/server";
import { campaignsTable, projectsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📥 Received body:", JSON.stringify(body, null, 2));

    let {
      user_id,
      name,
      description,
      product_url,
      selected_style,
      language,
      quality,
      duration,
      campaign_id,
      // Nowe parametry stylu i audio
      subtitles_enabled,
      subtitle_style,
      music_enabled,
      color_scheme,
    } = body;

    // Clean up empty strings to null
    name = name && name.trim() ? name.trim() : null;
    description = description && description.trim() ? description.trim() : null;

    console.log("🧹 After cleanup:");
    console.log("  Name:", name);
    console.log("  Description:", description);

    // Walidacja wymaganych pól
    if (
      !user_id ||
      !product_url ||
      !selected_style ||
      selected_style.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: user_id, product_url, and selected_style",
        },
        { status: 400 }
      );
    }

    console.log("💾 Saving project with campaign support...");

    let campaignId: string;

    // ============================================
    // STEP 1: Handle Campaign
    // ============================================

    if (campaign_id) {
      // Use existing campaign (when generating more ads)
      console.log("✅ Using existing campaign:", campaign_id);
      campaignId = campaign_id;

      const existingCampaign = await db
        .select()
        .from(campaignsTable)
        .where(eq(campaignsTable.id, campaign_id))
        .limit(1);

      if (existingCampaign && existingCampaign.length > 0) {
        await db
          .update(campaignsTable)
          .set({
            videos_generated:
              existingCampaign[0].videos_generated + selected_style.length,
            updated_at: new Date(),
            ...(name && { name }),
            ...(description && { description }),
          })
          .where(eq(campaignsTable.id, campaign_id));
      }
    } else {
      // Check if campaign exists for this product
      let existingCampaigns = null;

      if (description) {
        existingCampaigns = await db
          .select()
          .from(campaignsTable)
          .where(
            and(
              eq(campaignsTable.user_id, user_id),
              eq(campaignsTable.description, description),
              eq(campaignsTable.product_image_url, product_url)
            )
          )
          .limit(1);
      }

      if (existingCampaigns && existingCampaigns.length > 0) {
        campaignId = existingCampaigns[0].id;
        await db
          .update(campaignsTable)
          .set({
            videos_generated:
              existingCampaigns[0].videos_generated + selected_style.length,
            updated_at: new Date(),
          })
          .where(eq(campaignsTable.id, campaignId));
        console.log("✅ Using existing campaign:", campaignId);
      } else {
        // Create new campaign
        console.log("📁 Creating new campaign...");
        const newCampaign = await db
          .insert(campaignsTable)
          .values({
            user_id,
            name: name || "Untitled Campaign",
            description: description,
            product_image_url: product_url,
            videos_generated: selected_style.length,
          })
          .returning();

        campaignId = newCampaign[0].id;
        console.log("✅ Campaign created:", campaignId);
      }
    }

    // ============================================
    // STEP 2: Create project linked to campaign
    // ============================================
    const newProject = await db
      .insert(projectsTable)
      .values({
        user_id,
        campaign_id: campaignId,
        name: name,
        description: description,
        product_image_url: product_url,
        selected_styles: selected_style,
        language: language || "en",
        status: "processing",
        quality: quality || "720p",
        duration: duration || 10,
        // Dodanie nowych pól do bazy danych:
        subtitles_enabled: subtitles_enabled ?? false,
        subtitle_style: subtitles_enabled ? subtitle_style : null,
        music_enabled: music_enabled ?? true,
        color_scheme: subtitles_enabled ? color_scheme : null,
      })
      .returning();

    console.log("✅ Project created:", newProject[0].id);
    console.log("🎯 Campaign ID:", campaignId);
    console.log("📹 Videos to generate:", selected_style.length);

    return NextResponse.json({
      success: true,
      projectId: newProject[0].id,
      campaignId: campaignId,
      message: `Created project with ${selected_style.length} video(s)`,
    });
  } catch (error) {
    console.error("❌ Error in saveAd:", error);
    return NextResponse.json(
      {
        error: "Failed to save project",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
