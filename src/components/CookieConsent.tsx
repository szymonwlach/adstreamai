"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cookie, X, Shield, BarChart3, Sparkles } from "lucide-react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Show immediately, no delay
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      {/* Cookie banner - bottom right, always visible, no blur */}
      <div className="fixed bottom-6 right-6 max-w-md z-50 animate-in slide-in-from-bottom-4 duration-500">
        <Card className="relative overflow-hidden border-2 shadow-2xl bg-gradient-to-br from-background via-background to-primary/5">
          {/* Decorative gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary" />

          {/* Close button */}
          <button
            onClick={decline}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          <div className="p-6">
            {/* Header with icon */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Cookie className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Cookie Preferences</h3>
                <p className="text-xs text-muted-foreground">
                  We value your privacy
                </p>
              </div>
            </div>

            {/* Main text */}
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              We use cookies to enhance your experience, analyze site usage, and
              personalize content. Your choice matters to us.
            </p>

            {/* Cookie types (collapsible) */}
            {showDetails && (
              <div className="space-y-3 mb-4 animate-in slide-in-from-top-2 duration-300">
                <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
                  <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Essential</p>
                    <p className="text-xs text-muted-foreground">
                      Required for the website to function
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
                  <BarChart3 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Analytics</p>
                    <p className="text-xs text-muted-foreground">
                      Help us improve your experience
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
                  <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Personalization</p>
                    <p className="text-xs text-muted-foreground">
                      Tailored content just for you
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Toggle details button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-primary hover:underline mb-4 font-medium"
            >
              {showDetails ? "Hide details" : "Show details"}
            </button>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={decline}
                className="flex-1 group"
              >
                Decline All
              </Button>
              <Button
                onClick={accept}
                className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25"
              >
                Accept All
              </Button>
            </div>

            {/* Privacy policy link */}
            <p className="text-xs text-center text-muted-foreground mt-3">
              Read our{" "}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
