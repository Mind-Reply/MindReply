import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/analytics - Get today's metrics
 */
router.get('/', verifyToken, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

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
        repliesRejected: 0,
        followUpsSent: 0,
        estimatedHoursSaved: 0,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/analytics/summary - Get weekly/monthly summary
 */
router.get('/summary', verifyToken, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    const { period = 'week' } = req.query;
    const days = period === 'month' ? 30 : 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const records = await prisma.analytics.findMany({
      where: {
        agencyId: req.user.agencyId,
        date: { gte: startDate },
      },
    });

    const totals = records.reduce(
      (acc, record) => ({
        totalMessages: acc.totalMessages + record.messages_received,
        totalApproved: acc.totalApproved + record.replies_approved,
        totalRejected: acc.totalRejected + record.replies_rejected,
        totalEscalated: acc.totalEscalated + record.escalations,
        totalHoursSaved: acc.totalHoursSaved + record.estimated_hours_saved,
      }),
      {
        totalMessages: 0,
        totalApproved: 0,
        totalRejected: 0,
        totalEscalated: 0,
        totalHoursSaved: 0,
      }
    );

    res.json({
      data: {
        period,
        startDate,
        endDate: new Date(),
        ...totals,
        avgResponseTime: 0, // TODO: Calculate from sent messages
      },
    });
  } catch (err) {
    next(err);
  }
});

export { router as analyticsRouter };
