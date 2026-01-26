// "use client";
// import React, { useRef, useState } from "react";
// import { Sparkles, Volume2, VolumeX } from "lucide-react";

// const AdTransformationShowcase = () => {
//   const [mutedVideos, setMutedVideos] = useState({});

//   const adDemos = [
//     {
//       id: "watch-luxury",
//       title: "Luxury Watch",
//       category: "E-commerce",
//       beforeImage: "/previews_photo/zegarek.png",
//       videoFile: "/previews_video/luxury_watch.mp4",
//     },
//     {
//       id: "skincare-serum",
//       title: "Skin Care Serum",
//       category: "Beauty & Wellness",
//       beforeImage: "/previews_photo/skincare.png",
//       videoFile: "/previews_video/skin_care2.mp4",
//     },
//     {
//       id: "serum-advanced",
//       title: "Advanced Serum",
//       category: "Beauty & Wellness",
//       beforeImage: "/previews_photo/serum.png",
//       videoFile: "/previews_video/trend2.mp4",
//     },
//     {
//       id: "cream-luxury",
//       title: "Luxury Cream",
//       category: "Beauty & Wellness",
//       beforeImage: "/previews_photo/cream.png",
//       videoFile: "/previews_video/trend.mp4",
//     },
//   ];

//   // Duplikujemy tablicę dla płynnego scrollowania
//   const topRowAds = [...adDemos, ...adDemos];
//   const bottomRowAds = [...adDemos, ...adDemos];

//   const toggleMute = (videoId) => {
//     setMutedVideos((prev) => ({
//       ...prev,
//       [videoId]: !prev[videoId],
//     }));
//   };

//   const VideoCard = ({ demo, rowId }) => {
//     const videoRef = useRef(null);
//     const videoId = `${rowId}-${demo.id}`;
//     const isMuted = mutedVideos[videoId] !== false; // domyślnie wyciszone

//     return (
//       <div className="group relative flex-shrink-0 w-[280px] mx-3">
//         <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
//         <div className="relative bg-background/50 backdrop-blur-sm rounded-2xl p-4 border border-border shadow-xl">
//           {/* Before/After Badge */}
//           <div className="flex gap-2 mb-3">
//             <div className="flex-1 text-center py-1.5 bg-muted/50 rounded-lg">
//               <span className="text-xs font-semibold text-muted-foreground">
//                 BEFORE
//               </span>
//             </div>
//             <div className="flex-1 text-center py-1.5 bg-gradient-to-r from-primary to-accent rounded-lg">
//               <span className="text-xs font-semibold text-white">AFTER</span>
//             </div>
//           </div>

//           {/* Images Side by Side */}
//           <div className="flex gap-2 mb-3">
//             {/* Before Image */}
//             <div className="flex-1 aspect-[9/16] rounded-lg overflow-hidden bg-muted/30">
//               <img
//                 src={demo.beforeImage}
//                 alt={demo.title}
//                 className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
//               />
//             </div>

//             {/* After Video */}
//             <div className="flex-1 aspect-[9/16] rounded-lg overflow-hidden bg-black relative">
//               <video
//                 ref={videoRef}
//                 className="w-full h-full object-cover"
//                 loop
//                 autoPlay
//                 playsInline
//                 muted={isMuted}
//                 onLoadedMetadata={(e) => {
//                   const video = e.target as HTMLVideoElement;
//                   video.play().catch(() => {});
//                 }}
//               >
//                 <source src={demo.videoFile} type="video/mp4" />
//               </video>

