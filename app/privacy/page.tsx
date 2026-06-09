import Link from "next/link";

const safeguards = [
  "Raw input is not stored in memory by default.",
  "Receipts use hashes and metadata instead of private text.",
  "High-risk signals are held for review before movement.",
  "Memory keeps derived preferences, not sensitive wording.",
];

const principles = [
  {
    title: "Pressure is not a souvenir",
    copy: "MindReply is built to help you move through a charged moment without turning the raw material into a permanent exhibit.",
  },
  {
    title: "The receipt is narrow on purpose",
    copy: "The record keeps what proves the move: source, timing, risk, confidence, hash, and result. The private wording stays out of the record.",
  },
  {
    title: "Review is a form of care",
    copy: "When a moment carries risk, the system slows the action instead of rewarding speed. Calm is treated as infrastructure.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#081121] px-5 py-8 text-[#f8f5f0] md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold">
            MindReply
          </Link>
          <Link href="/" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-[#cdd6e4] transition hover:border-[#c9a961] hover:text-[#c9a961]">
            Back
          </Link>
        </div>

        <section className="mt-20 grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c9a961]">Privacy Whitepaper Intro</p>
            <h1 className="mt-6 font-serif text-5xl font-bold leading-tight md:text-6xl">Legal-grade restraint for decision work.</h1>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[#cdd6e4]">
            MindReply sits between pressure and action without collecting the private weather as a trophy. It keeps the decision clear while keeping the underlying material protected.
          </p>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-2">
          {safeguards.map((item) => (
            <article key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-[#cdd6e4]">
              {item}
            </article>
          ))}
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          {principles.map((principle) => (
            <article key={principle.title} className="rounded-2xl border border-[#c9a961]/20 bg-[#c9a961]/[0.07] p-5">
              <h2 className="font-serif text-2xl font-bold text-[#f8f5f0]">{principle.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[#cdd6e4]">{principle.copy}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
