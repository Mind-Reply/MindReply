import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
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
  const redPrefixes = [
    "Missing required route",
    "Missing required workflow",
    "Missing owner goal prompt",
    "Missing assisted-close helper",
    "Missing package request form component",
  ];
  if (blockers.some((blocker) => redPrefixes.some((prefix) => blocker.startsWith(prefix)))) return "red";
  if (blockers.length > 0) return "amber";
  return "green";
}

function configured(...names: string[]) {
  return names.some((name) => Boolean(process.env[name]));
}

const slackSecretPatterns = [
  /join\.slack\.com/i,
  /slack\.com\/join/i,
  /slack\.com\/invite/i,
  /shareDM\/zt-/i,
  /hooks\.slack\.com\/services/i,
  /xox[baprs]-[A-Za-z0-9-]+/i,
];

const scanSkipDirs = new Set([".git", ".next", "node_modules", "reports", ".vercel"]);
const scanTextExts = new Set([".md", ".ts", ".tsx", ".js", ".mjs", ".json", ".yml", ".yaml", ".txt"]);

async function scanForSlackSecrets(dir = root): Promise<string[]> {
  const matches: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (scanSkipDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(root, fullPath).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      matches.push(...(await scanForSlackSecrets(fullPath)));
      continue;
    }

    if (!entry.isFile() || !scanTextExts.has(path.extname(entry.name).toLowerCase())) continue;
    const content = await readFile(fullPath, "utf8").catch(() => "");
    if (slackSecretPatterns.some((pattern) => pattern.test(content))) matches.push(relativePath);
  }

  return matches;
}

