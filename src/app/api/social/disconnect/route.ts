// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/db";
// import { socialConnectionsTable } from "@/db/schema";
// import { eq, and } from "drizzle-orm";

// export async function POST(request: NextRequest) {
//   try {
//     const { userId, platform } = await request.json();

//     if (!userId || !platform) {
//       return NextResponse.json(
//         { error: "Missing userId or platform" },
//         { status: 400 }
//       );
//     }

//     // Dezaktywuj połączenie zamiast usuwać
//     await db
//       .update(socialConnectionsTable)
//       .set({
//         is_active: false,
//         updated_at: new Date(),
//       })
//       .where(
//         and(
//           eq(socialConnectionsTable.user_id, userId),
//           eq(socialConnectionsTable.platform, platform)
//         )
//       );

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error disconnecting platform:", error);
//     return NextResponse.json(
//       { error: "Failed to disconnect platform" },
//       { status: 500 }
//     );
//   }
// }
