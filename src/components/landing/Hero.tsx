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
          alt="AI-powered ad creation"
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
              ✨ Create & Stream AI-Powered Ads
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
            Create & Stream Ads{" "}
            <span className="text-gradient">Across Platforms</span>
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform product photos into stunning video ads with multiple
            creative styles. Auto-post to TikTok & YouTube, ready-to-go content
            for Facebook & Instagram.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a href="/dashboard">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 py-6 rounded-xl font-semibold shadow-lg glow-primary transition-all"
              >
                Start Creating Ads
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
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
              <span>Free to start • No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Multiple ad styles</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
