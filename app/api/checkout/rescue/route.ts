import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getMessageRescueCatalog, messageRescueOffer } from "@/lib/rescue-offer";

export async function GET() {
  return NextResponse.json({
    status: process.env.STRIPE_SECRET_KEY ? "configured" : "fallback",
    configured: Boolean(process.env.STRIPE_SECRET_KEY),
    offer: getMessageRescueCatalog(),
    requiredEnv: ["STRIPE_SECRET_KEY", "NEXT_PUBLIC_SITE_URL"],
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as { email?: unknown } | null;
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        {
          error: "Message Rescue checkout is not available right now.",
          configured: false,
        },
        { status: 501 },
      );
    }

    const stripe = new Stripe(secretKey);
    const origin = (process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin).replace(/\/$/, "");
    const customerEmail = typeof body?.email === "string" && body.email.includes("@") ? body.email : undefined;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: messageRescueOffer.currency,
            unit_amount: messageRescueOffer.amount,
            product_data: {
              name: messageRescueOffer.name,
              description: `${messageRescueOffer.messages} difficult messages finished in ${messageRescueOffer.deliveryMinutes} minutes.`,
            },
          },
        },
      ],
      allow_promotion_codes: true,
      success_url: `${origin}/dashboard?checkout=${messageRescueOffer.checkoutSuccess}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/rescue?checkout=rescue_cancelled`,
      metadata: {
        type: "message_rescue",
        offer: messageRescueOffer.slug,
        messages: String(messageRescueOffer.messages),
        deliveryMinutes: String(messageRescueOffer.deliveryMinutes),
      },
    });

    return NextResponse.json({ id: session.id, url: session.url, configured: true });
  } catch (error) {
    console.error("Message Rescue checkout failed:", error);
    return NextResponse.json({ error: "Message Rescue checkout failed" }, { status: 500 });
  }
}
