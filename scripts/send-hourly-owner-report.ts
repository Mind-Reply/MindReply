import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outboxDir = path.join(root, "reports", "outbox");
const latestReportPath = path.join(outboxDir, "hourly-owner-report-latest.md");
const latestReceiptPath = path.join(outboxDir, "hourly-owner-delivery-receipt-latest.json");
const liveRevenuePath = path.join(root, process.env.MINDREPLY_LIVE_REVENUE_JSON || "mindreply-live-revenue-surface.json");

type DeliveryStatus = "sent" | "blocked" | "dry-run" | "disabled" | "skipped" | "failed";

type Receipt = {
  generatedAt?: string;
  status?: string;
  reportEnabled?: boolean;
  dryRun?: boolean;
  channels?: string[];
  delivery?: Record<string, Record<string, unknown>>;
  blockers?: string[];
  liveRevenueSurface?: Record<string, unknown>;
};

type LiveRevenueProof = {
  generatedAt?: string;
  siteUrl?: string;
  expectedSha?: string | null;
  liveSha?: string | null;
  requireShaMatch?: boolean;
  status?: string;
  failed?: string[];
  warnings?: string[];
  checks?: Array<{ id?: string; pass?: boolean; detail?: string }>;
  surfaces?: Array<{ path?: string; status?: number | string; url?: string }>;
};

function boolEnv(name: string, defaultValue = false) {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  return value === "true";
}

function channels() {
  return (process.env.MINDREPLY_REPORT_CHANNELS || "email,slack")
    .split(",")
    .map((channel) => channel.trim().toLowerCase())
    .filter(Boolean);
}

function recipients() {
  const values = [process.env.MINDREPLY_REPORT_EMAIL || "", process.env.MINDREPLY_REPORT_EMAILS || ""];
  return values
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
}

function summarizeReport(report: string) {
  if (report.length <= 3600) return report;
  return `${report.slice(0, 3500)}\n\n[Report truncated for Slack. Full markdown is attached as a workflow artifact.]`;
}

async function readReceipt(): Promise<Receipt> {
  if (!existsSync(latestReceiptPath)) return {};
  return JSON.parse(await readFile(latestReceiptPath, "utf8")) as Receipt;
}

async function readLiveRevenueProof(): Promise<LiveRevenueProof | null> {
  if (!existsSync(liveRevenuePath)) return null;
  return JSON.parse(await readFile(liveRevenuePath, "utf8")) as LiveRevenueProof;
}

function liveProofSection(proof: LiveRevenueProof) {
  const failed = proof.failed?.length ? proof.failed.join(", ") : "none";
  const warnings = proof.warnings?.length ? proof.warnings.join(", ") : "none";
  const checks = (proof.checks || [])
    .map((item) => `- ${item.pass ? "PASS" : "FAIL"}: ${item.id || "unknown"} - ${item.detail || "no detail"}`)
    .join("\n");
  const surfaces = (proof.surfaces || [])
    .map((item) => `- ${item.path || item.url || "unknown"}: ${item.status || "unknown"}`)
    .join("\n");

  return `\n\n## Live Production Revenue Surface\n\nStatus: ${(proof.status || "unknown").toUpperCase()}\nGenerated: ${proof.generatedAt || "unknown"}\nSite: ${proof.siteUrl || "unknown"}\nExpected SHA: ${proof.expectedSha || "not required"}\nLive SHA: ${proof.liveSha || "missing"}\nStrict SHA match: ${proof.requireShaMatch ? "true" : "false"}\nFailed checks: ${failed}\nWarnings: ${warnings}\n\n### Live Checks\n\n${checks || "No check rows were recorded."}\n\n### Live Surfaces\n\n${surfaces || "No surface rows were recorded."}\n`;
}

