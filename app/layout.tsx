import type { Metadata } from "next";
import MRAgent from "@/components/MRAgent";
import Nav from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindReply | Executive Communication Intelligence Ecosystem",
  description: "Subconscious Communication Intelligence for Elite Professionals",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-mr-cream-light text-gray-900" style={{ fontFamily: "var(--font-inter)" }}>
        <Nav />
        {children}
        <MRAgent />
      </body>
    </html>
  );
}
