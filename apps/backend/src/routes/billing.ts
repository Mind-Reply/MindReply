import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { BillingService } from '../services/billingService';
import { logger } from '../utils/logger';

const router = express.Router();
const billingService = new BillingService();

/**
 * GET /api/billing/pricing - Get pricing tiers
 */
router.get('/pricing', (req, res) => {
  const tiers = billingService.getPricingTiers();
  res.json({ data: tiers });
});

/**
 * GET /api/billing/subscription - Get user subscription
 */
router.get('/subscription', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const subscription = await billingService.getUserSubscription(req.user.id);
    res.json({ data: subscription });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/billing/subscribe - Create subscription
 */
router.post('/subscribe', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { tier } = req.body;
    if (!tier) {
      return res.status(400).json({ error: 'Tier required' });
    }

    const subscription = await billingService.createSubscription(
      req.user.id,
      tier,
      req.user.email
    );

    logger.info('Subscription created', { userId: req.user.id, tier });
    res.json({ data: subscription });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/billing/upgrade - Upgrade subscription
 */
router.post('/upgrade', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { tier } = req.body;
    if (!tier) {
      return res.status(400).json({ error: 'Tier required' });
    }

    const result = await billingService.upgradeTier(req.user.id, tier);
    logger.info('Subscription upgraded', { userId: req.user.id, tier });
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/billing/cancel - Cancel subscription
 */
router.post('/cancel', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await billingService.cancelSubscription(req.user.id);
    logger.info('Subscription cancelled', { userId: req.user.id });
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/billing/history - Billing history
 */
router.get('/history', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const history = await billingService.getBillingHistory(req.user.id);
    res.json({ data: history });
  } catch (err) {
    next(err);
  }
});

export { router as billingRouter };
