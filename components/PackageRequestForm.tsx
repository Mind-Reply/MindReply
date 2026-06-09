"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Loader2, Mail, ReceiptText, RotateCcw, ShieldCheck } from "lucide-react";

type DeliveryStatus = "sent" | "blocked" | "dry-run" | "failed";

type PackageReceipt = {
  id: string;
  timestamp: string;
  intent: string;
  packageName: string;
  packageValue: string;
  inputHash: string;
  rawContentRedacted: boolean;
  delivery: {
    status: DeliveryStatus;
    detail: string;
  };
};

type PackageRequestFormProps = {
  mailtoHref: string;
  supportEmail: string;
};

const initialForm = {
  email: "",
  intent: "website-completion",
  context: "",
  triedMRagent: "",
  consent: false,
};

function fallbackReason(status?: DeliveryStatus) {
  if (status === "sent") return "Request delivered";
  if (status === "dry-run") return "Dry-run receipt";
  if (status === "failed") return "Provider failed";
  return "Fallback email available";
}

export default function PackageRequestForm({ mailtoHref, supportEmail }: PackageRequestFormProps) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<PackageReceipt | null>(null);

  const canSubmit = useMemo(() => form.email.trim() && form.context.trim().length >= 12 && form.consent && !loading, [form, loading]);

  async function submit() {
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    setReceipt(null);

    try {
      const response = await fetch("/api/package-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok && response.status !== 202) {
        setError(typeof data.error === "string" ? data.error : "The request could not be prepared. Use the fallback email route.");
        return;
      }

      setReceipt(data.receipt as PackageReceipt);
    } catch {
      setError("The request could not reach MindReply. Use the fallback email route and keep the context redacted.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-lg border border-[#122033]/10 bg-white p-6 shadow-xl shadow-[#122033]/10">
      <div className="flex items-center gap-3 text-[#2f6f72]">
        <Mail aria-hidden className="h-5 w-5" />
        <p className="text-xs font-bold uppercase tracking-[0.22em]">Package request</p>
      </div>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-[#39485b]">
          Your email
          <input
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            type="email"
            required
            className="rounded-lg border border-[#122033]/15 bg-[#fbfaf6] px-4 py-3 text-[#122033] outline-none transition focus:border-[#2f6f72]"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#39485b]">
          What do you need?
          <select
            value={form.intent}
            onChange={(event) => setForm((current) => ({ ...current, intent: event.target.value }))}
            className="rounded-lg border border-[#122033]/15 bg-[#fbfaf6] px-4 py-3 text-[#122033] outline-none transition focus:border-[#2f6f72]"
          >
            <option value="website-completion">Website Completion Package</option>
            <option value="mragent-unresolved">MRagent question could not be solved</option>
            <option value="security-owner">Security or owner decision</option>
            <option value="billing">Billing or payment route</option>
            <option value="pro">Pro continuity question</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#39485b]">
          Short context, redacted
          <textarea
            value={form.context}
            onChange={(event) => setForm((current) => ({ ...current, context: event.target.value }))}
            rows={5}
            required
            className="resize-none rounded-lg border border-[#122033]/15 bg-[#fbfaf6] px-4 py-3 text-[#122033] outline-none transition focus:border-[#2f6f72]"
            placeholder="Describe the issue without pasting secrets, tokens, private addresses, or unredacted sensitive text."
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#39485b]">
          What did MRagent already try?
          <textarea
            value={form.triedMRagent}
            onChange={(event) => setForm((current) => ({ ...current, triedMRagent: event.target.value }))}
            rows={3}
            className="resize-none rounded-lg border border-[#122033]/15 bg-[#fbfaf6] px-4 py-3 text-[#122033] outline-none transition focus:border-[#2f6f72]"
            placeholder="Optional. Paste a short summary, not raw sensitive material."
          />
        </label>
        <label className="flex gap-3 text-sm leading-6 text-[#59687b]">
          <input
            checked={form.consent}
            onChange={(event) => setForm((current) => ({ ...current, consent: event.target.checked }))}
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0"
          />
          <span>I consent to MindReply reviewing this redacted context for follow-up.</span>
        </label>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => void submit()}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#122033] px-5 py-3 text-sm font-bold text-[#f8f5f0] transition hover:bg-[#1c3150] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {loading ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <ArrowRight aria-hidden className="h-4 w-4" />}
          Submit package request
        </button>
      </div>

      {receipt ? (
        <div className="mt-5 rounded-lg border border-[#122033]/10 bg-[#f8f4ec] p-4 text-sm leading-6 text-[#59687b]">
          <div className="flex items-center gap-2 font-semibold text-[#122033]">
            <ReceiptText aria-hidden className="h-4 w-4 text-[#2f6f72]" />
            {fallbackReason(receipt.delivery.status)}
          </div>
          <div className="mt-3 grid gap-2">
            <p>Receipt: {receipt.id}</p>
            <p>Package: {receipt.packageName}, {receipt.packageValue}</p>
            <p>Input hash: {receipt.inputHash}</p>
            <p>Raw content redacted: {receipt.rawContentRedacted ? "yes" : "no"}</p>
            <p>Delivery: {receipt.delivery.detail}</p>
          </div>
          {receipt.delivery.status !== "sent" ? (
            <a href={mailtoHref} className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-[#122033]/15 px-4 py-2 text-xs font-bold text-[#122033] transition hover:border-[#2f6f72]">
              Email {supportEmail} <Mail aria-hidden className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <div className="mt-5 rounded-lg border border-[#d96f4a]/25 bg-[#fff8ef] p-4 text-sm leading-6 text-[#6f422b]">
          <div className="flex items-center gap-2 font-semibold">
            <RotateCcw aria-hidden className="h-4 w-4" />
            Fallback needed
          </div>
          <p className="mt-2">{error}</p>
          <a href={mailtoHref} className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#122033] px-4 py-2 text-xs font-bold text-[#f8f5f0]">
            Open fallback email <Mail aria-hidden className="h-3.5 w-3.5" />
          </a>
        </div>
      ) : null}

      <div className="mt-5 flex gap-3 rounded-lg border border-[#122033]/10 bg-[#fbfaf6] p-4 text-sm leading-6 text-[#59687b]">
        <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-[#2f6f72]" />
        <span>Requests use a redacted receipt. Do not include passwords, API keys, private addresses, or unredacted sensitive records.</span>
      </div>
    </section>
  );
}
