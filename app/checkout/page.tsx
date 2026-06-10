import Link from "next/link";
import {
  ArrowRight,
  BadgePoundSterling,
  CheckCircle2,
  CreditCard,
  FileText,
  LockKeyhole,
  Mail,
  ReceiptText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Checkout | MindReply",
  description:
    "Checkout for the MindReply Website Completion Package: GBP 600 fixed price with direct payment when configured and invoice-first request option.",
  alternates: {
    canonical: "https://www.mind-reply.com/checkout",
  },
};

const packagePaymentUrl = process.env.NEXT_PUBLIC_WEBSITE_COMPLETION_PACKAGE_PAYMENT_URL || "";
const invoiceHref = "/contact?intent=website-completion";

const included = [
  "Website, offer, or reply-path friction reviewed as one buying system.",
  "Ranked action queue: what to fix first, second, and only if needed.",
  "Send-ready copy for the next page section, reply, or assisted-close note.",
  "Privacy-safe receipt with raw sensitive material kept out of public proof.",
];

const routes = [
  {
    title: "Direct checkout",
    detail: packagePaymentUrl
      ? "Payment link is configured. Scope still stays fixed to the Website Completion Package before delivery."
      : "Direct payment link is not configured yet. The invoice route is active now, and this checkout page is ready for the payment URL.",
    icon: CreditCard,
  },
  {
    title: "Invoice option",
    detail: "Use the contact form to capture billing name and billing email before MindReply confirms scope and sends the invoice route.",
    icon: ReceiptText,
  },
  {
    title: "Owner-safe delivery",
    detail: "Sensitive owner decisions, security details, and private proof stay out of public copy and move through receipt-based reporting.",
    icon: LockKeyhole,
  },
];

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#f8f4ec] text-[#122033]">
      <header className="border-b border-[#122033]/10 bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#122033] font-serif text-lg font-bold text-[#e2b757]">M</span>
            <span className="font-serif text-xl font-bold tracking-wide">MindReply</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/products" className="hidden rounded-full border border-[#122033]/15 px-4 py-2 text-sm font-semibold text-[#122033] transition hover:border-[#2f6f72] md:inline-flex">
              Products
            </Link>
            <Link href="/contact?intent=website-completion" className="rounded-full bg-[#122033] px-4 py-2 text-sm font-semibold text-[#f8f5f0] transition hover:bg-[#1c3150]">
              Invoice
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-[#122033] px-4 py-12 text-[#f8f5f0] md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#e2b757]/35 bg-[#e2b757]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e2b757]">
              <Sparkles aria-hidden className="h-4 w-4" /> Fixed-price checkout
            </p>
            <h1 className="mt-7 max-w-4xl font-serif text-5xl font-bold leading-[0.96] md:text-7xl">Website Completion Package, GBP 600.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#d9e3e7] md:text-lg">
              One focused rescue pass for website buying friction, offer confusion, reply pressure, and follow-up leakage. Direct payment can be switched on by URL; invoice-first remains available.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.055] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#91d2c8]">Package total</p>
            <div className="mt-4 flex items-end gap-3">
              <BadgePoundSterling aria-hidden className="mb-2 h-8 w-8 text-[#e2b757]" />
              <p className="font-serif text-5xl font-bold">GBP 600</p>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#d9e3e7]">
              Fixed scope first. Payment or invoice before delivery. No invented urgency, no hidden price, no public personal inbox.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {packagePaymentUrl ? (
                <a href={packagePaymentUrl} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e2b757] px-5 py-3 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]">
                  Pay GBP 600 <ArrowRight aria-hidden className="h-4 w-4" />
                </a>
              ) : (
                <Link href={invoiceHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e2b757] px-5 py-3 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]">
                  Request invoice <Mail aria-hidden className="h-4 w-4" />
                </Link>
              )}
              <Link href="/website-completion-package" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-[#f8f5f0] transition hover:border-[#e2b757] hover:text-[#e2b757]">
                See package detail <FileText aria-hidden className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2f6f72]">What is included</p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">A concrete delivery bundle, not a vague consultation.</h2>
            <p className="mt-5 text-sm leading-7 text-[#59687b]">
              The checkout page exists to make the buying action calm and obvious. If direct payment is not active, the invoice form performs the same buying handoff with billing details captured safely.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {included.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-[#122033]/10 bg-white p-4 text-sm leading-6 text-[#59687b] shadow-sm shadow-[#122033]/5">
                <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f72]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#122033]/10 bg-white px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {routes.map((route) => {
            const Icon = route.icon;
            return (
              <article key={route.title} className="rounded-lg border border-[#122033]/10 bg-[#f8f4ec] p-5">
                <Icon aria-hidden className="h-6 w-6 text-[#2f6f72]" />
                <h3 className="mt-4 font-serif text-2xl font-bold">{route.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#59687b]">{route.detail}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-lg bg-[#103b39] p-6 text-[#f8f5f0] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#91d2c8]">Need invoice?</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight">Use the invoice route when the buyer needs billing details, project confirmation, or owner approval first.</h2>
          </div>
          <Link href={invoiceHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e2b757] px-5 py-3 text-sm font-bold text-[#122033] transition hover:bg-[#f0cf7a]">
            Request invoice <ReceiptText aria-hidden className="h-4 w-4" />
          </Link>
        </div>
        <div className="mx-auto mt-5 flex max-w-7xl gap-3 rounded-lg border border-[#122033]/10 bg-white p-4 text-sm leading-6 text-[#59687b]">
          <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f72]" />
          <span>Checkout, invoice, and contact routes use info@mind-reply.com or configured provider secrets. Public pages must not expose personal Gmail or private owner data.</span>
        </div>
      </section>
    </main>
  );
}
