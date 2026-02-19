import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase env vars");
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 },
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

  try {
    const body = await req.json();
    const { project_id, status } = body;

    if (!project_id || !status) {
      return NextResponse.json(
        { error: "Missing project_id or status" },
        { status: 400 },
      );
    }

    console.log(`🔧 Updating project ${project_id} to status: ${status}`);

    const { data, error } = await supabaseAdmin
      .from("projects")
      .update({ status: status })
      .eq("id", project_id);

    if (error) {
      console.error("❌ Error updating project status:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`✅ Project ${project_id} updated to ${status}`);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
