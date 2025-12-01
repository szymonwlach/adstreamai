"use client";
import { Sparkles, Target, Zap, Clock, TrendingUp, Shield } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Generated Videos",
    description:
      "Create UGC-style ads, trend-inspired clips, and educational content from a single product photo",
  },
  {
    icon: Target,
    title: "Platform Optimization",
    description:
      "Automatically optimize for TikTok, Instagram, Facebook, YouTube Shorts, and LinkedIn",
  },
  {
    icon: Zap,
    title: "One-Click Cross-Posting",
    description:
      "Post to all platforms simultaneously with platform-specific formatting and requirements",
  },
  {
    icon: Clock,
    title: "Smart Scheduling",
    description:
      "Set your posting schedule and let AdStreamAI handle 24/7 automatic content distribution",
  },
  {
    icon: TrendingUp,
    title: "Auto-Generated Captions",
    description:
      "Get platform-optimized captions, hashtags, and descriptions for maximum engagement",
  },
  {
    icon: Shield,
    title: "Brand Consistency",
    description:
      "Maintain your brand voice and style across all platforms with AI-powered content adaptation",
  },
];

export const Features = () => {
  return (
    <section className="py-24 sm:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Everything You Need for{" "}
            <span className="text-gradient">Ad Success</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features that make product promotion effortless
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
