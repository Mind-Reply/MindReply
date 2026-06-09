import { execSync } from "node:child_process";

const allowedProductionHosts = new Set([
  "www.mind-reply.com",
  "mind-reply.com",
  "mind-reply.vercel.app",
  "mind-reply-angellllkr-engs-projects.vercel.app",
  "mind-reply-git-main-angellllkr-engs-projects.vercel.app",
  "mindreply.vercel.app",
  "mindreply-angellllkr-engs-projects.vercel.app",
  "mindreply-git-main-mr-64b2efc9.vercel.app",
  "mindreply-mr-64b2efc9.vercel.app",
  "mindreply-git-main-mr-64b2efc9.vercel.app",
]);

const automationOnlyPrefixes = [
  ".github/",
  "docs/",
  "reports/",
  "site/automation/",
  "site/design/",
  "site/media/",
];

const automationOnlyFiles = new Set([
  "ARCHITECTURE.md",
  "README.md",
  "SECURITY.md",
  "mindreply-delivery-receipt.json",
  "mindreply-launch-readiness.json",
  "mindreply-vercel-status-audit.json",
  "scripts/activation-pack-report.ts",
  "scripts/hourly-owner-report.ts",
  "scripts/mragent-monitor-report.mjs",
  "scripts/mragent-growth-pulse.mjs",
  "scripts/mragent-short-digest.mjs",
  "scripts/personal-pack-report.ts",
  "scripts/production-domain-incident.mjs",
  "scripts/promotion-pack-report.ts",
  "scripts/security-pack-report.ts",
  "scripts/send-hourly-owner-report.ts",
  "scripts/vercel-ignore-build.mjs",
  "scripts/verify-hourly-owner-goal.ts",
  "scripts/verify-hourly-owner-report.ts",
  "scripts/verify-live-revenue-surface.mjs",
  "scripts/verify-production-version-contract.ts",
]);

