// Plan C - AI Gateway (single entrypoint for model usage)

export type AIRequest = {
  prompt: string;
  model?: string;
  context?: Record<string, any>;
};

export type AIResponse = {
  result: string;
  model: string;
  timestamp: string;
};

export async function runAI(req: AIRequest): Promise<AIResponse> {
  const model = req.model || "gpt-4.1-mini";

  // NOTE: API key must come from environment variables only
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  // Placeholder safe execution layer (no direct SDK binding assumed)
  const timestamp = new Date().toISOString();

  return {
    result: `Processed: ${req.prompt}`,
    model,
    timestamp
  };
}
