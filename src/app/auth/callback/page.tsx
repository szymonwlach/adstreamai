"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState("Processing...");

  const addUserToDB = async (user: { id: string; email: string | null }) => {
    if (!user.email) return;

    try {
      console.log("Adding user to DB:", user.id);
      await fetch("/api/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
        }),
      });
    } catch (error) {
      console.error("Failed to add user to DB", error);
    }
  };

  useEffect(() => {
    console.log("📍 Supabase Auth Callback page loaded");

    const processOAuth = async () => {
      try {
        setStatus("Verifying authentication...");

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth error:", error);
          router.push("/auth?error=oauth_failed");
          return;
        }

        if (session?.user) {
          console.log("✅ User authenticated:", session.user.id);
          setStatus("Setting up your account...");

          // Dodaj użytkownika do DB
          await addUserToDB({
            id: session.user.id,
            email: session.user.email,
          });

          setStatus("Redirecting to dashboard...");
          router.push("/dashboard");
        } else {
          console.error("No session found");
          router.push("/auth?error=no_session");
        }
      } catch (err) {
        console.error("OAuth processing error:", err);
        router.push("/auth?error=oauth_failed");
      }
    };

    processOAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">{status}</h2>
        <p className="text-sm text-muted-foreground">
          Please wait while we sign you in...
        </p>
      </div>
    </div>
  );
}
