'use client'

import React, { useCallback } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { startSubscriptionCheckout } from '../actions/stripe'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
)

export default function StripeCheckout({ planId }: { planId: string }) {
  const fetchClientSecret = useCallback(async () => {
    const clientSecret = await startSubscriptionCheckout(planId)
    if (!clientSecret) {
      throw new Error('Failed to start checkout session')
    }
    return clientSecret
  }, [planId])

  return (
    <div id="checkout" className="w-full">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
