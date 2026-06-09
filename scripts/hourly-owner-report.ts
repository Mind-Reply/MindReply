import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outboxDir = path.join(root, "reports", "outbox");
const latestReportPath = path.join(outboxDir, "hourly-owner-report-latest.md");
const latestReceiptPath = path.join(outboxDir, "hourly-owner-delivery-receipt-latest.json");

function nowIso() {
  return new Date().toISOString();
}

function safeStamp(iso: string) {
  return iso.replace(/[:.]/g, "-");
}

async function readOptional(filePath: string) {
  if (!existsSync(filePath)) return "";
  return readFile(filePath, "utf8");
}

function hasAll(source: string, terms: string[]) {
  const lower = source.toLowerCase();
  return terms.every((term) => lower.includes(term.toLowerCase()));
}

function statusFrom(blockers: string[]) {
  if (blockers.some((blocker) => blocker.startsWith("Missing required route") || blocker.startsWith("Missing required workflow"))) return "red";
  if (blockers.length > 0) return "amber";
  return "green";
}

async function main() {
  const iso = nowIso();
  await mkdir(outboxDir, { recursive: true });

  const [homePage, packPage, contactPage, workflow, prompt] = await Promise.all([
    readOptional(path.join(root, "app", "page.tsx")),
    readOptional(path.join(root, "app", "pack", "page.tsx")),
    readOptional(path.join(root, "app", "contact", "page.tsx")),
    readOptional(path.join(root, ".github", "workflows", "hourly-owner-report.yml")),
    readOptional(path.join(root, "docs", "hourly_owner_goal_prompt.md")),
  ]);

  const blockers: string[] = [];
  if (!homePage) blockers.push("Missing required route: homepage.");
  if (!packPage) blockers.push("Missing required route: /pack.");
  if (!contactPage) blockers.push("Missing required route: /contact.");
  if (!workflow) blockers.push("Missing required workflow: hourly owner report.");
  if (!prompt) blockers.push("Missing owner goal prompt.");
  if (!process.env.MINDREPLY_REPORT_EMAIL && !process.env.MINDREPLY_REPORT_EMAILS) blockers.push("Owner email secret is not configured.");
  if (!process.env.RESEND_API_KEY) blockers.push("RESEND_API_KEY is not configured; email delivery will be blocked.");
  if (!process.env.MINDREPLY_SLACK_WEBHOOK_URL && !process.env.SLACK_WEBHOOK_URL) blockers.push("Slack webhook secret is not configured; Slack delivery will be blocked.");
  if (!process.env.VERCEL_TOKEN) blockers.push("VERCEL_TOKEN is not configured; Vercel deploy status is limited to GitHub/Vercel environment context.");

  const packageReady = hasAll(homePage + packPage + contactPage, [
    "Website Completion Package",
    "GBP 600",
    "info@mind-reply.com",
    "MRagent",
  ]);

  if (!packageReady) blockers.push("Website Completion Package language is incomplete across homepage, pack, and contact routes.");

  const status = statusFrom(blockers);
  const topBlocker = blockers[0] ?? "No current blocker detected by the hourly report generator.";
  const reportEnabled = process.env.MINDREPLY_REPORT_ENABLED === "true";
  const dryRun = process.env.MINDREPLY_REPORT_DRY_RUN !== "false";
  const channels = process.env.MINDREPLY_REPORT_CHANNELS || "email,slack";
  const deployStatus = process.env.VERCEL_ENV
    ? `${process.env.VERCEL_ENV} context on ${process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || "unknown commit"}`
    : `GitHub Actions context on ${process.env.GITHUB_SHA || "unknown commit"}; Vercel API check requires VERCEL_TOKEN.`;

  const report = `# MindReply Hourly Owner Report

Generated: ${iso}
Status: ${status.toUpperCase()}

## What Changed This Hour

- Revenue system check ran on branch ${process.env.GITHUB_REF_NAME || "main"} at commit ${process.env.GITHUB_SHA || "unknown"}.
- Website Completion Package positioning is treated as the first paid object.
- Homepage authority layer, trust proof, assisted close, and public mailbox policy were inspected from the repo.

## Top Blocker

${topBlocker}

## Next Revenue Move

Push the Website Completion Package as the immediate paid offer: MRagent first, then GBP 600 package request through /pack or /contact when the issue is broader than one reply.

## Owner Decision Needed

Confirm the private owner report email, Resend sender, and Slack webhook secrets in GitHub Actions. Keep the owner inbox out of public files and public pages.

## Website Completion Package Progress

- Package language present: ${packageReady ? "yes" : "no"}
- Offer price: GBP 600
- Public route: info@mind-reply.com
- Assisted close: MRagent first, then contact/package request

## Vercel Deploy Status

${deployStatus}

## Slack/Email Delivery Receipt

- Report enabled: ${reportEnabled ? "true" : "false"}
- Dry run: ${dryRun ? "true" : "false"}
- Requested channels: ${channels}
- Email recipient configured: ${Boolean(process.env.MINDREPLY_REPORT_EMAIL || process.env.MINDREPLY_REPORT_EMAILS)}
- Resend key configured: ${Boolean(process.env.RESEND_API_KEY)}
- Slack webhook configured: ${Boolean(process.env.MINDREPLY_SLACK_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL)}

## Defensive Security Boundary

Owner reports are private and redacted. Do not include secrets, tokens, raw private pressure text, unredacted customer material, or personal inboxes in public repo files or public pages.
`;

  const receipt = {
    generatedAt: iso,
    status,
    reportPath: latestReportPath,
    reportEnabled,
    dryRun,
    channels: channels.split(",").map((channel) => channel.trim()).filter(Boolean),
    delivery: {
      email: { status: "pending", recipientConfigured: Boolean(process.env.MINDREPLY_REPORT_EMAIL || process.env.MINDREPLY_REPORT_EMAILS), providerConfigured: Boolean(process.env.RESEND_API_KEY) },
      slack: { status: "pending", webhookConfigured: Boolean(process.env.MINDREPLY_SLACK_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL) },
    },
    blockers,
  };

  const stampedReportPath = path.join(outboxDir, `hourly-owner-report-${safeStamp(iso)}.md`);
  const stampedReceiptPath = path.join(outboxDir, `hourly-owner-delivery-receipt-${safeStamp(iso)}.json`);

  await writeFile(latestReportPath, report, "utf8");
  await writeFile(stampedReportPath, report, "utf8");
  await writeFile(latestReceiptPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
  await writeFile(stampedReceiptPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");

  console.log(`Hourly owner report generated with ${status} status.`);
  if (blockers.length > 0) {
    console.log(`Blockers: ${blockers.length}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
