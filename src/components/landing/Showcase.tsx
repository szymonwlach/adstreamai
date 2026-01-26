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
  Wand2,
  BookOpen,
  Coffee,
  Gift,
  Eye,
  Cpu,
  Film,
  RotateCcw,
  Clock,
  Palette,
} from "lucide-react";

const AdTransformationShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  // Tylko style które mamy w demo
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

  // Wszystkie 12 stylów do pokazania w gridzie
  // const allStyles = [
  //   {
  //     id: "ugc",
  //     name: "UGC",
  //     icon: Camera,
  //     description: "Authentic & Relatable",
  //     available: true,
  //   },
  //   {
  //     id: "trend",
  //     name: "Trending",
  //     icon: TrendingUp,
  //     description: "Viral & Dynamic",
  //     available: true,
  //   },
  //   {
  //     id: "cinematic_luxury",
  //     name: "Luxury",
  //     icon: Crown,
  //     description: "Premium & Elegant",
  //     available: true,
  //   },
  //   {
  //     id: "product_showcase",
  //     name: "Product Focus",
  //     icon: Zap,
  //     description: "Clean & Direct",
  //     available: false,
  //   },
  //   {
  //     id: "stop_motion",
  //     name: "Stop Motion",
  //     icon: Film,
  //     description: "Creative Animation",
  //     available: false,
  //   },
  //   {
  //     id: "before_after",
  //     name: "Before/After",
  //     icon: RotateCcw,
  //     description: "Transformation",
  //     available: false,
  //   },
  //   {
  //     id: "educational",
  //     name: "Educational",
  //     icon: BookOpen,
  //     description: "Informative",
  //     available: false,
  //   },
  //   {
  //     id: "lifestyle",
  //     name: "Lifestyle",
  //     icon: Coffee,
  //     description: "Natural Use",
  //     available: false,
  //   },
  //   {
  //     id: "unboxing",
  //     name: "Unboxing",
  //     icon: Gift,
  //     description: "Discovery Moment",
  //     available: false,
  //   },
  //   {
  //     id: "asmr",
  //     name: "ASMR",
  //     icon: Eye,
  //     description: "Macro & Textures",
  //     available: false,
  //   },
  //   {
  //     id: "cyber_glitch",
  //     name: "Cyber",
  //     icon: Cpu,
  //     description: "Futuristic Vibe",
  //     available: false,
  //   },
  //   {
  //     id: "surreal_abstract",
  //     name: "Surreal",
  //     icon: Wand2,
  //     description: "Impossible Physics",
  //     available: false,
  //   },
  // ];

  const demos = [
    {
      id: 0,
      title: "Skin Care Serum",
      style: "ugc",
      industry: "Beauty",
      beforeImage: "/previews_photo/skincare.png",
      videoFile: "/previews_video/skin_care2.mp4",
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
      title: "Luxury Watch",
      style: "cinematic_luxury",
      industry: "E-commerce",
      beforeImage: "/previews_photo/zegarek.png",
      videoFile: "/previews_video/luxury_watch.mp4",
      metrics: { engagement: "92%", ctr: "8.4%", conversions: "+340%" },
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
  ];

  const currentDemo = demos[currentIndex];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(() => {});
          } else {
            if (videoRef.current) {
              videoRef.current.pause();
              videoRef.current.muted = true;
              setIsMuted(true);
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
      videoRef.current.load();
      setIsMuted(true);
      videoRef.current.muted = true;
      setTimeout(() => {
        videoRef.current?.play().catch(() => {});
      }, 50);
    }
  }, [currentIndex]);

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

  const goToStyleDemo = (styleId) => {
    const demoIndex = demos.findIndex((d) => d.style === styleId);
    if (demoIndex !== -1) {
      setCurrentIndex(demoIndex);
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-32 overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background"
    >
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s", animationDelay: "4s" }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">
              AI-Powered Transformation
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              One Photo.
            </span>
            <br />
            <span className="text-foreground">Infinite Possibilities.</span>
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Transform your product into high-converting ads in under 4 minutes.
            Choose from 12 proven styles that drive real results.
          </p>
        </div>

        {/* Social Proof Bar - Updated with truthful claims */}
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 mb-12 sm:mb-16 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">Under 4 min creation</span>
          </div>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-accent" />
            <span className="text-muted-foreground">12 unique styles</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-muted-foreground">Cinema-quality HD</span>
          </div>
        </div>

        {/* Main Showcase */}
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            {/* Navigation - Always visible */}
            <button
              onClick={prevDemo}
              className="hidden sm:flex absolute -left-4 lg:-left-20 top-1/2 -translate-y-1/2 z-20 p-3 sm:p-4 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:border-primary/50 shadow-xl hover:scale-110 transition-all group items-center justify-center"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-primary" />
            </button>
            <button
              onClick={nextDemo}
              className="hidden sm:flex absolute -right-4 lg:-right-20 top-1/2 -translate-y-1/2 z-20 p-3 sm:p-4 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:border-primary/50 shadow-xl hover:scale-110 transition-all group items-center justify-center"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-primary" />
            </button>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              {/* Before */}
              <div className="relative order-2 lg:order-1">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-2xl opacity-50" />
                <div className="relative">
                  <div className="mb-4 sm:mb-6 text-center lg:text-left">
                    <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider mb-2 flex items-center justify-center lg:justify-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      Step 1: Upload
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                      {currentDemo.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentDemo.industry}
                    </p>
                  </div>

                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                    <div className="relative bg-background/50 backdrop-blur-sm rounded-3xl p-4 sm:p-6 border border-border shadow-2xl">
                      <div className="relative w-full max-w-[450px] mx-auto aspect-square rounded-2xl overflow-hidden bg-muted/30">
                        <img
                          src={currentDemo.beforeImage}
                          alt={currentDemo.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-sm text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          Just one photo needed ✨
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* After */}
              <div className="relative order-1 lg:order-2">
                <div className="absolute -inset-4 bg-gradient-to-br from-accent/30 to-primary/30 rounded-3xl blur-2xl opacity-50" />
                <div className="relative">
                  <div className="mb-4 sm:mb-6 text-center lg:text-left">
                    <p className="text-xs sm:text-sm font-semibold text-accent uppercase tracking-wider mb-2 flex items-center justify-center lg:justify-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                      Step 2: AI Magic
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                      Ready in &lt;4 Minutes
                    </h3>
                    <div className="flex items-center gap-2 mt-2 justify-center lg:justify-start">
                      {(() => {
                        const styleInfo = getStyleInfo(currentDemo.style);
                        const Icon = styleInfo.icon;
                        return (
                          <>
                            <Icon className="w-4 h-4 text-accent" />
                            <p className="text-sm text-accent">
                              {styleInfo.name} Style
                            </p>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                    <div className="relative bg-background/50 backdrop-blur-sm rounded-3xl p-4 sm:p-6 border border-border shadow-2xl">
                      <div className="relative w-full max-w-[450px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl">
                        <video
                          ref={videoRef}
                          key={currentDemo.id}
                          className="w-full h-full object-cover"
                          loop
                          playsInline
                          muted={isMuted}
                        >
                          <source
                            src={currentDemo.videoFile}
                            type="video/mp4"
                          />
                        </video>

                        {/* Metrics overlay - Visible on hover */}
                        <div className="absolute top-4 left-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-md text-sm text-white font-bold inline-flex items-center gap-2 w-fit shadow-lg">
                            <TrendingUp className="w-4 h-4" />
                            <span>
                              {currentDemo.metrics.engagement} Engagement
                            </span>
                          </div>
                          <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500/90 to-cyan-500/90 backdrop-blur-md text-sm text-white font-bold inline-flex items-center gap-2 w-fit shadow-lg">
                            <Zap className="w-4 h-4" />
                            <span>{currentDemo.metrics.ctr} CTR</span>
                          </div>
                          <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-md text-sm text-white font-bold inline-flex items-center gap-2 w-fit shadow-lg animate-pulse">
                            <ArrowRight className="w-4 h-4" />
                            <span>
                              {currentDemo.metrics.conversions} Conversions
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={toggleMute}
                          className="absolute bottom-4 right-4 p-3 sm:p-4 rounded-full bg-white/90 backdrop-blur-sm shadow-2xl hover:bg-white transition-all hover:scale-110"
                          aria-label={isMuted ? "Unmute" : "Mute"}
                        >
                          {isMuted ? (
                            <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                          ) : (
                            <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8 sm:mt-12">
              {demos.map((demo, index) => (
                <button
                  key={demo.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? "w-8 sm:w-12 h-2 sm:h-3 bg-gradient-to-r from-primary to-accent"
                      : "w-2 sm:w-3 h-2 sm:h-3 bg-muted hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`View ${demo.title}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* All 12 Styles Grid */}
        <div className="mt-24 sm:mt-32 max-w-6xl mx-auto">
          {/* <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                12 Styles, Infinite Reach
              </span>
            </h3>
            <p className="text-muted-foreground text-lg">
              Every style optimized for maximum engagement
            </p>
          </div> */}

          {/* <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {allStyles.map((style) => {
              const Icon = style.icon;
              return (
                <button
                  key={style.id}
                  onClick={() => style.available && goToStyleDemo(style.id)}
                  disabled={!style.available}
                  className={`group relative p-6 rounded-2xl bg-background/50 backdrop-blur-sm border transition-all duration-300 ${
                    style.available
                      ? "border-border hover:border-primary/50 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 cursor-pointer"
                      : "border-border/50 opacity-60 cursor-not-allowed"
                  }`}
                >
                  {style.available && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform ${
                        style.available
                          ? "bg-gradient-to-br from-primary/20 to-accent/20 group-hover:scale-110"
                          : "bg-muted/30"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${style.available ? "text-primary" : "text-muted-foreground"}`}
                      />
                    </div>
                    <h4 className="font-bold text-foreground mb-1">
                      {style.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {style.description}
                    </p>
                    {style.available ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-600 text-xs font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Preview
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50 text-muted-foreground text-xs font-medium">
                        <Sparkles className="w-3 h-3" />
                        Coming Soon
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div> */}
        </div>

        {/* Value Props */}
        <div className="mt-20 sm:mt-32 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative text-center p-6 sm:p-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-border group-hover:border-primary/50 transition-all">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                  &lt;4min
                </div>
                <p className="text-muted-foreground font-medium">
                  Average Creation Time
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative text-center p-6 sm:p-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-border group-hover:border-accent/50 transition-all">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-3">
                  12
                </div>
                <p className="text-muted-foreground font-medium">
                  Proven Styles
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative text-center p-6 sm:p-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-border group-hover:border-primary/50 transition-all">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                  AI
                </div>
                <p className="text-muted-foreground font-medium">
                  Powered Generation
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative text-center p-6 sm:p-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-border group-hover:border-accent/50 transition-all">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-3">
                  HD
                </div>
                <p className="text-muted-foreground font-medium">
                  Cinema Quality
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 sm:mt-20 text-center">
          <button className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold text-lg shadow-xl shadow-primary/50 hover:shadow-2xl hover:shadow-primary/60 transition-all hover:scale-105">
            <span>Start Creating Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="mt-4 text-sm text-muted-foreground">
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
