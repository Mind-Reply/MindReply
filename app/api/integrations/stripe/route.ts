import { NextResponse } from 'next/server';
import { getStripe } from '../../../../lib/stripe';

export async function GET() {
  try {
    const stripe = getStripe();
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
      { revenue: 0, customers: 0, transactions: 0, status: 'error' },
      { status: 200 }
    );
  }
}
