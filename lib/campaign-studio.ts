export type CampaignInput = {
  brief: string;
  audience: string;
  productDetails: string;
  tone: string;
  channels: string[];
};

export type CampaignVariant = {
  channel: string;
  headline: string;
  body: string;
};

export type CampaignResult = {
  concept: string;
  variants: CampaignVariant[];
  launchChecklist: string[];
  imagePrompts: string[];
};

export type CampaignResponse = CampaignResult & {
  generatedImages: string[];
  models: {
    text: string;
    image: string;
  };
};

export type ValidationResult =
  | { ok: true; data: CampaignInput }
  | { ok: false; message: string };

const MIN_FIELD_LENGTH = 3;
const MAX_FIELD_LENGTH = 8000;
const MAX_CHANNELS = 6;

export const DEFAULT_TEXT_MODEL = process.env.OPENAI_TEXT_MODEL || 'gpt-5.5';
export const DEFAULT_IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2';

export const CAMPAIGN_RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    concept: {
      type: 'string',
      description: 'A concise campaign concept in 2-4 sentences.',
    },
    variants: {
      type: 'array',
      minItems: 5,
      maxItems: 5,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          channel: {
            type: 'string',
            description: 'The channel this variant is best suited for.',
          },
          headline: {
            type: 'string',
            description: 'A sharp headline or hook.',
          },
          body: {
            type: 'string',
            description: 'Supporting copy for the headline.',
          },
        },
        required: ['channel', 'headline', 'body'],
      },
    },
    launchChecklist: {
      type: 'array',
      minItems: 5,
      maxItems: 8,
      items: {
        type: 'string',
      },
    },
    imagePrompts: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'string',
      },
    },
  },
  required: ['concept', 'variants', 'launchChecklist', 'imagePrompts'],
} as const;

export function validateCampaignInput(input: unknown): ValidationResult {
  if (!input || typeof input !== 'object') {
    return { ok: false, message: 'Request body is missing.' };
  }

  const record = input as Record<string, unknown>;
  const brief = normalizeText(record.brief);
  const audience = normalizeText(record.audience);
  const productDetails = normalizeText(record.productDetails);
  const tone = normalizeText(record.tone);
  const channels = normalizeChannels(record.channels);

  if (brief.length < MIN_FIELD_LENGTH) {
    return { ok: false, message: 'Campaign brief is required.' };
  }

  if (audience.length < MIN_FIELD_LENGTH) {
    return { ok: false, message: 'Target audience is required.' };
  }

  if (productDetails.length < MIN_FIELD_LENGTH) {
    return { ok: false, message: 'Product details are required.' };
  }

  if (tone.length < MIN_FIELD_LENGTH) {
    return { ok: false, message: 'Tone is required.' };
  }

  if (channels.length === 0) {
    return { ok: false, message: 'Select at least one channel.' };
  }

  return {
    ok: true,
    data: {
      brief,
      audience,
      productDetails,
      tone,
      channels,
    },
  };
}

export function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim().slice(0, MAX_FIELD_LENGTH) : '';
}

export function normalizeChannels(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const cleaned = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, MAX_CHANNELS);

  return Array.from(new Set(cleaned));
}

export function buildCampaignSystemPrompt(): string {
  return [
    'You are a senior marketing strategist and creative director.',
    'Generate concise, high-quality campaign direction for professional marketing teams.',
    'Prefer practical copy that can be used immediately.',
    'Keep the concept concise and the checklist action-oriented.',
    'Make the five variants clearly different in tone or angle, while staying on brief.',
    'Image prompts should be visually distinct, production-friendly, and suitable for ad creative exploration.',
  ].join(' ');
}

export function buildCampaignUserPrompt(input: CampaignInput): string {
  return `
Campaign brief:
${input.brief}

Target audience:
${input.audience}

Product details:
${input.productDetails}

Tone:
${input.tone}

Desired channels:
${input.channels.join(', ')}

Return exactly:
- one concise campaign concept
- five headline/body variants tailored to the channels or strongest channel angles
- a launch checklist
- exactly three image prompts for campaign direction
`.trim();
}

export function parseCampaignResult(value: unknown): CampaignResult {
  if (!value || typeof value !== 'object') {
    throw new Error('Campaign model response was empty.');
  }

  const record = value as Record<string, unknown>;
  const concept = normalizeText(record.concept);
  const variantsRaw = Array.isArray(record.variants) ? record.variants : [];
  const launchChecklistRaw = Array.isArray(record.launchChecklist) ? record.launchChecklist : [];
  const imagePromptsRaw = Array.isArray(record.imagePrompts) ? record.imagePrompts : [];

  const variants: CampaignVariant[] = variantsRaw
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const row = item as Record<string, unknown>;
      const channel = normalizeText(row.channel);
      const headline = normalizeText(row.headline);
      const body = normalizeText(row.body);

      if (!channel || !headline || !body) {
        return null;
      }

      return { channel, headline, body };
    })
    .filter((item): item is CampaignVariant => Boolean(item))
    .slice(0, 5);

  const launchChecklist = launchChecklistRaw
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .slice(0, 8);

  const imagePrompts = imagePromptsRaw
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .slice(0, 3);

  if (!concept || variants.length !== 5 || launchChecklist.length < 5 || imagePrompts.length !== 3) {
    throw new Error('Campaign model response did not match the expected shape.');
  }

  return {
    concept,
    variants,
    launchChecklist,
    imagePrompts,
  };
}

export function imagePayloadToUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const record = payload as Record<string, unknown>;
  if (typeof record.b64_json === 'string' && record.b64_json.trim()) {
    return `data:image/png;base64,${record.b64_json.trim()}`;
  }

  if (typeof record.url === 'string' && record.url.trim()) {
    return record.url.trim();
  }

  return null;
}

export function extractResponseText(response: unknown): string {
  if (!response || typeof response !== 'object') {
    return '';
  }

  const record = response as Record<string, unknown>;
  if (typeof record.output_text === 'string' && record.output_text.trim()) {
    return record.output_text.trim();
  }

  const output = Array.isArray(record.output) ? record.output : [];
  const chunks: string[] = [];

  for (const item of output) {
    if (!item || typeof item !== 'object') {
      continue;
    }

    const entry = item as Record<string, unknown>;
    const content = Array.isArray(entry.content) ? entry.content : [];
    for (const piece of content) {
      if (!piece || typeof piece !== 'object') {
        continue;
      }

      const part = piece as Record<string, unknown>;
      if (typeof part.text === 'string') {
        chunks.push(part.text);
      }
    }
  }

  return chunks.join('').trim();
}
