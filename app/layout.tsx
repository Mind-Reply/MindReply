import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mind-reply.com"),
  title: {
    default: "MindReply | Reply Overload Cleanup for High-Stakes Messages",
    template: "%s | MindReply",
  },
  description:
    "MindReply helps founders, operators, and client-facing teams turn messy threads into an action queue, send-ready reply, risk flag, and private receipt.",
  keywords: [
    "executive communication support",
    "reply overload cleanup",
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
    title: "MindReply | Reply Overload Cleanup",
    description:
      "Paste one messy thread and get the next action, send-ready reply, risk flag, and private receipt.",
    siteName: "MindReply",
    type: "website",
    url: "https://www.mind-reply.com/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MindReply | Reply Overload Cleanup",
    description: "Action queues and send-ready replies for high-stakes messages.",
  },
  category: "technology",
  other: {
    "service:primary": "Reply Overload Cleanup",
    "service:positioning": "Action queue and send-ready replies",
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
