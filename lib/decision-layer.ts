export const forbiddenPublicTerms = ["ai", "chatbot", "productivity", "automation", "options", "boost", "hack"] as const;

export const redirectedPublicPaths = [
  "/analytics",
  "/book",
  "/booking",
  "/bookings",
  "/case-studies",
  "/dashboard",
  "/enterprise",
  "/ethics",
  "/forgot-password",
  "/integrations",
  "/lexicons",
  "/login",
  "/memberships",
  "/orchestrator",
  "/premium",
  "/professionals",
  "/rescue",
  "/session",
  "/sign-in",
  "/sign-up",
  "/signup",
  "/solutions",
  "/subconscious",
  "/tasks",
  "/terms",
  "/tools",
] as const;

export type IntakeSource = "manual" | "gmail" | "calendar" | "extension";
export type RecommendedActionKind = "reply" | "schedule" | "resolve" | "escalate";
export type RiskLevel = "low" | "medium" | "high";

export type IntakeRequest = {
  input: string;
  source: IntakeSource;
  userId?: string;
  devicePrivacyFlag?: boolean;
  consentFullContent?: boolean;
};

export type TriageContract = {
  importance: number;
  urgency: number;
  required_action: RecommendedActionKind;
  synthesis: string;
  confidence: number;
  playbook_id: string;
};

export type DecisionResponse = {
  synthesis: string;
  triage: TriageContract;
  mindRead: {
    reallyAbout: string;
    mindsetProtection: string;
    calmerMove: string;
  };
  recommendedAction: {
    kind: RecommendedActionKind;
    label: string;
    payload: Record<string, string | number | boolean | null>;
  };
  risk: {
    level: RiskLevel;
    reason: string;
    escalate: boolean;
  };
  memoryUpdate: {
    applied: boolean;
    summary: string;
  };
  receipt: {
    id: string;
    timestamp: string;
    source: IntakeSource;
    actionKind: RecommendedActionKind;
    riskLevel: RiskLevel;
    confidence: number;
    playbookId: string;
    playbookVersion: string;
    inputHash: string;
    rawContentRedacted: boolean;
    redactionLevel: "none" | "partial" | "full";
    signature: string;
  };
};

type Playbook = {
  id: string;
  version: string;
  title: string;
  action: RecommendedActionKind;
  triggers: string[];
  verificationRequired: boolean;
};

const playbooks: Playbook[] = [
  { id: "investor-ir-triage", version: "1.0", title: "Investor relations triage", action: "reply", triggers: ["investor", "shareholder", "term sheet", "funding", "due diligence"], verificationRequired: true },
  { id: "legal-risk-flag", version: "1.0", title: "Legal risk flag", action: "escalate", triggers: ["legal", "lawsuit", "regulator", "contract", "compliance"], verificationRequired: true },
  { id: "pr-crisis-triage", version: "1.0", title: "Public statement triage", action: "escalate", triggers: ["press", "journalist", "statement", "crisis", "media"], verificationRequired: true },
  { id: "deal-close-assistant", version: "1.0", title: "Deal close assistant", action: "reply", triggers: ["fee", "price", "proposal", "deal", "close"], verificationRequired: false },
  { id: "exec-inbox-zero", version: "1.0", title: "Executive inbox zero", action: "resolve", triggers: ["inbox", "newsletter", "fyi", "read later"], verificationRequired: false },
  { id: "meeting-outcome-actioner", version: "1.0", title: "Meeting outcome actioner", action: "schedule", triggers: ["meeting", "next step", "follow up", "check in"], verificationRequired: false },
  { id: "compliance-audit-trail", version: "1.0", title: "Compliance audit trail", action: "escalate", triggers: ["audit", "policy", "breach", "incident"], verificationRequired: true },
  { id: "customer-escalation", version: "1.0", title: "Customer escalation", action: "reply", triggers: ["client", "customer", "refund", "complaint"], verificationRequired: false },
  { id: "hiring-decision-helper", version: "1.0", title: "Hiring decision helper", action: "schedule", triggers: ["candidate", "interview", "hire", "recruit"], verificationRequired: false },
  { id: "finance-approval-flow", version: "1.0", title: "Finance approval flow", action: "escalate", triggers: ["invoice", "payment", "wire", "approval"], verificationRequired: true },
  { id: "product-launch-gatekeeper", version: "1.0", title: "Launch gatekeeper", action: "schedule", triggers: ["launch", "release", "ship", "go live"], verificationRequired: false },
  { id: "personal-life-triage", version: "1.0", title: "Personal life triage", action: "reply", triggers: ["family", "personal", "home", "appointment"], verificationRequired: false },
];

