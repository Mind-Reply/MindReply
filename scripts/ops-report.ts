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

const requiredFiles = [
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
  "scripts/vercel-ignore-build.mjs",
  "docs/ops/azure-vm-infrastructure-plan.md",
  "docs/ops/vercel-deployment-limit-runbook.md",
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
const redirectedRouteCount = redirectedPublicPaths.length;
const providerBlocks = [
  "Vercel build/deployment limits are account-side and require dashboard billing/quota action before blocked builds can resume.",
  "The Vercel ignored-build guard is configured to reduce stale preview build usage, not to bypass active account limits.",
  "The Vercel upload ignore file keeps support artifacts out of runtime deployments, reducing wasted transfer and build context.",
  "OPENAI_API_KEY controls live MRagent model replies; fallback remains deterministic without it.",
  "BLOB_READ_WRITE_TOKEN controls receipt persistence; raw input remains redacted by default.",
  "Custom domain attachment must be verified in the active Vercel project dashboard.",
];

const report = [
  "# MindReply 15-Minute Ops Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Public surface: ${statusLine(publicLeakHits.length === 0)}`,
  publicLeakHits.length ? `Blocked terms or missing public files: ${publicLeakHits.join(", ")}` : "No blocked customer-facing terms found in monitored public files.",
  "",
  `Required files: ${statusLine(missingRequired.length === 0)}`,
  missingRequired.length ? `Missing: ${missingRequired.join(", ")}` : "All required launch files are present.",
  "",
  `Playbooks: ${playbookCount} seed files found.`,
  `Redirected legacy public routes: ${redirectedRouteCount}.`,
  "",
  "Provider-side blockers:",
  ...providerBlocks.map((item) => `- ${item}`),
  "",
  "Next action:",
  "- Clear the Vercel dashboard build-rate-limit, redeploy PR #12, then verify /, /agent, /api/health, /api/intake, and /mcp.",
].join("\n");

console.log(report);

if (publicLeakHits.length || missingRequired.length || playbookCount < 12) {
  process.exitCode = 1;
}
