import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class BriefReviewService {
  /**
   * Get pending reviews for strategist
   */
  async getPendingReviews(limit: number = 20) {
    try {
      const pending = await prisma.briefProject.findMany({
        where: { status: 'review' },
        include: {
          user: true,
          brief: true,
          seoStrategy: true,
          distribution: true,
          calendar: true,
        },
        orderBy: { createdAt: 'asc' },
        take: limit,
      });

      return pending;
    } catch (err) {
      logger.error('Failed to fetch pending reviews:', err);
      throw err;
    }
  }

  /**
   * Approve brief and prepare for delivery
   */
  async approveBrief(briefId: string, reviewerId: string, edits?: any) {
    try {
      // Apply edits if provided
      if (edits) {
        await prisma.briefContent.update({
          where: { projectId: briefId },
          data: edits,
        });
      }

      // Mark as approved
      const brief = await prisma.briefProject.update({
        where: { id: briefId },
        data: {
          status: 'approved',
          reviewedBy: reviewerId,
          reviewedAt: new Date(),
        },
      });

      logger.info('Brief approved', { briefId, reviewerId });
      return brief;
    } catch (err) {
      logger.error('Failed to approve brief:', err);
      throw err;
    }
  }

  /**
   * Reject brief with feedback
   */
  async rejectBrief(
    briefId: string,
    reviewerId: string,
    feedback: string
  ) {
    try {
      const brief = await prisma.briefProject.update({
        where: { id: briefId },
        data: {
          status: 'rejected',
          reviewedBy: reviewerId,
          reviewedAt: new Date(),
        },
      });

      // TODO: Send email to user with feedback
      logger.info('Brief rejected', { briefId, feedback });
      return brief;
    } catch (err) {
      logger.error('Failed to reject brief:', err);
      throw err;
    }
  }

  /**
   * Request changes from creator
   */
  async requestChanges(briefId: string, feedback: string) {
    try {
      await prisma.briefProject.update({
        where: { id: briefId },
        data: {
          status: 'draft', // Back to draft for edits
        },
      });

      // TODO: Send email to user with feedback
      logger.info('Changes requested', { briefId });
      return true;
    } catch (err) {
      logger.error('Failed to request changes:', err);
      throw err;
    }
  }
}
