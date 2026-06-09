import { execSync } from "node:child_process";

const canonicalProjectId = process.env.MR_CANONICAL_VERCEL_PROJECT_ID || "prj_EuO1lFvbwoFSdDxBlezNyXG8eVV3";

const automationOnlyPrefixes = [
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
]);

const reportingOnlyScriptFiles = new Set([
  "scripts/mragent-monitor-report.mjs",
  "scripts/mragent-growth-pulse.mjs",
  "scripts/mragent-short-digest.mjs",
  "scripts/production-domain-incident.mjs",
  "scripts/verify-live-revenue-surface.mjs",
]);

function parseChangedFiles(value) {
  return value.split("\n").map((file) => file.trim()).filter(Boolean);
}

function changedFilesFromGit() {
  try {
    const output = execSync("git diff-tree --no-commit-id --name-only -r --root HEAD", {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return parseChangedFiles(output);
  } catch {
    return [];
  }
}

function changedFiles(env = process.env, gitReader = changedFilesFromGit) {
  if (env.MRAGENT_CHANGED_FILES) return parseChangedFiles(env.MRAGENT_CHANGED_FILES);
  return gitReader();
}

function isAutomationOnly(file) {
  return automationOnlyFiles.has(file) || reportingOnlyScriptFiles.has(file) || automationOnlyPrefixes.some((prefix) => file.startsWith(prefix));
}

export function shouldBuild(env = process.env, gitReader = changedFilesFromGit) {
  const vercelEnv = env.VERCEL_ENV || "";
  const commitRef = env.VERCEL_GIT_COMMIT_REF || "";
  const projectId = env.VERCEL_PROJECT_ID || env.NEXT_PUBLIC_VERCEL_PROJECT_ID || "";
  const canonicalId = env.MR_CANONICAL_VERCEL_PROJECT_ID || canonicalProjectId;

  if (projectId && canonicalId && projectId !== canonicalId) {
    return { build: false, reason: `Skipping non-canonical Vercel project ${projectId}. Canonical project is ${canonicalId}.` };
  }

  if (vercelEnv !== "production") {
    return { build: false, reason: `Skipping ${vercelEnv || "unknown"} deployment.` };
  }

  if (commitRef !== "main") {
    return { build: false, reason: `Skipping non-main branch ${commitRef || "unknown"}.` };
  }

  const files = changedFiles(env, gitReader);
  if (files.length > 0 && files.every(isAutomationOnly)) {
    return { build: false, reason: `Skipping docs/report-only change: ${files.join(", ")}. Live verification/report changes must be skipped. Reporting-only script changes must be skipped.` };
  }

  return { build: true, reason: "Building MindReply production main deployment." };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function selfTest() {
  assert(
    shouldBuild({
      VERCEL_PROJECT_ID: "prj_other",
      VERCEL_ENV: "production",
      VERCEL_GIT_COMMIT_REF: "main",
    }).build === false,
    "Non-canonical Vercel projects must be skipped.",
  );
  assert(shouldBuild({ VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "main" }).build === false, "Preview deployments must be skipped.");
  assert(shouldBuild({ VERCEL_ENV: "production", VERCEL_GIT_COMMIT_REF: "feature" }).build === false, "Non-main production branches must be skipped.");
  assert(
    shouldBuild({
      VERCEL_ENV: "production",
      VERCEL_GIT_COMMIT_REF: "main",
      VERCEL_PROJECT_ID: canonicalProjectId,
      MRAGENT_CHANGED_FILES: "README.md\ndocs/front_end_operating_pack.md",
    }).build === false,
    "Docs-only changes must be skipped when explicitly provided.",
  );
  assert(
    shouldBuild(
      {
        VERCEL_ENV: "production",
        VERCEL_GIT_COMMIT_REF: "main",
        VERCEL_PROJECT_ID: canonicalProjectId,
      },
      () => ["docs/production_alias_secret_blocker_2026-06-09.md"],
    ).build === false,
    "Docs-only changes discovered from Git must be skipped.",
  );
  assert(
    shouldBuild({
      VERCEL_ENV: "production",
      VERCEL_GIT_COMMIT_REF: "main",
      VERCEL_PROJECT_ID: canonicalProjectId,
      MRAGENT_CHANGED_FILES: "scripts/mragent-monitor-report.mjs\nscripts/verify-live-revenue-surface.mjs",
    }).build === false,
    "Reporting-only script changes must be skipped.",
  );
  assert(
    shouldBuild({
      VERCEL_ENV: "production",
      VERCEL_GIT_COMMIT_REF: "main",
      VERCEL_PROJECT_ID: canonicalProjectId,
      MRAGENT_CHANGED_FILES: "app/page.tsx\ncomponents/LocaleAssist.tsx\napp/api/geo-locale/route.ts",
    }).build === true,
    "App, component, and API changes must build on the canonical project.",
  );
  assert(
    shouldBuild({
      VERCEL_ENV: "production",
      VERCEL_GIT_COMMIT_REF: "main",
      VERCEL_PROJECT_ID: canonicalProjectId,
    }, () => []).build === true,
    "Production main must build on the canonical project when change scope is unknown.",
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
