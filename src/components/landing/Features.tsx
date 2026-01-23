"use client";
import {
  Sparkles,
  Youtube,
  Clock,
  Copy,
  Zap,
  Globe,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Sparkles,
    title: "AI Video Generation",
    description:
      "Upload a product photo and get professional UGC ads, educational content, or trending videos in seconds. No editing skills required.",
  },
  {
    icon: Youtube,
    title: "YouTube & TikTok Auto-Publishing",
    description:
      "Click publish or schedule your videos directly to YouTube and TikTok. Set it once and forget it—your content goes live automatically on both platforms.",
  },
  {
    icon: Copy,
    title: "Platform-Ready Captions",
    description:
      "Get unique, pre-written captions with hashtags for TikTok, Instagram, Facebook, and LinkedIn. Different text for each platform—just copy and paste.",
  },
  {
    icon: Clock,
    title: "Smart Scheduling",
    description:
      "Schedule weeks of content in minutes. Your YouTube and TikTok videos post automatically at the perfect time while you sleep.",
  },
  {
    icon: Zap,
    title: "Lightning-Fast Creation",
    description:
      "From product photo to published video in under 60 seconds. Create a month's worth of content in one afternoon.",
  },
  {
    icon: Globe,
    title: "Multi-Platform Strategy",
    description:
      "One video, multiple formats. Export optimized versions for Shorts, Reels, and TikTok with platform-specific captions included.",
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
            Stop spending hours on content.
            <span className="text-gradient"> Start scaling.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Everything you need to create, optimize, and publish video ads—with
            YouTube automation and ready-to-use content for all other platforms.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              {/* Card */}
              <div className="h-full p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300">
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
                    Your time is worth more than manual posting
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    AdStreamAI automates YouTube and TikTok posting completely
                    and generates ready-to-paste content for Instagram,
                    Facebook, and LinkedIn. Save hours on video creation and
                    caption writing.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Save 10+ hours per week</p>
                      <p className="text-sm text-muted-foreground">
                        No more manual video editing or caption writing
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Post 10x more content</p>
                      <p className="text-sm text-muted-foreground">
                        Scale your presence without scaling your team
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Never miss the algorithm</p>
                      <p className="text-sm text-muted-foreground">
                        Consistent posting = better reach and engagement
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 py-6 rounded-xl font-semibold shadow-lg"
                >
                  Start Creating Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  No credit card required • 7-day free trial
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
