import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const gitCandidates = [
  process.env.GIT_EXE,
  "git",
  "C:\\Users\\angel\\AppData\\Local\\GitHubDesktop\\app-3.5.12\\resources\\app\\git\\cmd\\git.exe",
].filter(Boolean);

function git(args, fallback = "") {
  for (const candidate of gitCandidates) {
    try {
      return execFileSync(candidate, args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    } catch {
      // Try the next candidate.
    }
  }
  return fallback;
}

const commitSha = process.env.GITHUB_SHA || process.env.VERCEL_GIT_COMMIT_SHA || git(["rev-parse", "HEAD"], "unknown");
const branch =
  process.env.GITHUB_REF_NAME ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  git(["rev-parse", "--abbrev-ref", "HEAD"], "main");

const metadata = {
  commitSha,
  branch,
  environment: process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_MINDREPLY_BUILD_ENVIRONMENT || "production",
  url: process.env.NEXT_PUBLIC_MINDREPLY_BUILD_URL || "https://www.mind-reply.com",
  projectProductionUrl: process.env.NEXT_PUBLIC_MINDREPLY_PROJECT_PRODUCTION_URL || "https://www.mind-reply.com",
  generatedAt: new Date().toISOString(),
};

const target = join(process.cwd(), "lib", "build-metadata.ts");
mkdirSync(dirname(target), { recursive: true });
writeFileSync(
  target,
  `export const buildMetadata = ${JSON.stringify(metadata, null, 2)} as const;\n`,
  "utf8",
);

console.log(`Wrote ${target} for ${metadata.commitSha.slice(0, 12)} on ${metadata.branch}.`);
