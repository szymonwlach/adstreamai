"use client";
import { useState } from "react";
import { ChevronDown, Globe, Zap, Video, Calendar } from "lucide-react";

const faqs = [
  {
    question: "Is AdstreamAI available in multiple languages?",
    answer:
      "Yes! AdstreamAI supports 8 languages: English 🇬🇧, Polish 🇵🇱, Spanish 🇪🇸, German 🇩🇪, French 🇫🇷, Italian 🇮🇹, Portuguese 🇵🇹, and Dutch 🇳🇱. You can switch languages anytime in your dashboard settings.",
    icon: Globe,
  },
  {
    question: "How many videos can I generate at once?",
    answer:
      "You can batch generate up to 12 videos simultaneously! Simply select multiple styles (UGC, Cinematic, Trend, etc.) and we'll create all variations in one go. Perfect for A/B testing different approaches.",
    icon: Zap,
  },
  {
    question: "What video styles are available?",
    answer:
      "We offer 12 professional styles: UGC (User Generated Content), Trend, Cinematic Luxury, Product Showcase, Stop Motion, Before/After, Educational, Lifestyle, Unboxing, ASMR, Cyber Glitch, and Surreal Abstract. Each style creates a completely unique video from your product photos.",
    icon: Video,
  },
  {
    question: "How long does it take to generate videos?",
    answer:
      "Most videos are ready in under 3 minutes! Even when generating multiple videos at once, the entire batch typically completes within 3-5 minutes. You'll receive a notification when they're ready.",
    icon: Zap,
  },
  {
    question: "Can I customize the video length?",
    answer:
      "Absolutely! You can choose your preferred video duration to match platform requirements. Whether you need short 15-second clips for Instagram Reels or longer formats for YouTube, we've got you covered.",
    icon: Video,
  },
  {
    question: "Do I need to write scripts or hooks myself?",
    answer:
      "No! While you can add custom hooks, CTAs, and scripts for more control, it's completely optional. Our AI automatically generates professional hooks and calls-to-action for each video style, so you can create great ads without any copywriting.",
    icon: Zap,
  },
  {
    question: "How does auto-publishing work?",
    answer:
      "Connect your YouTube and TikTok accounts once, then schedule or publish videos directly from AdstreamAI. You can queue up weeks of content and let it post automatically at optimal times. We also generate platform-specific captions with hashtags for all your other social channels.",
    icon: Calendar,
  },
  {
    question: "What do I need to get started?",
    answer:
      "Just product photos! Upload one or more images of your product, select your desired video styles and length, and we'll handle the rest. No video editing experience, expensive equipment, or design skills required.",
    icon: Video,
  },
  {
    question: "Can I test different ad variations?",
    answer:
      "That's exactly what we're built for! Generate 5-10 different style variations of the same product in one batch. Run them as A/B tests to see which style (UGC vs Cinematic vs Trend, etc.) performs best with your audience.",
    icon: Zap,
  },
  {
    question: "Do I get captions for all platforms?",
    answer:
      "Yes! For each video, we generate unique captions optimized for TikTok, Instagram, Facebook, and LinkedIn—complete with relevant hashtags. Each platform gets different text tailored to its audience and format.",
    icon: Globe,
  },
];

const FAQItem = ({
  question,
  answer,
  icon: Icon,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  icon: any;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <button
        onClick={onClick}
        className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left transition-colors duration-200 hover:bg-accent/5"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{question}</h3>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-5 pl-[4.5rem]">
            <p className="text-muted-foreground leading-relaxed">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-b from-background/50 to-background">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
            Frequently Asked
            <span className="text-gradient"> Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Everything you need to know about creating AI-powered video ads with
            AdstreamAI
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              icon={faq.icon}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <a
            href="mailto:support@adstreamai.com"
            className="text-primary hover:underline font-semibold"
          >
            Contact our support team →
          </a>
        </div>
      </div>
    </section>
  );
};
