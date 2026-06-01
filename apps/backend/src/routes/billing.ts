import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { BillingService } from '../services/billingService';
import { logger } from '../utils/logger';
import Stripe from 'stripe';

const router = express.Router();
const prisma = new PrismaClient();
const billingService = new BillingService();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

/**
 * GET /api/billing/pricing - Get pricing tiers
 */
router.get('/pricing', (req, res) => {
  const tiers = billingService.getPricingTiers();
  res.json({ data: tiers });
});

/**
 * GET /api/billing/subscription - Get current subscription
 */
router.get('/subscription', verifyToken, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    const subscription = await billingService.getUserSubscription(req.user.id);
    res.json({ data: subscription });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/billing/subscribe - Create or update subscription
 */
router.post('/subscribe', verifyToken, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    const { tier } = req.body;

    if (!tier || !['free', 'pro', 'agency', 'enterprise'].includes(tier)) {
      throw new AppError(400, 'Invalid tier');
    }

    // Get user email
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) throw new AppError(404, 'User not found');

    const subscription = await billingService.createSubscription(
      req.user.id,
      tier,
      user.email
    );

    res.json({
      data: subscription,
      message: `Subscribed to ${tier} tier`,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/billing/upgrade - Upgrade subscription tier
 */
router.post('/upgrade', verifyToken, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    const { newTier } = req.body;

    if (!newTier) throw new AppError(400, 'New tier required');

    await billingService.upgradeTier(req.user.id, newTier);

    res.json({
      message: `Upgraded to ${newTier}`,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/billing/cancel - Cancel subscription
 */
router.post('/cancel', verifyToken, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    await billingService.cancelSubscription(req.user.id);

    res.json({
      message: 'Subscription cancelled. Reverted to free tier.',
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/billing/invoices - Get billing history
 */
router.get('/invoices', verifyToken, async (req, res, next) => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized');

    const invoices = await billingService.getBillingHistory(req.user.id);

    res.json({ data: invoices });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/billing/webhook - Stripe webhook
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'customer.subscription.updated':
        logger.info('Subscription updated', { event });
        break;

      case 'customer.subscription.deleted':
        logger.info('Subscription deleted', { event });
        break;

      case 'invoice.payment_succeeded':
        logger.info('Payment succeeded', { event });
        break;

      case 'invoice.payment_failed':
        logger.warn('Payment failed', { event });
        // TODO: Send email notification
        break;
    }

    res.json({ received: true });
  } catch (err) {
    logger.error('Webhook error:', err);
    next(err);
  }
});

export { router as billingRouter };
