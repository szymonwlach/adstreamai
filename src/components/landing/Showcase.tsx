// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Sparkles, ArrowRight, Volume2, VolumeX } from "lucide-react";

// const AdTransformationShowcase = () => {
//   const [activeDemo, setActiveDemo] = useState(0);
//   const [isMuted, setIsMuted] = useState(true);
//   const videoRef = useRef(null);
//   const sectionRef = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting && videoRef.current) {
//             videoRef.current
//               .play()
//               .catch((err) => console.log("Autoplay prevented:", err));
//           }
//         });
//       },
//       { threshold: 0.5 }
//     );

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current);
//     }

//     return () => {
//       if (sectionRef.current) {
//         observer.unobserve(sectionRef.current);
//       }
//     };
//   }, [activeDemo]);

//   useEffect(() => {
//     if (videoRef.current) {
//       videoRef.current.load();
//       setIsMuted(true);
//       setTimeout(() => {
//         videoRef.current
//           ?.play()
//           ?.catch((err) => console.log("Play prevented:", err));
//       }, 50);
//     }
//   }, [activeDemo]);

//   const toggleMute = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = !isMuted;
//       setIsMuted(!isMuted);
//     }
//   };

//   const demos = [
//     {
//       id: 0,
//       title: "Luxury Watch",
//       beforeImage: "/zegarek.png",
//       videoFile: "/luxury_watch.mp4",
//     },
//     {
//       id: 1,
//       title: "Skin Care Serum",
//       beforeImage: "/skincare.png",
//       videoFile: "/skin_care.mp4",
//     },
//   ];

//   const currentDemo = demos[activeDemo];

//   return (
//     <section
//       ref={sectionRef}
//       className="relative py-32 overflow-hidden bg-gradient-to-b from-background to-muted/20"
//     >
//       {/* Subtle background effects */}
//       <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
//       <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />

//       <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Section Header */}
//         <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
//             <Sparkles className="w-4 h-4" />
//             AI Transformation
//           </div>
//           <h2 className="text-5xl sm:text-6xl font-bold tracking-tight">
//             From Photo to{" "}
//             <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//               Viral Ad
//             </span>
//           </h2>
//           <p className="text-xl text-muted-foreground leading-relaxed">
//             Watch how our AI transforms product images into engaging video ads
//           </p>
//         </div>

//         {/* Demo Selector */}
//         <div className="flex justify-center gap-3 mb-16">
//           {demos.map((demo) => (
//             <button
//               key={demo.id}
//               onClick={() => setActiveDemo(demo.id)}
//               className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
//                 activeDemo === demo.id
//                   ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25"
//                   : "bg-background border border-border hover:border-primary/50"
//               }`}
//             >
//               {demo.title}
//             </button>
//           ))}
//         </div>

//         {/* Transformation Display */}
//         <div className="max-w-7xl mx-auto">
//           <div className="relative grid md:grid-cols-[1fr_auto_1fr] gap-12 items-center">
//             {/* Before - Product Image */}
//             <div className="space-y-6">
//               <div className="text-center md:text-left">
//                 <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
//                   Before
//                 </p>
//                 <h3 className="text-2xl font-bold">Product Photo</h3>
//               </div>
//               <div className="relative group">
//                 <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                 <div className="relative bg-muted/30 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
//                   <div className="relative w-full max-w-[400px] mx-auto aspect-square rounded-2xl overflow-hidden bg-background">
//                     <img
//                       src={currentDemo.beforeImage}
//                       alt={currentDemo.title}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Arrow Indicator */}
//             <div className="hidden md:flex items-center justify-center">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-50" />
//                 <div className="relative bg-gradient-to-r from-primary to-accent p-4 rounded-full">
//                   <ArrowRight className="w-8 h-8 text-white" />
//                 </div>
//               </div>
//             </div>

