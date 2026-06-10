import Link from "next/link";
import {
  ArrowRight,
  BadgePoundSterling,
  Brain,
  CheckCircle2,
  ClipboardList,
  FileText,
  LockKeyhole,
  Mail,
  ReceiptText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Products | MindReply",
  description:
    "MindReply products: MRagent, Website Completion Package, Growth, and Pro. Fixed-price checkout and invoice-first routes for the GBP 600 package.",
  alternates: {
    canonical: "https://www.mind-reply.com/products",
  },
};

const packagePaymentUrl = process.env.NEXT_PUBLIC_WEBSITE_COMPLETION_PACKAGE_PAYMENT_URL || "";
const checkoutHref = "/checkout?package=website-completion";

const products = [
  {
    name: "MRagent",
    price: "Free start",
    eyebrow: "First read",
    icon: Brain,
    description:
      "A pressure-first chat for moments where the words are not the whole problem. MRagent reads the context, names the protective reflex, checks risk, and gives one composed move before you send, reply, or escalate.",
    includes: [
      "One synthesis and one recommended action",
      "Risk and confidence labels before movement",
      "Privacy-safe receipt shape without public raw text",
      "Upgrade trigger when the issue is bigger than one reply",
    ],
    primary: { label: "Try MindReply Free", href: "/agent" },
    secondary: { label: "See more", href: "/agent" },
  },
  {
    name: "Website Completion Package",
    price: "GBP 600 fixed",
    eyebrow: "First paid offer",
    icon: BadgePoundSterling,
    description:
      "A focused commercial rescue for overloaded websites, vague offers, weak contact paths, and follow-up friction. It turns the current page or offer into a ranked action queue, send-ready copy, and a narrow receipt.",
    includes: [
      "Messaging rescue for the page, offer, or reply path",
      "Ranked fixes in buyer-impact order",
      "Send-ready section copy, follow-up, or close note",
      "Fixed-price checkout plus invoice-first option",
    ],
    primary: { label: packagePaymentUrl ? "Checkout" : "Checkout or invoice", href: checkoutHref },
    secondary: { label: "See more", href: "/website-completion-package" },
    featured: true,
  },
  {
    name: "Growth",
    price: "GBP 49/mo",
    eyebrow: "Recurring pressure",
    icon: ClipboardList,
    description:
      "For recurring inbox, client, and operator pressure after the first paid rescue proves useful. Growth keeps the work lightweight: repeat reads, better follow-ups, and a cleaner action rhythm.",
    includes: [
      "More monthly reads and reply preparation",
      "Short-term context for active workstreams",
      "Priority support through info@mind-reply.com",
      "Best when the same overload returns weekly",
    ],
    primary: { label: "Try MindReply Free", href: "/agent" },
    secondary: { label: "See more", href: "/pricing" },
  },
  {
    name: "Pro",
    price: "GBP 129/mo",
    eyebrow: "Continuity lane",
    icon: ShieldCheck,
    description:
      "For high-trust operators who need approved continuity, deeper receipt review, and careful integration planning. Pro stays consent-led: no public claim of automation until credentials and permissions exist.",
    includes: [
      "Longer memory and profile direction once approved",
      "Slack/email integration lane when credentials are connected",
      "Advanced reporting and receipt review",
      "Founder, executive, legal, finance, and client-facing workflows",
    ],
    primary: { label: "Ask about Pro", href: "/contact?intent=pro" },
    secondary: { label: "See more", href: "/pricing" },
  },
];

