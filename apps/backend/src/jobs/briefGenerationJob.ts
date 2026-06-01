import Queue from 'bull';
import { PrismaClient } from '@prisma/client';
import { BriefService } from '../services/briefService';
import { SEOService } from '../services/seoService';
import { DistributionService } from '../services/distributionService';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();
const briefService = new BriefService();
const seoService = new SEOService();
const distributionService = new DistributionService();

const generationQueue = new Queue(
  'brief-generation',
  process.env.REDIS_URL!
);

/**
 * Background job: Generate brief, SEO strategy, and distribution plan
 */
export async function setupBriefGenerationJob() {
  generationQueue.process(async (job) => {
    try {
      const { projectId, topic, targetAudience, contentType, goals, keywords } =
        job.data;

      logger.info('Starting brief generation', { projectId });

      // Generate brief content
      const brief = await briefService.generateBrief({
        projectId,
        topic,
        targetAudience,
        contentType,
        goals,
        keywords,
      });

      // Generate SEO strategy
      const seoStrategy = await seoService.generateSEOStrategy(
        topic,
        keywords[0] || topic,
        contentType
      );

      // Generate distribution plan
      const distribution = await distributionService.generateDistributionPlan(
        topic,
        targetAudience,
        contentType
      );

      // Store all generated content
      await briefService.storeBrief(
        projectId,
        brief,
        seoStrategy,
        distribution
      );

      // Store SEO strategy
      await prisma.seoStrategy.create({
        data: {
          projectId,
          primaryKeyword: seoStrategy.primaryKeyword,
          secondaryKeywords: seoStrategy.secondaryKeywords,
          metaTitle: seoStrategy.metaTitle,
          metaDescription: seoStrategy.metaDescription,
          focusTopics: seoStrategy.focusTopics,
          internalLinks: seoStrategy.internalLinks,
          externalLinks: seoStrategy.externalLinks,
          relatedQueries: seoStrategy.relatedQueries,
        },
      });

      // Store distribution plan
      const distRecord = await prisma.distributionPlan.create({
        data: {
          projectId,
          crossPromotion: distribution.crossPromotion,
          timing: distribution.timing,
          frequency: distribution.frequency,
          metrics: distribution.metrics,
        },
      });

      // Store channel details
      for (const channel of distribution.channels) {
        await prisma.channel.create({
          data: {
            distributionId: distRecord.id,
            name: channel.name,
            postingTime: channel.postingTime,
            format: channel.format,
            estimatedReach: channel.estimatedReach,
            callToAction: channel.callToAction,
          },
        });
      }

      // Create content calendar
      const calendar = await prisma.contentCalendar.create({
        data: { projectId },
      });

      // Populate calendar with 4-week entries
      const today = new Date();
      for (let i = 0; i < 28; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);

        // Only add entries for weekdays
        if (date.getDay() !== 0 && date.getDay() !== 6) {
          await prisma.calendarEntry.create({
            data: {
              calendarId: calendar.id,
              date,
              contentType,
              channel: 'Social Media',
              notes: 'Auto-generated entry',
            },
          });
        }
      }

      logger.info('Brief generation completed', { projectId });
      return { success: true, projectId };
    } catch (err) {
      logger.error('Brief generation failed:', err);
      throw err;
    }
  });
}
