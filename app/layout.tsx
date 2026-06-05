import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AuthProvider from "@/components/AuthProvider";
import Nav from "@/components/Nav";
import MRAgent from "@/components/MRAgent";
import MarketingPixels from "@/components/MarketingPixels";
import { absoluteUrl, SITE_URL } from "@/lib/seo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MindReply | Executive Communication Intelligence",
    template: "%s | MindReply",
  },
  description:
    "AI communication intelligence for executives, psychologists, legal counsel, financial advisors, and high-trust professional teams.",
  alternates: { canonical: absoluteUrl("/") },
  keywords: [
    "AI communication intelligence",
    "executive communication",
    "professional email polisher",
    "behavioral intelligence",
    "legal communication AI",
    "psychologist communication tools",
    "financial advisor client communication",
  ],
  openGraph: {
    title: "MindReply | Executive Communication Intelligence",
    description:
      "Premium AI tools for sensitive professional messages, executive emails, specialist lexicons, and high-trust communication workflows.",
    url: absoluteUrl("/"),
    siteName: "MindReply",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MindReply | Executive Communication Intelligence",
    description: "Premium AI communication intelligence for high-trust professional work.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="antialiased bg-mr-cream-light text-gray-900" style={{ fontFamily: "var(--font-inter)" }}>
        <AuthProvider>
          <Nav />
          {children}
          <MRAgent />
          <MarketingPixels />
          <SpeedInsights />
        </AuthProvider>
      </body>
    </html>
  );
}
