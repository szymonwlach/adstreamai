import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { AddUser } from "@/lib/actions";

export async function proxy(request: NextRequest, _event: NextFetchEvent) {
  console.log("🔥 PROXY for:", request.nextUrl.pathname);

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("👤 User:", user ? user.email : "NOT LOGGED IN");

  // Ensure user is in database
  if (user && user.id && user.email) {
    try {
      await AddUser({ id: user.id as any, email: user.email });
      console.log("✅ User ensured in database:", user.email);
    } catch (error) {
      console.error("❌ Failed to add user to database:", error);
    }
  }

  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (user && request.nextUrl.pathname === "/auth") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth"],
};

export default proxy;
