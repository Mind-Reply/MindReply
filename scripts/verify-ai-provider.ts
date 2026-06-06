import assert from "node:assert/strict";
import { productionRequirements } from "../lib/production-requirements";
import { isOpenAIConfigured } from "../lib/azure-openai";

const aiRequirement = productionRequirements.find((item) => item.healthCheck === "azureOpenAI");
assert.ok(aiRequirement);
assert.match(aiRequirement.service, /AI Provider/i);
assert.deepEqual(aiRequirement.alternativeKeyGroups, [
  ["AZURE_OPENAI_ENDPOINT", "AZURE_OPENAI_API_KEY", "AZURE_OPENAI_DEPLOYMENT", "AZURE_OPENAI_API_VERSION"],
  ["OPENAI_API_KEY"],
]);

const originalOpenAIKey = process.env.OPENAI_API_KEY;
delete process.env.OPENAI_API_KEY;
assert.equal(isOpenAIConfigured(), false);

process.env.OPENAI_API_KEY = "test-openai-key";
assert.equal(isOpenAIConfigured(), true);

if (originalOpenAIKey === undefined) {
  delete process.env.OPENAI_API_KEY;
} else {
  process.env.OPENAI_API_KEY = originalOpenAIKey;
}

console.log("AI provider checks passed.");

export {};
