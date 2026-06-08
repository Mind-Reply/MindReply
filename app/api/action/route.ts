import { NextResponse } from "next/server";

type ActionKind = "reply" | "schedule" | "resolve" | "escalate";

const allowed = new Set<ActionKind>(["reply", "schedule", "resolve", "escalate"]);

function actionCopy(action: ActionKind, synthesis: string) {
  if (action === "reply") return `Thanks. I understand the concern and will respond today. ${synthesis}`;
  if (action === "schedule") return "A short hold has been prepared for the next available window.";
  if (action === "resolve") return "The thread has been closed with a private receipt.";
  return "Execution is paused. A review is required before this leaves the system.";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    synthesis?: string;
    recommended_action?: ActionKind;
  };
  const synthesis = String(body.synthesis ?? "No synthesis provided.").slice(0, 320);
  const requested = body.recommended_action;
  const recommendedAction: ActionKind = requested && allowed.has(requested) ? requested : "reply";
  const blocked = recommendedAction === "escalate";

  return NextResponse.json({
    synthesis,
    recommended_action: recommendedAction,
    prepared: !blocked,
    blocked,
    prepared_text: actionCopy(recommendedAction, synthesis),
    receipt_id: crypto.randomUUID(),
  });
}
