import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { forbiddenPublicTerms, redirectedPublicPaths } from "../lib/decision-layer";

const root = process.cwd();
const publicFiles = [
  "app/page.tsx",
  "app/agent/page.tsx",
  "app/privacy/page.tsx",
  "app/layout.tsx",
  "components/MRAgentChat.tsx",
  "components/DecisionIntake.tsx",
  "site/index.html",
  "site/seo/meta.yml",
  "docs/vision_dictionary.md",
  "docs/privacy_whitepaper_intro.md",
];

const subAgentFiles = [
  "docs/ops/subagents/README.md",
  "docs/ops/subagents/01-infrastructure-agent.md",
  "docs/ops/subagents/02-devops-agent.md",
  "docs/ops/subagents/03-security-agent.md",
  "docs/ops/subagents/04-frontend-agent.md",
  "docs/ops/subagents/05-mragent-agent.md",
  "docs/ops/subagents/06-integration-agent.md",
  "docs/ops/subagents/07-revenue-agent.md",
  "docs/ops/subagents/08-product-design-agent.md",
];

const requiredFiles = [
  ".circleci/config.yml",
  ".github/workflows/angel-pack-report.yml",
  ".vercelignore",
  "app/api/agent/route.ts",
  "app/api/health/route.ts",
  "app/api/intake/route.ts",
  "app/mcp/route.ts",
  "lib/decision-layer.ts",
  "lib/mragent.ts",
  "lib/mragent-mcp.ts",
  "src/agents/prompts.md",
  "src/chatgpt-app/mragent-tools.json",
  "chatgpt-app-submission.json",
  "scripts/angel-pack-report.ts",
  "scripts/launch-readiness-report.ts",
  "scripts/verify-playbooks.ts",
  "scripts/vercel-ignore-build.mjs",
  "docs/ops/8-workstream-agent-map.md",
  "docs/ops/azure-vm-infrastructure-plan.md",
  "docs/ops/slack-email-reporting.md",
  "docs/ops/vercel-deployment-limit-runbook.md",
  ...subAgentFiles,
];

function visibleSource(value: string) {
  return value
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      return !trimmed.startsWith("import ") && !trimmed.startsWith("export const metadata") && !trimmed.startsWith("description:");
    })
    .join("\n");
}

function forbiddenHits(file: string) {
  const fullPath = join(root, file);
  if (!existsSync(fullPath)) return [`missing:${file}`];
  const source = visibleSource(readFileSync(fullPath, "utf-8"));
  return forbiddenPublicTerms.flatMap((term) => {
    const pattern = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    return pattern.test(source) ? [`${file}:${term}`] : [];
  });
}

function statusLine(ok: boolean) {
  return ok ? "OK" : "NEEDS ATTENTION";
}

const missingRequired = requiredFiles.filter((file) => !existsSync(join(root, file)));
const publicLeakHits = publicFiles.flatMap(forbiddenHits);
const playbookDir = join(root, "playbooks", "seed");
const playbookCount = existsSync(playbookDir) ? readdirSync(playbookDir).filter((file) => file.endsWith(".json")).length : 0;
const playbookVerifierPresent = existsSync(join(root, "scripts", "verify-playbooks.ts"));
const launchReadinessReportPresent = existsSync(join(root, "scripts", "launch-readiness-report.ts"));
const redirectedRouteCount = redirectedPublicPaths.length;
const providerBlocks = [
  "Vercel build/deployment limits are account-side and require dashboard billing/quota action before blocked builds can resume.",
  "The Vercel ignored-build guard is configured to reduce stale preview build usage, not to bypass active account limits.",
  "The Vercel upload ignore file keeps support artifacts out of runtime deployments, reducing wasted transfer and build context.",
  "The launch readiness report is read-only; it proves preview, production, and health state without triggering deployments.",
  "The Angel Pack report can send to Slack/email only after report delivery is enabled and Slack/email secrets are configured.",
  "SLACK_APP_FIELD_ID can be stored as a GitHub variable for labeling, but it is not a credential and cannot send messages alone.",
  "OPENAI_API_KEY controls live MRagent model replies; fallback remains deterministic without it.",
  "BLOB_READ_WRITE_TOKEN controls receipt persistence; raw input remains redacted by default.",
  "Custom domain attachment must be verified in the active Vercel project dashboard.",
];

const report = [
  "# MindReply 23-Minute Ops Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Public surface: ${statusLine(publicLeakHits.length === 0)}`,
  publicLeakHits.length ? `Blocked terms or missing public files: ${publicLeakHits.join(", ")}` : "No blocked customer-facing terms found in monitored public files.",
  "",
  `Required files: ${statusLine(missingRequired.length === 0)}`,
  missingRequired.length ? `Missing: ${missingRequired.join(", ")}` : "All required launch and operating files are present.",
  "",
  `Sub-agent briefs: ${statusLine(subAgentFiles.every((file) => existsSync(join(root, file))))}`,
  `Playbooks: ${playbookCount} seed files found.`,
  `Playbook schema verifier: ${statusLine(playbookVerifierPresent)}.`,
  `Launch readiness report: ${statusLine(launchReadinessReportPresent)}.`,
  `Redirected legacy public routes: ${redirectedRouteCount}.`,
  "",
  "Provider-side blockers:",
  ...providerBlocks.map((item) => `- ${item}`),
  "",
  "Next action:",
  "- Run npm run launch:report for the current proof artifact, then clear or disconnect the stale duplicate Vercel status context before production promotion.",
].join("\n");

console.log(report);

if (publicLeakHits.length || missingRequired.length || playbookCount < 12 || !playbookVerifierPresent || !launchReadinessReportPresent) {
  process.exitCode = 1;
}
