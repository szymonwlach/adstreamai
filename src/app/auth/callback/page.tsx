"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        // 🔑 KLUCZOWY KROK – zamiana code → session
        const { error } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        );

        if (error) {
          console.error("OAuth exchange error:", error);
          router.replace("/auth?error=oauth_failed");
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          router.replace("/dashboard");
        } else {
          router.replace("/auth?error=no_session");
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        router.replace("/auth?error=oauth_failed");
      }
    };

    handleOAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
    </div>
  );
}
