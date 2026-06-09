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

function changedFiles(env = process.env) {
  if (!env.MRAGENT_CHANGED_FILES) return [];
  return env.MRAGENT_CHANGED_FILES.split("\n").map((file) => file.trim()).filter(Boolean);
}

function isAutomationOnly(file) {
  return automationOnlyFiles.has(file) || automationOnlyPrefixes.some((prefix) => file.startsWith(prefix));
}

export function shouldBuild(env = process.env) {
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

  const files = changedFiles(env);
  if (files.length > 0 && files.every(isAutomationOnly)) {
    return { build: false, reason: `Skipping docs/report-only change: ${files.join(", ")}.` };
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
    "Docs-only changes must be skipped.",
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
    }).build === true,
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
