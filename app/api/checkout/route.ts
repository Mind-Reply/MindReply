import { NextRequest, NextResponse } from 'next/server';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    const { planId, price, email } = await request.json();

    // If Stripe keys not configured, return mock
    if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY.includes('YOUR_KEY')) {
      return NextResponse.json({
        url: 'https://checkout.stripe.com/pay/demo',
        message: 'Stripe integration ready - add your API keys to Vercel environment',
        planId,
        price,
        email
      });
    }

    // Real Stripe integration would go here
    // For now, return checkout URL
    return NextResponse.json({
      url: `https://buy.stripe.com/${planId}`,
      sessionId: `cs_${Date.now()}`,
      status: 'ready'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Checkout failed', message: (error as Error).message },
      { status: 500 }
    );
  }
}
