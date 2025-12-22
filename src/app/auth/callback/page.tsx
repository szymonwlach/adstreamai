"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        // Pobierz code z URL
        const code = searchParams.get("code");

        if (!code) {
          console.error("Brak kodu w URL");
          router.replace("/auth?error=no_code");
          return;
        }

        console.log("Wymiana code na session...");

        // Wymień code na session
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          code
        );

        if (error) {
          console.error("OAuth exchange error:", error);
          setError(error.message);
          setTimeout(() => router.replace("/auth?error=oauth_failed"), 2000);
          return;
        }

        if (data?.session?.user) {
          console.log("Zalogowano pomyślnie:", data.session.user.email);
          router.replace("/dashboard");
        } else {
          console.error("Brak sesji po wymianie");
          router.replace("/auth?error=no_session");
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError(err instanceof Error ? err.message : "Nieznany błąd");
        setTimeout(() => router.replace("/auth?error=oauth_failed"), 2000);
      }
    };

    handleOAuth();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <p className="text-muted-foreground">Logowanie...</p>
      {error && (
        <p className="text-red-500 text-sm max-w-md text-center">
          Błąd: {error}
        </p>
      )}
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
