import { db } from "@/db";
import { projectsTable, usersTable } from "@/db/schema";
import { UUID } from "crypto";
import { eq } from "drizzle-orm";

interface AddUser {
  id: UUID;
  email: string;
}

interface Ad {
  user_id: string;
  description: string;
  name: string;
  product_url: string;
  selected_style: ("ugc" | "trend" | "educational")[];
  language: string;
  duration: number;
  quality: string;
}

export async function AddUser(user: AddUser) {
  await db.insert(usersTable).values({
    id: user.id,
    email: user.email,
  });
}

export async function saveAd(ad_obj: Ad) {
  await db.insert(projectsTable).values({
    user_id: ad_obj.user_id,
    name: ad_obj.name,
    description: ad_obj.description,
    product_image_url: ad_obj.product_url,
    language: ad_obj.language,
    selected_styles: ad_obj.selected_style,
    duration: ad_obj.duration,
    quality: ad_obj.quality,
  });
}

export async function getPlan(user_id: string) {
  const result = await db
    .select({ plan: usersTable.plan })
    .from(usersTable)
    .where(eq(usersTable.id, user_id));

  return result[0]?.plan || "free";
}