//             {/* After - Generated Video Ad */}
//             <div className="space-y-6">
//               <div className="text-center md:text-left">
//                 <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
//                   After
//                 </p>
//                 <h3 className="text-2xl font-bold">AI-Generated Ad</h3>
//               </div>
//               <div className="relative group">
//                 <div className="absolute -inset-1 bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                 <div className="relative bg-muted/30 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
//                   <div className="relative w-full max-w-[400px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden bg-black">
//                     <video
//                       ref={videoRef}
//                       key={currentDemo.id}
//                       className="w-full h-full object-cover"
//                       src={currentDemo.videoFile}
//                       autoPlay
//                       loop
//                       playsInline
//                       muted
//                     />
//                     {/* Unmute button */}
//                     <button
//                       onClick={toggleMute}
//                       className="absolute bottom-4 right-4 p-3 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 hover:bg-black/90 transition-all group"
//                       aria-label={isMuted ? "Włącz dźwięk" : "Wyłącz dźwięk"}
//                     >
//                       {isMuted ? (
//                         <VolumeX className="w-5 h-5 text-white" />
//                       ) : (
//                         <Volume2 className="w-5 h-5 text-white" />
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Stats */}
//         <div className="mt-24 max-w-4xl mx-auto">
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
//             <div className="text-center space-y-2">
//               <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//                 &lt;2min
//               </div>
//               <p className="text-muted-foreground">Generation Time</p>
//             </div>
//             <div className="text-center space-y-2">
//               <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//                 AI-Powered
//               </div>
//               <p className="text-muted-foreground">Fully Automated</p>
//             </div>
//             <div className="text-center space-y-2">
//               <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//                 HD Quality
//               </div>
//               <p className="text-muted-foreground">Ready to Stream</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AdTransformationShowcase;

//
//
//
//
//
//
//
//
//
//
//

// "use client";

// import { useRef, useEffect, useState } from "react";
// import { Sparkles, ArrowRight, Volume2, VolumeX } from "lucide-react";

// const AdTransformationShowcase = () => {
//   const videoRefs = useRef([]);
//   const sectionRef = useRef(null);
//   const [mutedStates, setMutedStates] = useState({});

//   const demos = [
//     {
//       id: 0,
//       title: "Luxury Watch",
//       beforeImage: "/zegarek.png",
//       videoFile: "/luxury_watch.mp4",
//     },
//     {
//       id: 1,
//       title: "Skin Care Serum",
//       beforeImage: "/skincare.png",
//       videoFile: "/skin_care.mp4",
//     },
//   ];

//   useEffect(() => {
//     // Initialize muted states
//     const initialMuted = {};
//     demos.forEach((demo) => {
//       initialMuted[demo.id] = true;
//     });
//     setMutedStates(initialMuted);
//   }, []);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             videoRefs.current.forEach((video) => {
//               if (video) {
//                 setTimeout(() => {
//                   video?.play()?.catch((err) => {
//                     const playOnInteraction = () => {
//                       videoRefs.current.forEach((v) => v?.play());
//                       document.removeEventListener("click", playOnInteraction);
//                       document.removeEventListener("scroll", playOnInteraction);
//                     };
//                     document.addEventListener("click", playOnInteraction, {
//                       once: true,
//                     });
//                     document.addEventListener("scroll", playOnInteraction, {
//                       once: true,
//                     });
//                   });
//                 }, 100);
//               }
//             });
//           }
//         });
//       },
//       { threshold: 0.3 }
//     );

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current);
//     }

//     return () => {
//       if (sectionRef.current) {
//         observer.unobserve(sectionRef.current);
//       }
//     };
//   }, []);

//   const toggleMute = (demoId) => {
//     const video = videoRefs.current[demoId];
//     if (video) {
//       video.muted = !mutedStates[demoId];
//       setMutedStates((prev) => ({
//         ...prev,
//         [demoId]: !prev[demoId],
//       }));
//     }
//   };

//   return (
//     <section
//       ref={sectionRef}
//       className="relative py-32 overflow-hidden bg-gradient-to-b from-background to-muted/20"
//     >
//       {/* Subtle background effects */}
//       <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
//       <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />

//       <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Section Header */}
//         <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
//             <Sparkles className="w-4 h-4" />
//             AI Transformation
//           </div>
//           <h2 className="text-5xl sm:text-6xl font-bold tracking-tight">
//             From Photo to{" "}
//             <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//               Viral Ad
//             </span>
//           </h2>
//           <p className="text-xl text-muted-foreground leading-relaxed">
//             Watch how our AI transforms product images into engaging video ads
//           </p>
//         </div>

