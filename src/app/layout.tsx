import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import ClientToaster from "@/components/ui/client-toaster";
import CookieConsent from "@/components/CookieConsent";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "AdStreamAI - Stream Your Ads to  Platforms",
  description:
    "Create AI-generated product ads and distribute them across every major social platform automatically. Set your ad stream and forget.",
  authors: [{ name: "AdStreamAI" }],
  openGraph: {
    title: "AdStreamAI - Stream Your Ads to Every Platform",
    description:
      "Create AI-generated product ads and distribute them across every major social platform automatically.",
    type: "website",
    images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@AdStreamAI",
    images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
        <ReactQueryProvider>
          <TooltipProvider>
            <ClientToaster />
            <Sonner />
            {children}
            <CookieConsent />
          </TooltipProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
