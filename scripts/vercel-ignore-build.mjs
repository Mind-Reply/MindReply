#!/usr/bin/env node

const env = process.env.VERCEL_ENV || "";
const branch = process.env.VERCEL_GIT_COMMIT_REF || "";
const prId = process.env.VERCEL_GIT_PULL_REQUEST_ID || "";
const forceValue = process.env.MINDREPLY_FORCE_VERCEL_BUILD || process.env.VERCEL_FORCE_BUILD || "";
const forceBuild = /^(1|true|yes)$/i.test(forceValue);
const extraAllowedBranches = (process.env.MINDREPLY_VERCEL_BUILD_BRANCHES || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

const allowedBranches = new Set([
  "main",
  "codex/executive-nervous-system-main-sync",
  ...extraAllowedBranches,
]);

const allowedPrefixes = ["release/", "deploy/"];

function continueBuild(reason) {
  console.log(`Vercel ignored-build guard: continue build. ${reason}`);
  process.exit(1);
}

function skipBuild(reason) {
  console.log(`Vercel ignored-build guard: skip build. ${reason}`);
  process.exit(0);
}

if (forceBuild) {
  continueBuild("Force-build flag is set.");
}

if (!env || !branch) {
  continueBuild("Missing Vercel environment metadata; defaulting to build.");
}

if (env === "production") {
  continueBuild("Production deploys must always build.");
}

if (allowedBranches.has(branch) || allowedPrefixes.some((prefix) => branch.startsWith(prefix))) {
  continueBuild(`Allowed preview branch: ${branch}${prId ? ` (PR ${prId})` : ""}.`);
}

skipBuild(`Preview branch ${branch} is not in the active launch allowlist.`);
