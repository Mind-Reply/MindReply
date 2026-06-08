import Link from "next/link";
import DecisionIntake from "@/components/DecisionIntake";
import MRAgentChat from "@/components/MRAgentChat";

const rails = [
  "One synthesis before movement.",
  "One recommended action in view.",
  "Risk checked before reply or follow-up.",
  "Memory updates without keeping raw pressure.",
];

const signals = [
  { label: "Layer", value: "Intake / Action / Memory" },
  { label: "Response", value: "One clear move" },
  { label: "Record", value: "Private receipt" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#edf1f6] text-[#111827]">
      <section className="border-b border-[#111827]/10 bg-[#edf1f6]/95 px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#111827] font-serif text-lg font-bold text-[#c7d7ea] shadow-sm">M</span>
            <span>
              <span className="block font-serif text-xl font-bold tracking-wide">MindReply</span>
              <span className="hidden text-xs uppercase tracking-[0.24em] text-[#607086] sm:block">Decision Infrastructure</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/agent" className="rounded-full bg-[#111827] px-4 py-2 text-sm font-semibold text-[#f8fafc] transition hover:bg-[#1f2937]">
              Open MRagent
            </Link>
            <Link href="/privacy" className="hidden rounded-full border border-[#111827]/15 px-4 py-2 text-sm font-semibold text-[#111827] transition hover:border-[#6f8fb5] sm:inline-flex">
              Privacy
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-6 md:grid-cols-[0.84fr_1.16fr] md:px-8 md:py-8">
        <div className="flex min-h-[42rem] flex-col justify-between overflow-hidden rounded-[1.5rem] bg-[#111827] p-6 text-[#f8fafc] shadow-2xl shadow-[#111827]/20 md:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#9fb7d7]">Executive Nervous System</p>
            <h1 className="mt-6 max-w-2xl font-serif text-5xl font-bold leading-[0.94] md:text-7xl">
              The next move is obvious.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#cbd5e1]">
              MindReply turns pressure into a private synthesis, checks risk, and leaves one calm action ready to take.
            </p>
          </div>

          <div className="mt-10 grid gap-3">
            {signals.map((signal) => (
              <div key={signal.label} className="grid grid-cols-[7rem_1fr] items-center rounded-xl border border-white/10 bg-white/[0.045] p-4 text-sm text-[#cbd5e1]">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9fb7d7]">{signal.label}</span>
                <span className="font-medium text-[#f8fafc]">{signal.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {rails.map((rail) => (
              <div key={rail} className="rounded-xl border border-white/10 bg-white/[0.045] p-4 text-sm leading-6 text-[#cbd5e1]">
                {rail}
              </div>
            ))}
          </div>
        </div>

        <div className="grid min-h-[42rem] gap-5">
          <div className="rounded-[1.5rem] border border-[#111827]/10 bg-[#101827] p-4 shadow-2xl shadow-[#111827]/15 md:p-5">
            <DecisionIntake />
          </div>
          <div className="min-h-[24rem] overflow-hidden rounded-[1.5rem] border border-[#111827]/10 bg-[#0d1729] shadow-xl shadow-[#111827]/10">
            <MRAgentChat compact />
          </div>
        </div>
      </section>
    </main>
  );
}
