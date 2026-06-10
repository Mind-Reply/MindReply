import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleTranslateProvider from "@/components/GoogleTranslateProvider";
import LocaleAssist from "@/components/LocaleAssist";
import SiteFooter from "@/components/SiteFooter";
import { localeAlternates, localeMeta, supportedLocales } from "@/lib/locales";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mind-reply.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MindReply | Website Completion and Response Overload Rescue",
    template: "%s | MindReply",
  },
  description:
    "MindReply turns website buying friction, client follow-up pressure, and response overload into one clear next move, a ranked action queue, and privacy-safe assisted close for priority UK, India, Gulf, US, German, Japanese, Brazilian, French, Spanish, Chinese, Ukrainian, and Bulgarian readers.",
  alternates: {
    canonical: "/",
    languages: localeAlternates(siteUrl, "/"),
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
    "GBP 600 website package",
    "website buying friction",
    "website completion service",
    "response overload",
    "client follow up cadence",
    "founder communication rescue",
    "assisted close",
    "privacy safe receipt",
    "ranked action queue",
    "send ready copy",
    "MRagent",
    "multilingual business communication support",
    "executive communication infrastructure",
    "United Kingdom website completion",
    "India business response overload",
    "UAE executive communication support",
    "Saudi Arabia Arabic business communication support",
    "United States founder response overload",
    "Germany professional reply support",
    "Japan executive communication support",
    "Brazil Portuguese business communication support",
    "France client follow up rescue",
    "Spain website conversion copy",
    "China business communication support",
    "Ukraine founder communication support",
    "Bulgaria business communication support",
    "Bulgarian website completion service",
    "Bulgarian professional reply support",
    "Arabic executive communication support",
    "Hindi founder communication support",
    "German risk aware professional replies",
    "Japanese business reply refinement",
    "Portuguese website completion Brazil",
    "Spanish sales objection reply support",
  ],
  category: "Business Communication",
  openGraph: {
    title: "MindReply | Website Completion and Response Overload Rescue",
    description: "Turn buying friction, client follow-up pressure, and response overload into one clear next move.",
    url: "/",
    siteName: "MindReply",
    type: "website",
    locale: "en_GB",
    alternateLocale: supportedLocales
      .map((locale) => localeMeta[locale].ogLocale)
      .filter((locale) => locale !== "en_GB"),
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
  other: {
    "content-language": "en, es, fr, de, pt, ar, hi, ja, zh, uk, bg",
    "geo.placename": "United Kingdom, India, United Arab Emirates, Saudi Arabia, United States, Germany, Japan, Brazil, France, Spain, Bulgaria",
    "target-market": "GB, IN, AE, SA, US, DE, JP, BR, FR, ES, BG",
    "target-market-priority": "UK > India > UAE > Saudi Arabia > US > Germany > Japan > Brazil > France > Spain > Bulgaria",
    "localization-priority": "English, Hindi, Arabic, German, Japanese, Portuguese, French, Spanish, Chinese, Ukrainian, Bulgarian",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="bg-[#081121] text-[#f8f5f0] antialiased" style={{ fontFamily: "var(--font-inter)" }}>
        {children}
        <SiteFooter />
        <LocaleAssist />
        <GoogleTranslateProvider />
        <SpeedInsights />
      </body>
    </html>
  );
}
