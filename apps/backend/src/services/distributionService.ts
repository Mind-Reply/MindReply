import { OpenAI } from 'openai';
import { logger } from '../utils/logger';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface DistributionPlan {
  channels: ChannelPlan[];
  crossPromotion: string[];
  timing: string;
  frequency: string;
  metrics: string[];
}

export interface ChannelPlan {
  name: string;
  postingTime: string;
  format: string;
  estimatedReach: number;
  callToAction: string;
}

export class DistributionService {
  /**
   * Generate distribution and promotion strategy
   */
  async generateDistributionPlan(
    topic: string,
    targetAudience: string,
    contentType: string
  ): Promise<DistributionPlan> {
    try {
      logger.info('Generating distribution plan', { topic, contentType });

      const prompt = `
You are a content distribution expert. Create a distribution strategy for the following content.

Return ONLY valid JSON (no markdown).

Topic: ${topic}
Target Audience: ${targetAudience}
Content Type: ${contentType}

Generate a JSON object with:
{
  "channels": [
    {
      "name": "LinkedIn",
      "postingTime": "Tuesday 9 AM",
      "format": "How to adapt for this channel",
      "estimatedReach": 5000,
      "callToAction": "CTA for this channel"
    }
  ],
  "crossPromotion": ["How to repurpose into other formats"],
  "timing": "Best time to post",
  "frequency": "Publishing cadence recommendation",
  "metrics": ["KPIs to track success"]
}

Include 3-4 most relevant channels for the content type and audience.
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const distribution = JSON.parse(
        completion.choices[0].message.content!
      );

      logger.info('Distribution plan generated', {
        channelCount: distribution.channels.length,
      });
      return distribution;
    } catch (err) {
      logger.error('Distribution plan generation failed:', err);
      throw new Error('Failed to generate distribution plan');
    }
  }
}
