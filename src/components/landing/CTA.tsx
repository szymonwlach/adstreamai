"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Ready to <span className="text-gradient">Stream Your Success?</span>
          </h2>

          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of brands creating and distributing AI-powered ads
            effortlessly
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button
              size="lg"
              className="group bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-10 py-7 rounded-xl font-semibold shadow-lg glow-primary transition-all"
            >
              Start Free Trial
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-7 rounded-xl font-semibold border-border/50 hover:border-primary/50 backdrop-blur-sm"
              onClick={() =>
                (window.location.href =
                  "mailto:contact@adstreamai.com?subject=Schedule a Demo")
              }
            >
              Schedule a Demo
            </Button>
          </div>

          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">
                Ads Generated Daily
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">6+</div>
              <div className="text-sm text-muted-foreground">
                Platform Integrations
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">100%</div>
              <div className="text-sm text-muted-foreground">
                Automated Posting
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
