import assert from "node:assert/strict";
import { analyzeCommunication, buildLocalAgentReply } from "../lib/agent-engine";

function assertSingleDecision(reply: string, expectedAction: "reply" | "schedule" | "resolve" | "escalate") {
  const lines = reply.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  assert.equal(lines.length, 2, `expected exactly two lines, got ${lines.length}: ${reply}`);
  assert.match(lines[0], /^Synthesis:/i);
  assert.match(lines[1], new RegExp(`^Recommended action:\\s*${expectedAction}\\b`, "i"));
  assert.doesNotMatch(reply, /\b(option|options|alternatives|choose from|AI|chatbot|automation tool|productivity app|viral|hype)\b/i);
}

const broadPrompt = "What is a good way to stop procrastinating before a client presentation?";
const broadAnalysis = analyzeCommunication(broadPrompt);
assert.equal(broadAnalysis.intent, "broad_question");
assert.equal(broadAnalysis.requiredAction, "resolve");
assert.equal(broadAnalysis.clarityFramework.length, 1);

const broadReply = buildLocalAgentReply(broadPrompt, broadAnalysis);
assertSingleDecision(broadReply, "resolve");
assert.match(broadReply, /one concrete action|first action/i);

const checkoutPrompt = "I need help buying credits and booking a video session";
const checkoutAnalysis = analyzeCommunication(checkoutPrompt);
assert.equal(checkoutAnalysis.intent, "booking_and_credits");
assert.equal(checkoutAnalysis.requiredAction, "schedule");

const checkoutReply = buildLocalAgentReply(checkoutPrompt, checkoutAnalysis);
assertSingleDecision(checkoutReply, "schedule");
assert.match(checkoutReply, /access|schedule|review/i);

const rescuePrompt = "I have a difficult client reply I keep avoiding and need it send-ready today";
const rescueAnalysis = analyzeCommunication(rescuePrompt);
assert.equal(rescueAnalysis.intent, "message_rescue");
assert.equal(rescueAnalysis.requiredAction, "reply");

const rescueReply = buildLocalAgentReply(rescuePrompt, rescueAnalysis);
assertSingleDecision(rescueReply, "reply");
assert.match(rescueReply, /reply is stuck|exact reply|calm response/i);

const planPrompt = "Which plan should I choose for daily work?";
const planAnalysis = analyzeCommunication(planPrompt);
assert.equal(planAnalysis.intent, "membership_upgrade");
assert.equal(planAnalysis.requiredAction, "resolve");

const planReply = buildLocalAgentReply(planPrompt, planAnalysis);
assertSingleDecision(planReply, "resolve");
assert.match(planReply, /repeated decision|access level|daily/i);

console.log("MRagent single-action decision checks passed.");

export {};
