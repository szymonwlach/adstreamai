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
import { Analytics } from "@vercel/analytics/next";
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "AdStreamAI – Create AI Ads & Auto-Post to Social Media",
  description:
    "Create high-converting AI ads in multiple formats and automatically publish them to Instagram, Facebook, TikTok, YouTube Shorts and more. One tool. Full automation.",
  authors: [{ name: "AdStreamAI" }],
  openGraph: {
    title: "AdStreamAI – Create AI Ads & Auto-Publish Everywhere",
    description:
      "Generate AI-powered ads in multiple styles and automatically post them to all major social media platforms from one dashboard.",
    type: "website",
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
            {/* <CookieConsent /> */}
          </TooltipProvider>
        </ReactQueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
