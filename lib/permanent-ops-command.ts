import { activeAgentRoster, agentRoster, agentRosterSummary } from "@/lib/agent-roster";
import { logMetric } from "@/lib/metrics";
import { getOpsReportRecipient } from "@/lib/ops-report-config";
import { getRevenueObservation } from "@/lib/revenue-observer";

export type AgentLearningRecordInput = {
  agentId?: string;
  lesson: string;
  source?: string;
  impact?: string;
};

const departments = [
  { name: "Engineering Ops", targetRoles: 20, mission: "Deploy, monitor, patch, and protect production systems." },
  { name: "Advertising And Paid Growth", targetRoles: 12, mission: "Drive verified qualified demand without scaling broken tracking." },
  { name: "SEO And Content", targetRoles: 10, mission: "Grow durable organic reach in priority countries and professions." },
  { name: "Engagement And Community", targetRoles: 8, mission: "Keep users activated, satisfied, referred, and supported." },
  { name: "Ad Ops And Analytics QA", targetRoles: 6, mission: "Prove conversion tracking, spend quality, and funnel attribution." },
  { name: "Security And Compliance", targetRoles: 4, mission: "Protect secrets, access, headers, abuse signals, and audit trails." },
] as const;

const learningModules = [
  "Production health and provider fallback response",
  "Stripe checkout, webhook, entitlement, and failed-payment recovery",
  "Clerk login, admin access, and session verification",
  "GTM, Google Ads, Meta Pixel, and conversion evidence",
  "High-trust communication boundaries for clinical, legal, finance, and executive use cases",
  "Search demand research for UK, US, Canada, Australia, Germany, Singapore, India, Ireland, Netherlands, and UAE",
  "Sentry incident triage and written handoff discipline",
  "Member satisfaction, engagement loops, referral prompts, and support escalation",
] as const;

function countActiveByDepartment(name: string) {
  if (name === "Engineering Ops") {
    return activeAgentRoster.filter((agent) => ["Platform Operations", "Auth And Security"].includes(agent.field)).length;
  }
  if (name === "Advertising And Paid Growth") {
    return activeAgentRoster.filter((agent) => agent.field === "Growth And Sales").length;
  }
  if (name === "SEO And Content") {
    return activeAgentRoster.filter((agent) => agent.field === "Content And SEO").length;
  }
  if (name === "Engagement And Community") {
    return activeAgentRoster.filter((agent) => ["Data And Intelligence", "Clinical Communication"].includes(agent.field)).length;
  }
  if (name === "Ad Ops And Analytics QA") {
    return activeAgentRoster.filter((agent) => ["Growth And Sales", "Data And Intelligence"].includes(agent.field)).length;
  }
  return activeAgentRoster.filter((agent) => agent.field === "Auth And Security").length;
}

export async function getPermanentOpsCommand() {
  const revenue = await getRevenueObservation();
  const summary = agentRosterSummary();
  const departmentPlan = departments.map((department) => {
    const activeNow = countActiveByDepartment(department.name);
    return {
      ...department,
      activeNow,
      hiringGap: Math.max(0, department.targetRoles - activeNow),
      recruiterAction: activeNow >= department.targetRoles
        ? "Maintain backup coverage and replace churn immediately."
        : `Recruit ${department.targetRoles - activeNow} more vetted operators and assign shift evidence requirements.`,
    };
  });

  return {
    status: revenue.status === "green" ? "growth-ready" : "needs-provider-and-revenue-work",
    generatedAt: new Date().toISOString(),
    reportRecipient: getOpsReportRecipient(),
    reportCadence: "08:00 and 20:00 UTC through Vercel Cron",
    revenueTarget: {
      dailySales: revenue.targetPerDay,
      todaySales: revenue.todaySales,
      firstWeekTarget: revenue.firstWeek.targetSales,
      firstWeekActual: revenue.firstWeek.actualSales,
      firstWeekGap: revenue.firstWeek.gap,
    },
    staffing: {
      totalPermanentRoles: agentRoster.length,
      activeAutomationDesks: activeAgentRoster.length,
      summary,
      departmentPlan,
    },
    learning: {
      cadence: "Every shift reads the last handoff, adds one lesson, and updates the next owner before closing.",
      modules: learningModules,
      persistence: "POST /api/agents/learning with CRON_SECRET records lessons into metrics when DATABASE_URL is configured.",
    },
    engagement: {
      mission: "Keep users satisfied through immediate product delivery, clear next action, support triage, and referral prompts.",
      signals: [
        "checkout confirmation",
        "dashboard product access",
        "tool usage",
        "booking fulfillment",
        "support issue resolved",
        "referral copied",
      ],
    },
    guardrails: [
      "Do not paste secrets into chat, issues, docs, or email.",
      "Do not scale paid ads when checkout, analytics, webhooks, or monitoring are fallback.",
      "Do not claim regulated professional advice without qualified human review.",
      "Use provider dashboards as source of truth for payments, ads, and email delivery.",
    ],
  };
}

export async function recordAgentLearning(input: AgentLearningRecordInput) {
  const lesson = input.lesson.trim();
  if (!lesson) {
    return { recorded: false, reason: "missing_lesson" as const };
  }

  const result = await logMetric({
    eventName: "agent.learning.handoff",
    eventValue: {
      agentId: input.agentId?.trim() || "MR-OPS",
      lesson,
      source: input.source?.trim() || "operator",
      impact: input.impact?.trim() || "not_set",
    },
  });

  return {
    recorded: result.logged,
    reason: result.logged ? undefined : result.reason,
  };
}
