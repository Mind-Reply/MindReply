import { logMetric } from "@/lib/metrics";

export type ToolSlug =
  | "text-refiner"
  | "email-polisher"
  | "tone-adjuster"
  | "shortener"
  | "expander"
  | "professional-rewrite"
  | "clarity-booster";

export type ToolResult = {
  tool: ToolSlug;
  name: string;
  creditCost: number;
  result: string;
  originalText: string;
  suggestions: string[];
  analysis: {
    clarity: number;
    authority: number;
    warmth: number;
    brevity: number;
  };
  metricLogged: boolean;
};

export const toolCatalog: Record<ToolSlug, { name: string; creditCost: number; description: string; action: string }> = {
  "text-refiner": {
    name: "Text Refiner",
    creditCost: 1,
    description: "Refine casual or imprecise text into polished professional language.",
    action: "Refine Text",
  },
  "email-polisher": {
    name: "Email Polisher",
    creditCost: 2,
    description: "Transform draft emails into executive-grade correspondence.",
    action: "Polish Email",
  },
  "tone-adjuster": {
    name: "Tone Adjuster",
    creditCost: 1,
    description: "Shift a message into a precise communication register.",
    action: "Adjust Tone",
  },
  shortener: {
    name: "Shortener",
    creditCost: 1,
    description: "Compress a message while preserving intent and professional tone.",
    action: "Shorten Text",
  },
  expander: {
    name: "Expander",
    creditCost: 1,
    description: "Expand terse notes into complete, composed communication.",
    action: "Expand Text",
  },
  "professional-rewrite": {
    name: "Professional Rewrite",
    creditCost: 2,
    description: "Rewrite informal text for high-trust professional settings.",
    action: "Rewrite Text",
  },
  "clarity-booster": {
    name: "Clarity Booster",
    creditCost: 1,
    description: "Remove ambiguity and strengthen the next action.",
    action: "Boost Clarity",
  },
};

const toneDescriptors: Record<string, string> = {
  professional: "formal, composed, and precise",
  warm: "approachable, respectful, and human",
  assertive: "direct, confident, and outcome-led",
  empathetic: "sensitive, validating, and steady",
  concise: "brief, clear, and low-friction",
  diplomatic: "balanced, tactful, and relationship-aware",
};

function normalize(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

function sentenceCase(text: string) {
  const cleaned = normalize(text);
  if (!cleaned) return cleaned;
  const withCapital = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return /[.!?]$/.test(withCapital) ? withCapital : `${withCapital}.`;
}

function score(text: string, result: string) {
  const wordCount = result.split(/\s+/).filter(Boolean).length;
  const hasAction = /\b(confirm|send|review|decide|schedule|reply|approve|share)\b/i.test(result);
  const hasWeakener = /\bjust|maybe|perhaps|kind of|sort of|I think\b/i.test(result);

  return {
    clarity: Math.min(98, 78 + (hasAction ? 12 : 5) + (result.length < text.length * 1.15 ? 4 : 0)),
    authority: Math.min(97, 76 + (hasWeakener ? 2 : 13)),
    warmth: Math.min(96, 78 + (/\bthank|appreciate|understand\b/i.test(result) ? 10 : 4)),
    brevity: Math.max(62, Math.min(98, 100 - Math.max(0, wordCount - 55))),
  };
}

function refineText(text: string) {
  const base = sentenceCase(text)
    .replace(/\bhey\b/gi, "Hello")
    .replace(/\bjust checking in\b/gi, "I am following up")
    .replace(/\bASAP\b/g, "at the earliest practical opportunity")
    .replace(/\blet me know\b/gi, "please confirm");

  return `Thank you for the context. ${base} Please confirm the preferred next step so we can move forward with clarity.`;
}

function polishEmail(text: string, tone = "professional") {
  const descriptor = toneDescriptors[tone] ?? toneDescriptors.professional;
  const body = sentenceCase(text);
  return `Subject: Clear next steps\n\nHello,\n\nThank you for your message. I have reviewed the context and want to respond in a ${descriptor} way.\n\n${body}\n\nTo keep momentum, please confirm the decision owner, timing, and any constraints I should account for.\n\nBest regards`;
}

function adjustTone(text: string, tone = "professional") {
  const descriptor = toneDescriptors[tone] ?? toneDescriptors.professional;
  const base = sentenceCase(text)
    .replace(/\bI think\b/gi, "My assessment is")
    .replace(/\bmaybe\b/gi, "a practical option is")
    .replace(/\bsorry\b/gi, "thank you for your patience");

  return `Reframed in a ${descriptor} tone:\n\n${base}`;
}

function shorten(text: string) {
  const cleaned = normalize(text);
  if (cleaned.length <= 220) return cleaned;
  return `${cleaned.slice(0, 217).replace(/\s+\S*$/, "").trim()}.`;
}

function expand(text: string) {
  const base = sentenceCase(text);
  return `Thank you for raising this. ${base}\n\nThe practical next step is to clarify the intended outcome, confirm who owns the decision, and agree when a response or action is needed. This keeps the conversation specific, respectful, and easy to act on.`;
}

function professionalRewrite(text: string) {
  const base = sentenceCase(text)
    .replace(/\bwanna\b/gi, "would like to")
    .replace(/\bgonna\b/gi, "going to")
    .replace(/\bkinda\b/gi, "somewhat")
    .replace(/\bstuff\b/gi, "details");

  return `I would like to clarify the following point with a composed and professional framing:\n\n${base}\n\nPlease confirm whether this direction aligns with your expectations, or whether a different approach would be more appropriate.`;
}

function clarityBoost(text: string) {
  return `Context: ${sentenceCase(text)}\n\nDecision needed: Confirm the intended outcome.\n\nNext action: Assign an owner, deadline, and response format.\n\nSuggested wording: Please confirm the preferred next step and the date by which you need it completed.`;
}

export function isToolSlug(value: string): value is ToolSlug {
  return value in toolCatalog;
}

export async function runTool(slug: ToolSlug, input: { text: string; tone?: string; userId?: number | null }): Promise<ToolResult> {
  const text = normalize(input.text);
  if (!text) {
    throw new Error("text is required");
  }

  const catalog = toolCatalog[slug];
  let result: string;

  if (slug === "text-refiner") result = refineText(text);
  else if (slug === "email-polisher") result = polishEmail(text, input.tone);
  else if (slug === "tone-adjuster") result = adjustTone(text, input.tone);
  else if (slug === "shortener") result = shorten(text);
  else if (slug === "expander") result = expand(text);
  else if (slug === "professional-rewrite") result = professionalRewrite(text);
  else result = clarityBoost(text);

  const analysis = score(text, result);
  const metric = await logMetric({
    userId: input.userId ?? null,
    eventName: `tool.${slug}`,
    eventValue: {
      creditCost: catalog.creditCost,
      inputLength: text.length,
      outputLength: result.length,
      analysis,
    },
  });

  return {
    tool: slug,
    name: catalog.name,
    creditCost: catalog.creditCost,
    result,
    originalText: text,
    suggestions: [
      "Check that the next action is explicit.",
      "Confirm the tone matches the recipient's status and context.",
      "Remove any remaining ambiguity before sending.",
    ],
    analysis,
    metricLogged: metric.logged,
  };
}
