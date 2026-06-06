import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getMessageRescueCatalog, messageRescueOffer } from "@/lib/rescue-offer";

function isConfirmedRescuePayment(session: Stripe.Checkout.Session) {
  return session.status === "complete" && (session.payment_status === "paid" || session.payment_status === "no_payment_required");
}

function rescueVerificationResponse(input: {
  configured: boolean;
  confirmed: boolean;
  status: string;
  paymentStatus: string;
  reason?: string | null;
}) {
  return NextResponse.json({
    configured: input.configured,
    confirmed: input.confirmed,
    status: input.status,
    paymentStatus: input.paymentStatus,
    offer: getMessageRescueCatalog(),
    fulfillment: {
      persisted: false,
      reason: input.reason ?? null,
    },
  });
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return rescueVerificationResponse({
      configured: false,
      confirmed: false,
      status: "stripe_not_configured",
      paymentStatus: "unknown",
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
        offer: getMessageRescueCatalog(),
        fulfillment: { persisted: false, reason: "missing_session_id" },
      },
      { status: 400 },
    );
  }

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.metadata?.type !== "message_rescue") {
      return NextResponse.json(
        {
          configured: true,
          confirmed: false,
          status: "not_rescue_session",
          paymentStatus: session.payment_status ?? "unknown",
          offer: getMessageRescueCatalog(),
          fulfillment: { persisted: false, reason: "not_rescue_session" },
        },
        { status: 400 },
      );
    }

    if (
      session.metadata.offer !== messageRescueOffer.slug ||
      session.metadata.messages !== String(messageRescueOffer.messages) ||
      session.metadata.deliveryMinutes !== String(messageRescueOffer.deliveryMinutes)
    ) {
      return NextResponse.json(
        {
          configured: true,
          confirmed: false,
          status: "rescue_offer_mismatch",
          paymentStatus: session.payment_status ?? "unknown",
          offer: getMessageRescueCatalog(),
          fulfillment: { persisted: false, reason: "rescue_offer_mismatch" },
        },
        { status: 400 },
      );
    }

    const confirmed = isConfirmedRescuePayment(session);
    return rescueVerificationResponse({
      configured: true,
      confirmed,
      status: session.status ?? "unknown",
      paymentStatus: session.payment_status ?? "unknown",
      reason: confirmed ? "client_rescue_delivery" : "payment_not_confirmed",
    });
  } catch (error) {
    console.error("Message Rescue session verification failed:", error);
    return NextResponse.json(
      {
        configured: true,
        confirmed: false,
        status: "lookup_failed",
        paymentStatus: "unknown",
        offer: getMessageRescueCatalog(),
        fulfillment: { persisted: false, reason: "lookup_failed" },
      },
      { status: 500 },
    );
  }
}
