import Link from "next/link";
import MRAgentChat from "@/components/MRAgentChat";

export const metadata = {
  title: "MRagent | MindReply",
  description: "A calm decision companion that turns pressure into one clear next move.",
};

export default function AgentPage() {
  return (
    <main className="min-h-screen bg-[#081121]">
      <header className="border-b border-white/10 px-5 py-5 md:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold tracking-wide text-[#f8f5f0]">
            MindReply
          </Link>
          <Link href="/privacy" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-[#cdd6e4] transition hover:border-[#c9a961] hover:text-[#c9a961]">
            Privacy
          </Link>
        </div>
      </header>
      <MRAgentChat />
    </main>
  );
}
