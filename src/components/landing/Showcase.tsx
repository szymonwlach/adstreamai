"use client";

// ============================================================
// 🚀 TRYB WAITLISTY — zmień na `false` żeby wrócić do normalu
// ============================================================
import { WAITLIST_MODE } from "@/lib/config";
// ============================================================

import React, { useRef, useEffect, useState } from "react";
import {
  Sparkles,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Zap,
  Crown,
  CheckCircle2,
  ArrowRight,
  Camera,
  Clock,
  Palette,
  RotateCcw,
  X,
  Mail,
  Loader2,
} from "lucide-react";

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
      // Zamień ten endpoint na swój rzeczywisty
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-background border border-border shadow-2xl p-6 sm:p-8">
        {/* Close */}
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
            {/* Header */}
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

            {/* Input */}
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
// MAIN COMPONENT
// ============================================================
const AdTransformationShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [showPoster, setShowPoster] = useState(true);
  const [showMetrics, setShowMetrics] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false); // ← NOWE
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const preloadRefs = useRef({});

  const availableStyles = [
    {
      id: "ugc",
      name: "UGC",
      icon: Camera,
      description: "Authentic & Relatable",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "trend",
      name: "Trending",
      icon: TrendingUp,
      description: "Viral & Dynamic",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "cinematic_luxury",
      name: "Luxury",
      icon: Crown,
      description: "Premium & Elegant",
      color: "from-yellow-500 to-amber-500",
    },
  ];

  const demos = [
    {
      id: 0,
      title: "Electrolyte Hydration Drink",
      style: "Cyber Glitch 3D",
      industry: "Beverage",
      beforeImage: "/previews_photo/cyber_glitch.jpg",
      videoFile: "/previews_video/cyber_glitch.mp4",
      metrics: { engagement: "87%", ctr: "7.2%", conversions: "+280%" },
    },
    {
      id: 1,
      title: "Premium Serum",
      style: "trend",
      industry: "Beauty",
      beforeImage: "/previews_photo/serum.png",
      videoFile: "/previews_video/trend2.mp4",
      metrics: { engagement: "94%", ctr: "9.1%", conversions: "+390%" },
    },
    {
      id: 2,
      title: "Skin Care Serum",
      style: "ugc",
      industry: "Beauty",
      beforeImage: "/previews_photo/skincare.png",
      videoFile: "/previews_video/skin_care2.mp4",
      metrics: { engagement: "87%", ctr: "7.2%", conversions: "+280%" },
    },
    {
      id: 3,
      title: "Face Cream",
      style: "trend",
      industry: "Wellness",
      beforeImage: "/previews_photo/cream.png",
      videoFile: "/previews_video/trend.mp4",
      metrics: { engagement: "89%", ctr: "7.8%", conversions: "+310%" },
    },
    {
      id: 4,
      title: "Luxury Watch",
      style: "cinematic_luxury",
      industry: "E-commerce",
      beforeImage: "/previews_photo/zegarek.png",
      videoFile: "/previews_video/luxury_watch.mp4",
      metrics: { engagement: "92%", ctr: "8.4%", conversions: "+340%" },
    },
  ];

  const currentDemo = demos[currentIndex];

  useEffect(() => {
    const preloadNext = () => {
      for (let i = 1; i <= 2; i++) {
        const nextIndex = (currentIndex + i) % demos.length;
        const nextDemo = demos[nextIndex];

        if (!preloadRefs.current[nextIndex]) {
          const video = document.createElement("video");
          video.preload = "auto";
          video.src = nextDemo.videoFile;
          video.muted = true;
          video.style.display = "none";
          document.body.appendChild(video);
          preloadRefs.current[nextIndex] = video;
        }
      }
    };

    preloadNext();

    return () => {
      Object.keys(preloadRefs.current).forEach((key) => {
        const index = parseInt(key);
        if (Math.abs(index - currentIndex) > 2) {
          preloadRefs.current[index]?.remove();
          delete preloadRefs.current[index];
        }
      });
    };
  }, [currentIndex]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {});
          } else {
            if (videoRef.current) {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [currentIndex]);

  useEffect(() => {
    if (videoRef.current) {
      setVideoLoading(true);
      setShowPoster(true);

      const video = videoRef.current;
      const source = video.querySelector("source");

      if (source) {
        source.src = currentDemo.videoFile;
      }

      video.load();
      video.muted = isMuted;

      const handleCanPlay = () => {
        setVideoLoading(false);
        setTimeout(() => {
          setShowPoster(false);
          video.play().catch(() => {});
        }, 100);
      };

      video.addEventListener("canplay", handleCanPlay);

      return () => {
        video.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [currentIndex, currentDemo.videoFile]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const nextDemo = () => {
    setCurrentIndex((prev) => (prev + 1) % demos.length);
  };

  const prevDemo = () => {
    setCurrentIndex((prev) => (prev - 1 + demos.length) % demos.length);
  };

  const getStyleInfo = (styleId) => {
    return availableStyles.find((s) => s.id === styleId) || availableStyles[0];
  };

  return (
    <>
      {/* WAITLIST MODAL */}
      <WaitlistModal
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />

      <section
        ref={sectionRef}
        className="relative py-16 sm:py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background"
      >
        {/* Animated background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "4s" }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "6s", animationDelay: "2s" }}
          />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-12 lg:mb-16 space-y-4 sm:space-y-4 lg:space-y-6">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold backdrop-blur-sm">
                ✨ Create & Stream AI-Powered Ads
              </span>
            </div>

            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-bold tracking-tighter px-4 leading-[1.1] sm:leading-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                One Photo.
              </span>
              <br />
              <span className="text-foreground">Infinite Possibilities.</span>
            </h2>

            <p className="text-lg sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4">
              Transform your product into high-converting ads in under 3
              minutes. Choose from 12 proven styles that drive real results.
            </p>

            <div className="mt-12 sm:mt-16 lg:mt-20 text-center px-4">
              {WAITLIST_MODE ? (
                // 👇 WAITLIST MODE
                <button
                  onClick={() => setWaitlistOpen(true)}
                  className="group relative inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold text-base sm:text-lg shadow-xl shadow-primary/50 hover:shadow-2xl hover:shadow-primary/60 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Start Creating Now</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                // 👇 NORMAL MODE
                <a href="/auth">
                  <button className="group relative inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold text-base sm:text-lg shadow-xl shadow-primary/50 hover:shadow-2xl hover:shadow-primary/60 transition-all hover:scale-105 active:scale-95">
                    <span>Start Creating Now</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </a>
              )}
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
                {WAITLIST_MODE
                  ? "No credit card required • Join the waitlist"
                  : "No credit card required • 3 free ads to start"}
              </p>
            </div>
          </div>

          {/* Social Proof Bar */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-12 mb-8 sm:mb-12 lg:mb-16 text-sm px-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-muted-foreground text-xs sm:text-sm">
                Under 3 min creation
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
              <span className="text-muted-foreground text-xs sm:text-sm">
                12 unique styles
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              <span className="text-muted-foreground text-xs sm:text-sm">
                Cinema-quality HD
              </span>
            </div>
          </div>

          {/* Main Showcase */}
          <div className="max-w-7xl mx-auto">
            <div className="relative">
              {/* Navigation - Desktop */}
              <button
                onClick={prevDemo}
                className="hidden lg:flex absolute -left-4 xl:-left-20 top-1/2 -translate-y-1/2 z-20 p-3 lg:p-4 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:border-primary/50 shadow-xl hover:scale-110 transition-all group items-center justify-center"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-muted-foreground group-hover:text-primary" />
              </button>
              <button
                onClick={nextDemo}
                className="hidden lg:flex absolute -right-4 xl:-right-20 top-1/2 -translate-y-1/2 z-20 p-3 lg:p-4 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:border-primary/50 shadow-xl hover:scale-110 transition-all group items-center justify-center"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-muted-foreground group-hover:text-primary" />
              </button>

              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
                {/* Video */}
                <div className="relative order-1 lg:order-2">
                  {/* Mobile Navigation */}
                  <button
                    onClick={prevDemo}
                    className="lg:hidden absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-background/90 backdrop-blur-sm border-2 border-primary/30 hover:border-primary shadow-xl active:scale-95 transition-all"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                  </button>
                  <button
                    onClick={nextDemo}
                    className="lg:hidden absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-background/90 backdrop-blur-sm border-2 border-primary/30 hover:border-primary shadow-xl active:scale-95 transition-all"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                  </button>

                  <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-br from-accent/30 to-primary/30 rounded-3xl blur-2xl opacity-50" />
                  <div className="relative">
                    <div className="hidden lg:block mb-4 sm:mb-6">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                        Ready in &lt;4 Minutes
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        {(() => {
                          const styleInfo = getStyleInfo(currentDemo.style);
                          const Icon = styleInfo.icon;
                          return (
                            <>
                              <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                              <p className="text-xs sm:text-sm text-accent">
                                {styleInfo.name} Style
                              </p>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="relative group">
                      <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl sm:rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                      <div className="relative bg-background/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 border border-border shadow-2xl">
                        <div className="relative w-full max-w-[280px] sm:max-w-[350px] lg:max-w-[450px] mx-auto aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden bg-black shadow-2xl">
                          {showPoster && (
                            <div className="absolute inset-0 z-10 bg-black flex items-center justify-center transition-opacity duration-300">
                              <img
                                src={currentDemo.beforeImage}
                                alt={currentDemo.title}
                                className="w-full h-full object-cover"
                              />
                              {videoLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                                    <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-spin" />
                                    <span className="text-white text-xs sm:text-sm font-medium">
                                      Loading video...
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          <video
                            ref={videoRef}
                            className={`w-full h-full object-cover transition-opacity duration-500 ${showPoster ? "opacity-0" : "opacity-100"}`}
                            loop
                            playsInline
                            muted={isMuted}
                            preload="auto"
                            poster={currentDemo.beforeImage}
                          >
                            <source
                              src={currentDemo.videoFile}
                              type="video/mp4"
                            />
                          </video>

                          <div
                            className={`absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 flex flex-col gap-1.5 sm:gap-2 transition-opacity duration-300 ${showMetrics ? "opacity-100" : "opacity-0"} lg:opacity-0 lg:group-hover:opacity-100`}
                          >
                            <div className="px-2 py-1 sm:px-3 sm:py-2 rounded-md sm:rounded-lg bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-md text-xs sm:text-sm text-white font-bold inline-flex items-center gap-1.5 sm:gap-2 w-fit shadow-lg">
                              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>
                                {currentDemo.metrics.engagement} Engagement
                              </span>
                            </div>
                            <div className="px-2 py-1 sm:px-3 sm:py-2 rounded-md sm:rounded-lg bg-gradient-to-r from-blue-500/90 to-cyan-500/90 backdrop-blur-md text-xs sm:text-sm text-white font-bold inline-flex items-center gap-1.5 sm:gap-2 w-fit shadow-lg">
                              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{currentDemo.metrics.ctr} CTR</span>
                            </div>
                            <div className="px-2 py-1 sm:px-3 sm:py-2 rounded-md sm:rounded-lg bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-md text-xs sm:text-sm text-white font-bold inline-flex items-center gap-1.5 sm:gap-2 w-fit shadow-lg animate-pulse">
                              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>
                                {currentDemo.metrics.conversions} Conversions
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => setShowMetrics(!showMetrics)}
                            className="lg:hidden absolute top-2 sm:top-4 right-2 sm:right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg text-xs font-semibold z-20"
                          >
                            {showMetrics ? "📊" : "👁️"}
                          </button>

                          <button
                            onClick={toggleMute}
                            className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 p-2.5 sm:p-3 lg:p-4 rounded-full bg-white/90 backdrop-blur-sm shadow-2xl hover:bg-white transition-all hover:scale-110"
                            aria-label={isMuted ? "Unmute" : "Mute"}
                          >
                            {isMuted ? (
                              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-black" />
                            ) : (
                              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-black" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photo */}
                <div className="relative order-2 lg:order-1">
                  <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-2xl opacity-50" />
                  <div className="relative">
                    <div className="hidden lg:block mb-4 sm:mb-6">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                        {currentDemo.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {currentDemo.industry}
                      </p>
                    </div>

                    <div className="relative group">
                      <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl sm:rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                      <div className="relative bg-background/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 border border-border shadow-2xl">
                        <div className="relative w-full max-w-[400px] lg:max-w-[450px] mx-auto aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-muted/30">
                          <img
                            src={currentDemo.beforeImage}
                            alt={currentDemo.title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-black/80 backdrop-blur-sm text-xs text-white lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            📸 Product Photo
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-10 sm:mt-12 lg:mt-12">
                {demos.map((demo, index) => (
                  <button
                    key={demo.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentIndex
                        ? "w-6 sm:w-8 lg:w-12 h-2 sm:h-2.5 lg:h-3 bg-gradient-to-r from-primary to-accent"
                        : "w-2 sm:w-2.5 lg:w-3 h-2 sm:h-2.5 lg:h-3 bg-muted hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`View ${demo.title}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Demo Info - Mobile only */}
          <div className="lg:hidden text-center mt-10 mb-10 px-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {currentDemo.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {currentDemo.industry}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30">
              {(() => {
                const styleInfo = getStyleInfo(currentDemo.style);
                const Icon = styleInfo.icon;
                return (
                  <>
                    <Icon className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold text-accent">
                      {styleInfo.name} Style
                    </span>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Value Props */}
          <div className="mt-12 sm:mt-16 lg:mt-32 max-w-6xl mx-auto px-2">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8">
              {[
                { value: "<4min", label: "Average Creation" },
                { value: "12", label: "Proven Styles" },
                { value: "AI", label: "Powered Gen" },
                { value: "HD", label: "Cinema Quality" },
              ].map((stat, i) => (
                <div key={i} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative text-center p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-background/50 backdrop-blur-sm border border-border group-hover:border-primary/50 transition-all">
                    <div className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1.5 sm:mb-2 lg:mb-3">
                      {stat.value}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes gradient {
            0%,
            100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          .animate-gradient {
            animation: gradient 3s ease infinite;
          }
        `}</style>
      </section>
    </>
  );
};

export default AdTransformationShowcase;