async function main() {
  const iso = nowIso();
  await mkdir(outboxDir, { recursive: true });

  const [
    homePage,
    packPage,
    contactPage,
    canonicalPackagePage,
    pricingPage,
    workflow,
    prompt,
    packageApi,
    packageHelper,
    packageForm,
    healthApi,
  ] = await Promise.all([
    readOptional(path.join(root, "app", "page.tsx")),
    readOptional(path.join(root, "app", "pack", "page.tsx")),
    readOptional(path.join(root, "app", "contact", "page.tsx")),
    readOptional(path.join(root, "app", "website-completion-package", "page.tsx")),
    readOptional(path.join(root, "app", "pricing", "page.tsx")),
    readOptional(path.join(root, ".github", "workflows", "hourly-owner-report.yml")),
    readOptional(path.join(root, "docs", "hourly_owner_goal_prompt.md")),
    readOptional(path.join(root, "app", "api", "package-request", "route.ts")),
    readOptional(path.join(root, "lib", "package-request.ts")),
    readOptional(path.join(root, "components", "PackageRequestForm.tsx")),
    readOptional(path.join(root, "app", "api", "health", "route.ts")),
  ]);

  const blockers: string[] = [];
  const paymentConfigured = configured("NEXT_PUBLIC_WEBSITE_COMPLETION_PACKAGE_PAYMENT_URL");
  const reportRecipientConfigured = configured("MINDREPLY_REPORT_EMAIL", "MINDREPLY_REPORT_EMAILS");
  const reportSenderConfigured = configured("MINDREPLY_REPORT_FROM");
  const reportProviderConfigured = configured("RESEND_API_KEY");
  const slackConfigured = configured("MINDREPLY_SLACK_WEBHOOK_URL", "SLACK_WEBHOOK_URL");
  const slackDmInviteAvailable = process.env.MINDREPLY_SLACK_DM_INVITE_AVAILABLE === "true";
  const packageRecipientConfigured = configured("MINDREPLY_PACKAGE_REQUEST_TO", "MINDREPLY_REPORT_EMAIL", "MINDREPLY_REPORT_EMAILS");
  const packageSenderConfigured = configured("MINDREPLY_PACKAGE_REQUEST_FROM", "MINDREPLY_REPORT_FROM");
  const packageProviderConfigured = reportProviderConfigured;
  const packageDryRun = process.env.MINDREPLY_PACKAGE_REQUEST_DRY_RUN === "true";
  const fallbackEmailActive = contactPage.includes("mailto:") || packageForm.includes("mailtoHref");
  const slackSecretMatches = await scanForSlackSecrets();
  const inviteUrlCommitted = slackSecretMatches.length > 0;

  if (!homePage) blockers.push("Missing required route: homepage.");
  if (!packPage) blockers.push("Missing required route: /pack.");
  if (!canonicalPackagePage) blockers.push("Missing required route: /website-completion-package.");
  if (!contactPage) blockers.push("Missing required route: /contact.");
  if (!pricingPage) blockers.push("Missing required route: /pricing.");
  if (!packageApi) blockers.push("Missing required route: /api/package-request.");
  if (!packageHelper) blockers.push("Missing assisted-close helper: lib/package-request.ts.");
  if (!packageForm) blockers.push("Missing package request form component.");
  if (!workflow) blockers.push("Missing required workflow: hourly owner report.");
  if (!prompt) blockers.push("Missing owner goal prompt.");
  if (!healthApi) blockers.push("Missing health route package request readiness.");
  if (!reportRecipientConfigured) blockers.push("Owner email secret is not configured.");
  if (!reportSenderConfigured) blockers.push("Report sender is not configured.");
  if (!reportProviderConfigured) blockers.push("RESEND_API_KEY is not configured; email delivery will be blocked.");
  if (!slackConfigured) blockers.push("Slack webhook secret is not configured; Slack delivery will be blocked.");
  if (!process.env.VERCEL_TOKEN) blockers.push("VERCEL_TOKEN is not configured; Vercel deploy status is limited to GitHub/Vercel environment context.");
  if (!paymentConfigured) blockers.push("Website Completion Package payment link is not configured; invoice request fallback remains active.");
  if (!packageRecipientConfigured) blockers.push("Package request recipient is not configured; assisted-close API will fall back.");
  if (!packageSenderConfigured) blockers.push("Package request sender is not configured; assisted-close API will fall back.");
  if (!packageProviderConfigured) blockers.push("Package request provider is not configured; assisted-close API delivery will fall back.");
  if (!fallbackEmailActive) blockers.push("Fallback email route is missing from the assisted close path.");

  const commercialPages = homePage + packPage + canonicalPackagePage + contactPage + pricingPage + packageForm;
  const packageReady = hasAll(commercialPages, [
    "Website Completion Package",
    "GBP 600",
    "info@mind-reply.com",
    "MRagent",
    "NEXT_PUBLIC_WEBSITE_COMPLETION_PACKAGE_PAYMENT_URL",
  ]);
  const assistedCloseReady = Boolean(
    packageApi.includes("deliverPackageRequest") &&
      packageApi.includes("fallback-required") &&
      packageHelper.includes("MINDREPLY_PACKAGE_REQUEST_TO") &&
      packageHelper.includes("MINDREPLY_PACKAGE_REQUEST_FROM") &&
      packageHelper.includes("RESEND_API_KEY") &&
      packageHelper.includes("rawContentRedacted") &&
      packageHelper.includes("inputHash") &&
      packageForm.includes("/api/package-request") &&
      packageForm.includes("Fallback email") &&
      healthApi.includes("/api/package-request"),
  );

  if (!packageReady) blockers.push("Website Completion Package language or payment fallback is incomplete across revenue routes.");
  if (!assistedCloseReady) blockers.push("Website Completion Package assisted-close API or receipt contract is incomplete.");

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
- Homepage relief promise, authority layer, trust proof, assisted close, pricing order, package request API, receipt contract, and payment route were inspected from the repo.

## Top Blocker

${topBlocker}

## Next Revenue Move

Push the Website Completion Package as the immediate paid offer: MRagent first, then GBP 600 payment, package request API, or invoice request when the issue is broader than one reply.

## Owner Decision Needed

Confirm the private owner report email, report sender, package request recipient, package request sender, Resend key, Slack webhook, and Website Completion Package payment URL in GitHub Actions/Vercel configuration. Keep the owner inbox out of public files and public pages.

## Website Completion Package Progress

- Package language present: ${packageReady ? "yes" : "no"}
- Offer price: GBP 600
- Public route: info@mind-reply.com
- Payment link configured: ${paymentConfigured ? "yes" : "no"}
- Invoice fallback active: ${fallbackEmailActive ? "yes" : "no"}
- Assisted close: MRagent first, then payment/package request/invoice/contact route

## Assisted Close / Package Request

- Contact form present: ${packageForm ? "yes" : "no"}
- API route present: ${packageApi ? "yes" : "no"}
- Redacted receipt contract present: ${assistedCloseReady ? "yes" : "no"}
- Recipient configured: ${packageRecipientConfigured ? "yes" : "no"}
- Sender configured: ${packageSenderConfigured ? "yes" : "no"}
- Resend configured: ${packageProviderConfigured ? "yes" : "no"}
- Dry run: ${packageDryRun ? "true" : "false"}
- Fallback email active: ${fallbackEmailActive ? "yes" : "no"}

## Vercel Deploy Status

${deployStatus}

## Slack/Email Delivery Receipt

- Report enabled: ${reportEnabled ? "true" : "false"}
- Dry run: ${dryRun ? "true" : "false"}
- Requested channels: ${channels}
- Email recipient configured: ${reportRecipientConfigured}
- Report sender configured: ${reportSenderConfigured}
- Resend key configured: ${reportProviderConfigured}
- Slack webhook configured: ${slackConfigured}
- Slack DM invite handoff available: ${slackDmInviteAvailable}
- Slack invite/webhook URL committed: ${inviteUrlCommitted ? "true" : "false"}

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
    paymentRoute: {
      configured: paymentConfigured,
      invoiceFallbackActive: fallbackEmailActive,
    },
    packageRequest: {
      apiPresent: Boolean(packageApi),
      helperPresent: Boolean(packageHelper),
      formPresent: Boolean(packageForm),
      healthCheckPresent: healthApi.includes("/api/package-request"),
      recipientConfigured: packageRecipientConfigured,
      senderConfigured: packageSenderConfigured,
      providerConfigured: packageProviderConfigured,
      dryRun: packageDryRun,
      fallbackEmailActive,
      receiptContractPresent: packageHelper.includes("rawContentRedacted") && packageHelper.includes("inputHash"),
    },
    delivery: {
      email: { status: "pending", recipientConfigured: reportRecipientConfigured, senderConfigured: reportSenderConfigured, providerConfigured: reportProviderConfigured },
      slack: {
        status: "pending",
        webhookConfigured: slackConfigured,
        dmInviteAvailable: slackDmInviteAvailable,
        inviteUrlCommitted,
        redactedMatchCount: slackSecretMatches.length,
      },
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
