import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface UsageLimits {
  briefs: number;
  emails: number;
  storage_gb: number;
}

export class UsageService {
  /**
   * Track usage event
   */
  async trackUsage(
    userId: string,
    eventType: 'brief_created' | 'email_sent' | 'pdf_generated',
    quantity: number = 1
  ) {
    try {
      await prisma.usageEvent.create({
        data: {
          userId,
          eventType,
          quantity,
          timestamp: new Date(),
        },
      });
    } catch (err) {
      logger.error('Failed to track usage:', err);
      throw err;
    }
  }

  /**
   * Get current month usage
   */
  async getCurrentMonthUsage(userId: string) {
    try {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const events = await prisma.usageEvent.findMany({
        where: {
          userId,
          timestamp: { gte: monthStart },
        },
      });

      // Aggregate by event type
      const usage = {
        briefs: 0,
        emails: 0,
        storage_gb: 0,
      };

      for (const event of events) {
        if (event.eventType === 'brief_created') {
          usage.briefs += event.quantity;
        } else if (event.eventType === 'email_sent') {
          usage.emails += event.quantity;
        } else if (event.eventType === 'pdf_generated') {
          usage.storage_gb += (event.quantity * 0.05); // Estimate: 50KB per PDF
        }
      }

      return usage;
    } catch (err) {
      logger.error('Failed to get usage:', err);
      throw err;
    }
  }

  /**
   * Check if user has exceeded limits
   */
  async checkUsageLimits(
    userId: string,
    tier: string,
    eventType: string
  ): Promise<{ allowed: boolean; remaining: number }> {
    try {
      // Get tier limits
      const tierLimits = this.getTierLimits(tier);
      if (!tierLimits) {
        return { allowed: false, remaining: 0 };
      }

      // Get current usage
      const usage = await this.getCurrentMonthUsage(userId);

      // Check limits based on event type
      let limitKey: keyof UsageLimits;
      let currentUsage: number;
      let limit: number;

      if (eventType === 'brief_created') {
        limitKey = 'briefs';
        currentUsage = usage.briefs;
        limit = tierLimits.briefs;
      } else if (eventType === 'email_sent') {
        limitKey = 'emails';
        currentUsage = usage.emails;
        limit = tierLimits.emails;
      } else {
        return { allowed: true, remaining: 999 };
      }

      const remaining = limit - currentUsage;
      const allowed = remaining > 0;

      logger.info('Usage check', { userId, tier, eventType, allowed, remaining });

      return { allowed, remaining };
    } catch (err) {
      logger.error('Failed to check usage limits:', err);
      throw err;
    }
  }

  /**
   * Get tier limits
   */
  private getTierLimits(tier: string): UsageLimits | null {
    const limits: Record<string, UsageLimits> = {
      free: { briefs: 1, emails: 10, storage_gb: 1 },
      pro: { briefs: 10, emails: 100, storage_gb: 10 },
      agency: { briefs: 999, emails: 999, storage_gb: 100 },
      enterprise: { briefs: 999, emails: 999, storage_gb: 1000 },
    };

    return limits[tier] || null;
  }

  /**
   * Get usage dashboard data
   */
  async getUsageDashboard(userId: string) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
      });

      if (!subscription) {
        return null;
      }

      const usage = await this.getCurrentMonthUsage(userId);
      const limits = this.getTierLimits(subscription.tier);

      return {
        tier: subscription.tier,
        usage,
        limits,
        percentUsed: {
          briefs: limits ? (usage.briefs / limits.briefs) * 100 : 0,
          emails: limits ? (usage.emails / limits.emails) * 100 : 0,
          storage: limits ? (usage.storage_gb / limits.storage_gb) * 100 : 0,
        },
      };
    } catch (err) {
      logger.error('Failed to get usage dashboard:', err);
      throw err;
    }
  }
}
