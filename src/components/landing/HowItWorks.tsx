"use client";
import { Upload, Wand2, Rocket, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload & Describe",
    description:
      "Upload your product photo and add a description — or let our AI generate one automatically from the image.",
    step: "01",
    details: [
      "Drag & drop images",
      "AI auto-descriptions",
      "Bulk uploads supported",
    ],
  },
  {
    icon: Wand2,
    title: "AI Generates Videos",
    description:
      "Our AI instantly creates multiple video styles: UGC-style ads, trending formats, and educational content.",
    step: "02",
    details: [
      "Multiple video styles",
      "Platform optimization",
      "Custom branding",
    ],
  },
  {
    icon: Rocket,
    title: "Select & Schedule",
    description:
      "Choose your platforms, set your posting frequency, and let AdStreamAI handle the rest automatically.",
    step: "03",
    details: [
      "Choose platforms",
      "Flexible scheduling",
      "Auto-optimized captions",
    ],
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Three Steps to <span className="text-gradient">Ad Automation</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            From product photo to multi-platform campaigns in minutes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="h-full p-8 rounded-3xl bg-gradient-to-br from-card to-muted/50 border border-border/50 hover:border-primary/30 transition-all">
                <div className="mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-background" />
                  </div>
                  <span className="text-5xl font-bold text-primary/10">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {step.description}
                </p>

                <ul className="space-y-3">
                  {step.details.map((detail, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-sm text-muted-foreground"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Ready to streamline your ad creation?
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold">
            <span>⚡</span>
            <span>Average setup time: 90 seconds</span>
          </div>
        </div>
      </div>
    </section>
  );
};
