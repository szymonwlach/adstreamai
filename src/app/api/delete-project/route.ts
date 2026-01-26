// app/api/delete-project/route.ts
import { DeleteProject } from "@/lib/actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { projectId, userId } = await request.json();

    if (!projectId || !userId) {
      return NextResponse.json(
        { error: "Missing projectId or userId" },
        { status: 400 },
      );
    }

    const deleted = await DeleteProject(projectId, userId);

    return NextResponse.json({
      success: true,
      deleted,
    });
  } catch (error: any) {
    console.error("❌ API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete project" },
      { status: 500 },
    );
  }
}
