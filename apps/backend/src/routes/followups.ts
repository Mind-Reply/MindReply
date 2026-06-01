import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/follow-ups - List follow-ups
 */
router.get('/', verifyToken, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    const { status, type } = req.query;

    const where: any = { agency_id: req.user.agencyId };
    if (status) where.status = status;
    if (type) where.follow_up_type = type;

    const followUps = await prisma.followUp.findMany({
      where,
      orderBy: { scheduled_at: 'asc' },
    });

    res.json({ data: followUps, total: followUps.length });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/follow-ups - Create follow-up
 */
router.post('/', verifyToken, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    const { messageId, type, scheduledAt, notes } = req.body;

    if (!messageId || !type || !scheduledAt) {
      throw new AppError(400, 'Missing required fields');
    }

    const followUp = await prisma.followUp.create({
      data: {
        agency_id: req.user.agencyId,
        message_id: messageId,
        follow_up_type: type,
        scheduled_at: new Date(scheduledAt),
        notes,
        status: 'pending',
      },
    });

    res.json({ data: followUp });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/follow-ups/:id - Update follow-up
 */
router.patch('/:id', verifyToken, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    const { status, completedAt, notes } = req.body;

    const followUp = await prisma.followUp.update({
      where: { id: req.params.id },
      data: {
        status,
        completed_at: completedAt ? new Date(completedAt) : undefined,
        notes,
      },
    });

    res.json({ data: followUp });
  } catch (err) {
    next(err);
  }
});

export { router as followUpsRouter };