//         {/* Demos Grid */}
//         <div className="max-w-7xl mx-auto space-y-24">
//           {demos.map((demo, index) => (
//             <div key={demo.id} className="relative">
//               <div className="grid md:grid-cols-[1fr_auto_1fr] gap-12 items-center">
//                 {/* Before - Product Image */}
//                 <div className="space-y-6">
//                   <div className="text-center md:text-left">
//                     <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
//                       Before
//                     </p>
//                     <h3 className="text-2xl font-bold">{demo.title}</h3>
//                   </div>
//                   <div className="relative group">
//                     <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                     <div className="relative bg-muted/30 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
//                       <div className="relative w-full max-w-[400px] mx-auto aspect-square rounded-2xl overflow-hidden bg-background">
//                         <img
//                           src={demo.beforeImage}
//                           alt={demo.title}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Arrow Indicator */}
//                 <div className="hidden md:flex items-center justify-center">
//                   <div className="relative">
//                     <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-50" />
//                     <div className="relative bg-gradient-to-r from-primary to-accent p-4 rounded-full">
//                       <ArrowRight className="w-8 h-8 text-white" />
//                     </div>
//                   </div>
//                 </div>

//                 {/* After - Generated Video Ad */}
//                 <div className="space-y-6">
//                   <div className="text-center md:text-left">
//                     <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
//                       After
//                     </p>
//                     <h3 className="text-2xl font-bold">AI-Generated Ad</h3>
//                   </div>
//                   <div className="relative group">
//                     <div className="absolute -inset-1 bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                     <div className="relative bg-muted/30 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
//                       <div className="relative w-full max-w-[400px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden bg-black">
//                         <video
//                           ref={(el) => {
//                             videoRefs.current[demo.id] = el;
//                           }}
//                           className="w-full h-full object-cover"
//                           src={demo.videoFile}
//                           autoPlay
//                           loop
//                           playsInline
//                           muted
//                         />
//                         {/* Unmute button */}
//                         <button
//                           onClick={() => toggleMute(demo.id)}
//                           className="absolute bottom-4 right-4 p-3 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 hover:bg-black/90 transition-all group"
//                           aria-label={
//                             mutedStates[demo.id]
//                               ? "Włącz dźwięk"
//                               : "Wyłącz dźwięk"
//                           }
//                         >
//                           {mutedStates[demo.id] ? (
//                             <VolumeX className="w-5 h-5 text-white" />
//                           ) : (
//                             <Volume2 className="w-5 h-5 text-white" />
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Divider line between demos (except last one) */}
//               {index < demos.length - 1 && (
//                 <div className="mt-24 flex items-center gap-4">
//                   <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Bottom Stats */}
//         <div className="mt-32 max-w-4xl mx-auto">
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
//             <div className="text-center space-y-2">
//               <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//                 &lt;2min
//               </div>
//               <p className="text-muted-foreground">Generation Time</p>
//             </div>
//             <div className="text-center space-y-2">
//               <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//                 AI-Powered
//               </div>
//               <p className="text-muted-foreground">Fully Automated</p>
//             </div>
//             <div className="text-center space-y-2">
//               <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//                 HD Quality
//               </div>
//               <p className="text-muted-foreground">Ready to Stream</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AdTransformationShowcase;

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Sparkles,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AdTransformationShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  const demos = [
    {
      id: 0,
      title: "Luxury Watch",
      category: "E-commerce",
      beforeImage: "/zegarek.png",
      videoFile: "/luxury_watch.mp4",
    },
    {
      id: 1,
      title: "Skin Care Serum",
      category: "Beauty & Wellness",
      beforeImage: "/skincare.png",
      videoFile: "/skin_care.mp4",
    },
  ];

  const currentDemo = demos[currentIndex];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            setTimeout(() => {
              videoRef.current?.play()?.catch((err) => {
                const playOnInteraction = () => {
                  videoRef.current?.play();
                  document.removeEventListener("click", playOnInteraction);
                };
                document.addEventListener("click", playOnInteraction, {
                  once: true,
                });
              });
            }, 100);
          }
        });
      },
      { threshold: 0.3 }
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
      setTimeout(() => {
        videoRef.current
          ?.play()
          ?.catch((err) => console.log("Play prevented:", err));
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

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div
        className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "4s" }}
      />
      <div
        className="absolute bottom-1/3 right-1/3 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "6s", animationDelay: "2s" }}
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-primary text-sm font-semibold backdrop-blur-sm">
            <Sparkles className="w-4 h-4 animate-pulse" />
            AI Transformation in Action
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Product to Profit
            </span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            One photo. One click. Infinite reach.
          </p>
        </div>

        {/* Main Showcase */}
        <div className="max-w-7xl mx-auto">
          {/* Category Badge */}
          <div className="text-center mb-8">
            <span className="inline-block px-6 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border text-sm font-semibold">
              {currentDemo.category}
            </span>
          </div>

          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={prevDemo}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-12 z-20 p-4 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:border-primary/50 shadow-xl hover:scale-110 transition-all"
              aria-label="Previous demo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextDemo}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-12 z-20 p-4 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:border-primary/50 shadow-xl hover:scale-110 transition-all"
              aria-label="Next demo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Content */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Before - Product Image */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/30 to-transparent rounded-3xl blur-2xl opacity-50" />
                <div className="relative">
                  <div className="mb-6 text-center lg:text-left">
                    <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2 flex items-center justify-center lg:justify-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      Original Photo
                    </p>
                    <h3 className="text-3xl font-bold">{currentDemo.title}</h3>
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                    <div className="relative bg-background/50 backdrop-blur-sm rounded-3xl p-6 border border-border shadow-2xl">
                      <div className="relative w-full max-w-[450px] mx-auto aspect-square rounded-2xl overflow-hidden bg-muted/30">
                        <img
                          src={currentDemo.beforeImage}
                          alt={currentDemo.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* After - Generated Video Ad */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-accent/30 to-transparent rounded-3xl blur-2xl opacity-50" />
                <div className="relative">
                  <div className="mb-6 text-center lg:text-left">
                    <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-2 flex items-center justify-center lg:justify-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                      AI-Generated Ad
                    </p>
                    <h3 className="text-3xl font-bold">Ready in 2 Minutes</h3>
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                    <div className="relative bg-background/50 backdrop-blur-sm rounded-3xl p-6 border border-border shadow-2xl">
                      <div className="relative w-full max-w-[450px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl">
                        <video
                          ref={videoRef}
                          key={currentDemo.id}
                          className="w-full h-full object-cover"
                          src={currentDemo.videoFile}
                          autoPlay
                          loop
                          playsInline
                          muted
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                        {/* Unmute button */}
                        <button
                          onClick={toggleMute}
                          className="absolute bottom-6 right-6 p-4 rounded-full bg-white/90 backdrop-blur-sm shadow-2xl hover:bg-white transition-all hover:scale-110 group/btn"
                          aria-label={
                            isMuted ? "Włącz dźwięk" : "Wyłącz dźwięk"
                          }
                        >
                          {isMuted ? (
                            <VolumeX className="w-6 h-6 text-black" />
                          ) : (
                            <Volume2 className="w-6 h-6 text-black" />
                          )}
                        </button>

                        {/* Live indicator */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-3 mt-12">
              {demos.map((demo, index) => (
                <button
                  key={demo.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? "w-12 h-3 bg-gradient-to-r from-primary to-accent"
                      : "w-3 h-3 bg-muted hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to ${demo.title}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-32 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative text-center p-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-border">
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                  &lt;4min
                </div>
                <p className="text-muted-foreground font-medium">
                  Generation Time
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative text-center p-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-border">
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                  100%
                </div>
                <p className="text-muted-foreground font-medium">AI-Powered</p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative text-center p-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-border">
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                  HD
                </div>
                <p className="text-muted-foreground font-medium">
                  Cinema Quality
                </p>
              </div>
            </div>
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
  );
};

export default AdTransformationShowcase;
