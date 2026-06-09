import { createHash, randomUUID } from "node:crypto";

export type PackageRequestIntent = "website-completion" | "mragent-unresolved" | "security-owner" | "billing" | "pro";
export type PackageRequestDeliveryStatus = "sent" | "blocked" | "dry-run" | "failed";

export type PackageRequestInput = {
  email: string;
  intent: PackageRequestIntent;
  context: string;
  triedMRagent?: string;
  consent: boolean;
};

export type PackageRequestAssistedClose = {
  status: "queued" | "fallback";
  nextStep: string;
  expectedReplyWindow: "one business day";
  ownerDecisionNeeded: string;
  buyerPromise: string;
  paymentPath: string;
};

export type PackageRequestReceipt = {
  id: string;
  timestamp: string;
  intent: PackageRequestIntent;
  actionKind: "package_request";
  riskLevel: "low";
  confidence: "medium";
  playbookVersion: "website-completion-2026-06";
  packageName: "Website Completion Package";
  packageValue: "GBP 600";
  contactRoute: "api";
  fallbackEmail: "info@mind-reply.com";
  inputHash: string;
  rawContentRedacted: true;
  consentCaptured: boolean;
  assistedClose: PackageRequestAssistedClose;
  delivery: {
    status: PackageRequestDeliveryStatus;
    channel: "email";
    provider: "resend";
    recipientConfigured: boolean;
    providerConfigured: boolean;
    detail: string;
  };
};

const intentValues = new Set<PackageRequestIntent>(["website-completion", "mragent-unresolved", "security-owner", "billing", "pro"]);

function clean(value: unknown, limit = 2000) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, limit);
}

function inputHash(input: PackageRequestInput) {
  const source = [input.email.toLowerCase(), input.intent, input.context, input.triedMRagent || ""].join("|");
  return `pkg-${createHash("sha256").update(source).digest("hex").slice(0, 20)}`;
}

function normalizeIntent(value: unknown): PackageRequestIntent {
  const cleaned = clean(value, 80).toLowerCase().replace(/\s+/g, "-");
  if (intentValues.has(cleaned as PackageRequestIntent)) return cleaned as PackageRequestIntent;
  if (cleaned.includes("security")) return "security-owner";
  if (cleaned.includes("billing") || cleaned.includes("payment")) return "billing";
  if (cleaned.includes("pro")) return "pro";
  if (cleaned.includes("mragent")) return "mragent-unresolved";
  return "website-completion";
}

function recipients() {
  const raw = [process.env.MINDREPLY_PACKAGE_REQUEST_TO || "", process.env.MINDREPLY_REPORT_EMAIL || "", process.env.MINDREPLY_REPORT_EMAILS || ""];
  return raw
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
}

function assistedClose(delivery: PackageRequestReceipt["delivery"]): PackageRequestAssistedClose {
  const fallback = delivery.status !== "sent";

  return {
    status: fallback ? "fallback" : "queued",
    nextStep: fallback
      ? "Send the receipt id to info@mind-reply.com with redacted context so the close can continue manually."
      : "MindReply reviews the redacted request and sends the next close-ready reply route.",
    expectedReplyWindow: "one business day",
    ownerDecisionNeeded: "Confirm scope, invoice/payment route, or decline/refine with one clear reason.",
    buyerPromise: "Website Completion Package request: GBP 600 once for ranked fixes, send-ready copy, and buyer path cleanup.",
    paymentPath: "Scope first, then invoice or payment link after acceptance.",
  };
}

export function parsePackageRequest(body: unknown): { input?: PackageRequestInput; error?: string } {
  if (!body || typeof body !== "object") return { error: "Request body is required." };
  const record = body as Record<string, unknown>;
  const email = clean(record.email, 200).toLowerCase();
  const context = clean(record.context, 2400);
  const triedMRagent = clean(record.triedMRagent, 1600);
  const consent = record.consent === true || record.consent === "true" || record.consent === "on";

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return { error: "A valid email is required." };
  if (!context || context.length < 12) return { error: "Short redacted context is required." };
  if (!consent) return { error: "Consent is required before MindReply reviews the request." };

  return {
    input: {
      email,
      intent: normalizeIntent(record.intent),
      context,
      triedMRagent,
      consent,
    },
  };
}

export function makePackageReceipt(input: PackageRequestInput, delivery: PackageRequestReceipt["delivery"]): PackageRequestReceipt {
  return {
    id: `pkg-${randomUUID()}`,
    timestamp: new Date().toISOString(),
    intent: input.intent,
    actionKind: "package_request",
    riskLevel: "low",
    confidence: "medium",
    playbookVersion: "website-completion-2026-06",
    packageName: "Website Completion Package",
    packageValue: "GBP 600",
    contactRoute: "api",
    fallbackEmail: "info@mind-reply.com",
    inputHash: inputHash(input),
    rawContentRedacted: true,
    consentCaptured: input.consent,
    assistedClose: assistedClose(delivery),
    delivery,
  };
}

export async function deliverPackageRequest(input: PackageRequestInput): Promise<PackageRequestReceipt["delivery"]> {
  const to = recipients();
  const from = process.env.MINDREPLY_PACKAGE_REQUEST_FROM || process.env.MINDREPLY_REPORT_FROM || "";
  const apiKey = process.env.RESEND_API_KEY || "";
  const dryRun = process.env.MINDREPLY_PACKAGE_REQUEST_DRY_RUN === "true";

  if (dryRun) {
    return {
      status: "dry-run",
      channel: "email",
      provider: "resend",
      recipientConfigured: to.length > 0,
      providerConfigured: Boolean(apiKey),
      detail: "Package request dry run; no email sent.",
    };
  }

  if (to.length === 0) {
    return {
      status: "blocked",
      channel: "email",
      provider: "resend",
      recipientConfigured: false,
      providerConfigured: Boolean(apiKey),
      detail: "MINDREPLY_PACKAGE_REQUEST_TO or report email recipient is missing.",
    };
  }

  if (!from || !apiKey) {
    return {
      status: "blocked",
      channel: "email",
      provider: "resend",
      recipientConfigured: true,
      providerConfigured: Boolean(apiKey),
      detail: !from ? "Sender email is missing." : "RESEND_API_KEY is missing.",
    };
  }

  const text = [
    "MindReply package request",
    "",
    `Intent: ${input.intent}`,
    `Package: Website Completion Package, GBP 600`,
    `Reply-to: ${input.email}`,
    "Owner decision needed: confirm scope, invoice/payment route, or decline/refine with one clear reason.",
    "Payment path: scope first, then invoice or payment link after acceptance.",
    "Expected reply window: one business day.",
    "",
    "Redacted context:",
    input.context,
    "",
    "MRagent attempt:",
    input.triedMRagent || "Not provided.",
    "",
    "Consent captured: yes",
    "Raw content policy: requester was asked not to include secrets, tokens, private addresses, or unredacted sensitive text.",
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: input.email,
      subject: "MindReply Website Completion Package request",
      text,
    }),
  });

  if (!response.ok) {
    const body = (await response.text()).slice(0, 500);
    return {
      status: "failed",
      channel: "email",
      provider: "resend",
      recipientConfigured: true,
      providerConfigured: true,
      detail: `Resend returned ${response.status}: ${body}`,
    };
  }

  return {
    status: "sent",
    channel: "email",
    provider: "resend",
    recipientConfigured: true,
    providerConfigured: true,
    detail: "Package request accepted by Resend.",
  };
}
