type Provider = "azure-openai" | "openai" | "qwen" | "codex";

const PROVIDER = (process.env.LLM_PROVIDER as Provider | undefined) ?? "azure-openai";

export type ToolKind =
  | "text-refiner"
  | "email-polisher"
  | "call-scripter"
  | "planning-assistant"
  | "correction-engine"
  | "teaching-optimizer"
  | "lexicon-refiner"
  | "tone-adjuster"
  | "tone-calibrator"
  | "shortener"
  | "expander"
  | "professional-rewrite"
  | "clarity-booster"
  | "structure-architect"
  | "cultural-adapter";

export type LlmParams = {
  tool: ToolKind;
  input: string;
  extra?: Record<string, unknown>;
};

const SYSTEM_PROMPT = [
  "You are MR-Core, the autonomous system brain of the MindReply ecosystem.",
  "Transform text according to the selected micro-tool.",
  "Return only the transformed text, without explanations.",
].join(" ");

function buildUserPrompt(params: LlmParams): string {
  const tone = typeof params.extra?.tone === "string" ? params.extra.tone : "premium, calm, high-status";
  const length = typeof params.extra?.length === "string" ? params.extra.length : "natural";

  return [`Tool: ${params.tool}`, `Tone: ${tone}`, `Length: ${length}`, "", "Input:", params.input].join("\n");
}

function deterministicTransform(params: LlmParams): string {
  const text = params.input.trim();
  if (!text) return "";

  if (params.tool === "shortener") {
    return text.split(/\s+/).slice(0, 36).join(" ") + (text.split(/\s+/).length > 36 ? "." : "");
  }

  if (params.tool === "expander") {
    return `${text}\n\nExpanded framing: the message is clearer when it states the intended outcome, the relevant context, and the next decision required.`;
  }

  if (params.tool === "email-polisher") {
    return `Hello,\n\n${text}\n\nBest regards,`;
  }

  if (params.tool === "tone-adjuster") {
    return `Calm, direct version: ${text}`;
  }

  if (params.tool === "tone-calibrator") {
    return `Calibrated tone version: ${text}\n\nTone note: keep warmth in the opening, authority in the request, and precision in the close.`;
  }

  if (params.tool === "call-scripter") {
    return `Opening: Thank you for making time today.\n\nObjective: ${text}\n\nDiscovery: What outcome would make this conversation useful for you?\n\nClose: Shall we confirm the next action and date now?`;
  }

  if (params.tool === "planning-assistant") {
    return `Objective: ${text}\n\n1. Define the result.\n2. Identify owner and stakeholders.\n3. Set three milestones.\n4. Confirm communication cadence.\n5. Review weekly.`;
  }

  if (params.tool === "correction-engine") {
    return `Corrected version: ${text}\n\nCorrection notes: remove weak qualifiers, clarify the owner, and state the next action.`;
  }

  if (params.tool === "teaching-optimizer") {
    return `Learning objective: ${text}\n\nTeach it by stating the principle, showing the step, asking for application, and confirming what changed.`;
  }

  if (params.tool === "lexicon-refiner") {
    return `Professional lexicon version: ${text}\n\nVocabulary note: use evidence, constraints, ownership, risk, and measurable outcomes.`;
  }

  if (params.tool === "professional-rewrite") {
    return `Professional rewrite: ${text}`;
  }

  if (params.tool === "clarity-booster") {
    return `Clear version: ${text}`;
  }

  if (params.tool === "structure-architect") {
    return `Executive structure:\n\n1. Context: ${text}\n2. Decision: state the choice or approval needed.\n3. Evidence: add the strongest reason.\n4. Close: confirm owner, action, and deadline.`;
  }

  if (params.tool === "cultural-adapter") {
    return `Cross-cultural adaptation: ${text}\n\nLead with respect and context, then make the request clear without unnecessary pressure.`;
  }

  return `Refined version: ${text}`;
}

async function requestJson(url: string, init: RequestInit) {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`LLM provider returned ${response.status}`);
  }
  return response.json() as Promise<any>;
}

async function runAzureOpenAI(prompt: string): Promise<string | null> {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY ?? process.env.AZURE_OPENAI_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION ?? "2024-02-15-preview";

  if (!endpoint || !apiKey || !deployment) return null;

  const url = `${endpoint.replace(/\/$/, "")}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
  const data = await requestJson(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": apiKey },
    body: JSON.stringify({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    }),
  });

  return data.choices?.[0]?.message?.content?.trim() ?? null;
}

async function runOpenAI(prompt: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  if (!apiKey) return null;

  const data = await requestJson("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    }),
  });

  return data.choices?.[0]?.message?.content?.trim() ?? null;
}

async function runQwen(prompt: string): Promise<string | null> {
  const endpoint = process.env.QWEN_ENDPOINT;
  const apiKey = process.env.QWEN_API_KEY;
  const model = process.env.QWEN_MODEL ?? "qwen-plus";
  if (!endpoint || !apiKey) return null;

  const data = await requestJson(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    }),
  });

  return data.choices?.[0]?.message?.content?.trim() ?? null;
}

export async function runLlm(params: LlmParams): Promise<string> {
  const prompt = buildUserPrompt(params);

  try {
    const providerResult =
      PROVIDER === "openai"
        ? await runOpenAI(prompt)
        : PROVIDER === "qwen"
          ? await runQwen(prompt)
          : await runAzureOpenAI(prompt);

    return providerResult ?? deterministicTransform(params);
  } catch {
    return deterministicTransform(params);
  }
}