function normalizeHost(value = "") {
  return value.replace(/^https?:\/\//i, "").replace(/\/$/, "").toLowerCase();
}

function changedFiles(env = process.env) {
  if (env.MRAGENT_CHANGED_FILES) {
    return env.MRAGENT_CHANGED_FILES.split("\n").map((file) => file.trim()).filter(Boolean);
  }

  try {
    const previousSha = env.VERCEL_GIT_PREVIOUS_SHA || "HEAD~1";
    const output = execSync(`git diff --name-only ${previousSha} HEAD`, { encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] });
    return output.split("\n").map((file) => file.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function isAutomationOnly(file) {
  return automationOnlyFiles.has(file) || automationOnlyPrefixes.some((prefix) => file.startsWith(prefix));
}

function changeScope(env = process.env) {
  const files = changedFiles(env);
  if (files.length === 0) return { known: false, files, automationOnly: false };
  return { known: true, files, automationOnly: files.every(isAutomationOnly) };
}

export function shouldBuild(env = process.env) {
  const vercelEnv = env.VERCEL_ENV || "";
  const commitRef = env.VERCEL_GIT_COMMIT_REF || "";
  const productionHost = normalizeHost(env.VERCEL_PROJECT_PRODUCTION_URL || "");

  if (vercelEnv !== "production") {
    return { build: false, reason: `Skipping ${vercelEnv || "unknown"} deployment.` };
  }

  if (commitRef !== "main") {
    return { build: false, reason: `Skipping non-main branch ${commitRef || "unknown"}.` };
  }

  if (productionHost && !allowedProductionHosts.has(productionHost)) {
    return { build: false, reason: `Skipping duplicate Vercel project ${productionHost}.` };
  }

  const scope = changeScope(env);
  if (scope.known && scope.automationOnly) {
    return { build: false, reason: `Skipping docs/report-only change: ${scope.files.join(", ")}.` };
  }

  return { build: true, reason: "Building canonical MindReply production deployment." };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function selfTest() {
  assert(shouldBuild({ VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "main" }).build === false, "Preview deployments must be skipped.");
  assert(shouldBuild({ VERCEL_ENV: "production", VERCEL_GIT_COMMIT_REF: "feature" }).build === false, "Non-main production branches must be skipped.");
  assert(
    shouldBuild({
      VERCEL_ENV: "production",
      VERCEL_GIT_COMMIT_REF: "main",
      VERCEL_PROJECT_PRODUCTION_URL: "mind-reply-lox1-angellllkr-engs-projects.vercel.app",
    }).build === false,
    "Duplicate Vercel projects must be skipped.",
  );
  assert(
    shouldBuild({
      VERCEL_ENV: "production",
      VERCEL_GIT_COMMIT_REF: "main",
      VERCEL_PROJECT_PRODUCTION_URL: "mindreply-mr-64b2efc9.vercel.app",
      MRAGENT_CHANGED_FILES: "app/page.tsx\nsite/automation/report-schema.yml",
    }).build === true,
    "Canonical MindReply project host must be allowed to build app changes.",
  );
  assert(
    shouldBuild({
      VERCEL_ENV: "production",
      VERCEL_GIT_COMMIT_REF: "main",
      VERCEL_PROJECT_PRODUCTION_URL: "mindreply-git-main-mr-64b2efc9.vercel.app",
      MRAGENT_CHANGED_FILES: "app/contact/page.tsx\ncomponents/PackageRequestForm.tsx",
    }).build === true,
    "Canonical MindReply Git host must be allowed to build contact/package changes.",
  );
  assert(
    shouldBuild({
      VERCEL_ENV: "production",
      VERCEL_GIT_COMMIT_REF: "main",
      VERCEL_PROJECT_PRODUCTION_URL: "mindreply-angellllkr-engs-projects.vercel.app",
      MRAGENT_CHANGED_FILES: "site/automation/report-schema.yml\nscripts/mragent-monitor-report.mjs",
    }).build === false,
    "Automation-only changes must be skipped.",
  );
  assert(
    shouldBuild({
      VERCEL_ENV: "production",
      VERCEL_GIT_COMMIT_REF: "main",
      VERCEL_PROJECT_PRODUCTION_URL: "mindreply-angellllkr-engs-projects.vercel.app",
      MRAGENT_CHANGED_FILES: "README.md\nSECURITY.md\ndocs/front_end_operating_pack.md",
    }).build === false,
    "Docs-only changes must be skipped.",
  );
  assert(
    shouldBuild({
      VERCEL_ENV: "production",
      VERCEL_GIT_COMMIT_REF: "main",
      VERCEL_PROJECT_PRODUCTION_URL: "mindreply-angellllkr-engs-projects.vercel.app",
      MRAGENT_CHANGED_FILES: "scripts/activation-pack-report.ts\nscripts/security-pack-report.ts\nreports/owner.md",
    }).build === false,
    "Reporting-only script changes must be skipped.",
  );
  assert(
    shouldBuild({
      VERCEL_ENV: "production",
      VERCEL_GIT_COMMIT_REF: "main",
      VERCEL_PROJECT_PRODUCTION_URL: "mindreply-angellllkr-engs-projects.vercel.app",
      MRAGENT_CHANGED_FILES: "scripts/hourly-owner-report.ts\nscripts/send-hourly-owner-report.ts\.github/workflows/hourly-owner-report.yml",
    }).build === false,
    "Hourly owner report changes must be skipped.",
  );
  assert(
    shouldBuild({
      VERCEL_ENV: "production",
      VERCEL_GIT_COMMIT_REF: "main",
      VERCEL_PROJECT_PRODUCTION_URL: "mindreply-angellllkr-engs-projects.vercel.app",
      MRAGENT_CHANGED_FILES: "scripts/verify-live-revenue-surface.mjs\nscripts/send-hourly-owner-report.ts",
    }).build === false,
    "Live verification/report changes must be skipped.",
  );
  assert(
    shouldBuild({
      VERCEL_ENV: "production",
      VERCEL_GIT_COMMIT_REF: "main",
      VERCEL_PROJECT_PRODUCTION_URL: "mindreply-angellllkr-engs-projects.vercel.app",
      MRAGENT_CHANGED_FILES: "app/page.tsx\nsite/automation/report-schema.yml",
    }).build === true,
    "App changes must build.",
  );
  assert(
    shouldBuild({
      VERCEL_ENV: "production",
      VERCEL_GIT_COMMIT_REF: "main",
      VERCEL_PROJECT_PRODUCTION_URL: "mindreply-angellllkr-engs-projects.vercel.app",
    }).build === true,
    "Canonical production project must build when change scope is unknown.",
  );
  console.log("Vercel ignore-build guard verification passed.");
}

if (process.argv.includes("--self-test")) {
  selfTest();
} else {
  const result = shouldBuild();
  console.log(result.reason);
  process.exit(result.build ? 1 : 0);
}
