import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

export const PRICING_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    interval: 'month',
    limits: {
      briefs: 1,
      emails: 10,
      storage_gb: 1,
    },
    features: [
      'Basic brief generation',
      '1 brief per month',
      'Email management (10/mo)',
      'Basic analytics',
    ],
  },
  pro: {
    name: 'Pro',
    price: 2900, // $29/month in cents
    interval: 'month',
    stripePriceId: 'price_pro_monthly',
    limits: {
      briefs: 10,
      emails: 100,
      storage_gb: 10,
    },
    features: [
      'AI brief + SEO strategy',
      '10 briefs per month',
      'Email management (100/mo)',
      'Advanced analytics',
      'Custom templates',
      'Priority support',
    ],
  },
  agency: {
    name: 'Agency',
    price: 19900, // $199/month in cents
    interval: 'month',
    stripePriceId: 'price_agency_monthly',
    limits: {
      briefs: 999,
      emails: 999,
      storage_gb: 100,
    },
    features: [
      'Unlimited briefs',
      'Unlimited emails',
      'Team collaboration',
      'White-label option',
      'API access',
      'Dedicated support',
      'Advanced automation',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 0, // Custom pricing
    interval: 'month',
    stripePriceId: 'price_enterprise_monthly',
    limits: {
      briefs: 999,
      emails: 999,
      storage_gb: 1000,
    },
    features: [
      'Everything in Agency',
      'Dedicated strategist',
      'Custom integrations',
      'SLA guarantee',
      'Priority feature requests',
      '24/7 phone support',
    ],
  },
};

export class BillingService {
  /**
   * Get pricing tiers
   */
  getPricingTiers() {
    return PRICING_TIERS;
  }

  /**
   * Get user's current subscription
   */
  async getUserSubscription(userId: string) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
        include: { usage: true },
      });

      return subscription || { tier: 'free', status: 'active' };
    } catch (err) {
      logger.error('Failed to get subscription:', err);
      throw err;
    }
  }

  /**
   * Create Stripe customer and subscription
   */
  async createSubscription(
    userId: string,
    tier: string,
    email: string
  ) {
    try {
      if (tier === 'free') {
        // Create free tier subscription
        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            tier: 'free',
            status: 'active',
            stripeCustomerId: null,
            stripeSubscriptionId: null,
            currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
          update: { tier: 'free', status: 'active' },
        });

        logger.info('Free tier subscription created', { userId });
        return { tier: 'free', status: 'active' };
      }

      // Create Stripe customer
      const customer = await stripe.customers.create({
        email,
        metadata: { userId },
      });

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price: PRICING_TIERS[tier as keyof typeof PRICING_TIERS]
              .stripePriceId,
          },
        ],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      // Store in DB
      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          tier: tier as any,
          status: 'active',
          stripeCustomerId: customer.id,
          stripeSubscriptionId: subscription.id,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
        update: {
          tier: tier as any,
          stripeCustomerId: customer.id,
          stripeSubscriptionId: subscription.id,
        },
      });

      logger.info('Subscription created', { userId, tier });

      return {
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent
          ?.client_secret,
      };
    } catch (err) {
      logger.error('Failed to create subscription:', err);
      throw err;
    }
  }

  /**
   * Update subscription tier
   */
  async upgradeTier(userId: string, newTier: string) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
      });

      if (!subscription?.stripeSubscriptionId) {
        throw new Error('No Stripe subscription found');
      }

      // Get current subscription from Stripe
      const stripeSubscription = await stripe.subscriptions.retrieve(
        subscription.stripeSubscriptionId
      );

      // Update subscription
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        items: [
          {
            id: stripeSubscription.items.data[0].id,
            price: PRICING_TIERS[newTier as keyof typeof PRICING_TIERS]
              .stripePriceId,
          },
        ],
        proration_behavior: 'always_invoice',
      });

      // Update DB
      await prisma.subscription.update({
        where: { userId },
        data: { tier: newTier as any },
      });

      logger.info('Subscription upgraded', { userId, newTier });
      return { success: true };
    } catch (err) {
      logger.error('Failed to upgrade subscription:', err);
      throw err;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId: string) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
      });

      if (subscription?.stripeSubscriptionId) {
        await stripe.subscriptions.del(subscription.stripeSubscriptionId);
      }

      // Update to free tier
      await prisma.subscription.update({
        where: { userId },
        data: { tier: 'free', status: 'cancelled' },
      });

      logger.info('Subscription cancelled', { userId });
      return { success: true };
    } catch (err) {
      logger.error('Failed to cancel subscription:', err);
      throw err;
    }
  }

  /**
   * Get billing history for user
   */
  async getBillingHistory(userId: string) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
      });

      if (!subscription?.stripeCustomerId) {
        return [];
      }

      const invoices = await stripe.invoices.list({
        customer: subscription.stripeCustomerId,
        limit: 12,
      });

      return invoices.data.map((invoice) => ({
        id: invoice.id,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency.toUpperCase(),
        date: new Date(invoice.created * 1000),
        status: invoice.status,
        pdfUrl: invoice.invoice_pdf,
      }));
    } catch (err) {
      logger.error('Failed to get billing history:', err);
      throw err;
    }
  }
}
