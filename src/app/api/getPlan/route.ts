import { getPlan } from "@/lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { user_id } = await req.json();

  const plan = await getPlan(user_id);

  return NextResponse.json({ plan });
}
