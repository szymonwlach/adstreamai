"use client";
import { CheckCircle2 } from "lucide-react";

const platforms = [
  {
    name: "TikTok",
    gradient: "from-[#00f2ea] to-[#ff0050]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-8 h-8 text-white"
        fill="currentColor"
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    gradient: "from-[#f09433] via-[#e6683c] to-[#bc1888]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-8 h-8 text-white"
        fill="currentColor"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    gradient: "from-[#1877f2] to-[#0a66c2]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-8 h-8 text-white"
        fill="currentColor"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    gradient: "from-[#ff0000] to-[#cc0000]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-8 h-8 text-white"
        fill="currentColor"
      >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    gradient: "from-[#0077b5] to-[#00a0dc]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-8 h-8 text-white"
        fill="currentColor"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Twitter/X",
    gradient: "from-[#1da1f2] to-[#0d8bd9]",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-8 h-8 text-white"
        fill="currentColor"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export const Platforms = () => {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Optimized for <span className="text-gradient">Every Platform</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Generate platform-specific ads and content with AI-powered
            descriptions, captions, and creative assets
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto mb-16">
          {platforms.map((platform, index) => (
            <div key={index} className="group relative aspect-square">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-card to-muted border border-border/50 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10" />
              <div className="relative h-full flex flex-col items-center justify-center p-4 space-y-3">
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                >
                  {platform.icon}
                </div>
                <p className="font-semibold text-sm text-center">
                  {platform.name}
                </p>
              </div>
              {/* Checkmark indicator */}
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-background" />
              </div>
            </div>
          ))}
        </div>

        {/* Feature highlights */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
            <h4 className="font-bold text-lg mb-2">AI-Generated Content</h4>
            <p className="text-sm text-muted-foreground">
              Create engaging ads and promotional videos with AI-powered
              scripts, visuals, and platform-specific formatting
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
            <h4 className="font-bold text-lg mb-2">Smart Descriptions</h4>
            <p className="text-sm text-muted-foreground">
              Auto-generated descriptions, captions, and hashtags tailored to
              each platform's best practices
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
            <h4 className="font-bold text-lg mb-2">Auto-Post to YouTube</h4>
            <p className="text-sm text-muted-foreground">
              Set it and forget it — automatic YouTube posting with manual
              options for other platforms
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
