"use client";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">
              <span className="text-gradient">AdStream</span>AI
            </h3>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a
              href="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms & Conditions
            </a>
            <a
              href="#blog"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </a>
            <a
              href="/contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8">
          <p className="text-sm text-muted-foreground text-center">
            © 2025 AdStream AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
