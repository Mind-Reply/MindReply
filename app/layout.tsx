import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MindReply | Executive Nervous System",
  description:
    "MindReply is a Decision Infrastructure Layer that turns scattered input into one clear next action with privacy-first defaults.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "MindReply",
    description: "An Executive Nervous System for leaders who need the next action to become obvious.",
    siteName: "MindReply",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
