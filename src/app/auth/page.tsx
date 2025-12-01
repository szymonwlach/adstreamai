"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { CircleChevronLeft } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Tylko sprawdź czy już zalogowany
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/dashboard");
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-5 left-5">
        <a
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <CircleChevronLeft size={30} />
        </a>
      </div>

      <AuthCard className="w-full max-w-md" />
    </div>
  );
}
