// app/api/delete-campaign/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // ✅ Twój Drizzle instance
import { eq, and, or } from "drizzle-orm";
import {
  campaignsTable,
  projectsTable,
  videosTable,
  videoStyleEnum,
} from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    const { campaignId, userId } = body;

    console.log("Delete campaign request:", { campaignId, userId });

    if (!campaignId || !userId) {
      return NextResponse.json(
        { error: "Missing campaignId or userId" },
        { status: 400 },
      );
    }

    // ✅ Verify ownership with Drizzle
    const [campaign] = await db
      .select()
      .from(campaignsTable)
      .where(eq(campaignsTable.id, campaignId))
      .limit(1);

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 },
      );
    }

    if (campaign.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // ✅ Delete with Drizzle - cascade should handle related data
    // But if you need manual cleanup:

    // 1. Get all projects in this campaign
    const campaignProjects = await db
      .select({ id: projectsTable.id })
      .from(projectsTable)
      .where(eq(projectsTable.campaign_id, campaignId));

    const projectIds = campaignProjects.map((p) => p.id);

    // 2. Delete videos first (if no cascade)
    if (projectIds.length > 0) {
      await db
        .delete(videosTable)
        .where(
          projectIds
            .map((id) => eq(videosTable.project_id, id))
            .reduce((a, b) => or(a, b)),
        );

      // 3. Delete projects
      await db
        .delete(projectsTable)
        .where(eq(projectsTable.campaign_id, campaignId));
    }

    // 4. Delete campaign
    await db.delete(campaignsTable).where(eq(campaignsTable.id, campaignId));

    console.log("✅ Campaign deleted successfully:", campaignId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete campaign" },
      { status: 500 },
    );
  }
}
