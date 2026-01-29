"use client";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-b from-background to-background/50">
      {/* Subtle background decoration */}
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
            YouTube and TikTok. Get ready-to-use content for all other platforms
            in one go.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              {/* Highlight badge for main feature */}
              {feature.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-white text-xs font-bold shadow-lg">
                    ⚡ GAME CHANGER
                  </div>
                </div>
              )}

              {/* Card */}
              <div
                className={`h-full p-8 rounded-2xl bg-card border transition-all duration-500 hover:shadow-2xl ${
                  feature.highlight
                    ? "border-primary/50 hover:border-primary shadow-lg shadow-primary/10"
                    : "border-border/50 hover:border-primary/30 hover:shadow-primary/5"
                }`}
              >
                {/* Icon */}
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

                {/* Content */}
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

        {/* Value Proposition Section */}
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden p-10 sm:p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-primary/20">
            {/* Decorative blur */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
                <div>
                  <h3 className="text-3xl font-bold mb-4">
                    Stop creating one video at a time
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    While others spend hours making one ad, you're generating
                    5-10 variations in different styles. Test what works, scale
                    what converts, and dominate every platform with
                    ready-to-publish content.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        Generate 10+ videos per product
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Create multiple styles at once—find your winner faster
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold">A/B test effortlessly</p>
                      <p className="text-sm text-muted-foreground">
                        UGC vs Cinematic vs Trend—see what your audience loves
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Auto-publish everywhere</p>
                      <p className="text-sm text-muted-foreground">
                        YouTube & TikTok automation + captions for all platforms
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Example showcase */}
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
                  💡 Generated in under 3 minutes. Published to YouTube & TikTok
                  automatically.
                </p>
              </div>

              <div className="text-center pt-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 py-6 rounded-xl font-semibold shadow-lg"
                >
                  Start Batch Creating Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  No credit card required • Generate up to 3 videos free
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
