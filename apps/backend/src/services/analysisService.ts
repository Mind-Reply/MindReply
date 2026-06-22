import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { logger } from '../utils/logger';

export class AnalysisService {
  private openai: OpenAI;
  private anthropic: Anthropic;
  private preferredModel: string;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    this.preferredModel = process.env.AI_MODEL || 'openai'; // openai or anthropic
  }

  /**
   * Analyze email message with AI
   */
  async analyzeMessage(subject: string, body: string, tonePref: string = 'professional') {
    try {
      const prompt = `
You are an expert email analyst. Analyze the following email and provide:
1. A concise 2-3 sentence summary
2. Sentiment (positive, neutral, negative)
3. Key questions or action items extracted from the email
4. A suggested professional reply (tone: ${tonePref})

Email Subject: ${subject}
Email Body:
${body}

Respond in JSON format:
{
  "summary": "...",
  "sentiment": "...",
  "extractedQuestions": [...],
  "suggestedReply": "...",
  "keyTopics": [...],
  "actionItems": [...]
}`;

      let analysis;

      if (this.preferredModel === 'anthropic') {
        analysis = await this.analyzeWithAnthropic(prompt);
      } else {
        analysis = await this.analyzeWithOpenAI(prompt);
      }

      const confidenceScore = this.calculateConfidence(subject, body);

      return {
        ...analysis,
        confidenceScore,
      };
    } catch (err) {
      logger.error('Failed to analyze message:', err);
      throw err;
    }
  }

  /**
   * Analyze with OpenAI GPT-4
   */
  private async analyzeWithOpenAI(prompt: string) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 800,
      });

      const content = response.choices[0].message.content || '{}';
      const analysis = JSON.parse(content);

      logger.info('OpenAI analysis completed', {
        tokens: response.usage?.total_tokens,
        model: response.model,
      });

      return {
        ...analysis,
        analysisModel: 'gpt-4-turbo',
        tokenUsage: response.usage?.total_tokens,
      };
    } catch (err) {
      logger.error('OpenAI analysis failed:', err);
      throw err;
    }
  }

  /**
   * Analyze with Anthropic Claude 3
   */
  private async analyzeWithAnthropic(prompt: string) {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '{}';
      const analysis = JSON.parse(content);

      logger.info('Anthropic analysis completed', {
        inputTokens: response.usage?.input_tokens,
        outputTokens: response.usage?.output_tokens,
      });

      return {
        ...analysis,
        analysisModel: 'claude-3-sonnet',
        tokenUsage: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0),
      };
    } catch (err) {
      logger.error('Anthropic analysis failed:', err);
      throw err;
    }
  }

  /**
   * Detect if message requires escalation
   */
  detectEscalation(sentiment: string, confidenceScore: number, questionCount: number) {
    const shouldEscalate = sentiment === 'negative' || confidenceScore < 0.6 || questionCount > 3;

    let reason = '';
    if (sentiment === 'negative') reason += 'Negative sentiment detected. ';
    if (confidenceScore < 0.6) reason += 'Low confidence in analysis. ';
    if (questionCount > 3) reason += 'Multiple questions require careful response. ';

    return {
      shouldEscalate,
      reason: reason.trim() || null,
    };
  }

  /**
   * Calculate confidence score based on email characteristics
   */
  private calculateConfidence(subject: string, body: string): number {
    let score = 0.5; // Base score

    // Increase confidence if email has clear structure
    if (subject.length > 5) score += 0.1;
    if (body.length > 50) score += 0.1;
    if (body.split('\n').length > 2) score += 0.1;

    // Decrease confidence if email is very short or unclear
    if (body.length < 20) score -= 0.2;
    if (subject.includes('URGENT') || subject.includes('HELP')) score -= 0.1;

    return Math.min(Math.max(score, 0), 1); // Clamp between 0 and 1
  }

  /**
   * Generate follow-up suggestions
   */
  async suggestFollowUps(subject: string, body: string, sentiment: string) {
    try {
      const prompt = `Based on this email, suggest 2-3 follow-up actions:
Subject: ${subject}
Body: ${body}
Sentiment: ${sentiment}

Respond in JSON: { "followUps": [{ "type": "...", "scheduledDays": 3, "description": "..." }] }`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 300,
      });

      const content = response.choices[0].message.content || '{}';
      return JSON.parse(content);
    } catch (err) {
      logger.error('Failed to suggest follow-ups:', err);
      return { followUps: [] };
    }
  }
}
