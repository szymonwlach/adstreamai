"use client";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Check,
  Zap,
  Sparkles,
  Crown,
  Gift,
  ArrowRight,
  CircleChevronLeft,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { DashboardNavbar } from "../dashboardPage/DashboardNavbar";

const tiers = [
  {
    name: "Growth",
    icon: Zap,
    price: "49",
    credits: "25",
    description: "Perfect for solopreneurs & small brands",
    features: [
      "25 AI video credits/month",
      "All AI styles (UGC, Trend, Educational)",
      "Post to all 6+ platforms",
      "Smart scheduling & autoposting",
      "Basic analytics",
      "Email support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Business",
    icon: Sparkles,
    price: "195",
    credits: "100",
    description: "For scaling brands & agencies",
    features: [
      "100 AI video credits/month",
      "Priority AI generation (faster)",
      "Advanced analytics & insights",
      "Custom branding removal",
      "A/B testing tools",
      "Priority support",
      "Team collaboration (up to 3 users)",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    icon: Crown,
    price: "499",
    credits: "300",
    description: "For established businesses at scale",
    features: [
      "300 AI video credits/month",
      "White-label options",
      "API access",
      "Real-time dashboard",
      "Dedicated account manager",
      "Custom integrations",
      "Unlimited team members",
      "Custom posting schedules",
    ],
    cta: "Get Started",
    popular: false,
  },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const Pricing = () => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  // Sprawdzenie zalogowania i przekierowanie
  const handleClick = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    router.push(session ? "/dashboard" : "/auth");
  };

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden" id="pricing">
      <div className="fixed top-5 left-5 ">
        <a
          href="/dashboard"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <CircleChevronLeft size={30} />
        </a>
      </div>

      <div className="absolutebg-gradient-to-b from-background via-muted/10 to-background" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Simple, <span className="text-gradient">Credit-Based</span> Pricing
          </h2>
          <p
            className={`text-xl text-muted-foreground ${
              isDashboard ? "mb-12" : ""
            }`}
          >
            5 credits = 1 AI-generated video. Start free, upgrade when ready.
          </p>
        </div>

        {/* Free Forever Banner */}
        {isDashboard ? (
          ""
        ) : (
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/30 rounded-2xl p-8 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent">
                        <Gift className="w-5 h-5 text-background" />
                      </div>
                      <h3 className="text-2xl font-bold text-gradient">
                        Start Free Forever
                      </h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Get{" "}
                      <span className="font-bold text-foreground text-lg">
                        5 free video credits
                      </span>{" "}
                      to try AdStreamAI. No credit card, no time limit.
                      <br />
                      <span className="text-sm">
                        Upgrade anytime to unlock monthly credits & advanced
                        features
                      </span>
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-primary" />
                        <span>5 credits forever</span>
                      </div>
                      <span className="text-border hidden sm:inline">•</span>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-primary" />
                        <span>All AI styles</span>
                      </div>
                      <span className="text-border hidden sm:inline">•</span>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-primary" />
                        <span>No expiration</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-xl shadow-primary/30 text-base px-8 py-6 h-auto group"
                      onClick={handleClick}
                    >
                      Start for Free
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      Upgrade later starting at $49/mo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative group ${tier.popular ? "md:-mt-4" : ""}`}
            >
              {tier.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-xs font-bold text-background shadow-lg z-10">
                  MOST POPULAR
                </div>
              )}

              <div
                className={`h-full p-8 rounded-3xl border transition-all ${
                  tier.popular
                    ? "bg-gradient-to-br from-card to-muted border-primary shadow-xl shadow-primary/20"
                    : "bg-card border-border/50 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
                }`}
              >
                <div className="mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                      tier.popular
                        ? "bg-gradient-to-br from-primary to-accent"
                        : "bg-primary/10"
                    }`}
                  >
                    <tier.icon
                      className={`w-6 h-6 ${
                        tier.popular ? "text-background" : "text-primary"
                      }`}
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {tier.description}
                  </p>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold text-gradient">
                      ${tier.price}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>

                  <div className="inline-block px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary">
                    {tier.credits} video credits/mo
                  </div>
                </div>

                <Button
                  className={`w-full mb-6 ${
                    tier.popular
                      ? "bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                  size="lg"
                  onClick={handleClick}
                >
                  {tier.cta}
                </Button>

                <ul className="space-y-3">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            All plans include: Unlimited platform connections • Auto-scheduling
            • Smart optimization • Regular updates
          </p>
          <p className="text-sm text-muted-foreground">
            Need 300+ videos/month or custom features?{" "}
            <a
              href="#contact"
              className="text-primary hover:underline font-semibold"
            >
              Contact sales for Enterprise+
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
