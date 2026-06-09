import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mind-reply.com"),
  title: {
    default: "MindReply | Private Decision Layer for High-Stakes Messages",
    template: "%s | MindReply",
  },
  description:
    "MindReply helps leaders handle sensitive work messages with one synthesis, one recommended action, quiet memory, and legal-grade privacy.",
  keywords: [
    "executive communication support",
    "private decision layer",
    "chief of staff support",
    "sensitive message review",
    "founder communication",
    "sales reply support",
    "communication risk",
    "high-stakes messages",
    "executive inbox support",
    "private reply review",
    "Website Completion Package",
  ],
  applicationName: "MindReply",
  authors: [{ name: "MindReply" }],
  creator: "MindReply",
  publisher: "MindReply",
  alternates: {
    canonical: "/",
    languages: {
      en: "/?lang=en",
      es: "/?lang=es",
      fr: "/?lang=fr",
      de: "/?lang=de",
      it: "/?lang=it",
      pt: "/?lang=pt",
      nl: "/?lang=nl",
      pl: "/?lang=pl",
      uk: "/?lang=uk",
      ar: "/?lang=ar",
    },
  },
  openGraph: {
    title: "MindReply | Private Decision Layer",
    description:
      "One synthesis, one recommended action, quiet memory, and legal-grade privacy for sensitive executive messages.",
    siteName: "MindReply",
    type: "website",
    url: "https://www.mind-reply.com/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MindReply | Private Decision Layer",
    description: "Private decision support for high-stakes messages.",
  },
  category: "technology",
  other: {
    "service:primary": "Private Decision Layer",
    "service:positioning": "Executive Nervous System",
    "privacy:default": "minimal retention",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
