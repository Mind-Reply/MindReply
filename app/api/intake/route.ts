import { NextResponse } from "next/server";

type ActionKind = "reply" | "schedule" | "resolve" | "escalate";
type RiskLevel = "low" | "medium" | "high";

type Signal = {
  pattern: RegExp;
  importance: number;
  urgency: number;
  action: ActionKind;
};

const signals: Signal[] = [
  { pattern: /\b(urgent|asap|blocked|deadline|today)\b/i, importance: 86, urgency: 91, action: "reply" },
  { pattern: /\b(legal|contract|claim|breach|liability|termination|harassment)\b/i, importance: 96, urgency: 88, action: "escalate" },
  { pattern: /\b(calendar|meeting|call|available|schedule|tomorrow)\b/i, importance: 70, urgency: 72, action: "schedule" },
  { pattern: /\b(done|resolved|approved|complete|thank you|thanks)\b/i, importance: 35, urgency: 26, action: "resolve" },
  { pattern: /\b(invoice|payment|overdue|billing|refund)\b/i, importance: 82, urgency: 76, action: "reply" },
];

function trimSignal(value: string) {
  const cleaned = value.trim().replace(/\s+/g, " ");
  if (!cleaned) return "No usable signal was provided.";
  return cleaned.length > 132 ? `${cleaned.slice(0, 129).trim()}...` : cleaned;
}

function assessRisk(text: string): RiskLevel {
  if (/\b(legal|claim|breach|liability|termination|harassment)\b/i.test(text)) return "high";
  if (/\b(sensitive|angry|refund|deadline|urgent|board)\b/i.test(text)) return "medium";
  return "low";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    input?: string;
    context?: string;
    devicePrivacyFlag?: boolean;
  };
  const input = String(body.input ?? "");
  const context = String(body.context ?? "");
  const combined = `${input} ${context}`;
  const match = signals
    .filter((signal) => signal.pattern.test(combined))
    .sort((a, b) => b.importance + b.urgency - (a.importance + a.urgency))[0];

  const action = match?.action ?? "reply";
  const risk = assessRisk(combined);
  const recommendedAction: ActionKind = risk === "high" ? "escalate" : action;

  return NextResponse.json({
    synthesis: `${trimSignal(input)} Recommended action: ${recommendedAction}.`,
    recommended_action: recommendedAction,
    risk,
    importance: match?.importance ?? 45,
    urgency: match?.urgency ?? 35,
    memory_update: body.devicePrivacyFlag
      ? "Pattern retained on device. Raw signal stays out of memory."
      : "Pattern retained silently. Raw signal is not stored.",
  });
}
