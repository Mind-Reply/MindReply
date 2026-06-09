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
    "MindReply turns website buying friction, client follow-up pressure, and response overload into one clear next move, a ranked action queue, and privacy-safe assisted close for priority UK, US, Gulf, German, French, Japanese, Brazilian, Spanish, Indian, Chinese, and Ukrainian readers.",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      es: "/?lang=es",
      fr: "/?lang=fr",
      de: "/?lang=de",
      pt: "/?lang=pt",
      ar: "/?lang=ar",
      hi: "/?lang=hi",
      ja: "/?lang=ja",
      zh: "/?lang=zh",
      uk: "/?lang=uk",
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
    "United States founder response overload",
    "UAE executive communication support",
    "Saudi Arabia Arabic business communication support",
    "Germany professional reply support",
    "France client follow up rescue",
    "Japan executive communication support",
    "Brazil Portuguese business communication support",
    "Spain website conversion copy",
    "India business response overload",
    "China business communication support",
    "Ukraine founder communication support",
    "Arabic executive communication support",
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
    alternateLocale: ["es_ES", "fr_FR", "de_DE", "pt_BR", "ar_AE", "hi_IN", "ja_JP", "zh_CN", "uk_UA"],
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
    "content-language": "en, es, fr, de, pt, ar, hi, ja, zh, uk",
    "geo.placename": "United Kingdom, United States, United Arab Emirates, Saudi Arabia, Germany, France, Japan, Brazil, Spain, India",
    "target-market": "UK, US, AE, SA, DE, FR, JP, BR, ES, IN",
    "target-market-priority": "UK > US > UAE > Saudi Arabia > Germany > France > Japan > Brazil > Spain > India",
    "localization-priority": "English, Arabic, German, French, Japanese, Portuguese, Spanish, Hindi, Chinese, Ukrainian",
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
