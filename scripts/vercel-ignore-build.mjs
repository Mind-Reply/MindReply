const allowedProductionHosts = new Set([
  "www.mind-reply.com",
  "mind-reply.com",
  "mind-reply-angellllkr-engs-projects.vercel.app",
  "mind-reply-git-main-angellllkr-engs-projects.vercel.app",
]);

function normalizeHost(value = "") {
  return value.replace(/^https?:\/\//i, "").replace(/\/$/, "").toLowerCase();
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
      VERCEL_PROJECT_PRODUCTION_URL: "mind-reply-angellllkr-engs-projects.vercel.app",
    }).build === true,
    "Canonical production project must build.",
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
