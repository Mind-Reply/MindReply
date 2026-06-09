import { NextResponse } from "next/server";

type ActionKind = "reply" | "schedule" | "resolve" | "escalate";
type Role = "owner" | "reviewer" | "operator";
type Redaction = "metadata" | "partial" | "full";

const actions = new Set<ActionKind>(["reply", "schedule", "resolve", "escalate"]);

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    owner_email?: string;
    role?: Role;
    synthesis?: string;
    recommended_action?: ActionKind;
    consent_granted?: boolean;
    redaction_level?: Redaction;
  };

  const ownerEmail = String(body.owner_email ?? "").trim().toLowerCase();
  const role = body.role ?? "owner";
  const action = body.recommended_action && actions.has(body.recommended_action) ? body.recommended_action : "reply";
  const consentGranted = body.consent_granted === true;
  const exportAllowed = Boolean(ownerEmail && role === "owner" && consentGranted);

  return NextResponse.json({
    decision_id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    owner_email: ownerEmail,
    role,
    synthesis: String(body.synthesis ?? "No synthesis provided.").replace(/\s+/g, " ").trim().slice(0, 320),
    recommended_action: action,
    consent_granted: consentGranted,
    redaction_level: body.redaction_level ?? "metadata",
    export_allowed: exportAllowed,
    reason: exportAllowed
      ? "Owner consent verified; export can be prepared."
      : "Owner export is held until owner identity and consent are verified.",
  });
}