async function sendEmail(report: string, dryRun: boolean): Promise<{ status: DeliveryStatus; detail: string }> {
  const to = recipients();
  const from = process.env.MINDREPLY_REPORT_FROM || "";
  const apiKey = process.env.RESEND_API_KEY || "";

  if (dryRun) return { status: "dry-run", detail: "Email dry run; no message sent." };
  if (to.length === 0) return { status: "blocked", detail: "MINDREPLY_REPORT_EMAIL or MINDREPLY_REPORT_EMAILS is missing." };
  if (!from) return { status: "blocked", detail: "MINDREPLY_REPORT_FROM is missing." };
  if (!apiKey) return { status: "blocked", detail: "RESEND_API_KEY is missing." };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: process.env.MINDREPLY_REPORT_SUBJECT || "MindReply hourly owner report",
      text: report,
    }),
  });

  if (!response.ok) {
    const body = (await response.text()).slice(0, 500);
    return { status: "failed", detail: `Resend returned ${response.status}: ${body}` };
  }

  return { status: "sent", detail: "Email accepted by Resend." };
}

async function sendSlack(report: string, dryRun: boolean): Promise<{ status: DeliveryStatus; detail: string }> {
  const webhook = process.env.MINDREPLY_SLACK_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL || "";
  if (dryRun) return { status: "dry-run", detail: "Slack dry run; no message sent." };
  if (!webhook) return { status: "blocked", detail: "Slack webhook secret is missing." };

  const response = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: summarizeReport(report) }),
  });

  if (!response.ok) {
    const body = (await response.text()).slice(0, 500);
    return { status: "failed", detail: `Slack webhook returned ${response.status}: ${body}` };
  }

  return { status: "sent", detail: "Slack webhook accepted the report." };
}

async function main() {
  if (!existsSync(latestReportPath)) {
    throw new Error("Missing owner report. Run npm run launch:report first.");
  }

  let report = await readFile(latestReportPath, "utf8");
  const receipt = await readReceipt();
  const enabled = boolEnv("MINDREPLY_REPORT_ENABLED", false);
  const dryRun = boolEnv("MINDREPLY_REPORT_DRY_RUN", true);
  const liveProofRequired = boolEnv("MINDREPLY_REPORT_REQUIRE_LIVE_PROOF", false);
  const requestedChannels = channels();
  const liveProof = await readLiveRevenueProof();

  if (liveProof && !report.includes("## Live Production Revenue Surface")) {
    report = `${report}${liveProofSection(liveProof)}`;
    await writeFile(latestReportPath, report, "utf8");
  }

  const delivery: Record<string, Record<string, unknown>> = receipt.delivery || {};
  const liveProofAttached = Boolean(liveProof && report.includes("## Live Production Revenue Surface"));

  if (!enabled) {
    delivery.email = { status: "disabled", detail: "MINDREPLY_REPORT_ENABLED is not true." };
    delivery.slack = { status: "disabled", detail: "MINDREPLY_REPORT_ENABLED is not true." };
  } else if (liveProofRequired && !liveProofAttached) {
    delivery.email = { status: "blocked", detail: "Live production revenue proof is required before owner email delivery." };
    delivery.slack = { status: "blocked", detail: "Live production revenue proof is required before owner Slack delivery." };
  } else {
    delivery.email = requestedChannels.includes("email")
      ? await sendEmail(report, dryRun)
      : { status: "skipped", detail: "Email channel not requested." };
    delivery.slack = requestedChannels.includes("slack")
      ? await sendSlack(report, dryRun)
      : { status: "skipped", detail: "Slack channel not requested." };
  }

  const updatedReceipt = {
    ...receipt,
    sentAt: new Date().toISOString(),
    reportEnabled: enabled,
    dryRun,
    channels: requestedChannels,
    liveRevenueSurface: liveProof
      ? {
          attached: liveProofAttached,
          path: liveRevenuePath,
          status: liveProof.status || "unknown",
          expectedSha: liveProof.expectedSha || null,
          liveSha: liveProof.liveSha || null,
          failed: liveProof.failed || [],
        }
      : { attached: false, path: liveRevenuePath, status: "missing" },
    delivery,
  };

  await writeFile(latestReceiptPath, `${JSON.stringify(updatedReceipt, null, 2)}\n`, "utf8");

  const failed = Object.values(delivery).some((value) => ["failed"].includes(String(value.status)));
  const blocked = Object.values(delivery).some((value) => ["blocked"].includes(String(value.status)));

  console.log(`Hourly owner report delivery complete. failed=${failed} blocked=${blocked} dryRun=${dryRun} liveProofAttached=${liveProofAttached}`);

  if (failed) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
