import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const packagePagePath = join(process.cwd(), "app/website-completion-package/page.tsx");
assert(existsSync(packagePagePath), "Website Completion Package page must exist.");

const packagePage = readFileSync(packagePagePath, "utf-8");

for (const expected of [
  "Sample delivery receipt",
  "This is the proof object, not a vague strategy note.",
  "actionKind",
  "website-completion",
  "riskLevel",
  "low-to-medium, depending on claims and sensitive context",
  "confidence",
  "medium until the owner accepts scope and payment route",
  "rawContentRedacted",
  "true",
  "inputHash",
  "present; raw text absent",
  "ownerDecisionNeeded",
  "confirm scope, route invoice or payment link, approve the next close-ready move",
  "Assisted-close assets",
  "DM 1",
  "DM 5",
  "Cold email set",
  "Three emails for buyers who need proof before a call.",
  "Your page is explaining more than it is closing",
  "One focused rescue pass for the buying path",
  "A faster way to make the offer inspectable",
  "Two follow-ups",
  "Follow-up 1",
  "Follow-up 2",
  "Booking page line",
  "Objection handling",
  "We do not need a redesign.",
  "We are not ready to share sensitive details.",
  "Why pay before seeing the work?",
  "Is this for startups or service businesses?",
]) {
  assert(packagePage.includes(expected), `Package delivery proof must include: ${expected}`);
}

assert(!/ANGELLLKR@GMAIL\.COM|angelllkr@gmail\.com/i.test(packagePage), "Package page must not expose personal Gmail.");

console.log("Website Completion Package delivery proof verification passed.");
