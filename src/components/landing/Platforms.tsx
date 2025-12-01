"use client";
import { Play, CheckCircle2 } from "lucide-react";

const platforms = [
  { name: "TikTok", gradient: "from-[#00f2ea] to-[#ff0050]" },
  { name: "Instagram", gradient: "from-[#f09433] via-[#e6683c] to-[#bc1888]" },
  { name: "Facebook", gradient: "from-[#1877f2] to-[#0a66c2]" },
  { name: "YouTube", gradient: "from-[#ff0000] to-[#cc0000]" },
  { name: "LinkedIn", gradient: "from-[#0077b5] to-[#00a0dc]" },
  { name: "Twitter/X", gradient: "from-[#1da1f2] to-[#0d8bd9]" },
];

export const Platforms = () => {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Choose <span className="text-gradient">Your Platforms</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Select which platforms to post to, and AdStreamAI optimizes content
            for each one automatically
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto mb-16">
          {platforms.map((platform, index) => (
            <div key={index} className="group relative aspect-square">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-card to-muted border border-border/50 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10" />

              <div className="relative h-full flex flex-col items-center justify-center p-4 space-y-3">
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <Play className="w-8 h-8 text-white ml-0.5" />
                </div>
                <p className="font-semibold text-sm text-center">
                  {platform.name}
                </p>
              </div>

              {/* Checkmark indicator */}
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-background" />
              </div>
            </div>
          ))}
        </div>

        {/* Feature highlights */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
            <h4 className="font-bold text-lg mb-2">Platform-Specific</h4>
            <p className="text-sm text-muted-foreground">
              Each video is formatted with the perfect dimensions, length, and
              style for its platform
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
            <h4 className="font-bold text-lg mb-2">Smart Captions</h4>
            <p className="text-sm text-muted-foreground">
              Auto-generated captions and hashtags optimized for each platform's
              algorithm
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
            <h4 className="font-bold text-lg mb-2">Flexible Posting</h4>
            <p className="text-sm text-muted-foreground">
              Choose posting frequency based on your subscription — daily, every
              2 days, or weekly
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
