import { db } from "@/db";
import { campaignsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const { campaign_id, user_id, creative_controls_locked } = await req.json();

  await db
    .update(campaignsTable)
    .set({ creative_controls_locked })
    .where(
      and(
        eq(campaignsTable.id, campaign_id),
        eq(campaignsTable.user_id, user_id),
      ),
    );

  return NextResponse.json({ success: true });
}
