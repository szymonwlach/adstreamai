import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { socialConnectionsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Pobierz userId z query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Pobierz aktywne połączenia
    const connections = await db
      .select({
        platform: socialConnectionsTable.platform,
        username: socialConnectionsTable.platform_username,
        connected_at: socialConnectionsTable.connected_at,
      })
      .from(socialConnectionsTable)
      .where(
        and(
          eq(socialConnectionsTable.user_id, userId),
          eq(socialConnectionsTable.is_active, true)
        )
      );

    return NextResponse.json({ connections });
  } catch (error) {
    console.error("Error fetching connections:", error);
    return NextResponse.json(
      { error: "Failed to fetch connections" },
      { status: 500 }
    );
  }
}
// // app/api/connections/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/db";
// import { socialConnectionsTable } from "@/db/schema";
// import { eq, and } from "drizzle-orm";

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get("userId");

//     if (!userId) {
//       return NextResponse.json(
//         { error: "User ID is required" },
//         { status: 400 }
//       );
//     }

//     // Pobierz aktywne połączenia
//     const connections = await db
//       .select({
//         id: socialConnectionsTable.id,
//         platform: socialConnectionsTable.platform,
//         username: socialConnectionsTable.platform_username,
//         connected_at: socialConnectionsTable.connected_at,
//         page_id: socialConnectionsTable.page_id,
//         instagram_account_id: socialConnectionsTable.instagram_account_id,
//       })
//       .from(socialConnectionsTable)
//       .where(
//         and(
//           eq(socialConnectionsTable.user_id, userId),
//           eq(socialConnectionsTable.is_active, true)
//         )
//       );

//     return NextResponse.json({ connections });
//   } catch (error) {
//     console.error("Error fetching connections:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch connections" },
//       { status: 500 }
//     );
//   }
// }
