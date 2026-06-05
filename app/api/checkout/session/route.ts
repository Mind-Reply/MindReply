import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { fulfillMembershipPurchase, getMembershipEntitlement, normalizeMembershipTier } from "@/lib/fulfillment";

function stripeId(value: string | { id?: string } | null) {
  return typeof value === "string" ? value : value?.id ?? null;
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  const fallbackTier = normalizeMembershipTier(req.nextUrl.searchParams.get("tier"));
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({
      configured: false,
      confirmed: false,
      status: "stripe_not_configured",
      paymentStatus: "unknown",
      tier: fallbackTier,
      entitlement: getMembershipEntitlement(fallbackTier),
      fulfillment: { persisted: false, reason: "stripe_not_configured" },
    });
  }

  if (!sessionId) {
    return NextResponse.json({
      configured: true,
      confirmed: false,
      status: "missing_session_id",
      paymentStatus: "unknown",
      tier: fallbackTier,
      entitlement: getMembershipEntitlement(fallbackTier),
      fulfillment: { persisted: false, reason: "missing_session_id" },
    }, { status: 400 });
  }

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const tier = normalizeMembershipTier(session.metadata?.tier ?? fallbackTier);
    const confirmed = session.status === "complete" || session.payment_status === "paid" || session.payment_status === "no_payment_required";
    const fulfillment = confirmed
      ? await fulfillMembershipPurchase({
          tier,
          email: session.customer_details?.email ?? null,
          name: session.customer_details?.name ?? null,
          source: "checkout_session",
          stripeCustomerId: stripeId(session.customer),
          stripeSessionId: session.id,
          stripeSubscriptionId: stripeId(session.subscription),
        })
      : {
          entitlement: getMembershipEntitlement(tier),
          persisted: false,
          reason: "payment_not_confirmed" as const,
        };

    return NextResponse.json({
      configured: true,
      confirmed,
      id: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      tier,
      customerEmail: session.customer_details?.email ?? null,
      entitlement: fulfillment.entitlement,
      fulfillment: {
        persisted: fulfillment.persisted,
        reason: fulfillment.reason ?? null,
      },
    });
  } catch (error) {
    console.error("Stripe session lookup failed:", error);
    return NextResponse.json({
      configured: true,
      confirmed: false,
      status: "lookup_failed",
      paymentStatus: "unknown",
      tier: fallbackTier,
      entitlement: getMembershipEntitlement(fallbackTier),
      fulfillment: { persisted: false, reason: "lookup_failed" },
    }, { status: 500 });
  }
}
