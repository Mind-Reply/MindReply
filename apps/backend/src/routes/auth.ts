import express from 'express';
import { validateRequest, loginSchema, signupSchema } from '../middleware/validation';
import { generateToken } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import bcrypt from 'bcryptjs';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * POST /api/auth/signup - Register new user
 */
router.post('/signup', validateRequest(signupSchema), async (req, res, next) => {
  try {
    const { email, name, password, agencyName } = req.validated;

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create agency
    const agency = await prisma.agency.create({
      data: { name: agencyName },
    });

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        agencyId: agency.id,
        authProvider: 'email',
        role: 'admin', // First user is admin
      },
    });

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      agencyId: user.agencyId,
      role: user.role,
    });

    logger.info('User registered', { userId: user.id, email });

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, agencyId: agency.id },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login - Login user
 */
router.post('/login', validateRequest(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.validated;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      agencyId: user.agencyId,
      role: user.role,
    });

    logger.info('User logged in', { userId: user.id, email });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, agencyId: user.agencyId },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/me - Get current user
 */
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Token verification handled by middleware in real implementation
    res.json({ message: 'User info endpoint' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export { router as authRouter };
