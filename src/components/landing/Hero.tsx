// import { Button } from "@/components/ui/button";
// import { ArrowRight, Play } from "lucide-react";
// import Image from "next/image";

// export const Hero = () => {
//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
//       {/* Background with gradient overlay */}
//       <div className="absolute inset-0 z-0">
//         <Image
//           src="/hero-bg.jpg"
//           alt="AI-powered ad streaming"
//           fill
//           className="object-cover opacity-40"
//           priority
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
//       </div>

//       {/* Animated glow effects */}
//       <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
//       <div
//         className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"
//         style={{ animationDelay: "1s" }}
//       />

//       {/* Content */}
//       <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto text-center space-y-8">
//           <div className="inline-block">
//             <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold backdrop-blur-sm">
//               🚀 AI-Generated Ads Posted Across Platforms
//             </span>
//           </div>

//           <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
//             Stream Your Ads to{" "}
//             <span className="text-gradient">Every Platform</span>
//           </h1>

//           <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
//             Turn any product photo into viral-ready videos and schedule them
//             across all selected platforms — in seconds.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
//             <a href="/dashboard">
//               <Button
//                 size="lg"
//                 className="group bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 py-6 rounded-xl font-semibold shadow-lg glow-primary transition-all"
//               >
//                 Start Your Ad Stream
//                 <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
//               </Button>
//             </a>

//             <Button
//               size="lg"
//               variant="outline"
//               className="text-lg px-8 py-6 rounded-xl font-semibold border-border/50 hover:border-primary/50 backdrop-blur-sm"
//             >
//               <Play className="mr-2 h-5 w-5" />
//               Watch Demo
//             </Button>
//           </div>

//           <div className="pt-8 flex flex-wrap justify-center gap-8 items-center text-sm text-muted-foreground">
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//               <span>Free trial • No credit card</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//               <span>Set up in 2 minutes</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };
// import { Button } from "@/components/ui/button";
// import { ArrowRight, Play } from "lucide-react";
// import Image from "next/image";

// export const Hero = () => {
//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
//       {/* Background with gradient overlay */}
//       <div className="absolute inset-0 z-0">
//         <Image
//           src="/hero-bg.jpg"
//           alt="AI-powered ad creation"
//           fill
//           className="object-cover opacity-40"
//           priority
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
//       </div>

//       {/* Animated glow effects */}
//       <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
//       <div
//         className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"
//         style={{ animationDelay: "1s" }}
//       />

//       {/* Content */}
//       <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto text-center space-y-8">
//           <div className="inline-block">
//             <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold backdrop-blur-sm">
//               ✨ AI-Powered Ad Creation in Multiple Styles
//             </span>
//           </div>

//           <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
//             Create & Post Ads{" "}
//             <span className="text-gradient">Across All Platforms</span>
//           </h1>

//           <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
//             Generate stunning video ads from product photos with multiple
//             creative styles. Post anywhere with one click.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
//             <a href="/dashboard">
//               <Button
//                 size="lg"
//                 className="group bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 py-6 rounded-xl font-semibold shadow-lg glow-primary transition-all"
//               >
//                 Create Your First Ad
//                 <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
//               </Button>
//             </a>
//             <Button
//               size="lg"
//               variant="outline"
//               className="text-lg px-8 py-6 rounded-xl font-semibold border-border/50 hover:border-primary/50 backdrop-blur-sm"
//             >
//               <Play className="mr-2 h-5 w-5" />
//               Watch Demo
//             </Button>
//           </div>

//           <div className="pt-8 flex flex-wrap justify-center gap-8 items-center text-sm text-muted-foreground">
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//               <span>Free to start • No credit card</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//               <span>Multiple ad styles</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };
// import { Button } from "@/components/ui/button";
// import { ArrowRight, Play } from "lucide-react";
// import Image from "next/image";

// export const Hero = () => {
//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
//       {/* Background with gradient overlay */}
//       <div className="absolute inset-0 z-0">
//         <Image
//           src="/hero-bg.jpg"
//           alt="AI-powered ad creation"
//           fill
//           className="object-cover opacity-40"
//           priority
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
//       </div>

//       {/* Animated glow effects */}
//       <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
//       <div
//         className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"
//         style={{ animationDelay: "1s" }}
//       />

//       {/* Content */}
//       <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto text-center space-y-8">
//           <div className="inline-block">
//             <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold backdrop-blur-sm">
//               ✨ AI-Powered Ad Creation in Multiple Styles
//             </span>
//           </div>

//           <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
//             Stream Your Ads{" "}
//             <span className="text-gradient">Across Platforms</span>
//           </h1>

//           <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
//             Generate stunning video ads from product photos with multiple
//             creative styles. Auto-post to TikTok & YouTube, ready-to-go content
//             for Facebook & Instagram.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
//             <a href="/dashboard">
//               <Button
//                 size="lg"
//                 className="group bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 py-6 rounded-xl font-semibold shadow-lg glow-primary transition-all"
//               >
//                 Start Streaming Ads
//                 <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
//               </Button>
//             </a>
//             <a href="#showcase">
//               <Button
//                 size="lg"
//                 variant="outline"
//                 className="text-lg px-8 py-6 rounded-xl font-semibold border-border/50 hover:border-primary/50 backdrop-blur-sm"
//               >
//                 <Play className="mr-2 h-5 w-5" />
//                 Watch Demo
//               </Button>
//             </a>
//           </div>

//           <div className="pt-8 flex flex-wrap justify-center gap-8 items-center text-sm text-muted-foreground">
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//               <span>Free to start • No credit card</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//               <span>Multiple ad styles</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };
"use client";

// ============================================================
// 🚀 TRYB WAITLISTY — zmień na `false` żeby wrócić do normalu
// ============================================================
import { WAITLIST_MODE } from "@/lib/config";
// ============================================================

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
import Image from "next/image";

// ============================================================
// WAITLIST MODAL (identyczny jak w AdTransformationShowcase)
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
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
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
// HERO
// ============================================================
export const Hero = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <>
      <WaitlistModal
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />

      <section className="relative min-h-[70vh] md:min-h-[85vh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg"
            alt="AI-powered ad creation"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        {/* Glow effects */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        {/* Content */}
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              Create & Stream Ads{" "}
              <span className="text-gradient">Across Platforms</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Turn Photos into Viral Video Ads. Automate TikTok & YouTube. Get
              ready-to-post assets for everywhere else.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              {WAITLIST_MODE ? (
                // 👇 WAITLIST MODE
                <Button
                  size="lg"
                  onClick={() => setWaitlistOpen(true)}
                  className="group bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 py-6 rounded-xl font-semibold shadow-lg glow-primary transition-all"
                >
                  Start Creating Ads
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                // 👇 NORMAL MODE
                <a href="/dashboard">
                  <Button
                    size="lg"
                    className="group bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 py-6 rounded-xl font-semibold shadow-lg glow-primary transition-all"
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
                  className="text-lg px-8 py-6 rounded-xl font-semibold border-border/50 hover:border-primary/50 backdrop-blur-sm"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </a>
            </div>

            <div className="pt-8 flex flex-wrap justify-center gap-8 items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>
                  {WAITLIST_MODE
                    ? "Join waitlist • No credit card"
                    : "Free to start • No credit card"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Multiple ad styles</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
