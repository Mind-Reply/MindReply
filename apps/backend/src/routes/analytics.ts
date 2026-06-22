import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { logger } from '../utils/logger';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/analytics/overview - Dashboard overview
 */
router.get('/overview', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const analytics = await prisma.analytics.findUnique({
      where: {
        agencyId_date: {
          agencyId: req.user.agencyId,
          date: today,
        },
      },
    });

    res.json({
      data: analytics || {
        messagesReceived: 0,
        messagesProcessed: 0,
        repliesApproved: 0,
        estimatedHoursSaved: 0,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/analytics/trend - 30-day trend
 */
router.get('/trend', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const trend = await prisma.analytics.findMany({
      where: {
        agencyId: req.user.agencyId,
        date: { gte: thirtyDaysAgo },
      },
      orderBy: { date: 'asc' },
    });

    res.json({ data: trend });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/analytics/usage - Monthly usage
 */
router.get('/usage', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const currentMonth = new Date();
    currentMonth.setDate(1);

    const usage = await prisma.usageMetrics.findUnique({
      where: {
        agencyId_month: {
          agencyId: req.user.agencyId,
          month: currentMonth,
        },
      },
    });

    res.json({
      data: usage || {
        emailsProcessed: 0,
        apiBriefsGenerated: 0,
        storageUsedGb: 0,
        aiTokensUsed: 0,
      },
    });
  } catch (err) {
    next(err);
  }
});

export { router as analyticsRouter };
