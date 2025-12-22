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
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />

        {/* Animated background blurs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative z-10">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl opacity-30 animate-pulse" />

          {/* Main card */}
          <div className="relative bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 max-w-md w-full border border-border/50">
            <div className="flex flex-col items-center gap-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-30 animate-pulse" />
                <div className="relative bg-gradient-to-br from-primary to-accent rounded-full p-5 shadow-lg">
                  <div className="w-14 h-14 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              </div>
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold text-gradient">
                  Checking Session
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Please wait while we verify your login status
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-6">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />

      {/* Animated background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <a
          href="/"
          className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300"
        >
          <div className="p-2 rounded-xl bg-card/50 backdrop-blur-sm group-hover:bg-card transition-all duration-300 shadow-sm group-hover:shadow-md border border-border/50">
            <CircleChevronLeft size={24} />
          </div>
          <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Back
          </span>
        </a>
      </div>

      {/* Auth card with wrapper for glow effect */}
      <div className="relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur-2xl opacity-20 animate-pulse" />
        <div className="relative">
          <AuthCard className="w-full max-w-md backdrop-blur-xl bg-card/80 shadow-2xl border border-border/50 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
