// "use client";
// import { useState, useEffect } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Check,
//   Zap,
//   Sparkles,
//   Crown,
//   ArrowRight,
//   CircleChevronLeft,
//   Clock,
//   TrendingDown,
// } from "lucide-react";
// import { createClient } from "@supabase/supabase-js";

// const tiers = [
//   {
//     name: "Starter",
//     icon: Zap,
//     monthlyPrice: "29",
//     monthlyPromoPrice: "19",
//     yearlyPrice: "24",
//     yearlyPromoPrice: "16",
//     credits: "300",
//     videos: "~20",
//     features: [
//       "300 video credits/month",
//       "UGC & Educational AI styles",
//       "YouTube & TikTok auto-posting",
//       "Copy-paste ready captions (Instagram, Facebook, LinkedIn)",
//       "Basic analytics",
//       "Email support",
//       "No Watermark",
//     ],
//     popular: false,
//     discount: "35%",
//   },
//   {
//     name: "Pro",
//     icon: Sparkles,
//     monthlyPrice: "79",
//     monthlyPromoPrice: "59",
//     yearlyPrice: "66",
//     yearlyPromoPrice: "49",
//     credits: "750",
//     videos: "~50",
//     features: [
//       "750 video credits/month",
//       "All AI styles (UGC, Trend, Educational)",
//       "YouTube & TikTok auto-posting",
//       "Smart scheduling (7 days ahead)",
//       "Copy-paste ready captions (Instagram, Facebook, LinkedIn)",
//       // "Advanced analytics & insights",
//       "Priority support",
//       "No Watermark",
//     ],
//     popular: true,
//     discount: "25%",
//   },
//   {
//     name: "Scale",
//     icon: Crown,
//     monthlyPrice: "149",
//     monthlyPromoPrice: "119",
//     yearlyPrice: "124",
//     yearlyPromoPrice: "99",
//     credits: "2000",
//     videos: "~130",
//     features: [
//       "2000 video credits/month",
//       "All AI styles + priority queue",
//       "YouTube & TikTok auto-posting",
//       "Advanced scheduling (30 days ahead)",
//       "Copy-paste ready captions (all platforms)",
//       "Bulk video upload & generation",
//       // "Performance insights & reports",
//       "Priority support",
//       "No Watermark",
//     ],
//     popular: false,
//     discount: "20%",
//   },
// ];

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// export const Pricing = () => {
//   const [isYearly, setIsYearly] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(90 * 24 * 60 * 60); // 90 days in seconds
//   const supabase = createClient(supabaseUrl, supabaseAnonKey);
//   const router = useRouter();
//   const pathname = usePathname();
//   const isDashboard = pathname.startsWith("/dashboard");

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const formatTime = (seconds) => {
//     const totalHours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${totalHours}h ${minutes.toString().padStart(2, "0")}m ${secs
//       .toString()
//       .padStart(2, "0")}s`;
//   };

//   const handleClick = async () => {
//     const {
//       data: { session },
//     } = await supabase.auth.getSession();
//     router.push(session ? "/dashboard" : "/auth");
//   };

//   return (
//     <section className="py-24 sm:py-32 relative overflow-hidden" id="pricing">
//       {isDashboard && (
//         <div className="fixed top-5 left-5">
//           <a
//             href="/dashboard"
//             className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
//           >
//             <CircleChevronLeft size={30} />
//           </a>
//         </div>
//       )}

//       {/* Promo Banner */}
//       {/* <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary via-accent to-primary py-3.5 z-20 shadow-lg">
//         <div className="container mx-auto px-4 flex items-center justify-center gap-4 flex-wrap">
//           <div className="flex items-center gap-2">
//             <TrendingDown className="w-5 h-5 text-white animate-bounce" />
//             <span className="text-white font-bold text-sm sm:text-base">
//               🎉 SPECIAL LAUNCH OFFER
//             </span>
//           </div>
//           <span className="text-white/95 text-sm sm:text-base font-medium">
//             Save up to 35% on all plans
//           </span>
//           <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/30">
//             <Clock className="w-4 h-4 text-white" />
//             <span className="text-white font-mono font-bold text-sm">
//               {formatTime(timeLeft)}
//             </span>
//           </div>
//         </div>
//       </div> */}

//       <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
//         <div className="text-center max-w-3xl mx-auto mb-12">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
//             <span className="relative flex h-3 w-3">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
//             </span>
//             <span className="text-sm font-semibold text-primary">
//               Limited Time Pricing
//             </span>
//           </div>

//           <h2 className="text-4xl sm:text-5xl font-bold mb-4">
//             Choose Your <span className="text-gradient">Growth Plan</span>
//           </h2>
//           <p className="text-lg text-muted-foreground mb-8">
//             Simple credit-based pricing. ~15 credits = 1 video ad.
//             <br />
//             <span className="text-primary font-semibold">
//               Promotional pricing for your first 3 months! 🔒
//             </span>
//           </p>

//           <div className="inline-flex items-center gap-4 p-1.5 rounded-full bg-muted/50 border border-border">
//             <button
//               onClick={() => setIsYearly(false)}
//               className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
//                 !isYearly
//                   ? "bg-background text-foreground shadow-md"
//                   : "text-muted-foreground hover:text-foreground"
//               }`}
//             >
//               Monthly
//             </button>
//             <button
//               onClick={() => setIsYearly(true)}
//               className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
//                 isYearly
//                   ? "bg-background text-foreground shadow-md"
//                   : "text-muted-foreground hover:text-foreground"
//               }`}
//             >
//               Yearly
//             </button>
//           </div>

//           {isYearly && (
//             <p className="text-sm text-primary font-semibold mt-4">
//               💰 Save even more with annual billing
//             </p>
//           )}
//         </div>

//         <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
//           {tiers.map((tier, index) => {
//             const originalPrice = isYearly
//               ? tier.yearlyPrice
//               : tier.monthlyPrice;
//             const promoPrice = isYearly
//               ? tier.yearlyPromoPrice
//               : tier.monthlyPromoPrice;

//             return (
//               <div
//                 key={index}
//                 className={`relative group ${tier.popular ? "md:-mt-4" : ""}`}
//               >
//                 {/* Discount Badge */}
//                 <div className="absolute -top-3 -right-3 z-10">
//                   <div className="relative">
//                     <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-50 animate-pulse"></div>
//                     <div className="relative bg-gradient-to-br from-primary to-accent text-white font-bold text-sm px-3.5 py-1.5 rounded-full shadow-lg border-2 border-white">
//                       SAVE {tier.discount}
//                     </div>
//                   </div>
//                 </div>

//                 {tier.popular && (
//                   <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-xs font-bold text-background shadow-lg z-10 whitespace-nowrap">
//                     ⭐ MOST POPULAR
//                   </div>
//                 )}

//                 <div
//                   className={`h-full p-8 rounded-3xl border transition-all duration-300 ${
//                     tier.popular
//                       ? "bg-gradient-to-br from-card via-card to-primary/5 border-primary shadow-2xl shadow-primary/20 scale-105"
//                       : "bg-card border-border/50 hover:border-primary/30 hover:shadow-xl"
//                   }`}
//                 >
//                   <div className="mb-6">
//                     <div
//                       className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${
//                         tier.popular
//                           ? "bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30"
//                           : "bg-primary/10"
//                       }`}
//                     >
//                       <tier.icon
//                         className={`w-7 h-7 ${
//                           tier.popular ? "text-background" : "text-primary"
//                         }`}
//                       />
//                     </div>
//                     <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
//                   </div>

//                   <div className="mb-6">
//                     <div className="mb-4">
//                       <div className="flex items-center justify-center gap-2 mb-2">
//                         <span className="text-3xl text-muted-foreground line-through font-semibold">
//                           ${originalPrice}
//                         </span>
//                         <span className="text-sm text-muted-foreground">
//                           /{isYearly ? "mo" : "month"}
//                         </span>
//                       </div>
//                       <div className="flex items-baseline justify-center gap-2">
//                         <span className="text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//                           ${promoPrice}
//                         </span>
//                         <div className="flex flex-col">
//                           <span className="text-muted-foreground text-sm">
//                             /{isYearly ? "mo" : "month"}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="mt-2 text-xs text-muted-foreground">
//                         Then ${originalPrice}/{isYearly ? "mo" : "month"} after
//                         3 months
//                       </div>
//                     </div>

//                     <div className="flex justify-center">
//                       <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
//                         <span className="text-sm font-bold text-primary">
//                           {tier.credits} credits
//                         </span>
//                         <span className="text-xs text-muted-foreground">
//                           • {tier.videos} videos
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <Button
//                     className={`w-full mb-6 h-12 text-base font-semibold group bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg glow-primary transition-all ${
//                       tier.popular ? "shadow-primary/30" : ""
//                     }`}
//                     onClick={handleClick}
//                   >
//                     Claim This Deal
//                     <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                   </Button>

//                   <div className="space-y-3">
//                     {tier.features.map((feature, i) => (
//                       <div key={i} className="flex items-start gap-3">
//                         <div className="mt-0.5">
//                           <Check className="w-5 h-5 text-primary flex-shrink-0" />
//                         </div>
//                         <span className="text-sm text-muted-foreground leading-relaxed">
//                           {feature}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         <div className="max-w-4xl mx-auto space-y-4 text-center">
//           <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
//             <p className="text-sm text-muted-foreground mb-3">
//               <span className="font-semibold text-foreground">
//                 All plans include:
//               </span>{" "}
//               Multi-platform captions • Multi-format export • Regular AI updates
//               • Cancel anytime
//             </p>
//             <p className="text-sm mb-3">
//               <span className="text-primary font-bold">
//                 ⚡ Early Bird Bonus:
//               </span>{" "}
//               <span className="text-foreground">
//                 First 100 customers get{" "}
//                 <span className="font-semibold">+50 bonus credits</span> on
//                 their first month!
//               </span>
//             </p>
//             <p className="text-sm text-muted-foreground">
//               Need 2000+ videos/month or custom features?{" "}
//               <a
//                 href="/contact"
//                 className="text-primary hover:underline font-semibold"
//               >
//                 Contact our sales team →
//               </a>
//             </p>
//           </div>

//           {!isDashboard && (
//             <div className="space-y-2">
//               <p className="text-xs text-muted-foreground">
//                 Start with 50 free credits • No credit card required • Upgrade
//                 anytime
//               </p>
//               <p className="text-sm font-semibold text-primary">
//                 🎯 Join 500+ creators already creating amazing content!
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };
"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Check,
  Zap,
  Sparkles,
  Crown,
  ArrowRight,
  CircleChevronLeft,
  Loader2,
  X,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
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
// TIERS
// ============================================================
const tiers = [
  {
    name: "Starter",
    icon: Zap,
    monthlyPrice: "29",
    monthlyPromoPrice: "19",
    yearlyPrice: "24",
    yearlyPromoPrice: "16",
    credits: "300",
    valueIndicator: "Enough for ~20 basic ads",
    stripeMonthlyPriceId: "price_starter_monthly_placeholder",
    stripeYearlyPriceId: "price_starter_yearly_placeholder",
    features: [
      "300 video credits/month",
      "UGC & Educational AI styles",
      "YouTube & TikTok auto-posting",
      "Copy-paste ready captions (Instagram, Facebook, LinkedIn)",
      "Basic analytics",
      "Email support",
      "No Watermark",
    ],
    popular: false,
    discount: "35%",
  },
  {
    name: "Pro",
    icon: Sparkles,
    monthlyPrice: "79",
    monthlyPromoPrice: "59",
    yearlyPrice: "66",
    yearlyPromoPrice: "49",
    credits: "750",
    valueIndicator: "Enough for ~50 professional ads",
    stripeMonthlyPriceId: "price_pro_monthly_placeholder",
    stripeYearlyPriceId: "price_pro_yearly_placeholder",
    features: [
      "750 video credits/month",
      "All AI styles (UGC, Trend, Educational)",
      "YouTube & TikTok auto-posting",
      "Smart scheduling (7 days ahead)",
      "Copy-paste ready captions (Instagram, Facebook, LinkedIn)",
      "Priority support",
      "No Watermark",
    ],
    popular: true,
    discount: "25%",
  },
  {
    name: "Scale",
    icon: Crown,
    monthlyPrice: "149",
    monthlyPromoPrice: "119",
    yearlyPrice: "124",
    yearlyPromoPrice: "99",
    credits: "2000",
    valueIndicator: "Enough for ~130 enterprise ads",
    stripeMonthlyPriceId: "price_scale_monthly_placeholder",
    stripeYearlyPriceId: "price_scale_yearly_placeholder",
    features: [
      "2000 video credits/month",
      "All AI styles + priority queue",
      "YouTube & TikTok auto-posting",
      "Advanced scheduling (30 days ahead)",
      "Copy-paste ready captions (all platforms)",
      "Bulk video upload & generation",
      "Priority support",
      "No Watermark",
    ],
    popular: false,
    discount: "20%",
  },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ============================================================
// PRICING
// ============================================================
export const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  const handleClick = async (tier: (typeof tiers)[0]) => {
    // 👇 WAITLIST MODE — otwiera modal zamiast checkout
    if (WAITLIST_MODE) {
      setWaitlistOpen(true);
      return;
    }

    // 👇 NORMAL MODE — oryginalny flow Stripe
    setLoadingTier(tier.name);
    try {
      const priceId = isYearly
        ? tier.stripeYearlyPriceId
        : tier.stripeMonthlyPriceId;
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        localStorage.setItem(
          "pendingCheckout",
          JSON.stringify({ priceId, tierName: tier.name, isYearly }),
        );
        router.push("/auth");
      } else {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId, userId: session.user.id }),
        });
        if (!response.ok) throw new Error("Failed to create checkout session");
        const { url } = await response.json();
        if (url) window.location.href = url;
        else throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <>
      <WaitlistModal
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />

      <section className="py-24 sm:py-32 relative overflow-hidden" id="pricing">
        {isDashboard && (
          <div className="fixed top-5 left-5 z-50">
            <a
              href="/dashboard"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <CircleChevronLeft size={30} />
            </a>
          </div>
        )}

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-sm font-semibold text-primary">
                {WAITLIST_MODE ? "Coming Soon" : "Limited Time Pricing"}
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Choose Your <span className="text-gradient">Growth Plan</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Simple credit-based pricing. ~15 credits = 1 video ad.
              <br />
              {WAITLIST_MODE ? (
                <span className="text-primary font-semibold">
                  Join the waitlist to get early access + bonus credits! 🎁
                </span>
              ) : (
                <span className="text-primary font-semibold">
                  Promotional pricing for your first 3 months! 🔒
                </span>
              )}
            </p>

            <div className="inline-flex items-center gap-4 p-1.5 rounded-full bg-muted/50 border border-border">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  !isYearly
                    ? "bg-background text-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  isYearly
                    ? "bg-background text-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly
              </button>
            </div>

            {isYearly && (
              <p className="text-sm text-primary font-semibold mt-4">
                💰 Save even more with annual billing
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            {tiers.map((tier, index) => {
              const originalPrice = isYearly
                ? tier.yearlyPrice
                : tier.monthlyPrice;
              const promoPrice = isYearly
                ? tier.yearlyPromoPrice
                : tier.monthlyPromoPrice;

              return (
                <div
                  key={index}
                  className={`relative group ${tier.popular ? "md:-mt-4" : ""}`}
                >
                  <div className="absolute -top-3 -right-3 z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-50 animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-primary to-accent text-white font-bold text-sm px-3.5 py-1.5 rounded-full shadow-lg border-2 border-white">
                        SAVE {tier.discount}
                      </div>
                    </div>
                  </div>

                  {tier.popular && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-60"></div>
                        <div className="relative px-6 py-2 rounded-full bg-gradient-to-r from-primary to-accent text-sm font-bold text-white shadow-2xl border-2 border-white/20 whitespace-nowrap">
                          ⭐ MOST POPULAR
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    className={`h-full p-8 rounded-3xl border transition-all duration-300 ${
                      tier.popular
                        ? "bg-gradient-to-br from-card via-card to-primary/5 border-primary shadow-2xl shadow-primary/20 scale-105"
                        : "bg-card border-border/50 hover:border-primary/30 hover:shadow-xl"
                    }`}
                  >
                    <div className="mb-6">
                      <div
                        className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${
                          tier.popular
                            ? "bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30"
                            : "bg-primary/10"
                        }`}
                      >
                        <tier.icon
                          className={`w-7 h-7 ${tier.popular ? "text-white" : "text-primary"}`}
                        />
                      </div>
                      <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
                    </div>

                    <div className="mb-6">
                      <div className="mb-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-3xl text-muted-foreground line-through font-semibold">
                            ${originalPrice}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            /{isYearly ? "mo" : "month"}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            ${promoPrice}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            /{isYearly ? "mo" : "month"}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Then ${originalPrice}/{isYearly ? "mo" : "month"}{" "}
                          after 3 months
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-center">
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                            <span className="text-sm font-bold text-primary">
                              {tier.credits} credits
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-center text-muted-foreground font-medium">
                          {tier.valueIndicator}
                        </p>
                      </div>
                    </div>

                    <Button
                      className={`w-full mb-6 h-12 text-base font-semibold group bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg transition-all ${
                        tier.popular ? "shadow-primary/30" : ""
                      }`}
                      onClick={() => handleClick(tier)}
                      disabled={!WAITLIST_MODE && loadingTier === tier.name}
                    >
                      {!WAITLIST_MODE && loadingTier === tier.name ? (
                        <>
                          <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : WAITLIST_MODE ? (
                        // 👇 WAITLIST MODE — inny tekst przycisku
                        <>
                          Join Waitlist
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      ) : (
                        // 👇 NORMAL MODE
                        <>
                          Claim This Deal
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>

                    <div className="space-y-3">
                      {tier.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="max-w-4xl mx-auto space-y-4 text-center">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-3">
                <span className="font-semibold text-foreground">
                  All plans include:
                </span>{" "}
                Multi-platform captions • Multi-format export • Regular AI
                updates • Cancel anytime
              </p>
              <p className="text-sm mb-3">
                <span className="text-primary font-bold">
                  ⚡ Early Bird Bonus:
                </span>{" "}
                <span className="text-foreground">
                  First 100 customers get{" "}
                  <span className="font-semibold">+50 bonus credits</span> on
                  their first month!
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Need 2000+ videos/month or custom features?{" "}
                <a
                  href="/contact"
                  className="text-primary hover:underline font-semibold"
                >
                  Contact our sales team →
                </a>
              </p>
            </div>

            {!isDashboard && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  {WAITLIST_MODE
                    ? "Join the waitlist • Be first to get access • Bonus credits on launch"
                    : "Start with 50 free credits • No credit card required • Upgrade anytime"}
                </p>
                <p className="text-sm font-semibold text-primary">
                  🎯 Join 100+ creators already creating amazing content!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
