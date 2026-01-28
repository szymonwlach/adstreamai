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

      <div className="mt-4 md:mt-0 lg:-mt-5" id="showcase">
        <AdTransformationShowcase />
      </div>
      <div className="-mt-6 lg:-mt-24 md:-mt-10">
        <Hero />
      </div>
      <HowItWorks />
      <div id="features">
        <Features />
      </div>
      <Pricing />
      <CTA />
      <div id="footer">
        <Footer />
      </div>
    </div>
  );
}
