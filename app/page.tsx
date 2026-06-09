import Link from "next/link";
import MRAgentChat from "@/components/MRAgentChat";

const rails = [
  "Feels the pressure before it answers.",
  "Reads posture, timing, and tone without making it clinical.",
  "Keeps one clear move in view.",
  "Leaves a quiet receipt, not the raw text.",
];

const moments = [
  {
    title: "The message has weather in it",
    copy: "MRagent slows the read before you send anything sharp, small, or over-explained.",
  },
  {
    title: "The ask is simple, but your body refuses it",
    copy: "It names the pressure, the protection, and the cleaner boundary underneath.",
  },
  {
    title: "The follow-up keeps touching your attention",
    copy: "It turns the loose thread into one quiet next move so the matter stops orbiting you.",
  },
];

const steps = ["Place the pressure", "Read what is underneath", "Move once, with a receipt"];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MindReply MRagent",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://www.mind-reply.com/agent",
  description: "A composed pressure read and one clear next move for tense work moments.",
  featureList: ["One synthesis", "One recommended action", "Risk gate", "Quiet receipt"],
  audience: {
    "@type": "Audience",
    audienceType: "Professionals carrying tense messages, delicate replies, and unresolved follow-ups",
  },
  brand: {
    "@type": "Brand",
    name: "MindReply",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4efe4] text-[#162033]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="border-b border-[#162033]/10 bg-[#f4efe4] px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#162033] font-serif text-lg font-bold text-[#e2b757]">M</span>
            <span className="font-serif text-xl font-bold tracking-wide">MindReply</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/pack" className="hidden rounded-full border border-[#162033]/15 px-4 py-2 text-sm font-semibold text-[#162033] transition hover:border-[#e2b757] sm:inline-flex">
              Personal Pack
            </Link>
            <Link href="/agent" className="rounded-full bg-[#162033] px-4 py-2 text-sm font-semibold text-[#f8f5f0] transition hover:bg-[#22314d]">
              Open MRagent
            </Link>
            <Link href="/privacy" className="hidden rounded-full border border-[#162033]/15 px-4 py-2 text-sm font-semibold text-[#162033] transition hover:border-[#e2b757] sm:inline-flex">
              Privacy
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:grid-cols-[0.92fr_1.08fr] md:px-8 md:py-12">
        <div className="flex min-h-[42rem] flex-col justify-between rounded-2xl bg-[#162033] p-6 text-[#f8f5f0] shadow-2xl shadow-[#162033]/20 md:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#e2b757]">MRagent</p>
            <h1 className="mt-6 max-w-xl font-serif text-5xl font-bold leading-[0.94] md:text-7xl">
              Read the pressure. Move with grace.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-[#d8deea]">
              Bring the message, hesitation, or private knot. MRagent listens for the hidden temperature, returns one composed read, and keeps the next move mercifully clear.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {rails.map((rail) => (
              <div key={rail} className="rounded-xl border border-white/10 bg-white/[0.045] p-4 text-sm leading-6 text-[#d8deea]">
                {rail}
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-[42rem] overflow-hidden rounded-2xl border border-[#162033]/10 bg-[#0d1729] shadow-2xl shadow-[#162033]/15">
          <MRAgentChat compact />
        </div>
      </section>

      <section className="border-y border-[#162033]/10 bg-[#fffaf0] px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b7430]">When to use it</p>
            <h2 className="mt-4 max-w-md font-serif text-4xl font-bold leading-tight md:text-5xl">
              For the charged second before your tone becomes the story.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {moments.map((moment) => (
              <article key={moment.title} className="rounded-xl border border-[#162033]/10 bg-white p-5 shadow-sm shadow-[#162033]/5">
                <h3 className="font-serif text-2xl font-bold leading-tight">{moment.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[#4c5a70]">{moment.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 rounded-2xl bg-[#162033] p-5 text-[#f8f5f0] md:flex-row md:items-center md:justify-between md:p-6">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center gap-4">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#e2b757] text-sm font-bold text-[#162033]">{index + 1}</span>
              <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[#d8deea]">{step}</span>
            </div>
          ))}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/agent" className="rounded-full bg-[#f8f5f0] px-5 py-3 text-center text-sm font-bold text-[#162033] transition hover:bg-[#e2b757]">
              Try the Mind Read
            </Link>
            <Link href="/pack" className="rounded-full border border-[#f8f5f0]/30 px-5 py-3 text-center text-sm font-bold text-[#f8f5f0] transition hover:border-[#e2b757] hover:text-[#e2b757]">
              See the Pack
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
