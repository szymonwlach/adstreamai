"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

const PLAN_CREDITS: Record<string, number> = {
  starter: 300,
  pro: 750,
  scale: 2000,
};

const PLAN_EMOJI: Record<string, string> = {
  starter: "⚡",
  pro: "✨",
  scale: "👑",
};

export default function SuccessPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      // Czekaj chwilę żeby webhook zdążył zaktualizować bazę
      await new Promise((r) => setTimeout(r, 2000));

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push("/auth");
        return;
      }

      const res = await fetch(`/api/user/profile?email=${session.user.email}`);
      const data = await res.json();

      setPlan(data?.plan || "starter");
      setCredits(data?.credits ?? PLAN_CREDITS[data?.plan] ?? 300);
      setLoading(false);
    };

    fetchUser();
  }, []);

  // Animacja licznika kredytów
  useEffect(() => {
    if (!credits) return;
    const duration = 1500;
    const steps = 60;
    const increment = credits / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= credits) {
        setCount(credits);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [credits]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground animate-pulse">
            Activating your plan...
          </p>
        </div>
      </div>
    );
  }

  const planName = plan
    ? plan.charAt(0).toUpperCase() + plan.slice(1)
    : "Starter";
  const emoji = PLAN_EMOJI[plan || "starter"];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
        {/* Confetti dots */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor:
                i % 3 === 0
                  ? "hsl(var(--primary))"
                  : i % 3 === 1
                    ? "hsl(var(--accent))"
                    : "#22c55e",
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1.5 + Math.random()}s`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Main card */}
        <div className="bg-card border border-border/50 rounded-3xl p-8 sm:p-12 shadow-2xl">
          {/* Emoji */}
          <div className="text-7xl mb-6 animate-bounce">{emoji}</div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {planName}!
            </span>
          </h1>

          <p className="text-muted-foreground mb-8 text-lg">
            Your subscription is active. Time to create some amazing ads!
          </p>

          {/* Credits counter */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6 mb-8">
            <p className="text-sm text-muted-foreground mb-2 font-medium uppercase tracking-wide">
              Credits added to your account
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tabular-nums">
                {count}
              </span>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">credits</p>
                <p className="text-xs text-muted-foreground">per month</p>
              </div>
            </div>
          </div>

          {/* What's next */}
          <div className="space-y-3 mb-8 text-left">
            {[
              "Upload your product photos",
              "Choose a video style",
              "Let AI generate your ads",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">{step}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push("/dashboard/my-ads")}
              className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-95 transition-all"
            >
              🚀 Start Generating
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="flex-1 py-3.5 px-6 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-semibold text-sm transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-xs text-muted-foreground mt-4">
          Confirmation sent to your email • Cancel anytime
        </p>
      </div>
    </div>
  );
}
