import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { validateRequest, createFollowUpSchema } from '../middleware/validation';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/followups - List follow-ups
 */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { status = 'scheduled', limit = '20' } = req.query;

    const followups = await prisma.followUp.findMany({
      where: {
        agencyId: req.user.agencyId,
        status: status as string,
      },
      orderBy: { scheduledFor: 'asc' },
      take: parseInt(limit as string),
    });

    res.json({ data: followups });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/followups - Create follow-up
 */
router.post('/', authMiddleware, validateRequest(createFollowUpSchema), async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const followup = await prisma.followUp.create({
      data: {
        agencyId: req.user.agencyId,
        messageId: req.validated?.messageId,
        createdBy: req.user.id,
        taskType: req.validated?.taskType,
        description: req.validated?.description,
        scheduledFor: req.validated?.scheduledFor,
        notificationChannels: req.validated?.notificationChannels || ['email'],
      },
    });

    logger.info('Follow-up created', { followupId: followup.id });
    res.json({ data: followup });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/followups/:id/complete - Mark complete
 */
router.post('/:id/complete', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const followup = await prisma.followUp.update({
      where: { id: req.params.id },
      data: {
        status: 'completed',
        completedAt: new Date(),
        completedBy: req.user.id,
      },
    });

    logger.info('Follow-up completed', { followupId: followup.id });
    res.json({ data: followup });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/followups/:id - Cancel follow-up
 */
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const followup = await prisma.followUp.update({
      where: { id: req.params.id },
      data: { status: 'cancelled' },
    });

    logger.info('Follow-up cancelled', { followupId: followup.id });
    res.json({ status: 'cancelled' });
  } catch (err) {
    next(err);
  }
});

export { router as followupsRouter };
