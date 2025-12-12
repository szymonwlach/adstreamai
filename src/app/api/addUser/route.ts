import { AddUser } from "@/lib/actions";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    await AddUser(data);
  } catch (error) {
    console.error(error);
  }
}
