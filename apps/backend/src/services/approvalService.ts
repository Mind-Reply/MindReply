import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class ApprovalService {
  /**
   * Create approval queue item
   */
  async createApprovalItem(
    agencyId: string,
    messageId: string,
    analysisId: string,
    suggestedReply: string,
    priority: string = 'normal'
  ) {
    try {
      const approvalItem = await prisma.approvalQueue.create({
        data: {
          agencyId,
          messageId,
          suggestedReply,
          priority,
          status: 'pending',
        },
      });

      logger.info('Approval item created', { approvalItem: approvalItem.id });
      return approvalItem;
    } catch (err) {
      logger.error('Failed to create approval item:', err);
      throw err;
    }
  }

  /**
   * Get pending approvals for agency
   */
  async getPendingApprovals(agencyId: string, limit: number = 20) {
    try {
      const approvals = await prisma.approvalQueue.findMany({
        where: {
          agencyId,
          status: 'pending',
        },
        include: {
          message: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
      });

      return approvals;
    } catch (err) {
      logger.error('Failed to get pending approvals:', err);
      throw err;
    }
  }

  /**
   * Approve and prepare for sending
   */
  async approveReply(approvalId: string, userId: string, edits?: string) {
    try {
      const approvalItem = await prisma.approvalQueue.update({
        where: { id: approvalId },
        data: {
          status: 'approved',
          reviewedBy: userId,
          reviewedAt: new Date(),
          humanEdits: edits,
        },
      });

      logger.info('Reply approved', { approvalId, userId });
      return approvalItem;
    } catch (err) {
      logger.error('Failed to approve reply:', err);
      throw err;
    }
  }

  /**
   * Reject reply
   */
  async rejectReply(approvalId: string, userId: string, reason: string) {
    try {
      const approvalItem = await prisma.approvalQueue.update({
        where: { id: approvalId },
        data: {
          status: 'rejected',
          reviewedBy: userId,
          reviewedAt: new Date(),
          reviewNotes: reason,
        },
      });

      logger.info('Reply rejected', { approvalId, userId });
      return approvalItem;
    } catch (err) {
      logger.error('Failed to reject reply:', err);
      throw err;
    }
  }

  /**
   * Escalate item
   */
  async escalateItem(approvalId: string, reason: string, escalateTo?: string) {
    try {
      const approvalItem = await prisma.approvalQueue.update({
        where: { id: approvalId },
        data: {
          status: 'escalated',
          escalatedAt: new Date(),
          escalationReason: reason,
          escalatedTo: escalateTo,
        },
      });

      logger.warn('Item escalated', { approvalId, reason });
      return approvalItem;
    } catch (err) {
      logger.error('Failed to escalate item:', err);
      throw err;
    }
  }

  /**
   * Notify team of new approvals
   */
  async notifyTeam(agencyId: string, approvalId: string) {
    try {
      // TODO: Implement Slack/Email notification
      logger.info('Team notified of new approval', { approvalId });
    } catch (err) {
      logger.error('Failed to notify team:', err);
    }
  }

  /**
   * Get approval stats for dashboard
   */
  async getApprovalStats(agencyId: string, days: number = 7) {
    try {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const stats = await prisma.approvalQueue.groupBy({
        by: ['status'],
        where: {
          agencyId,
          createdAt: { gte: since },
        },
        _count: true,
      });

      return stats;
    } catch (err) {
      logger.error('Failed to get approval stats:', err);
      throw err;
    }
  }
}
