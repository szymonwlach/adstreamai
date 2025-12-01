"use client";
import { Button } from "@/components/ui/button";
import { Check, Zap, Sparkles, Crown } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    icon: Zap,
    price: "49",
    description: "Perfect for testing the waters",
    frequency: "1 ad every 3 days",
    features: [
      "1 product upload",
      "AI-generated videos (UGC style)",
      "3 platform selections",
      "Basic analytics",
      "Standard support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    icon: Sparkles,
    price: "149",
    description: "For growing brands",
    frequency: "1 ad every 2 days",
    features: [
      "5 product uploads",
      "All AI video styles (UGC, Trend, Educational)",
      "All 6 platform selections",
      "Advanced analytics & insights",
      "Priority support",
      "Custom branding",
      "A/B testing",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    icon: Crown,
    price: "399",
    description: "For established businesses",
    frequency: "1 ad daily",
    features: [
      "Unlimited product uploads",
      "All AI video styles + custom",
      "All platforms + future additions",
      "Real-time analytics dashboard",
      "Dedicated account manager",
      "White-label options",
      "API access",
      "Custom posting schedules",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export const Pricing = () => {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden" id="pricing">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Choose Your <span className="text-gradient">Ad Stream</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Select the posting frequency that fits your marketing goals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative group ${tier.popular ? "md:-mt-4" : ""}`}
            >
              {tier.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-xs font-bold text-background shadow-lg">
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

                  <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                    {tier.frequency}
                  </div>
                </div>

                <Button
                  className={`w-full mb-6 ${
                    tier.popular
                      ? "bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                  size="lg"
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

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Need a custom plan?{" "}
            <a
              href="#contact"
              className="text-primary hover:underline font-semibold"
            >
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
