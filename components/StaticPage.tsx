import Link from "next/link";
import type { ReactNode } from "react";

type Section = {
  title: string;
  body: string;
};

type StaticPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  sections?: Section[];
  children?: ReactNode;
};

export default function StaticPage({ eyebrow, title, description, primaryHref, primaryLabel, sections = [], children }: StaticPageProps) {
  return (
    <main className="pt-20 min-h-screen" style={{ background: "hsl(40 33% 97%)" }}>
      <section className="py-14 px-4" style={{ background: "hsl(220 55% 20%)" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "hsl(43 80% 60%)" }}>{eyebrow}</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3" style={{ color: "hsl(43 70% 88%)" }}>{title}</h1>
          <p className="text-sm max-w-2xl leading-relaxed" style={{ color: "rgba(248,245,240,0.72)" }}>{description}</p>
          {primaryHref && primaryLabel && (
            <Link href={primaryHref} className="inline-flex mt-6 px-5 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity" style={{ background: "hsl(43 80% 60%)", color: "hsl(220 45% 13%)" }}>
              {primaryLabel}
            </Link>
          )}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-10">
        {children}
        {sections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sections.map((section) => (
              <article key={section.title} className="bg-white border rounded-xl p-6" style={{ borderColor: "hsl(40 25% 88%)" }}>
                <h2 className="font-serif text-xl font-bold mb-3" style={{ color: "hsl(220 45% 13%)" }}>{section.title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(220 25% 45%)" }}>{section.body}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
