import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase env vars");
    return NextResponse.json(
      { message: "Server misconfiguration." },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ message: "Invalid email." }, { status: 400 });
    }

    const { error } = await supabase.from("waitlist").insert({ email });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "You're already on the waitlist!" },
          { status: 409 },
        );
      }
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Waitlist error:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
