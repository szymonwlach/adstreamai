import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projectsTable, videosTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    console.log("📥 Fetching projects for user:", userId);

    const projects = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.user_id, userId));

    console.log("✅ Found projects:", projects.length);

    // Sortuj
    projects.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Dla każdego projektu pobierz video
    const projectsWithVideos = await Promise.all(
      projects.map(async (project) => {
        const videos = await db
          .select()
          .from(videosTable)
          .where(eq(videosTable.project_id, project.id));

        console.log(`📹 Project ${project.id} has ${videos.length} videos`);

        return {
          ...project,
          videos,
        };
      })
    );

    return NextResponse.json({ projects: projectsWithVideos });
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch projects",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
