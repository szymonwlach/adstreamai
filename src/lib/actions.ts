import { db } from "@/db";
import { projectsTable, usersTable } from "@/db/schema";
import { UUID } from "crypto";
import { and, eq } from "drizzle-orm";

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
  console.log("Inserting user:", user);
  try {
    await db.insert(usersTable).values({
      id: user.id,
      email: user.email,
    });
    console.log("User inserted successfully");
  } catch (error: any) {
    console.log("Error code:", error.code);
    console.log("Error cause code:", error.cause?.code);
    console.log("Error message:", error.message);
    // If user already exists, ignore the error
    if (error.code === "23505" || error.cause?.code === "23505") {
      // PostgreSQL unique violation
      console.log("User already exists, skipping insert");
    } else {
      throw error;
    }
  }
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
    .select({
      plan: usersTable.plan,
      credits: usersTable.credits, // lub usersTable.credit - zależy jak nazywa się kolumna
    })
    .from(usersTable)
    .where(eq(usersTable.id, user_id));

  return {
    plan: result[0]?.plan || "free",
    credits: result[0]?.credits || 0, // lub result[0]?.credit
  };
}

export async function DeleteProject(projectId: string, userId: string) {
  try {
    const deleted = await db
      .delete(projectsTable)
      .where(
        and(eq(projectsTable.id, projectId), eq(projectsTable.user_id, userId)),
      )
      .returning();
    if (!deleted || deleted.length === 0) {
      throw new Error("Project not found or unauthorized");
    }
    console.log("✅ Project deleted:", deleted[0].id);
    return deleted[0];
  } catch (error: any) {
    console.error("❌ Delete error:", error);
    throw error;
  }
}
