"use client";

// ============================================================
// 🚀 TRYB WAITLISTY — zmień na `false` żeby wrócić do normalu
// ============================================================
import { WAITLIST_MODE } from "@/lib/config";
// ============================================================

import { useState, useEffect } from "react";
import {
  Sparkles,
  Youtube,
  Clock,
  Copy,
  Zap,
  Globe,
  ArrowRight,
  Layers,
  Wand2,
  X,
  Mail,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================================
// WAITLIST MODAL
// ============================================================
const WaitlistModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Something went wrong.");
      }
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-background border border-border shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>

        {status === "success" ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              You're on the list! 🎉
            </h3>
            <p className="text-muted-foreground text-sm">
              We'll notify you at{" "}
              <span className="text-foreground font-medium">{email}</span> when
              access opens up.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Got it!
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
                <Sparkles className="w-3 h-3" />
                Early Access
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Join the Waitlist
              </h3>
              <p className="text-muted-foreground text-sm">
                Be first to know when we launch. Early members get{" "}
                <span className="text-primary font-semibold">
                  bonus credits
                </span>{" "}
                on day one.
              </p>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
              {errorMsg && (
                <p className="text-red-500 text-xs px-1">{errorMsg}</p>
              )}
              <button
                onClick={handleSubmit}
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    Join Waitlist
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================
// FEATURES
// ============================================================
const features = [
  {
    icon: Layers,
    title: "Batch Generate Multiple Styles",
    description:
      "Create 3, 5, or even 12 different ad variations at once. Select multiple video styles (UGC, Trend, Cinematic, etc.) and generate them all simultaneously—perfect for A/B testing.",
    highlight: true,
  },
  {
    icon: Wand2,
    title: "12 Professional Video Styles",
    description:
      "From authentic UGC to cinematic luxury, ASMR to stop-motion. Mix and match styles in one batch to find what resonates with your audience.",
  },
  {
    icon: Sparkles,
    title: "AI Video Generation",
    description:
      "Upload product photos and get professional ads in seconds. Each style generates a completely unique video—no editing skills required.",
  },
  {
    icon: Youtube,
    title: "YouTube & TikTok Auto-Publishing",
    description:
      "Publish or schedule all your generated videos directly to YouTube and TikTok. Set it once and forget it—your content goes live automatically.",
  },
  {
    icon: Copy,
    title: "Platform-Ready Captions",
    description:
      "Get unique, pre-written captions with hashtags for each video and each platform. TikTok, Instagram, Facebook, LinkedIn—different text for each.",
  },
  {
    icon: Clock,
    title: "Smart Scheduling",
    description:
      "Schedule weeks of content in minutes. Queue up all your batch-generated videos and let them post automatically at optimal times.",
  },
];

export const Features = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <>
      <WaitlistModal
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />

      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-background to-background/50">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
              Create 10+ variations in one click.
              <span className="text-gradient"> Find what converts.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Generate multiple ad styles simultaneously and auto-publish to
              YouTube and TikTok. Get ready-to-use content for all other
              platforms in one go.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                {feature.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-white text-xs font-bold shadow-lg">
                      ⚡ GAME CHANGER
                    </div>
                  </div>
                )}
                <div
                  className={`h-full p-8 rounded-2xl bg-card border transition-all duration-500 hover:shadow-2xl ${
                    feature.highlight
                      ? "border-primary/50 hover:border-primary shadow-lg shadow-primary/10"
                      : "border-border/50 hover:border-primary/30 hover:shadow-primary/5"
                  }`}
                >
                  <div className="mb-6">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                        feature.highlight
                          ? "bg-primary/20 group-hover:bg-primary/30"
                          : "bg-primary/10 group-hover:bg-primary/15"
                      }`}
                    >
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Advanced Customization */}
          <div className="max-w-5xl mx-auto mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Wand2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  ADVANCED CUSTOMIZATION
                </span>
              </div>
              <h3 className="text-3xl font-bold mb-3">
                Fine-tune every detail (optional)
              </h3>
              <p className="text-muted-foreground text-lg">
                Want more control? Customize tone, hooks, CTAs, and messaging
                for each video style
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <span className="text-xl">🎭</span>
                </div>
                <h4 className="font-semibold text-lg mb-2">Tone of Voice</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Choose from Casual & Friendly, Professional, Playful & Fun,
                  Luxury & Premium, or Urgent & Bold
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-md bg-muted text-xs">
                    Casual
                  </span>
                  <span className="px-2 py-1 rounded-md bg-muted text-xs">
                    Professional
                  </span>
                  <span className="px-2 py-1 rounded-md bg-muted text-xs">
                    Playful
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <span className="text-xl">🎣</span>
                </div>
                <h4 className="font-semibold text-lg mb-2">
                  Opening Hook & CTA
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Set custom opening hooks and calls to action for maximum
                  engagement
                </p>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Hooks:</span> "Stop
                    scrolling!", "You need to see this"
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">CTAs:</span> "Shop Now",
                    "Learn More", "Try It Free"
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <span className="text-xl">💬</span>
                </div>
                <h4 className="font-semibold text-lg mb-2">
                  Key Message & USPs
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Define your target audience, key selling points, and core
                  message
                </p>
                <div className="text-xs text-muted-foreground">
                  Perfect for laser-focused ads that speak directly to your
                  ideal customer
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-xl bg-muted/50 border border-border/50">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">
                    AI does the heavy lifting by default
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Our AI automatically generates optimized hooks, CTAs, and
                    messaging for each video style. Use custom options only when
                    you need precise control over your ad copy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden p-10 sm:p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-primary/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
                  <div>
                    <h3 className="text-3xl font-bold mb-4">
                      Stop creating one video at a time
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      While others spend hours making one ad, you're generating
                      5-10 variations in different styles. Test what works,
                      scale what converts, and dominate every platform with
                      ready-to-publish content.
                    </p>
                  </div>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Generate 10+ videos per product",
                        desc: "Create multiple styles at once—find your winner faster",
                      },
                      {
                        title: "A/B test effortlessly",
                        desc: "UGC vs Cinematic vs Trend—see what your audience loves",
                      },
                      {
                        title: "Auto-publish everywhere",
                        desc: "YouTube & TikTok automation + captions for all platforms",
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-background/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-border/50">
                  <p className="text-sm font-semibold text-muted-foreground mb-3">
                    EXAMPLE WORKFLOW
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-sm">
                      1 Product Photo
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-sm">
                      Select 5 Styles
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-sm font-semibold">
                      5 Unique Videos Ready
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    💡 Generated in under 3 minutes. Published to YouTube &
                    TikTok automatically.
                  </p>
                </div>

                {/* ↓ PRZYCISK Z WAITLIST_MODE */}
                <div className="text-center pt-4">
                  {WAITLIST_MODE ? (
                    // 👇 WAITLIST MODE
                    <Button
                      size="lg"
                      onClick={() => setWaitlistOpen(true)}
                      className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 py-6 rounded-xl font-semibold shadow-lg"
                    >
                      Start Batch Creating Free
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  ) : (
                    // 👇 NORMAL MODE
                    <a href="/dashboard">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 py-6 rounded-xl font-semibold shadow-lg"
                      >
                        Start Batch Creating Free
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </a>
                  )}
                  <p className="text-sm text-muted-foreground mt-4">
                    {WAITLIST_MODE
                      ? "No credit card required • Join the waitlist"
                      : "No credit card required • Generate up to 3 videos free"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
