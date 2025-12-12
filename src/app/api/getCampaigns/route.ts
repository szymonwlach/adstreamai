// app/api/getCampaigns/route.ts
import { NextRequest, NextResponse } from "next/server";
import { campaignsTable, projectsTable, videosTable } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    console.log("📤 Fetching campaigns for user:", user_id);

    // ============================================
    // STEP 1: Get all campaigns (not archived)
    // ============================================
    const campaigns = await db
      .select()
      .from(campaignsTable)
      .where(and(eq(campaignsTable.user_id, user_id)))
      .orderBy(desc(campaignsTable.created_at));

    console.log(`✅ Found ${campaigns.length} campaigns`);

    // ============================================
    // STEP 2: For each campaign, get projects + videos
    // ============================================
    const campaignsWithProjects = await Promise.all(
      campaigns.map(async (campaign) => {
        // Get all projects for this campaign
        const projects = await db
          .select()
          .from(projectsTable)
          .where(eq(projectsTable.campaign_id, campaign.id))
          .orderBy(desc(projectsTable.created_at));

        // For each project, get videos
        const projectsWithVideos = await Promise.all(
          projects.map(async (project) => {
            const videos = await db
              .select()
              .from(videosTable)
              .where(eq(videosTable.project_id, project.id));

            return {
              ...project,
              videos: videos || [],
            };
          })
        );

        return {
          ...campaign,
          projects: projectsWithVideos,
        };
      })
    );

    return NextResponse.json({
      success: true,
      campaigns: campaignsWithProjects,
    });
  } catch (error) {
    console.error("❌ Error fetching campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}
