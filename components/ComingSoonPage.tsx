import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function ComingSoonPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-24 text-[#111827]">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#386fae] hover:text-[#111827]"
        >
          <ArrowLeft size={16} />
          Back to MindReply
        </Link>
        <section className="rounded-lg border border-[#d7dde8] bg-white p-8 shadow-sm">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-[#eaf3ff] text-[#386fae]">
            <Compass size={22} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#386fae]">
            Expansion lane
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">{title}</h1>
          <p className="mt-4 leading-7 text-[#4b5563]">{description}</p>
          <Link
            href="/agents"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#111827] px-5 py-3 text-sm font-semibold text-white hover:bg-[#243041]"
          >
            View agent rollout
          </Link>
        </section>
      </div>
    </main>
  );
}
