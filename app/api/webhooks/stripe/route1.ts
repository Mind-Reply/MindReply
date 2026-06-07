import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id; // Pass this from your frontend checkout call
    const priceId = session.line_items?.data[0]?.price?.id;

    if (!userId || !priceId) {
      return NextResponse.json({ error: 'Missing userId or priceId' }, { status: 400 });
    }

    // Determine tier based on Price ID
    let tier = 'free';
    if (priceId === process.env.STRIPE_GROWTH_PRICE_ID) tier = 'growth';
    if (priceId === process.env.STRIPE_PRO_PRICE_ID) tier = 'pro';

    // Update user in Supabase (Assuming you have a 'profiles' or 'users' table)
    const { error } = await supabase
      .from('users')
      .update({ tier: tier, stripe_customer_id: session.customer })
      .eq('id', userId);

    if (error) {
      console.error('Supabase update error:', error);
ls      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

// Disable body parsing for Stripe webhooks
export const config = { api: { bodyParser: false } };