const highRiskTerms = ["threat", "force", "blackmail", "harass", "illegal", "lawsuit", "regulator", "self-harm", "suicide", "breach"];
const mediumRiskTerms = ["complaint", "refund", "termination", "medical", "legal", "fire", "contract", "wire"];

function cleanInput(input: string) {
  return input.replace(/\s+/g, " ").trim();
}

function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function makeReceiptId(input: string, timestamp: string, playbookId: string) {
  return `mr-${stableHash(`${timestamp}:${playbookId}:${input}`)}`;
}

function makeInputHash(input: string) {
  return `mrh-${stableHash(input)}`;
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function selectPlaybook(input: string): Playbook {
  const lower = input.toLowerCase();
  return playbooks.find((playbook) => playbook.triggers.some((trigger) => lower.includes(trigger))) ?? {
    id: "clear-next-move",
    version: "1.0",
    title: "Clear next move",
    action: "resolve",
    triggers: [],
    verificationRequired: false,
  };
}

function assessRisk(input: string): DecisionResponse["risk"] {
  const lower = input.toLowerCase();
  if (highRiskTerms.some((term) => lower.includes(term))) {
    return { level: "high", reason: "Risk detected before movement.", escalate: true };
  }
  if (mediumRiskTerms.some((term) => lower.includes(term))) {
    return { level: "medium", reason: "Sensitive context detected; proceed with restraint.", escalate: false };
  }
  return { level: "low", reason: "No blocking risk detected.", escalate: false };
}

function chooseAction(input: string, playbook: Playbook, risk: DecisionResponse["risk"]): RecommendedActionKind {
  if (risk.escalate || (playbook.verificationRequired && risk.level !== "low")) return "escalate";
  const lower = input.toLowerCase();
  if (/(follow up|check in|tomorrow|next week|calendar|later|meeting)/.test(lower)) return "schedule";
  if (/(reply|client|customer|email|message|fee|price|response|send|proposal)/.test(lower)) return "reply";
  return playbook.action;
}

function buildSynthesis(input: string, kind: RecommendedActionKind) {
  if (!input) return "No usable input was provided.";
  if (kind === "escalate") return "This carries risk and needs review before movement.";
  if (kind === "reply") return "This needs a calm response that reduces pressure and preserves the relationship.";
  if (kind === "schedule") return "This needs a quiet follow-up moment rather than more wording now.";
  return "This can be closed with a clear record and no further movement.";
}

function buildTriage(input: string, source: IntakeSource, risk: DecisionResponse["risk"], playbook: Playbook): TriageContract {
  const action = chooseAction(input, playbook, risk);
  const lower = input.toLowerCase();
  const urgency = clamp((/(today|urgent|immediately|deadline|now)/.test(lower) ? 78 : 36) + (risk.level === "high" ? 18 : risk.level === "medium" ? 8 : 0));
  const importance = clamp((playbook.verificationRequired ? 82 : 52) + (source === "manual" ? 0 : 6) + (risk.level === "high" ? 10 : 0));
  return {
    importance,
    urgency,
    required_action: action,
    synthesis: buildSynthesis(input, action),
    confidence: 0.84,
    playbook_id: playbook.id,
  };
}

function buildMindRead(kind: RecommendedActionKind, risk: DecisionResponse["risk"]): DecisionResponse["mindRead"] {
  if (risk.level === "high" || kind === "escalate") {
    return {
      reallyAbout: "This is not only about wording; it is about preventing pressure from becoming a risky move.",
      mindsetProtection: "You are trying to regain control quickly. The steadier signal is restraint before response.",
      calmerMove: "Hold the message, review the context, and keep the next step measured.",
    };
  }

  if (kind === "reply") {
    return {
      reallyAbout: "This is less about the surface objection and more about trust, timing, and whether the relationship still feels steady.",
      mindsetProtection: "You are protecting the relationship without giving away your position too quickly.",
      calmerMove: "Answer with warmth and limits: acknowledge the concern, name the decision point, and keep the timing clear.",
    };
  }

  if (kind === "schedule") {
    return {
      reallyAbout: "This needs rhythm more than more language. The right move is to place the pressure somewhere contained.",
      mindsetProtection: "You are protecting your attention from being pulled back into the same decision repeatedly.",
      calmerMove: "Set one quiet follow-up moment, then stop carrying it in your head.",
    };
  }

  return {
    reallyAbout: "This is ready to be closed without turning it into a larger decision.",
    mindsetProtection: "You are looking for certainty before moving, but the clean record is enough here.",
    calmerMove: "Mark the decision clearly, keep the receipt, and let it leave your attention.",
  };
}

function buildAction(kind: RecommendedActionKind, synthesis: string): DecisionResponse["recommendedAction"] {
  if (kind === "reply") {
    return {
      kind,
      label: "Send the prepared reply",
      payload: {
        draft:
          "Thank you for being direct. I understand the concern. The next step is to confirm the decision point, protect the relationship, and agree the timing.",
      },
    };
  }
  if (kind === "schedule") {
    return {
      kind,
      label: "Set the follow-up",
      payload: {
        title: "MindReply follow-up",
        delayMinutes: 60,
      },
    };
  }
  if (kind === "escalate") {
    return {
      kind,
      label: "Hold and review",
      payload: {
        reason: synthesis,
        verificationRequired: true,
      },
    };
  }
  return {
    kind,
    label: "Mark resolved",
    payload: {
      record: synthesis,
    },
  };
}

function redactionLevel(request: IntakeRequest): DecisionResponse["receipt"]["redactionLevel"] {
  if (request.devicePrivacyFlag) return "full";
  if (request.consentFullContent) return "partial";
  return "full";
}

export function buildDecisionResponse(request: IntakeRequest): DecisionResponse {
  const input = cleanInput(request.input);
  const timestamp = new Date().toISOString();
  const playbook = selectPlaybook(input);
  const risk = assessRisk(input);
  const triage = buildTriage(input, request.source, risk, playbook);
  const synthesis = triage.synthesis;
  const receiptId = makeReceiptId(input, timestamp, playbook.id);
  const confidence = triage.confidence;
  const redaction = redactionLevel(request);

  return {
    synthesis,
    triage,
    mindRead: buildMindRead(triage.required_action, risk),
    recommendedAction: buildAction(triage.required_action, synthesis),
    risk,
    memoryUpdate: {
      applied: true,
      summary: "Decision memory adjusted quietly.",
    },
    receipt: {
      id: receiptId,
      timestamp,
      source: request.source,
      actionKind: triage.required_action,
      riskLevel: risk.level,
      confidence,
      playbookId: playbook.id,
      playbookVersion: playbook.version,
      inputHash: makeInputHash(input),
      rawContentRedacted: true,
      redactionLevel: redaction,
      signature: stableHash(`receipt:${receiptId}:${playbook.version}:${redaction}`),
    },
  };
}

export function isRedirectedPublicPath(pathname: string) {
  return redirectedPublicPaths.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
