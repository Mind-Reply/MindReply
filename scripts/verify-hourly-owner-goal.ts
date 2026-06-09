import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

function readRequired(relativePath: string) {
  const filePath = path.join(root, relativePath);
  if (!existsSync(filePath)) throw new Error(`Missing required file: ${relativePath}`);
  return readFileSync(filePath, "utf8");
}

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

const prompt = readRequired("docs/hourly_owner_goal_prompt.md");
const home = readRequired("app/page.tsx");
const pack = readRequired("app/pack/page.tsx");
const contact = readRequired("app/contact/page.tsx");

const publicPages = [home, pack, contact].join("\n");
const operatingContract = prompt.toLowerCase();

for (const phrase of [
  "stop builder thinking",
  "revenue system thinking",
  "Website Completion Package",
  "GBP 600",
  "authority",
  "trust proof",
  "assisted close",
  "defensive security boundary",
]) {
  assert((prompt + publicPages).toLowerCase().includes(phrase.toLowerCase()), `Missing revenue-first phrase: ${phrase}`);
}

assert(home.includes("Website Completion Package"), "Homepage must name the Website Completion Package.");
assert(home.includes("GBP 600"), "Homepage must show the GBP 600 paid package.");
assert(home.includes("Buy the Website Package") || home.includes("Request package"), "Homepage must include a package CTA.");
assert(home.includes("info@mind-reply.com"), "Homepage must use the public MindReply mailbox.");

assert(pack.includes("Website Completion Package"), "/pack must sell the Website Completion Package.");
assert(pack.includes("Revenue truth"), "/pack must keep revenue claims evidence-bound.");
assert(pack.includes("GBP 600"), "/pack must show the GBP 600 total.");

assert(contact.includes("Ask MRagent first"), "/contact must preserve MRagent-first support.");
assert(contact.includes("Security owner route"), "/contact must include owner/security routing language.");
assert(contact.includes("info@mind-reply.com"), "/contact must use the public MindReply mailbox.");

assert(!/gmail\.com/i.test(publicPages), "Public pages must not expose personal Gmail addresses.");
assert(!/57 active staff/i.test(publicPages), "Public pages must not claim 57 active staff.");
assert(operatingContract.includes("reports are owner-only and redacted"), "Prompt must keep reports owner-only and redacted.");

console.log("Revenue-first owner goal verified.");
