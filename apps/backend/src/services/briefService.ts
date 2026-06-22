import { PrismaClient } from '@prisma/client';
import { OpenAI } from 'openai';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface BriefGenerationInput {
  projectId: string;
  topic: string;
  targetAudience: string;
  contentType: string; // blog, video, social, whitepaper
  goals: string[];
  keywords: string[];
  agencyTone?: string;
}

export interface GeneratedBrief {
  angle: string;
  keyMessages: string[];
  targetPain: string;
  solutionOffered: string;
  callToAction: string;
  estimatedLength: number;
  tone: string;
  structureNotes: string;
  confidenceScore: number;
}

export class BriefService {
  /**
   * Generate content brief using AI
   */
  async generateBrief(input: BriefGenerationInput): Promise<GeneratedBrief> {
    try {
      logger.info('Generating brief', { projectId: input.projectId });

      const prompt = this.buildBriefPrompt(input);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const responseText = completion.choices[0].message.content;
      const brief = JSON.parse(responseText!);

      logger.info('Brief generated successfully', {
        projectId: input.projectId,
        confidence: brief.confidenceScore,
      });

      return brief;
    } catch (err) {
      logger.error('Brief generation failed:', err);
      throw new Error('Failed to generate brief');
    }
  }

  /**
   * Build AI prompt for brief generation
   */
  private buildBriefPrompt(input: BriefGenerationInput): string {
    const lengthGuide = this.getLengthGuide(input.contentType);

    return `
You are a professional content strategist. Generate a comprehensive content brief using the following information.

Return ONLY valid JSON (no markdown, no code blocks).

Project Details:
- Topic: ${input.topic}
- Target Audience: ${input.targetAudience}
- Content Type: ${input.contentType}
- Goals: ${input.goals.join(', ')}
- Keywords to focus on: ${input.keywords.join(', ')}
- Tone: ${input.agencyTone || 'professional and engaging'}

Generate a JSON object with these fields:
{
  "angle": "Unique perspective or hook (1 sentence)",
  "keyMessages": ["Message 1", "Message 2", "Message 3"],
  "targetPain": "Main problem the audience faces",
  "solutionOffered": "How this content solves that problem",
  "callToAction": "What should audience do after reading",
  "estimatedLength": ${lengthGuide},
  "tone": "${input.agencyTone || 'professional'}",
  "structureNotes": "Suggested structure and flow",
  "confidenceScore": 0.85
}

Ensure the brief is:
- Focused on the target audience's needs
- Optimized for the ${input.contentType} format
- Aligned with stated goals
- Incorporating provided keywords naturally
- Professional and actionable
    `;
  }

  /**
   * Get estimated content length by type
   */
  private getLengthGuide(contentType: string): number {
    const guides: Record<string, number> = {
      blog: 2000,
      video: 10,
      social: 280,
      whitepaper: 5000,
      case_study: 3000,
      infographic: 500,
      podcast: 30,
    };
    return guides[contentType] || 2000;
  }

  /**
   * Store generated brief
   */
  async storeBrief(
    projectId: string,
    brief: GeneratedBrief,
    seoStrategy: any,
    distribution: any
  ) {
    try {
      await prisma.briefContent.create({
        data: {
          projectId,
          angle: brief.angle,
          keyMessages: brief.keyMessages,
          targetPain: brief.targetPain,
          solutionOffered: brief.solutionOffered,
          callToAction: brief.callToAction,
          estimatedLength: brief.estimatedLength,
          tone: brief.tone,
          structureNotes: brief.structureNotes,
        },
      });

      // Update project status
      await prisma.briefProject.update({
        where: { id: projectId },
        data: { status: 'review' },
      });

      logger.info('Brief stored', { projectId });
      return true;
    } catch (err) {
      logger.error('Failed to store brief:', err);
      throw err;
    }
  }

  /**
   * Detect if brief should be escalated for review
   */
  detectEscalation(brief: GeneratedBrief, contentType: string): {
    shouldEscalate: boolean;
    reason?: string;
  } {
    // Low confidence
    if (brief.confidenceScore < 0.75) {
      return {
        shouldEscalate: true,
        reason: `Low confidence score: ${brief.confidenceScore}`,
      };
    }

    // Complex content types
    if (['whitepaper', 'case_study'].includes(contentType)) {
      return {
        shouldEscalate: true,
        reason: `Complex content type: ${contentType}`,
      };
    }

    return { shouldEscalate: false };
  }
}
