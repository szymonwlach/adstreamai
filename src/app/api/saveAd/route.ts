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
      tone_of_voice,
      custom_hook,
      call_to_action,
    } = body;

    // Clean up empty strings to null
    name = name && name.trim() ? name.trim() : null;
    description = description && description.trim() ? description.trim() : null;
    custom_hook = custom_hook && custom_hook.trim() ? custom_hook.trim() : null;
    call_to_action =
      call_to_action && call_to_action.trim() ? call_to_action.trim() : null;

    console.log("🧹 After cleanup:");
    console.log("  Name:", name);
    console.log("  Description:", description);
    console.log("  Selected styles:", selected_style);
    console.log("  Custom hook:", custom_hook);
    console.log("  Tone:", tone_of_voice);

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
        { status: 400 },
      );
    }

    let campaignId: string;

    // ============================================
    // STEP 1: Handle Campaign
    // ============================================

    if (campaign_id) {
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
      let existingCampaigns = null;

      if (description) {
        existingCampaigns = await db
          .select()
          .from(campaignsTable)
          .where(
            and(
              eq(campaignsTable.user_id, user_id),
              eq(campaignsTable.description, description),
              eq(campaignsTable.product_image_url, product_url),
            ),
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
        console.log("📁 Creating new campaign...");
        const newCampaign = await db
          .insert(campaignsTable)
          .values({
            user_id,
            name: name || "Setting up your campaign...",
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
    // STEP 2: Create SEPARATE project for EACH style
    // ============================================

    const createdProjects = [];

    for (const style of selected_style) {
      console.log(`📹 Creating project for style: ${style}`);

      const newProject = await db
        .insert(projectsTable)
        .values({
          user_id,
          campaign_id: campaignId,
          name,
          description,
          product_image_url: product_url,
          selected_styles: [style],
          language: language || "en",
          status: "processing",
          quality: quality || "720p",
          duration: duration || 10,
          tone_of_voice: tone_of_voice || "casual",
          custom_hook,
          call_to_action,
        })
        .returning();

      createdProjects.push(newProject[0]);
      console.log(`✅ Project created for ${style}:`, newProject[0].id);
    }

    console.log("🎯 Campaign ID:", campaignId);
    console.log("📹 Total projects created:", createdProjects.length);

    return NextResponse.json({
      success: true,
      projectIds: createdProjects.map((p) => p.id),
      campaignId: campaignId,
      message: `Created ${createdProjects.length} project(s) with ${selected_style.length} video(s)`,
    });
  } catch (error) {
    console.error("❌ Error in saveAd:", error);
    return NextResponse.json(
      {
        error: "Failed to save project",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
