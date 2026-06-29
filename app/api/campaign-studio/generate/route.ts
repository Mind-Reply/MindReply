import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type CampaignInput = {
  brief: string;
  audience: string;
  product: string;
  tone: string;
  channels: string[];
};

type CampaignVariant = {
  headline: string;
  body: string;
};

type CampaignPayload = {
  concept: string;
  strategicAngle: string;
  variants: CampaignVariant[];
  launchChecklist: string[];
  imagePrompts: string[];
};

type GeneratedImage = {
  prompt: string;
  src: string | null;
  status: 'ok' | 'failed';
  error?: string;
};

const TEXT_MODEL = process.env.OPENAI_TEXT_MODEL ?? 'gpt-5.5';
const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL ?? 'gpt-image-2';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const campaignSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    concept: {
      type: 'string',
      description: 'Concise campaign concept in 2-4 sentences.',
    },
    strategicAngle: {
      type: 'string',
      description: 'One short strategic lens for the campaign.',
    },
    variants: {
      type: 'array',
      minItems: 5,
      maxItems: 5,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          headline: { type: 'string' },
          body: { type: 'string' },
        },
        required: ['headline', 'body'],
      },
    },
    launchChecklist: {
      type: 'array',
      minItems: 6,
      items: { type: 'string' },
    },
    imagePrompts: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: { type: 'string' },
    },
  },
  required: ['concept', 'strategicAngle', 'variants', 'launchChecklist', 'imagePrompts'],
} as const;

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => asString(item)).filter(Boolean);
}

function extractTextFromResponsesPayload(payload: any): string {
  if (typeof payload?.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const fragments: string[] = [];
  for (const item of payload?.output ?? []) {
    if (item?.type === 'message' && Array.isArray(item.content)) {
      for (const part of item.content) {
        if (typeof part?.text === 'string') fragments.push(part.text);
        if (typeof part?.content === 'string') fragments.push(part.content);
      }
    }
    if (typeof item?.text === 'string') fragments.push(item.text);
  }

  return fragments.join('\n').trim();
}

function parseCampaignPayload(text: string): CampaignPayload {
  const parsed = JSON.parse(text) as CampaignPayload;

  if (!parsed.concept || !parsed.strategicAngle) {
    throw new Error('Missing required campaign fields.');
  }

  if (!Array.isArray(parsed.variants) || parsed.variants.length !== 5) {
    throw new Error('Expected exactly 5 campaign variants.');
  }

  if (!Array.isArray(parsed.launchChecklist) || parsed.launchChecklist.length < 6) {
    throw new Error('Expected a launch checklist with at least 6 items.');
  }

  if (!Array.isArray(parsed.imagePrompts) || parsed.imagePrompts.length !== 3) {
    throw new Error('Expected exactly 3 image prompts.');
  }

  return parsed;
}

async function callResponsesApi(input: CampaignInput): Promise<CampaignPayload> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured on the server.');
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: TEXT_MODEL,
      input: [
        {
          role: 'developer',
          content:
            'You are a senior marketing strategist building production-ready campaign concepts. Return only valid JSON that matches the supplied schema. Keep the concept concise, commercially sharp, and channel-aware. Make the five variants meaningfully different in angle. Make the checklist operational and execution-focused. Create image prompts that are visually distinct, brand-safe, and suitable for social, ads, and landing pages.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            brief: input.brief,
            audience: input.audience,
            product: input.product,
            tone: input.tone,
            channels: input.channels,
          }),
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          strict: true,
          schema: campaignSchema,
        },
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message ?? 'OpenAI Responses API request failed.');
  }

  const outputText = extractTextFromResponsesPayload(data);
  if (!outputText) {
    throw new Error('OpenAI returned an empty campaign payload.');
  }

  return parseCampaignPayload(outputText);
}

async function generateImage(prompt: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured on the server.');
  }

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: IMAGE_MODEL,
      prompt,
      size: '1024x1024',
      n: 1,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message ?? 'Image generation failed.');
  }

  const first = data?.data?.[0] ?? {};
  if (typeof first.url === 'string' && first.url) {
    return first.url;
  }

  if (typeof first.b64_json === 'string' && first.b64_json) {
    return `data:image/png;base64,${first.b64_json}`;
  }

  throw new Error('Image generation returned no usable asset.');
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CampaignInput>;
    const brief = asString(body.brief);
    const audience = asString(body.audience);
    const product = asString(body.product);
    const tone = asString(body.tone) || 'Professional';
    const channels = asStringArray(body.channels);

    if (!brief || !audience || !product || channels.length === 0) {
      return jsonError('Brief, audience, product, and at least one channel are required.', 400);
    }

    const campaign = await callResponsesApi({
      brief,
      audience,
      product,
      tone,
      channels,
    });

    const generatedImages = await Promise.all(
      campaign.imagePrompts.map(async (prompt) => {
        try {
          const src = await generateImage(prompt);
          return { prompt, src, status: 'ok' as const };
        } catch (error) {
          return {
            prompt,
            src: null,
            status: 'failed' as const,
            error: error instanceof Error ? error.message : 'Image generation failed.',
          };
        }
      }),
    );

    return NextResponse.json({
      campaign,
      generatedImages,
      meta: {
        textModel: TEXT_MODEL,
        imageModel: IMAGE_MODEL,
      },
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Campaign generation failed.', 500);
  }
}
