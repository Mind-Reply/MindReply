import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { UsageService } from '../services/usageService';

const router = express.Router();
const usageService = new UsageService();
const prisma = new PrismaClient();

/**
 * GET /api/usage/current - Get current month usage
 */
router.get('/current', verifyToken, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    const usage = await usageService.getCurrentMonthUsage(req.user.id);
    res.json({ data: usage });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/usage/dashboard - Get usage dashboard
 */
router.get('/dashboard', verifyToken, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    const dashboard = await usageService.getUsageDashboard(req.user.id);
    res.json({ data: dashboard });
  } catch (err) {
    next(err);
  }
});

export { router as usageRouter };
