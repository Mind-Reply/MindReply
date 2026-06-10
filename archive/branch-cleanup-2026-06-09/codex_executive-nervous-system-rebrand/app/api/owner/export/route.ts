import { NextResponse } from "next/server";

type ActionKind = "reply" | "schedule" | "resolve" | "escalate";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    owner_email?: string;
    synthesis?: string;
    recommended_action?: ActionKind;
    redaction_level?: string;
    receipt_id?: string;
    export_allowed?: boolean;
  };

  if (body.export_allowed !== true) {
    return NextResponse.json(
      {
        prepared: false,
        reason: "Owner export is held until owner identity and consent are verified.",
      },
      { status: 403 },
    );
  }

  const action = body.recommended_action ?? "reply";
  const bodyText = [
    "MindReply owner decision package",
    `Synthesis: ${String(body.synthesis ?? "No synthesis provided.").replace(/\s+/g, " ").trim().slice(0, 320)}`,
    `Recommended action: ${action}`,
    `Redaction level: ${body.redaction_level ?? "metadata"}`,
    `Receipt: ${body.receipt_id ?? crypto.randomUUID()}`,
    "Raw content is excluded unless the owner explicitly exports it.",
  ].join("\n");

  return NextResponse.json({
    prepared: true,
    export_id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    to: String(body.owner_email ?? "").trim().toLowerCase(),
    subject: "MindReply owner decision package",
    body: bodyText,
    recommended_action: action,
    redaction_level: body.redaction_level ?? "metadata",
    delivery_status: "prepared",
  });
}
