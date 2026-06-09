import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import LocaleAssist from "@/components/LocaleAssist";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mind-reply.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MindReply | Website Completion and Response Overload Rescue",
    template: "%s | MindReply",
  },
  description:
    "MindReply turns website buying friction, client follow-up pressure, and response overload into one clear next move, a ranked action queue, and privacy-safe assisted close.",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      es: "/?lang=es",
      fr: "/?lang=fr",
      de: "/?lang=de",
      it: "/?lang=it",
      pt: "/?lang=pt",
      ar: "/?lang=ar",
      ja: "/?lang=ja",
      ko: "/?lang=ko",
      zh: "/?lang=zh",
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
    "Website Completion Package",
    "website buying friction",
    "response overload",
    "client follow up cadence",
    "founder communication rescue",
    "assisted close",
    "privacy safe receipt",
    "ranked action queue",
    "send ready copy",
    "MRagent",
  ],
  category: "Business Communication",
  openGraph: {
    title: "MindReply | Website Completion and Response Overload Rescue",
    description: "Turn buying friction, client follow-up pressure, and response overload into one clear next move.",
    url: "/",
    siteName: "MindReply",
    type: "website",
    locale: "en_GB",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "MindReply MRagent - website completion and response overload rescue",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MindReply | Website Completion and Response Overload Rescue",
    description: "Pressure in. One clear move out. Website package, action queue, and assisted close.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="bg-[#081121] text-[#f8f5f0] antialiased" style={{ fontFamily: "var(--font-inter)" }}>
        {children}
        <SiteFooter />
        <LocaleAssist />
        <SpeedInsights />
      </body>
    </html>
  );
}
