import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getCreditPack } from "@/lib/credit-packs";

function isConfirmedCreditPayment(session: Stripe.Checkout.Session) {
  return session.status === "complete" && (session.payment_status === "paid" || session.payment_status === "no_payment_required");
}

function verificationResponse(input: {
  configured: boolean;
  confirmed: boolean;
  status: string;
  paymentStatus: string;
  credits: number | null;
  reason?: string | null;
}) {
  return NextResponse.json({
    configured: input.configured,
    confirmed: input.confirmed,
    status: input.status,
    paymentStatus: input.paymentStatus,
    credits: input.credits,
    fulfillment: {
      persisted: false,
      reason: input.reason ?? null,
    },
  });
}

export async function GET(req: NextRequest) {
  const requestedCredits = getCreditPack(req.nextUrl.searchParams.get("credits"))?.credits ?? null;
  const sessionId = req.nextUrl.searchParams.get("session_id");
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return verificationResponse({
      configured: false,
      confirmed: false,
      status: "stripe_not_configured",
      paymentStatus: "unknown",
      credits: requestedCredits,
      reason: "stripe_not_configured",
    });
  }

  if (!sessionId) {
    return NextResponse.json(
      {
        configured: true,
        confirmed: false,
        status: "missing_session_id",
        paymentStatus: "unknown",
        credits: requestedCredits,
        fulfillment: { persisted: false, reason: "missing_session_id" },
      },
      { status: 400 },
    );
  }

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.metadata?.type !== "credits") {
      return NextResponse.json(
        {
          configured: true,
          confirmed: false,
          status: "not_credit_session",
          paymentStatus: session.payment_status ?? "unknown",
          credits: null,
          fulfillment: { persisted: false, reason: "not_credit_session" },
        },
        { status: 400 },
      );
    }

    const pack = getCreditPack(session.metadata.credits);
    if (!pack) {
      return NextResponse.json(
        {
          configured: true,
          confirmed: false,
          status: "invalid_credit_pack",
          paymentStatus: session.payment_status ?? "unknown",
          credits: null,
          fulfillment: { persisted: false, reason: "invalid_credit_pack" },
        },
        { status: 400 },
      );
    }

    if (requestedCredits !== null && requestedCredits !== pack.credits) {
      return NextResponse.json(
        {
          configured: true,
          confirmed: false,
          status: "credit_pack_mismatch",
          paymentStatus: session.payment_status ?? "unknown",
          credits: pack.credits,
          fulfillment: { persisted: false, reason: "credit_pack_mismatch" },
        },
        { status: 400 },
      );
    }

    const confirmed = isConfirmedCreditPayment(session);
    return verificationResponse({
      configured: true,
      confirmed,
      status: session.status ?? "unknown",
      paymentStatus: session.payment_status ?? "unknown",
      credits: pack.credits,
      reason: confirmed ? "client_credit_wallet" : "payment_not_confirmed",
    });
  } catch (error) {
    console.error("Stripe credit session verification failed:", error);
    return NextResponse.json(
      {
        configured: true,
        confirmed: false,
        status: "lookup_failed",
        paymentStatus: "unknown",
        credits: requestedCredits,
        fulfillment: { persisted: false, reason: "lookup_failed" },
      },
      { status: 500 },
    );
  }
}
