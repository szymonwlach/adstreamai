import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Platforms } from "@/components/landing/Platforms";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import ComingSoon from "@/components/landing/ComingSoon";
import AdTransformationShowcase from "@/components/landing/Showcase";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* <ComingSoon /> */}
      <div className="">
        <Hero />
      </div>
      <div className="-mt-28" id="showcase">
        <AdTransformationShowcase />
      </div>

      <HowItWorks />
      <div id="features">
        <Features />
      </div>
      {/* <div id="platforms">
        <Platforms />
      </div> */}
      <Pricing />
      <CTA />
      <div id="footer">
        <Footer />
      </div>
    </div>
  );
}
