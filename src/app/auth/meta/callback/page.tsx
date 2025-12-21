"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function MetaCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Connecting your Instagram...");
  const [error, setError] = useState<string | null>(null);

  // Zapobiegaj wielokrotnemu wywołaniu
  const hasRun = useRef(false);

  useEffect(() => {
    // Jeśli już wykonano, nie rób tego ponownie
    if (hasRun.current) {
      console.log("⏭️ Callback already processed, skipping...");
      return;
    }

    const handleMetaCallback = async () => {
      const code = searchParams.get("code");
      const errorParam = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      // Użytkownik anulował
      if (errorParam) {
        console.log("❌ User cancelled OAuth");
        setStatus("Connection cancelled");
        setError("You cancelled the connection. No worries!");
        setTimeout(() => router.push("/dashboard#connect"), 2000);
        return;
      }

      // Brak code
      if (!code) {
        console.error("❌ No code in callback URL");
        setStatus("Invalid callback");
        setError("Something went wrong. Please try again.");
        setTimeout(() => router.push("/dashboard#connect"), 2000);
        return;
      }

      // Oznacz że już się wykonuje
      hasRun.current = true;
      console.log("🔄 Processing OAuth code...");

      try {
        // Pobierz zalogowanego użytkownika
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          console.error("❌ No user found");
          router.push("/auth");
          return;
        }

        console.log("✅ User found:", user.id);
        setStatus("Exchanging authorization code...");

        // Wyślij code do backendu żeby wymienić na token
        const response = await fetch("/api/meta/exchange-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            userId: user.id,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("❌ Connection failed:", data.error);

          // Specjalne obsługiwanie błędu wygasłego kodu
          if (
            data.error?.includes("expired") ||
            data.error?.includes("been used")
          ) {
            setStatus("Session expired");
            setError(
              "This authorization link has expired. Please try connecting again."
            );
            setTimeout(() => router.push("/dashboard#connect"), 3000);
            return;
          }

          // Inne błędy
          setStatus("Connection failed");
          setError(data.error || "Failed to connect Instagram");
          setTimeout(() => router.push("/dashboard#connect"), 3000);
          return;
        }

        console.log("✅ Instagram connected successfully!");
        setStatus("Instagram connected!");
        setError(null);

        // Przekieruj na dashboard po sukcesie
        setTimeout(() => {
          router.push("/dashboard#connect");
        }, 1500);
      } catch (err: any) {
        console.error("❌ Meta callback error:", err);
        setStatus("Connection failed");
        setError(err.message || "An unexpected error occurred");
        setTimeout(() => router.push("/dashboard#connect"), 3000);
      }
    };

    handleMetaCallback();
  }, []); // Pusty array - wykonaj tylko raz przy montowaniu

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 max-w-md">
        {!error ? (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">{status}</h2>
            <p className="text-sm text-muted-foreground">
              Please wait while we connect your Instagram account...
            </p>
          </>
        ) : (
          <>
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-destructive">
              {status}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <p className="text-xs text-muted-foreground">
              Redirecting back to dashboard...
            </p>
          </>
        )}

        {status === "Instagram connected!" && (
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        )}
      </div>
    </div>
  );
}
