// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/db";
// import { projectsTable, videosTable } from "@/db/schema";
// import { eq, and } from "drizzle-orm";

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("user_id");
//     const campaignId = searchParams.get("campaign_id"); // ✅ NOWE

//     if (!userId) {
//       return NextResponse.json({ error: "User ID required" }, { status: 400 });
//     }

//     console.log("📥 Fetching projects for user:", userId);
//     if (campaignId) {
//       console.log("🎯 Filtering by campaign:", campaignId);
//     }

//     // ✅ ZMIANA: Obsługa filtrowania po campaign_id
//     let projects;
//     if (campaignId) {
//       projects = await db
//         .select()
//         .from(projectsTable)
//         .where(
//           and(
//             eq(projectsTable.user_id, userId),
//             eq(projectsTable.campaign_id, campaignId),
//           ),
//         );
//     } else {
//       projects = await db
//         .select()
//         .from(projectsTable)
//         .where(eq(projectsTable.user_id, userId));
//     }

//     console.log("✅ Found projects:", projects.length);

//     // Sortuj (najnowsze pierwsze)
//     projects.sort(
//       (a, b) =>
//         new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
//     );

//     // Dla każdego projektu pobierz video
//     const projectsWithVideos = await Promise.all(
//       projects.map(async (project) => {
//         const videos = await db
//           .select()
//           .from(videosTable)
//           .where(eq(videosTable.project_id, project.id));

//         console.log(`📹 Project ${project.id} has ${videos.length} videos`);

//         return {
//           ...project,
//           videos,
//         };
//       }),
//     );

//     return NextResponse.json({ projects: projectsWithVideos });
//   } catch (error) {
//     console.error("❌ Error fetching projects:", error);
//     return NextResponse.json(
//       {
//         error: "Failed to fetch projects",
//         details: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 },
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projectsTable, videosTable } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");
    const campaignId = searchParams.get("campaign_id");

    if (!userId) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 },
      );
    }

    // Jedna spójna konstrukcja zapytania – TypeScript nie gubi .where / .orderBy
    const projects = await db
      .select()
      .from(projectsTable)
      .where(
        campaignId
          ? and(
              eq(projectsTable.user_id, userId),
              eq(projectsTable.campaign_id, campaignId),
            )
          : eq(projectsTable.user_id, userId),
      )
      .orderBy(desc(projectsTable.created_at));

    console.log(`✅ Found ${projects.length} projects`);

    const projectsWithVideos = await Promise.all(
      projects.map(async (project) => {
        const videos = await db
          .select()
          .from(videosTable)
          .where(eq(videosTable.project_id, project.id));

        return {
          ...project,
          videos: videos ?? [],
        };
      }),
    );

    return NextResponse.json({
      success: true,
      projects: projectsWithVideos,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}
