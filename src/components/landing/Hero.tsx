import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.jpg"
          alt="AI-powered ad streaming"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      {/* Animated glow effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block">
            <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold backdrop-blur-sm">
              🚀 AI-Generated Ads Posted Across Platforms
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
            Stream Your Ads to{" "}
            <span className="text-gradient">Every Platform</span>
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Turn any product photo into viral-ready videos and schedule them
            across all selected platforms — in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a href="/dashboard">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 py-6 rounded-xl font-semibold shadow-lg glow-primary transition-all"
              >
                Start Your Ad Stream
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>

            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-xl font-semibold border-border/50 hover:border-primary/50 backdrop-blur-sm"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          <div className="pt-8 flex flex-wrap justify-center gap-8 items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Free trial • No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Set up in 2 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

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
//               ✨ AI-Powered Video Ads in Seconds
//             </span>
//           </div>

//           <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
//             Stream Video Ads That{" "}
//             <span className="text-gradient">Convert & Scale</span>
//           </h1>

//           <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
//             Upload a product photo. AI generates stunning videos with
//             platform-optimized captions. Stream directly to your audience.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
//             <a href="/dashboard">
//               <Button
//                 size="lg"
//                 className="group bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 py-6 rounded-xl font-semibold shadow-lg glow-primary transition-all"
//               >
//                 Start Streaming
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
//               <span>Ready in 2 minutes</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };
//

//
//
//

//

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
//               ✨ One Photo → Viral Short-Form Ads
//             </span>
//           </div>

//           <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
//             Stream Viral Ads <span className="text-gradient">On Autopilot</span>
//           </h1>

//           <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
//             AI creates short-form video ads with platform-optimized captions.
//             Schedule to TikTok & YouTube or grab ready content for anywhere
//             else.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
//             <a href="/dashboard">
//               <Button
//                 size="lg"
//                 className="group bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 py-6 rounded-xl font-semibold shadow-lg glow-primary transition-all"
//               >
//                 Start Streaming
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

//           <div className="pt-8 flex flex-wrap justify-center gap-6 items-center text-sm text-muted-foreground">
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//               <span>Auto-schedule TikTok & YouTube</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 rounded-full bg-blue-500" />
//               <span>Export for all platforms</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };
