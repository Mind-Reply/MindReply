import axios from 'axios';

type Provider = 'azure-openai' | 'openai' | 'qwen' | 'codex';

const PROVIDER = (process.env.LLM_PROVIDER as Provider) || 'azure-openai';

type ToolKind =
  | 'text-refiner'
  | 'email-polisher'
  | 'tone-adjuster'
  | 'shortener'
  | 'expander'
  | 'professional-rewrite'
  | 'clarity-booster';

type LlmParams = {
  tool: ToolKind;
  input: string;
  extra?: Record<string, any>;
};

const SYSTEM_PROMPT = `
You are MR-Core, the autonomous system brain of the MindReply ecosystem.
You refine and transform text according to the requested micro-tool:

- text-refiner: Clean, sharpen, and clarify while preserving intent.
- email-polisher: Make it professional, concise, and clear.
- tone-adjuster: Adjust tone to premium, calm, high-status.
- shortener: Compress while preserving key meaning.
- expander: Elaborate with more depth and clarity.
- professional-rewrite: Rewrite to sound like a senior consultant.
- clarity-booster: Remove ambiguity and make structure obvious.

Always return ONLY the transformed text. No explanations.
`;

function buildUserPrompt(params: LlmParams): string {
  const { tool, input, extra } = params;
  const tone = extra?.tone ?? 'premium, calm, high-status';
  const length = extra?.length ?? 'natural';

  return [
    `Tool: ${tool}`,
    `Tone: ${tone}`,
    `Length: ${length}`,
    '',
    'Input:',
    input
  ].join('\n');
}

export async function runLlm(params: LlmParams): Promise<string> {
  const userPrompt = buildUserPrompt(params);

  switch (PROVIDER) {
    case 'azure-openai':
      return runAzureOpenAI(userPrompt);
    case 'openai':
      return runOpenAI(userPrompt);
    case 'qwen':
      return runQwen(userPrompt);
    case 'codex':
      return runCodex(userPrompt);
    default:
      return userPrompt;
  }
}

async function runAzureOpenAI(prompt: string): Promise<string> {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_KEY;
