type Provider = "azure-openai" | "openai" | "qwen" | "codex";

const PROVIDER = (process.env.LLM_PROVIDER as Provider | undefined) ?? "azure-openai";

export type ToolKind =
  | "text-refiner"
  | "email-polisher"
  | "tone-adjuster"
  | "shortener"
  | "expander"
  | "professional-rewrite"
  | "clarity-booster";

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

  if (params.tool === "professional-rewrite") {
    return `Professional rewrite: ${text}`;
  }

  if (params.tool === "clarity-booster") {
    return `Clear version: ${text}`;
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
