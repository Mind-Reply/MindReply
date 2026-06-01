import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * POST /api/auth/login - JWT login
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, 'Email and password required');
    }

    // TODO: Implement proper auth (hash comparison, etc.)
    // For now, simple demo
    const user = await prisma.user.findUnique({
      where: { email },
      include: { agency: true },
    });

    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        agencyId: user.agency_id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    logger.info('User logged in', { email });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/logout - Logout
 */
router.post('/logout', (req, res) => {
  // Token is stateless, so logout is handled client-side
  res.json({ status: 'ok', message: 'Logged out' });
});

/**
 * POST /api/auth/gmail-callback - Gmail OAuth2 callback
 */
router.post('/gmail-callback', async (req, res, next) => {
  try {
    const { code, userId } = req.body;

    if (!code || !userId) {
      throw new AppError(400, 'Code and user ID required');
    }

    // TODO: Exchange code for access token using google-auth-library
    // Store access token securely (encrypted in DB or secure session)

    logger.info('Gmail authenticated for user', { userId });

    res.json({
      status: 'ok',
      message: 'Gmail connected',
    });
  } catch (err) {
    next(err);
  }
});

export { router as authRouter };
