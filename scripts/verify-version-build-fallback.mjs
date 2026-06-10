import { readFileSync } from "node:fs";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const route = readFileSync("app/api/version/route.ts", "utf8");
const workflow = readFileSync(".github/workflows/manual-vercel-production.yml", "utf8");

assert(route.includes('value("NEXT_PUBLIC_MINDREPLY_BUILD_COMMIT_SHA")'), "version route must read build commit fallback.");
assert(route.includes('value("NEXT_PUBLIC_MINDREPLY_BUILD_BRANCH")'), "version route must read build branch fallback.");
assert(route.includes('value("NEXT_PUBLIC_MINDREPLY_BUILD_ENVIRONMENT")'), "version route must read build environment fallback.");
assert(route.includes('value("NEXT_PUBLIC_MINDREPLY_PROJECT_PRODUCTION_URL")'), "version route must read project production URL fallback.");

assert(workflow.includes("NEXT_PUBLIC_MINDREPLY_BUILD_COMMIT_SHA: ${{ github.sha }}"), "manual deploy must pass build commit SHA.");
assert(workflow.includes("NEXT_PUBLIC_MINDREPLY_BUILD_BRANCH: ${{ github.ref_name }}"), "manual deploy must pass build branch.");
assert(workflow.includes("NEXT_PUBLIC_MINDREPLY_BUILD_ENVIRONMENT: production"), "manual deploy must pass production environment.");
assert(workflow.includes("NEXT_PUBLIC_MINDREPLY_BUILD_URL: https://www.mind-reply.com"), "manual deploy must pass build URL.");
assert(workflow.includes("NEXT_PUBLIC_MINDREPLY_PROJECT_PRODUCTION_URL: https://www.mind-reply.com"), "manual deploy must pass production URL.");

console.log("Version build fallback verification passed.");