const checkoutRows = [
  {
    title: "Fixed price",
    copy: "The Website Completion Package is GBP 600 once. The buyer should not have to negotiate the starting offer.",
    icon: BadgePoundSterling,
  },
  {
    title: "Checkout when configured",
    copy: "A direct payment button appears when NEXT_PUBLIC_WEBSITE_COMPLETION_PACKAGE_PAYMENT_URL is configured.",
    icon: ArrowRight,
  },
  {
    title: "Invoice option always visible",
    copy: "The invoice route captures billing name and billing email before scope is confirmed and delivery begins.",
    icon: ReceiptText,
  },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#f8f4ec] text-[#122033]">
      <header className="border-b border-[#122033]/10 bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#122033] font-serif text-lg font-bold text-[#e2b757]">M</span>
            <span className="font-serif text-xl font-bold tracking-wide">MindReply</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/agent" className="hidden rounded-full border border-[#122033]/15 px-4 py-2 text-sm font-semibold text-[#122033] transition hover:border-[#2f6f72] md:inline-flex">
              MRagent
            </Link>
            <Link href={checkoutHref} className="rounded-full bg-[#122033] px-4 py-2 text-sm font-semibold text-[#f8f5f0] transition hover:bg-[#1c3150]">
              Checkout
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-[#122033] px-4 py-12 text-[#f8f5f0] md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#e2b757]/35 bg-[#e2b757]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e2b757]">
              <Sparkles aria-hidden className="h-4 w-4" /> Product surface
            </p>
            <h1 className="mt-7 max-w-4xl font-serif text-5xl font-bold leading-[0.96] md:text-7xl">
              One free read, one fixed-price rescue, then continuity only after proof.
            </h1>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[#d9e3e7] md:text-lg">
            The product ladder stays deliberately legible: MRagent proves relief, the Website Completion Package removes buying friction for GBP 600, and Growth or Pro appear only when the pressure repeats.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-4">
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <article
                key={product.name}
                className={
                  product.featured
                    ? "rounded-lg border border-[#e2b757]/45 bg-[#122033] p-6 text-[#f8f5f0] shadow-xl shadow-[#122033]/18"
                    : "rounded-lg border border-[#122033]/10 bg-white p-6 shadow-sm shadow-[#122033]/5"
                }
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={product.featured ? "grid h-11 w-11 place-items-center rounded-lg bg-[#e2b757] text-[#122033]" : "grid h-11 w-11 place-items-center rounded-lg bg-[#f8f4ec] text-[#2f6f72]"}>
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>
                  <span className={product.featured ? "rounded-full border border-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#e2b757]" : "rounded-full bg-[#f8f4ec] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#2f6f72]"}>
                    {product.eyebrow}
                  </span>
                </div>
                <h2 className="mt-5 font-serif text-3xl font-bold leading-tight">{product.name}</h2>
                <p className={product.featured ? "mt-2 text-xl font-bold text-[#e2b757]" : "mt-2 text-xl font-bold text-[#122033]"}>{product.price}</p>
                <p className={product.featured ? "mt-4 text-sm leading-7 text-[#d9e3e7]" : "mt-4 text-sm leading-7 text-[#59687b]"}>{product.description}</p>
                <div className="mt-5 grid gap-3">
                  {product.includes.map((item) => (
                    <div key={item} className={product.featured ? "flex gap-3 text-sm leading-6 text-[#d9e3e7]" : "flex gap-3 text-sm leading-6 text-[#59687b]"}>
                      <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#e2b757]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-col gap-2">
                  <Link href={product.primary.href} className={product.featured ? "inline-flex items-center justify-center gap-2 rounded-full bg-[#e2b757] px-4 py-2.5 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]" : "inline-flex items-center justify-center gap-2 rounded-full bg-[#122033] px-4 py-2.5 text-sm font-bold text-[#f8f5f0] transition hover:bg-[#1c3150]"}>
                    {product.primary.label} <ArrowRight aria-hidden className="h-4 w-4" />
                  </Link>
                  <Link href={product.secondary.href} className={product.featured ? "inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-[#f8f5f0] transition hover:border-[#e2b757] hover:text-[#e2b757]" : "inline-flex items-center justify-center gap-2 rounded-full border border-[#122033]/15 px-4 py-2 text-xs font-bold text-[#122033] transition hover:border-[#2f6f72]"}>
                    {product.secondary.label}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[#122033]/10 bg-white px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f6f72]">Checkout and invoice</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">Fixed price, no fog, invoice route kept open.</h2>
            <p className="mt-5 text-sm leading-7 text-[#59687b]">
              A buyer should see the price, understand the route, and know what happens next. Direct payment can be enabled without removing the invoice-first path.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {checkoutRows.map((row) => {
              const Icon = row.icon;
              return (
                <article key={row.title} className="rounded-lg border border-[#122033]/10 bg-[#f8f4ec] p-5">
                  <Icon aria-hidden className="h-6 w-6 text-[#2f6f72]" />
                  <h3 className="mt-4 font-serif text-2xl font-bold">{row.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#59687b]">{row.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-lg bg-[#103b39] p-6 text-[#f8f5f0] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#91d2c8]">Best next move</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight">Use MRagent first. Buy the GBP 600 package when the website or offer still leaks the sale.</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/agent" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e2b757] px-5 py-3 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]">
              Try MindReply Free <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
            <Link href={checkoutHref} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-[#f8f5f0] transition hover:border-[#e2b757] hover:text-[#e2b757]">
              Checkout or invoice <Mail aria-hidden className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