//               {/* Sound Toggle */}
//               <button
//                 onClick={() => toggleMute(videoId)}
//                 className="absolute bottom-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all hover:scale-110"
//                 aria-label={isMuted ? "Unmute" : "Mute"}
//               >
//                 {isMuted ? (
//                   <VolumeX className="w-3 h-3 text-black" />
//                 ) : (
//                   <Volume2 className="w-3 h-3 text-black" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Info */}
//           <div className="text-center">
//             <h3 className="font-semibold text-sm mb-1">{demo.title}</h3>
//             <p className="text-xs text-muted-foreground">{demo.category}</p>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <section className="relative py-32 overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
//       {/* Background Effects */}
//       <div
//         className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse"
//         style={{ animationDuration: "4s" }}
//       />
//       <div
//         className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl animate-pulse"
//         style={{ animationDuration: "6s", animationDelay: "2s" }}
//       />

//       <div className="relative z-10">
//         {/* Section Header */}
//         <div className="text-center max-w-3xl mx-auto mb-16 px-4 space-y-6">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-primary text-sm font-semibold backdrop-blur-sm">
//             <Sparkles className="w-4 h-4 animate-pulse" />
//             AI Transformation Gallery
//           </div>
//           <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
//             <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
//               See The Magic
//             </span>
//           </h2>
//           <p className="text-xl text-muted-foreground leading-relaxed">
//             Real products transformed into scroll-stopping ads
//           </p>
//         </div>

//         {/* Scrolling Rows */}
//         <div className="space-y-8">
//           {/* Top Row - Scrolls Right */}
//           <div className="relative">
//             <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
//             <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

//             <div className="overflow-hidden">
//               <div className="flex animate-scroll-right hover:pause-animation">
//                 {topRowAds.map((demo, index) => (
//                   <VideoCard key={`top-${index}`} demo={demo} rowId="top" />
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Bottom Row - Scrolls Left */}
//           <div className="relative">
//             <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
//             <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

//             <div className="overflow-hidden">
//               <div className="flex animate-scroll-left hover:pause-animation">
//                 {bottomRowAds.map((demo, index) => (
//                   <VideoCard
//                     key={`bottom-${index}`}
//                     demo={demo}
//                     rowId="bottom"
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Stats */}
//         <div className="mt-32 max-w-5xl mx-auto px-4">
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
//             <div className="relative group">
//               <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
//               <div className="relative text-center p-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-border">
//                 <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
//                   &lt;4min
//                 </div>
//                 <p className="text-muted-foreground font-medium">
//                   Generation Time
//                 </p>
//               </div>
//             </div>
//             <div className="relative group">
//               <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
//               <div className="relative text-center p-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-border">
//                 <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
//                   100%
//                 </div>
//                 <p className="text-muted-foreground font-medium">AI-Powered</p>
//               </div>
//             </div>
//             <div className="relative group">
//               <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
//               <div className="relative text-center p-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-border">
//                 <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
//                   HD
//                 </div>
//                 <p className="text-muted-foreground font-medium">
//                   Cinema Quality
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes scroll-right {
//           0% {
//             transform: translateX(0);
//           }
//           100% {
//             transform: translateX(-50%);
//           }
//         }

//         @keyframes scroll-left {
//           0% {
//             transform: translateX(-50%);
//           }
//           100% {
//             transform: translateX(0);
//           }
//         }

//         @keyframes gradient {
//           0%,
//           100% {
//             background-position: 0% 50%;
//           }
//           50% {
//             background-position: 100% 50%;
//           }
//         }

//         .animate-scroll-right {
//           animation: scroll-right 40s linear infinite;
//         }

//         .animate-scroll-left {
//           animation: scroll-left 40s linear infinite;
//         }

//         .hover\:pause-animation:hover {
//           animation-play-state: paused;
//         }

//         .animate-gradient {
//           animation: gradient 3s ease infinite;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default AdTransformationShowcase;
"use client";

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
} from "lucide-react";

const AdTransformationShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [showPoster, setShowPoster] = useState(true);
  const [showMetrics, setShowMetrics] = useState(false);
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
      title: "Luxury Watch",
      style: "cinematic_luxury",
      industry: "E-commerce",
      beforeImage: "/previews_photo/zegarek.png",
      videoFile: "/previews_video/luxury_watch.mp4",
      metrics: { engagement: "92%", ctr: "8.4%", conversions: "+340%" },
    },
    {
      id: 4,
      title: "Face Cream",
      style: "trend",
      industry: "Wellness",
      beforeImage: "/previews_photo/cream.png",
      videoFile: "/previews_video/trend.mp4",
      metrics: { engagement: "89%", ctr: "7.8%", conversions: "+310%" },
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
              // Don't force mute when scrolling away
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
        {/* Header - Always on top */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-12 lg:mb-16 space-y-4 sm:space-y-4 lg:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-primary">
              AI-Powered Transformation
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight px-4">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              One Photo.
            </span>
            <br />
            <span className="text-foreground">Infinite Possibilities.</span>
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4">
            Transform your product into high-converting ads in under 4 minutes.
            Choose from 12 proven styles that drive real results.
          </p>
        </div>

        {/* Social Proof Bar - Always visible */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-12 mb-8 sm:mb-12 lg:mb-16 text-sm px-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="text-muted-foreground text-xs sm:text-sm">
              Under 4 min creation
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
            {/* Navigation - Desktop only (on far sides) */}
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

            {/* Navigation - Mobile only (between video and photo) */}
            <button
              onClick={prevDemo}
              className="lg:hidden absolute left-2 sm:left-4 top-[55%] sm:top-[58%] z-20 p-3 sm:p-4 rounded-full bg-background/90 backdrop-blur-sm border-2 border-primary/30 hover:border-primary shadow-xl active:scale-95 transition-all"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            </button>
            <button
              onClick={nextDemo}
              className="lg:hidden absolute right-2 sm:right-4 top-[55%] sm:top-[58%] z-20 p-3 sm:p-4 rounded-full bg-background/90 backdrop-blur-sm border-2 border-primary/30 hover:border-primary shadow-xl active:scale-95 transition-all"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            </button>

            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
              {/* Video - Order 1 on mobile, Order 2 on desktop */}
              <div className="relative order-1 lg:order-2">
                <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-br from-accent/30 to-primary/30 rounded-3xl blur-2xl opacity-50" />
                <div className="relative">
                  {/* Title - Desktop only */}
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
                        {/* Poster image */}
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

                        {/* Metrics overlay - hidden on mobile by default, visible on desktop hover */}
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

                        {/* Toggle metrics button - Mobile only */}
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

              {/* Photo - Order 2 on mobile, Order 1 on desktop */}
              <div className="relative order-2 lg:order-1">
                <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-2xl opacity-50" />
                <div className="relative">
                  {/* Title - Desktop only */}
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

                        {/* Product Photo badge - always visible on mobile, on hover on desktop */}
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

        {/* Demo Info - Mobile only - Simplified */}
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
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative text-center p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-background/50 backdrop-blur-sm border border-border group-hover:border-primary/50 transition-all">
                <div className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1.5 sm:mb-2 lg:mb-3">
                  &lt;4min
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  Average Creation
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative text-center p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-background/50 backdrop-blur-sm border border-border group-hover:border-accent/50 transition-all">
                <div className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-1.5 sm:mb-2 lg:mb-3">
                  12
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  Proven Styles
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative text-center p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-background/50 backdrop-blur-sm border border-border group-hover:border-primary/50 transition-all">
                <div className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1.5 sm:mb-2 lg:mb-3">
                  AI
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  Powered Gen
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative text-center p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-background/50 backdrop-blur-sm border border-border group-hover:border-accent/50 transition-all">
                <div className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-1.5 sm:mb-2 lg:mb-3">
                  HD
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  Cinema Quality
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 sm:mt-16 lg:mt-20 text-center px-4">
          <button className="group relative inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold text-base sm:text-lg shadow-xl shadow-primary/50 hover:shadow-2xl hover:shadow-primary/60 transition-all hover:scale-105 active:scale-95">
            <span>Start Creating Now</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
            No credit card required • 3 free ads to start
          </p>
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
  );
};

export default AdTransformationShowcase;
