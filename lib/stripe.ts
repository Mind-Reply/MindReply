import 'server-only'

import Stripe from 'stripe'

export const STRIPE_API_VERSION = '2024-04-10' as const;

let _stripe: Stripe | undefined;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: STRIPE_API_VERSION,
    });
  }
  return _stripe;
}


