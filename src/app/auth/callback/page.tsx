"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        addLog("🚀 Rozpoczynam OAuth callback");
        addLog(`📍 Pełny URL: ${window.location.href}`);

        // Pobierz wszystkie parametry
        const code = searchParams.get("code");
        const error_code = searchParams.get("error");
        const error_description = searchParams.get("error_description");

        addLog(`🔑 Code: ${code ? "JEST ✅" : "BRAK ❌"}`);

        if (error_code) {
          addLog(`❌ Błąd OAuth: ${error_code} - ${error_description}`);
          setError(`OAuth error: ${error_description}`);
          setTimeout(() => router.replace("/auth?error=oauth_failed"), 3000);
          return;
        }

        if (!code) {
          addLog("❌ Brak kodu w URL - przekierowanie do /auth");
          setTimeout(() => router.replace("/auth?error=no_code"), 2000);
          return;
        }

        addLog("🔄 Wymiana code na session...");

        const { data, error } = await supabase.auth.exchangeCodeForSession(
          code
        );

        if (error) {
          addLog(`❌ Błąd exchangeCodeForSession: ${error.message}`);
          setError(error.message);
          setTimeout(() => router.replace("/auth?error=oauth_failed"), 3000);
          return;
        }

        addLog(
          `✅ Exchange sukces! Session: ${data?.session ? "JEST" : "BRAK"}`
        );
        addLog(`👤 User: ${data?.session?.user?.email || "BRAK"}`);

        if (data?.session?.user) {
          addLog("🎉 Przekierowanie do /dashboard...");
          // Poczekaj chwilę przed przekierowaniem
          await new Promise((resolve) => setTimeout(resolve, 500));
          router.replace("/dashboard");
        } else {
          addLog("❌ Brak sesji mimo sukcesu");
          setTimeout(() => router.replace("/auth?error=no_session"), 2000);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Nieznany błąd";
        addLog(`💥 Exception: ${errorMsg}`);
        setError(errorMsg);
        setTimeout(() => router.replace("/auth?error=exception"), 3000);
      }
    };

    handleOAuth();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 p-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <p className="text-muted-foreground">Logowanie...</p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
          <p className="text-red-600 font-semibold">Błąd:</p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Debug panel */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-2xl w-full max-h-64 overflow-y-auto">
        <p className="font-mono text-xs font-semibold mb-2">Debug Log:</p>
        {logs.map((log, i) => (
          <p key={i} className="font-mono text-xs text-gray-700">
            {log}
          </p>
        ))}
      </div>
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
