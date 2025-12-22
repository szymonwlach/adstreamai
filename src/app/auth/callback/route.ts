import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // 'next' to parametr, który mówi gdzie przekierować po sukcesie (domyślnie /dashboard)
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    // Pobieramy cookieStore (w Next.js 15+ jest to Promise, dlatego używamy await)
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Metoda setAll może rzucić błąd, jeśli jest wywołana z Server Componentu,
              // ale w Route Handlerze jest to bezpieczne.
            }
          },
        },
      }
    );

    // Wymieniamy kod tymczasowy na sesję użytkownika
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else {
        // Wymuszamy przekierowanie na pełną domenę z www, aby uniknąć problemów z sesją
        return NextResponse.redirect(`https://www.adstreamai.com${next}`);
      }
    }
  }

  // Jeśli coś poszło nie tak (brak kodu lub błąd wymiany), wracamy do logowania
  return NextResponse.redirect(`${origin}/auth?error=auth_failed`);
}
