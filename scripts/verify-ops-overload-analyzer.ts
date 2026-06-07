import assert from "node:assert/strict";
import { runTool } from "../lib/tool-engine";

const providerEnv = [
  "AZURE_OPENAI_ENDPOINT",
  "AZURE_OPENAI_API_KEY",
  "AZURE_OPENAI_DEPLOYMENT",
  "AZURE_OPENAI_API_VERSION",
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "OPENROUTER_API_KEY",
  "GROQ_API_KEY",
  "BLACKBOX_API_KEY",
  "BLACKBOX_CHAT_ENDPOINT",
] as const;

const originalEnv = Object.fromEntries(providerEnv.map((key) => [key, process.env[key]]));
for (const key of providerEnv) delete process.env[key];

async function main() {
  const result = await runTool("ops-overload-analyzer", {
    text: [
      "Client needs approval today before the project deadline slips.",
      "Slack thread is blocked because nobody owns the next action.",
      "Ops inbox has five follow-ups that need a response by tomorrow.",
    ].join("\n\n"),
  });

  assert.equal(result.tool, "ops-overload-analyzer");
  assert.match(result.result, /Immediate overload diagnosis/i);
  assert.match(result.result, /What is costing time/i);
  assert.match(result.result, /Action queue/i);
  assert.match(result.result, /Next 24-hour operating move/i);
  assert.match(result.result, /Send-ready response/i);
  assert.match(result.result, /Upgrade trigger/i);
  assert.match(result.result, /2\+ hours daily/i);
  assert.match(result.suggestions.join(" "), /10 items/i);
}

async function run() {
  try {
    await main();
  } finally {
    for (const key of providerEnv) {
      const value = originalEnv[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }

  console.log("Ops overload analyzer checks passed.");
}

void run();

export {};
