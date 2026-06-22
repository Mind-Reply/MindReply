import rateLimit from 'express-rate-limit';
import { logger } from './logger';

/**
 * Global rate limiter: 100 requests per 15 minutes
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    if (req.user?.role === 'admin') return true;
    return false;
  },
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      userId: req.user?.id,
    });
    res.status(429).json({ error: 'Rate limit exceeded' });
  },
});

/**
 * API rate limiter: 1000 requests per hour per user
 */
export const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1000,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: 'API rate limit exceeded',
});

/**
 * Auth rate limiter: 5 failed attempts per 15 minutes
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.',
});

/**
 * Webhook rate limiter: 100 per minute
 */
export const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  keyGenerator: (req) => req.headers['x-webhook-signature'] || req.ip,
});
