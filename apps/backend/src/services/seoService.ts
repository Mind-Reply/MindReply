import { OpenAI } from 'openai';
import { logger } from '../utils/logger';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface SEOAnalysis {
  primaryKeyword: string;
  secondaryKeywords: string[];
  metaTitle: string;
  metaDescription: string;
  focusTopics: string[];
  internalLinks: string[];
  externalLinks: string[];
  relatedQueries: string[];
  confidenceScore: number;
}

export class SEOService {
  /**
   * Analyze keywords and generate SEO strategy
   */
  async generateSEOStrategy(
    topic: string,
    primaryKeyword: string,
    contentType: string
  ): Promise<SEOAnalysis> {
    try {
      logger.info('Generating SEO strategy', { topic, primaryKeyword });

      const prompt = `
You are an SEO expert. Generate an SEO strategy for the following content.

Return ONLY valid JSON (no markdown).

Topic: ${topic}
Primary Keyword: ${primaryKeyword}
Content Type: ${contentType}

Generate a JSON object with:
{
  "primaryKeyword": "${primaryKeyword}",
  "secondaryKeywords": ["keyword1", "keyword2", "keyword3"],
  "metaTitle": "SEO-optimized title (60 chars max)",
  "metaDescription": "Compelling description (160 chars max)",
  "focusTopics": ["Topic cluster 1", "Topic cluster 2"],
  "internalLinks": ["Relevant internal pages to link"],
  "externalLinks": ["Authoritative sources to cite"],
  "relatedQueries": ["People also ask queries"],
  "confidenceScore": 0.88
}
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 800,
      });

      const seoStrategy = JSON.parse(completion.choices[0].message.content!);

      logger.info('SEO strategy generated', { primaryKeyword });
      return seoStrategy;
    } catch (err) {
      logger.error('SEO strategy generation failed:', err);
      throw new Error('Failed to generate SEO strategy');
    }
  }
}
