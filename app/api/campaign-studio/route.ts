import {
  buildCampaignSystemPrompt,
  buildCampaignUserPrompt,
  CAMPAIGN_RESPONSE_SCHEMA,
  DEFAULT_IMAGE_MODEL,
  DEFAULT_TEXT_MODEL,
  extractResponseText,
  parseCampaignResult,
  validateCampaignInput,
} from '../../../lib/campaign-studio';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function postJson<T>(url: string, body: unknown, apiKey: string): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `OpenAI request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function imagePayloadToUrl(payload: unknown): string | null {
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

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'OPENAI_API_KEY is not configured on the server.' },
        { status: 500 },
      );
    }

    const rawBody = await request.json().catch(() => null);
    const validation = validateCampaignInput(rawBody);
    if (!validation.ok) {
      return Response.json({ error: validation.message }, { status: 400 });
    }

    const textModel = DEFAULT_TEXT_MODEL;
    const imageModel = DEFAULT_IMAGE_MODEL;

    const textResponse = await postJson<Record<string, unknown>>('https://api.openai.com/v1/responses', {
      model: textModel,
      input: [
        {
          role: 'system',
          content: [{ type: 'input_text', text: buildCampaignSystemPrompt() }],
        },
        {
          role: 'user',
          content: [{ type: 'input_text', text: buildCampaignUserPrompt(validation.data) }],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'campaign_studio_output',
          strict: true,
          schema: CAMPAIGN_RESPONSE_SCHEMA,
        },
      },
    }, apiKey);

    const campaignData = parseCampaignResult(JSON.parse(extractResponseText(textResponse)));

    const imageJobs = await Promise.allSettled(
      campaignData.imagePrompts.map(async (prompt) => {
        const imageResponse = await postJson<Record<string, unknown>>('https://api.openai.com/v1/images/generations', {
          model: imageModel,
          prompt,
          size: '1024x1024',
        }, apiKey);

        const data = Array.isArray(imageResponse.data) ? imageResponse.data : [];
        const url = data.length > 0 ? imagePayloadToUrl(data[0]) : null;
        if (!url) {
          throw new Error('Image generation did not return an image payload.');
        }
        return url;
      }),
    );

    const generatedImages = imageJobs
      .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
      .map((result) => result.value);

    const imageWarnings = imageJobs
      .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
      .map((result) => result.reason instanceof Error ? result.reason.message : 'Image generation failed.');

    return Response.json({
      ...campaignData,
      generatedImages,
      imageWarnings,
      models: {
        text: textModel,
        image: imageModel,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error.';
    return Response.json({ error: message }, { status: 500 });
  }
}
