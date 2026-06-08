import Link from "next/link";
import MRAgentChat from "@/components/MRAgentChat";

export const metadata = {
  title: "MRagent | MindReply",
  description: "A warm behavioral companion that reads pressure and returns one clear next move.",
};

export default function AgentPage() {
  return (
    <main className="min-h-screen bg-[#f4efe4] text-[#162033]">
      <header className="border-b border-[#162033]/10 px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#162033] font-serif text-lg font-bold text-[#e2b757]">M</span>
            <span className="font-serif text-xl font-bold tracking-wide">MindReply</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="rounded-full border border-[#162033]/15 px-4 py-2 text-sm font-semibold text-[#162033] transition hover:border-[#e2b757]">
              Home
            </Link>
            <Link href="/privacy" className="hidden rounded-full border border-[#162033]/15 px-4 py-2 text-sm font-semibold text-[#162033] transition hover:border-[#e2b757] sm:inline-flex">
              Privacy
            </Link>
          </div>
        </div>
      </header>
      <MRAgentChat />
    </main>
  );
}
