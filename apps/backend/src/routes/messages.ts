import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import Queue from 'bull';

const router = express.Router();
const prisma = new PrismaClient();
const emailQueue = new Queue('email-sync', process.env.REDIS_URL!);

/**
 * GET /api/messages - List incoming messages
 */
router.get('/', verifyToken, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    const { status, limit = '20', offset = '0' } = req.query;

    const where: any = { agency_id: req.user.agencyId };
    if (status) where.status = status;

    const messages = await prisma.incomingMessage.findMany({
      where,
      include: {
        analysis: true,
        approvalQueue: true,
        sentMessage: true,
      },
      orderBy: { created_at: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.incomingMessage.count({ where });

    res.json({ data: messages, total });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/messages/:id - Get message details
 */
router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    const message = await prisma.incomingMessage.findUnique({
      where: { id: req.params.id },
      include: {
        analysis: true,
        approvalQueue: true,
        sentMessage: true,
        followUps: true,
      },
    });

    if (!message || message.agency_id !== req.user.agencyId) {
      throw new AppError(404, 'Message not found');
    }

    res.json({ data: message });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/messages/sync - Trigger Gmail sync
 */
router.post('/sync', verifyToken, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    // Get user's Gmail access token (from session/auth service)
    const accessToken = req.headers['x-gmail-token'] as string;
    if (!accessToken) {
      throw new AppError(400, 'Gmail token required');
    }

    // Queue email sync job
    const job = await emailQueue.add(
      { agencyId: req.user.agencyId, accessToken },
      { priority: 10 }
    );

    res.json({
      status: 'ok',
      message: 'Sync started',
      jobId: job.id,
    });
  } catch (err) {
    next(err);
  }
});

export { router as messagesRouter };
