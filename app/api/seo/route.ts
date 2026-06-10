import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const seoDemandManifest = {
  updatedAt: "2026-06-09",
  product: "MindReply",
  primaryOffer: "Website Completion Package",
  revenuePriority: "Sell the GBP 600 Website Completion Package before expanding low-conversion integrations.",
  positioning: [
    {
      lane: "AI decision support",
      intent: "Operators need a recommended next move, not a long draft or generic brainstorm.",
      homepageMessage: "Confident replies, clear decisions, and a cleaner website in 24 hours.",
      allowedClaims: ["one synthesis", "one action queue", "risk and confidence labels"],
    },
    {
      lane: "AI email reply assistant",
      intent: "Teams need warmer escalation, fewer delayed replies, and less communication pressure.",
      homepageMessage: "Turn pressure into a send-ready message.",
      allowedClaims: ["send-ready replies", "assisted close", "privacy-safe receipt"],
    },
    {
      lane: "Website conversion rescue",
      intent: "Service businesses need clearer offers, better proof, and lower buying friction.",
      homepageMessage: "Website Completion Package: fixed-scope clarity for overloaded websites.",
      allowedClaims: ["ranked action queue", "buyer-ready language", "GBP 600 fixed-scope package"],
    },
    {
      lane: "AI search visibility",
      intent: "Buyers increasingly compare services through answer engines and summaries.",
      homepageMessage: "Structured proof, simple claims, and clear service language.",
      allowedClaims: ["structured data", "plain-language offer", "evidence-tied claims"],
    },
  ],
  languages: ["en", "es", "fr", "de", "it", "pt", "nl", "pl", "uk", "bg"],
  requiredChecks: [
    "homepage title and description mention premium reply intelligence",
    "Website Completion Package appears above the fold",
    "GBP 600 package buttons remain visible",
    "language selector remains available on mobile and desktop",
    "no public claim of active integrations without credentials and proof",
  ],
};

export function GET() {
  return NextResponse.json(seoDemandManifest, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
