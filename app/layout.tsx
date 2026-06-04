import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "MindReply | Executive Communication Intelligence Ecosystem",
  description: "Subconscious Communication Intelligence for Elite Professionals",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="antialiased bg-mr-cream-light text-gray-900" style={{ fontFamily: "var(--font-inter)" }}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
