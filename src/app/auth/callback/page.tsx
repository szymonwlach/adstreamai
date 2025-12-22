"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { CircleChevronLeft } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";

export default function AuthPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        // Dodaj małe opóźnienie żeby uniknąć flash error
        await new Promise((resolve) => setTimeout(resolve, 300));

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session && isMounted) {
          router.push("/dashboard");
        } else if (isMounted) {
          setIsChecking(false);
        }
      } catch (error) {
        console.error("Session check error:", error);
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    checkSession();

    // Nasłuchuj zmian stanu autoryzacji
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session && isMounted) {
          // Małe opóźnienie dla smooth transition
          await new Promise((resolve) => setTimeout(resolve, 500));
          router.push("/dashboard");
        }
      }
    );

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [router]);

  // Pokaż loading tylko podczas sprawdzania sesji
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full opacity-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      </div>

      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <a
          href="/"
          className="group flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-all duration-300"
        >
          <div className="p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm group-hover:bg-white dark:group-hover:bg-slate-800 transition-all duration-300 shadow-sm group-hover:shadow-md">
            <CircleChevronLeft size={24} />
          </div>
          <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Back
          </span>
        </a>
      </div>

      {/* Auth card with wrapper for glow effect */}
      <div className="relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-20 animate-pulse" />
        <div className="relative">
          <AuthCard className="w-full max-w-md backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 shadow-2xl border border-white/20 dark:border-slate-700/50 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
