"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Check,
  Zap,
  Sparkles,
  Crown,
  ArrowRight,
  CircleChevronLeft,
  Clock,
  TrendingDown,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const tiers = [
  {
    name: "Starter",
    icon: Zap,
    monthlyPrice: "29",
    monthlyPromoPrice: "19",
    yearlyPrice: "24",
    yearlyPromoPrice: "16",
    credits: "300",
    videos: "~20",
    features: [
      "300 video credits/month",
      "UGC & Educational AI styles",
      "YouTube & TikTok auto-posting",
      "Copy-paste ready captions (Instagram, Facebook, LinkedIn)",
      "Basic analytics",
      "Email support",
    ],
    popular: false,
    discount: "35%",
  },
  {
    name: "Pro",
    icon: Sparkles,
    monthlyPrice: "79",
    monthlyPromoPrice: "59",
    yearlyPrice: "66",
    yearlyPromoPrice: "49",
    credits: "750",
    videos: "~50",
    features: [
      "750 video credits/month",
      "All AI styles (UGC, Trend, Educational)",
      "YouTube & TikTok auto-posting",
      "Smart scheduling (7 days ahead)",
      "Copy-paste ready captions (Instagram, Facebook, LinkedIn)",
      "Advanced analytics & insights",
      "Priority support",
    ],
    popular: true,
    discount: "25%",
  },
  {
    name: "Scale",
    icon: Crown,
    monthlyPrice: "149",
    monthlyPromoPrice: "119",
    yearlyPrice: "124",
    yearlyPromoPrice: "99",
    credits: "2000",
    videos: "~130",
    features: [
      "2000 video credits/month",
      "All AI styles + priority queue",
      "YouTube & TikTok auto-posting",
      "Advanced scheduling (30 days ahead)",
      "Copy-paste ready captions (all platforms)",
      "Bulk video upload & generation",
      "Performance insights & reports",
      "Priority support + onboarding call",
    ],
    popular: false,
    discount: "20%",
  },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90 * 24 * 60 * 60); // 90 days in seconds
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours.toString().padStart(2, "0")}h ${minutes
      .toString()
      .padStart(2, "0")}m`;
  };

  const handleClick = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    router.push(session ? "/dashboard" : "/auth");
  };

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden" id="pricing">
      {isDashboard && (
        <div className="fixed top-5 left-5">
          <a
            href="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <CircleChevronLeft size={30} />
          </a>
        </div>
      )}

      {/* Promo Banner */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 py-3.5 z-20 shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-white animate-bounce" />
            <span className="text-white font-bold text-sm sm:text-base">
              🎉 SPECIAL LAUNCH OFFER
            </span>
          </div>
          <span className="text-white/95 text-sm sm:text-base font-medium">
            Save up to 35% on all plans
          </span>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/30">
            <Clock className="w-4 h-4 text-white" />
            <span className="text-white font-mono font-bold text-sm">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-semibold text-emerald-700">
              Limited Time Pricing
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Choose Your <span className="text-gradient">Growth Plan</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Simple credit-based pricing. ~15 credits = 1 video ad.
            <br />
            <span className="text-emerald-600 font-semibold">
              Lock in these promotional prices for 3 months! 🔒
            </span>
          </p>

          <div className="inline-flex items-center gap-4 p-1.5 rounded-full bg-muted/50 border border-border">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                !isYearly
                  ? "bg-background text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                isYearly
                  ? "bg-background text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
            </button>
          </div>

          {isYearly && (
            <p className="text-sm text-emerald-600 font-semibold mt-4">
              💰 Save even more with annual billing
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {tiers.map((tier, index) => {
            const originalPrice = isYearly
              ? tier.yearlyPrice
              : tier.monthlyPrice;
            const promoPrice = isYearly
              ? tier.yearlyPromoPrice
              : tier.monthlyPromoPrice;

            return (
              <div
                key={index}
                className={`relative group ${tier.popular ? "md:-mt-4" : ""}`}
              >
                {/* Discount Badge */}
                <div className="absolute -top-3 -right-3 z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold text-sm px-3.5 py-1.5 rounded-full shadow-lg border-2 border-white">
                      SAVE {tier.discount}
                    </div>
                  </div>
                </div>

                {tier.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-xs font-bold text-background shadow-lg z-10 whitespace-nowrap">
                    ⭐ MOST POPULAR
                  </div>
                )}

                <div
                  className={`h-full p-8 rounded-3xl border transition-all duration-300 ${
                    tier.popular
                      ? "bg-gradient-to-br from-card via-card to-primary/5 border-primary shadow-2xl shadow-primary/20 scale-105"
                      : "bg-card border-border/50 hover:border-primary/30 hover:shadow-xl"
                  }`}
                >
                  <div className="mb-6">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${
                        tier.popular
                          ? "bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30"
                          : "bg-primary/10"
                      }`}
                    >
                      <tier.icon
                        className={`w-7 h-7 ${
                          tier.popular ? "text-background" : "text-primary"
                        }`}
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
                  </div>

                  <div className="mb-6">
                    <div className="mb-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-3xl text-muted-foreground line-through font-semibold">
                          ${originalPrice}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          /{isYearly ? "mo" : "month"}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-6xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                          ${promoPrice}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-sm">
                            /{isYearly ? "mo" : "month"}
                          </span>
                          <span className="text-xs text-emerald-600 font-semibold">
                            for 3 months
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-sm font-bold text-emerald-700">
                          {tier.credits} credits
                        </span>
                        <span className="text-xs text-muted-foreground">
                          • {tier.videos} videos
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className={`w-full mb-6 h-12 text-base font-semibold relative overflow-hidden group ${
                      tier.popular
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/30 text-white"
                        : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                    }`}
                    onClick={handleClick}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Claim This Deal
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </span>
                  </Button>

                  <div className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        </div>
                        <span className="text-sm text-muted-foreground leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto space-y-4 text-center">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/50">
            <p className="text-sm text-muted-foreground mb-3">
              <span className="font-semibold text-foreground">
                All plans include:
              </span>{" "}
              Multi-platform captions • Multi-format export • Regular AI updates
              • Cancel anytime
            </p>
            <p className="text-sm mb-3">
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                ⚡ Early Bird Bonus:
              </span>{" "}
              <span className="text-foreground">
                First 100 customers get{" "}
                <span className="font-semibold">+50 bonus credits</span> on
                their first month!
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Need 2000+ videos/month or custom features?{" "}
              <a
                href="/contact"
                className="text-emerald-600 hover:underline font-semibold"
              >
                Contact our sales team →
              </a>
            </p>
          </div>

          {!isDashboard && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Start with 50 free credits • No credit card required • Upgrade
                anytime
              </p>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                🎯 Join 500+ creators already creating amazing content!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
