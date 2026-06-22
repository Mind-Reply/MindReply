import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

export async function GET() {
  try {
    const [customers, charges, subscriptions] = await Promise.all([
      stripe.customers.list({ limit: 100 }),
      stripe.charges.list({ limit: 100 }),
      stripe.subscriptions.list({ limit: 100 }),
    ]);

    const revenue = charges.data.reduce((sum, charge) => sum + (charge.amount || 0), 0) / 100;

    return NextResponse.json({
      revenue: Math.round(revenue),
      customers: customers.data.length,
      transactions: charges.data.length,
      status: 'connected',
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { revenue: 0, customers: 0, transactions: 0, status: 'error', error: String(error) },
      { status: 200 }
    );
  }
}
