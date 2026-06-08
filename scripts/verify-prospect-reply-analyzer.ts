import { readFileSync } from "node:fs";
import { join } from "node:path";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function readProjectFile(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

const toolsPagePath = "app/tools/page.tsx";
const apiRoutePath = "app/api/tools/[slug]/route.ts";
const packagePath = "package.json";

const toolsPage = readProjectFile(toolsPagePath);
const apiRoute = readProjectFile(apiRoutePath);
const packageJson = readProjectFile(packagePath);

assert(/"prospect:verify"\s*:\s*"tsx scripts\/verify-prospect-reply-analyzer\.ts"/.test(packageJson), "package.json must expose npm run prospect:verify.");
assert(/useState<ToolSlug>\("prospect-reply-analyzer"\)/.test(toolsPage), "/tools must default to Prospect Reply Analyzer.");
assert(/const TOOLS:[\s\S]*id:\s*"prospect-reply-analyzer"[\s\S]*id:\s*"ops-overload-analyzer"/.test(toolsPage), "Prospect Reply Analyzer must be the first tool before Ops Overload Analyzer.");
assert(/Recover stalled replies before they go cold/.test(toolsPage), "/tools hero must lead with revenue recovery copy.");
assert(/Recover the next 10 replies/.test(toolsPage), "The prospect analyzer result panel must push the next 10 replies upgrade moment.");

assert(/function runProspectReplyAnalyzer/.test(apiRoute), "API route must have a dedicated prospect analyzer response path.");
assert(/slug === "prospect-reply-analyzer"[\s\S]*runProspectReplyAnalyzer\(text\)/.test(apiRoute), "Prospect analyzer API calls must be intercepted before generic tool execution.");
assert(apiRoute.indexOf("runProspectReplyAnalyzer(text)") < apiRoute.indexOf("runTool(slug"), "Prospect analyzer must run before runTool fallback.");

for (const label of [
  "Why they did not convert:",
  "Where friction exists:",
  "Where trust breaks:",
  "Rewritten messaging:",
  "Rewritten offer:",
  "Rewritten closing:",
  "Minimum 30% close-rate improvement rationale:",
]) {
  assert(apiRoute.includes(label), `Prospect analyzer output is missing section: ${label}`);
}

for (const forbidden of ["MOA agent routing", "Growth Agent:", "AI Content Agent:", "Support Agent:", "Business Agent:", "Security Agent:"]) {
  assert(!apiRoute.includes(forbidden), `Public prospect analyzer route must not expose internal agent language: ${forbidden}`);
}

console.log("Prospect Reply Analyzer verification passed.");
