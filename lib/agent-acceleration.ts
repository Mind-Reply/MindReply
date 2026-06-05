import { activeAgentRoster } from "@/lib/agent-roster";

const directActions = [
  { label: "Production smoke", href: "/api/health", owner: "Vercel Deployment Watch", outcome: "Confirm site and API health before scaling traffic." },
  { label: "MRagent sales check", href: "/agent", owner: "MRagent Quality Auditor", outcome: "Confirm broad chat, credits, booking, and Growth/Pro routing." },
  { label: "Buy credits", href: "/tools", owner: "Stripe Checkout Monitor", outcome: "Move tool users directly into 5-credit or 20-credit checkout." },
  { label: "Book video session", href: "/professionals", owner: "Membership Activation Specialist", outcome: "Route urgent users to field professional video/voice/text rooms." },
  { label: "Upgrade memory", href: "/memberships", owner: "Subscription Retention Operator", outcome: "Convert Signal to Growth and Growth to Pro." },
  { label: "Ops status", href: "/api/ops/status", owner: "Incident Commander", outcome: "Expose provider fallbacks, owners, and next actions." },
  { label: "Integration status", href: "/api/integrations/status", owner: "Slack/Gmail/Notion Operators", outcome: "Show Pro integration readiness and missing provider setup." },
  { label: "Revenue observer", href: "/api/revenue/observer", owner: "Pipeline Signal Analyst", outcome: "Track 10-sales/day gap and revenue action queue." },
] as const;

const laneObjectives = [
  { lane: "revenue", priority: "P0", targetMinutes: 15, directive: "Push every qualified visitor to credits, booking, Growth, or Pro within one interaction." },
  { lane: "platform", priority: "P0", targetMinutes: 10, directive: "Keep deploy, health, auth, checkout, and integration status visible without silent failures." },
  { lane: "trust", priority: "P1", targetMinutes: 20, directive: "Route high-stakes clinical, legal, finance, and executive cases to professional review." },
  { lane: "intelligence", priority: "P1", targetMinutes: 20, directive: "Improve MRagent quality, usage insight, SEO reach, and daily executive reporting." },
] as const;

export function getAgentAccelerationCommand() {
  const byLane = activeAgentRoster.reduce<Record<string, number>>((acc, agent) => {
    acc[agent.lane] = (acc[agent.lane] ?? 0) + 1;
    return acc;
  }, {});

  return {
    status: "ready",
    mode: "x66 acceleration",
    multiplier: 66,
    totalActiveAgents: activeAgentRoster.length,
    command: "Collapse observation to action: every desk must report owner, route, evidence, and next revenue move.",
    target: "Faster paid conversion, faster provider issue detection, faster session delivery, and less passive UX.",
    byLane,
    laneObjectives,
    directActions,
    operatingRules: [
      "No passive observation without a linked action route.",
      "Revenue desks prioritize credits, bookings, Growth, and Pro before broad marketing.",
      "Platform desks verify health, checkout, auth, integrations, and smoke routes first.",
      "Trust desks route regulated or high-risk cases to professional review.",
      "Every handoff records evidence, owner, and next action.",
    ],
  };
}
