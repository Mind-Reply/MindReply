import { NextResponse } from 'next/server';
import {
  normalizeText,
  normalizeChannels,
  extractResponseText,
  imagePayloadToUrl,
  DEFAULT_TEXT_MODEL,
  DEFAULT_IMAGE_MODEL,
} from '../../../../lib/campaign-studio';

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
      model: DEFAULT_TEXT_MODEL,
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

  const outputText = extractResponseText(data);
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
      model: DEFAULT_IMAGE_MODEL,
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
  const url = imagePayloadToUrl(first);
  if (!url) {
    throw new Error('Image generation returned no usable asset.');
  }
  return url;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CampaignInput>;
    const brief = normalizeText(body.brief);
    const audience = normalizeText(body.audience);
    const product = normalizeText(body.product);
    const tone = normalizeText(body.tone) || 'Professional';
    const channels = normalizeChannels(body.channels);

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
        textModel: DEFAULT_TEXT_MODEL,
        imageModel: DEFAULT_IMAGE_MODEL,
      },
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Campaign generation failed.', 500);
  }
}
