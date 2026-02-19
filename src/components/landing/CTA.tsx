"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Play,
  X,
  Mail,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { WAITLIST_MODE } from "@/lib/config"; // ← jedna flaga dla całej apki

// ============================================================
// WAITLIST MODAL
// ============================================================
const WaitlistModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Something went wrong.");
      }
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-background border border-border shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>

        {status === "success" ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              You're on the list! 🎉
            </h3>
            <p className="text-muted-foreground text-sm">
              We'll notify you at{" "}
              <span className="text-foreground font-medium">{email}</span> when
              access opens up.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Got it!
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
                <Sparkles className="w-3 h-3" />
                Early Access
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Join the Waitlist
              </h3>
              <p className="text-muted-foreground text-sm">
                Be first to know when we launch. Early members get{" "}
                <span className="text-primary font-semibold">
                  bonus credits
                </span>{" "}
                on day one.
              </p>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
              {errorMsg && (
                <p className="text-red-500 text-xs px-1">{errorMsg}</p>
              )}
              <button
                onClick={handleSubmit}
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    Join Waitlist
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================
// CTA
// ============================================================
export const CTA = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <>
      <WaitlistModal
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />

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
              Ready to{" "}
              <span className="text-gradient">Stream Your Success?</span>
            </h2>

            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of brands creating and distributing AI-powered ads
              effortlessly
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              {WAITLIST_MODE ? (
                // 👇 WAITLIST MODE
                <Button
                  size="lg"
                  onClick={() => setWaitlistOpen(true)}
                  className="group bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-10 py-7 rounded-xl font-semibold shadow-lg glow-primary transition-all"
                >
                  Start Creating Ads
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                // 👇 NORMAL MODE
                <a href="/auth">
                  <Button
                    size="lg"
                    className="group bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-10 py-7 rounded-xl font-semibold shadow-lg glow-primary transition-all"
                  >
                    Start Creating Ads
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              )}

              <a href="#showcase">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-7 rounded-xl font-semibold border-border/50 hover:border-primary/50 backdrop-blur-sm"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </a>
            </div>

            <p className="text-sm text-muted-foreground">
              {WAITLIST_MODE
                ? "No credit card required • Join the waitlist"
                : "No credit card required • Free to start"}
            </p>

            <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div>
                <div className="text-4xl font-bold text-gradient mb-2">
                  10K+
                </div>
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
                <div className="text-4xl font-bold text-gradient mb-2">
                  100%
                </div>
                <div className="text-sm text-muted-foreground">
                  Automated Posting
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
// "use client";
// import { Button } from "@/components/ui/button";
// import { ArrowRight, Sparkles, Zap, Clock } from "lucide-react";

// export const CTA = () => {
//   return (
//     <section className="py-32 relative overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
//       <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
//       <div
//         className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"
//         style={{ animationDelay: "1s" }}
//       />

//       <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="max-w-5xl mx-auto">
//           {/* Main CTA Card */}
//           <div className="relative overflow-hidden p-12 sm:p-16 rounded-3xl bg-gradient-to-br from-card to-muted border border-primary/20 shadow-2xl">
//             {/* Decorative elements */}
//             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
//             <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

//             <div className="relative z-10 text-center space-y-8">
//               <div className="inline-block">
//                 <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
//                   <Sparkles className="inline w-4 h-4 mr-1" />
//                   Start Creating Today
//                 </span>
//               </div>

//               <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
//                 Stop posting manually.
//                 <br />
//                 <span className="text-gradient">Start scaling with AI.</span>
//               </h2>

//               <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
//                 Join creators and businesses turning product photos into viral
//                 video ads in seconds—with YouTube automation included.
//               </p>

//               {/* CTA Buttons */}
//               <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
//                 <Button
//                   size="lg"
//                   className="group bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-10 py-7 rounded-xl font-semibold shadow-lg transition-all"
//                 >
//                   Get Started Free
//                   <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
//                 </Button>
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="text-lg px-10 py-7 rounded-xl font-semibold border-border/50 hover:border-primary/50 backdrop-blur-sm"
//                   onClick={() =>
//                     (window.location.href =
//                       "mailto:contact@adstreamai.com?subject=Schedule a Demo")
//                   }
//                 >
//                   Schedule a Demo
//                 </Button>
//               </div>

//               <p className="text-sm text-muted-foreground">
//                 30 free credits • No credit card required • Cancel anytime
//               </p>

//               {/* Benefits Grid */}
//               <div className="grid sm:grid-cols-3 gap-6 pt-8 max-w-3xl mx-auto">
//                 <div className="p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
//                     <Zap className="w-6 h-6 text-primary" />
//                   </div>
//                   <div className="text-2xl font-bold text-gradient mb-2">
//                     60s
//                   </div>
//                   <div className="text-sm text-muted-foreground">
//                     From photo to video
//                   </div>
//                 </div>

//                 <div className="p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
//                     <Clock className="w-6 h-6 text-primary" />
//                   </div>
//                   <div className="text-2xl font-bold text-gradient mb-2">
//                     10hrs/week
//                   </div>
//                   <div className="text-sm text-muted-foreground">
//                     Time saved on average
//                   </div>
//                 </div>

//                 <div className="p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
//                     <Sparkles className="w-6 h-6 text-primary" />
//                   </div>
//                   <div className="text-2xl font-bold text-gradient mb-2">
//                     6+
//                   </div>
//                   <div className="text-sm text-muted-foreground">
//                     Platforms supported
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Trust indicators */}
//           <div className="mt-12 text-center">
//             <p className="text-sm text-muted-foreground mb-4">
//               Trusted by creators, agencies, and e-commerce brands worldwide
//             </p>
//             <div className="flex flex-wrap justify-center gap-6 items-center">
//               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <div className="w-2 h-2 rounded-full bg-green-500" />
//                 <span>30-day money-back guarantee</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <div className="w-2 h-2 rounded-full bg-green-500" />
//                 <span>Cancel anytime</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <div className="w-2 h-2 rounded-full bg-green-500" />
//                 <span>No setup fees</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };
