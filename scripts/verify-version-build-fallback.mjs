import { readFileSync } from "node:fs";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const route = readFileSync("app/api/version/route.ts", "utf8");
const workflow = readFileSync(".github/workflows/manual-vercel-production.yml", "utf8");
const packageJson = readFileSync("package.json", "utf8");
const generator = readFileSync("scripts/write-version-build-metadata.mjs", "utf8");
const metadata = readFileSync("lib/build-metadata.ts", "utf8");

assert(route.includes('value("NEXT_PUBLIC_MINDREPLY_BUILD_COMMIT_SHA")'), "version route must read build commit fallback.");
assert(route.includes('value("NEXT_PUBLIC_MINDREPLY_BUILD_BRANCH")'), "version route must read build branch fallback.");
assert(route.includes('value("NEXT_PUBLIC_MINDREPLY_BUILD_ENVIRONMENT")'), "version route must read build environment fallback.");
assert(route.includes('value("NEXT_PUBLIC_MINDREPLY_PROJECT_PRODUCTION_URL")'), "version route must read project production URL fallback.");
assert(route.includes('buildMetadata.commitSha'), "version route must fall back to committed build metadata.");
assert(route.includes("metadataGeneratedAt"), "version route must expose metadata generation time.");

assert(packageJson.includes('"version:metadata"'), "package.json must expose the version metadata generator.");
assert(packageJson.includes('"prebuild": "npm run version:metadata"'), "npm build must generate fresh version metadata before Next.js builds.");
assert(generator.includes("gitCandidates"), "metadata generator must support multiple git executable candidates.");
assert(generator.includes("NEXT_PUBLIC_MINDREPLY_BUILD_COMMIT_SHA"), "metadata generator must read deploy-provided commit SHA.");
assert(generator.includes("NEXT_PUBLIC_MINDREPLY_BUILD_BRANCH"), "metadata generator must read deploy-provided branch.");
assert(generator.includes("rev-parse"), "metadata generator must read git commit fallback.");
assert(generator.includes("existingMetadata"), "metadata generator must preserve committed metadata when Git is unavailable.");
assert(generator.includes('"lib", "build-metadata.ts"'), "metadata generator must write lib/build-metadata.ts.");
assert(metadata.includes("commitSha"), "committed build metadata must include commitSha.");
assert(metadata.includes("projectProductionUrl"), "committed build metadata must include production URL.");

assert(workflow.includes("NEXT_PUBLIC_MINDREPLY_BUILD_COMMIT_SHA: ${{ github.sha }}"), "manual deploy must pass build commit SHA.");
assert(workflow.includes("NEXT_PUBLIC_MINDREPLY_BUILD_BRANCH: ${{ github.ref_name }}"), "manual deploy must pass build branch.");
assert(workflow.includes("NEXT_PUBLIC_MINDREPLY_BUILD_ENVIRONMENT: production"), "manual deploy must pass production environment.");
assert(workflow.includes("NEXT_PUBLIC_MINDREPLY_BUILD_URL: https://www.mind-reply.com"), "manual deploy must pass build URL.");
assert(workflow.includes("NEXT_PUBLIC_MINDREPLY_PROJECT_PRODUCTION_URL: https://www.mind-reply.com"), "manual deploy must pass production URL.");

console.log("Version build fallback verification passed.");
