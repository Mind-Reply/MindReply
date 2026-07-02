'use server'

import { getStripe } from '../../lib/stripe'
import { getPlan } from '../../lib/plans'

export async function startSubscriptionCheckout(planId: string) {
  const plan = getPlan(planId)

  if (!plan) {
    throw new Error(`Plan with id "${planId}" not found`)
  }

  const session = await getStripe().checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    mode: 'subscription',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `MindReply ${plan.name}`,
            description: `Up to ${plan.emails.toLocaleString()} emails per month`,
          },
          unit_amount: plan.priceInCents,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      },
    ],
  })

  return session.client_secret
}

export async function getCheckoutStatus(sessionId: string) {
  const session = await getStripe().checkout.sessions.retrieve(sessionId)

  return {
    status: session.status,
    paymentStatus: session.payment_status,
    customerEmail: session.customer_details?.email ?? null,
  }
}
