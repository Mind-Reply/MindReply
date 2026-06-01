import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, requireRole } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/agency - Get agency details
 */
router.get('/', verifyToken, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    const agency = await prisma.agency.findUnique({
      where: { id: req.user.agencyId },
    });

    if (!agency) throw new AppError(404, 'Agency not found');

    res.json({ data: agency });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/agency - Update agency settings
 */
router.patch('/', verifyToken, requireRole(['admin']), async (req, res, next) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    const { name, settings } = req.body;

    const agency = await prisma.agency.update({
      where: { id: req.user.agencyId },
      data: {
        name: name || undefined,
        settings: settings || undefined,
      },
    });

    res.json({ data: agency, message: 'Agency settings updated' });
  } catch (err) {
    next(err);
  }
});

export { router as agencyRouter };
