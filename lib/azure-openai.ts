type AzureChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type AzureChatInput = {
  messages: AzureChatMessage[];
  temperature?: number;
  maxTokens?: number;
};

export type AIProviderSource = "azure-openai" | "openai";

type AzureChatChoice = {
  message?: {
    content?: string;
  };
};

type AzureChatResponse = {
  choices?: AzureChatChoice[];
};

export function isAzureOpenAIConfigured() {
  return Boolean(
    process.env.AZURE_OPENAI_ENDPOINT &&
    process.env.AZURE_OPENAI_API_KEY &&
    process.env.AZURE_OPENAI_DEPLOYMENT &&
    process.env.AZURE_OPENAI_API_VERSION,
  );
}

export function isOpenAIConfigured() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function isAIProviderConfigured() {
  return isAzureOpenAIConfigured() || isOpenAIConfigured();
}

export async function runAzureChatCompletion(input: AzureChatInput) {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION ?? "2024-02-15-preview";

  if (!endpoint || !apiKey || !deployment) return null;

  const url = `${endpoint.replace(/\/$/, "")}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      temperature: input.temperature ?? 0.35,
      max_tokens: input.maxTokens ?? 450,
      messages: input.messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`Azure OpenAI request failed with ${response.status}`);
  }

  const data = await response.json() as AzureChatResponse;
  const content = data.choices?.[0]?.message?.content?.trim();
  return content || null;
}

export async function runOpenAIChatCompletion(input: AzureChatInput) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  if (!apiKey) return null;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: input.temperature ?? 0.35,
      max_tokens: input.maxTokens ?? 450,
      messages: input.messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with ${response.status}`);
  }

  const data = await response.json() as AzureChatResponse;
  const content = data.choices?.[0]?.message?.content?.trim();
  return content || null;
}

export async function runConfiguredChatCompletion(input: AzureChatInput) {
  if (isAzureOpenAIConfigured()) {
    const content = await runAzureChatCompletion(input);
    return content ? { content, source: "azure-openai" as const } : null;
  }

  if (isOpenAIConfigured()) {
    const content = await runOpenAIChatCompletion(input);
    return content ? { content, source: "openai" as const } : null;
  }

  return null;
}
