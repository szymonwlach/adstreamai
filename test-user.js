import { db } from "./src/db/index.js";
import { usersTable } from "./src/db/schema.js";
import { eq } from "drizzle-orm";

(async () => {
  try {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, "szymwl187@gmail.com"));
    console.log("User found:", result);
    if (result.length === 0) {
      console.log("User not found, trying to add...");
      await db.insert(usersTable).values({
        id: "c538fc86-dede-411d-8bc0-e83a08a9acc8",
        email: "szymwl187@gmail.com",
      });
      console.log("User added successfully");
    }
  } catch (error) {
    console.error("Error:", error);
  }
})();
