import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin", "cyrillic"], variable: "--font-playfair" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mind-reply.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MindReply | Premium AI Reply Intelligence",
    template: "%s | MindReply",
  },
  description:
    "Premium AI reply intelligence for clear decisions, confident email replies, website conversion rescue, and the GBP 600 Website Completion Package.",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      es: "/",
      fr: "/",
      de: "/",
      it: "/",
      pt: "/",
      nl: "/",
      pl: "/",
      uk: "/",
      bg: "/",
    },
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "AI decision support",
    "AI email reply assistant",
    "premium reply intelligence",
    "website conversion rescue",
    "Website Completion Package",
    "AI communication assistant",
    "private decision support",
    "buyer-ready website copy",
    "AI search visibility",
    "MRagent",
  ],
  category: "AI Communication",
  openGraph: {
    title: "MindReply | Premium AI Reply Intelligence",
    description:
      "Clear decisions, confident replies, and buyer-ready website communication with MRagent and the Website Completion Package.",
    url: "/",
    siteName: "MindReply",
    type: "website",
    locale: "en_US",
    alternateLocale: ["es_ES", "fr_FR", "de_DE", "it_IT", "pt_PT", "nl_NL", "pl_PL", "uk_UA", "bg_BG"],
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "MindReply MRagent - warm mind read, clear next move",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MindReply | Premium AI Reply Intelligence",
    description: "Turn communication pressure into one clear next move, a confident reply, or a website completion queue.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="antialiased bg-[#081121] text-[#f8f5f0]" style={{ fontFamily: "var(--font-inter)" }}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
