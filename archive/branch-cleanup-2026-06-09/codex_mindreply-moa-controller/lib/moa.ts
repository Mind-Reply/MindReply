export type AgentPriority = "primary" | "support" | "observer";
export type AgentStatus = "active";

export type SpecialistAgent = {
  id: string;
  name: string;
  domain: string;
  signals: string[];
  responsibilities: string[];
  boundary: string;
  requiredOutputFormats: string[];
};

export type RoutedAgent = SpecialistAgent & {
  status: AgentStatus;
  priority: AgentPriority;
  matchedSignals: string[];
  output: {
    headline: string;
    assessment: string;
    actionItems: string[];
    evidence: string;
    requiredFormat: string;
    boundaryCheck: string;
  };
};

export type ValidationResult = {
  valid: boolean;
  checkedAgents: number;
  expectedAgents: number;
  missingAgents: string[];
  inactiveAgents: string[];
  incompleteOutputs: string[];
  domainBoundaryViolations: string[];
  duplicateAgents: string[];
  confidenceScore: number;
  validationSummary: string;
};

export type OrchestratedGoal = {
  userGoal: string;
  goal: string;
  masterOrchestratorAgent: typeof MASTER_ORCHESTRATOR_AGENT;
  taskRoutingLayer: RoutedAgent[];
  validation: ValidationResult;
  finalCombinedResult: {
    summary: string;
    primaryAgents: string[];
    nextActions: string[];
    visibleResult: string;
    rolloutPhase: string;
  };
};

export const MASTER_ORCHESTRATOR_AGENT = {
  name: "Master Orchestrator Agent (MOA)",
  mode: "user-facing-control-plane",
  routingPolicy:
    "User talks to MOA only. MOA assigns specialist tasks, validates structured outputs, rejects conflicts, and returns one combined result.",
};

export const MOA_AGENTS: SpecialistAgent[] = [
  {
    id: "infrastructure",
    name: "Infrastructure Agent",
    domain: "Hosting, DNS, SSL, routing, environments, and platform runtime",
    signals: ["infrastructure", "cloud", "hosting", "runtime", "scaling", "observability", "platform", "vercel"],
    responsibilities: ["Map runtime requirements", "Identify capacity and environment risks", "Define monitoring and reliability checkpoints"],
    boundary: "Owns hosting and runtime only; does not change pipelines, application logic, or secrets policy.",
    requiredOutputFormats: ["checklist", "config", "logs or error analysis"],
  },
  {
    id: "devops",
    name: "DevOps Agent",
    domain: "CI/CD, pipelines, runners, deployments, releases, and rollback gates",
    signals: ["devops", "ci", "cd", "pipeline", "deploy", "deployment", "release", "rollback", "build"],
    responsibilities: ["Prepare release pipeline actions", "Define build and rollback gates", "Coordinate deployment sequencing"],
    boundary: "Owns CI/CD and release flow only; does not own hosting infrastructure, product UI, or code architecture.",
    requiredOutputFormats: ["step-by-step plan", "config", "logs or error analysis"],
  },
  {
    id: "security",
    name: "Security Agent",
    domain: "Secrets, environment variables, vulnerabilities, privacy, authorization, and abuse prevention",
    signals: ["security", "secure", "privacy", "auth", "permission", "compliance", "risk", "harden"],
    responsibilities: ["Identify security-sensitive surfaces", "Add validation and authorization checkpoints", "Define audit and privacy controls"],
    boundary: "Owns security controls only; does not own feature copy, growth offers, or deployment sequencing.",
    requiredOutputFormats: ["checklist", "JSON", "logs or error analysis"],
  },
  {
    id: "frontend",
    name: "Frontend Agent",
    domain: "UI pages, client components, interaction states, and responsive frontend behavior",
    signals: ["frontend", "client", "react", "page", "component", "dashboard", "screen", "interface"],
    responsibilities: ["Shape user-facing screens", "Define responsive interaction states", "Keep visible output clear and actionable"],
    boundary: "Owns client UI implementation only; does not own APIs, database schema, or pricing strategy.",
    requiredOutputFormats: ["code block", "checklist", "step-by-step plan"],
  },
  {
    id: "backend",
    name: "Backend Agent",
    domain: "APIs, server logic, routing, service contracts, and orchestration endpoints",
    signals: ["backend", "api", "apis", "endpoint", "service", "server", "logic", "contract"],
    responsibilities: ["Define service contracts", "Coordinate server-side orchestration", "Handle request validation and errors"],
    boundary: "Owns server contracts only; does not own frontend presentation, database migrations, or external vendor setup.",
    requiredOutputFormats: ["code block", "JSON", "logs or error analysis"],
  },
  {
    id: "database",
    name: "Database Agent",
    domain: "Schemas, migrations, queries, persistence, analytics data, and consistency",
    signals: ["database", "data", "postgres", "schema", "migration", "query", "analytics", "storage"],
    responsibilities: ["Map persistence requirements", "Protect data consistency", "Plan schema or analytics changes"],
    boundary: "Owns data persistence only; does not own API behavior, UI display, or infrastructure sizing.",
    requiredOutputFormats: ["config", "JSON", "checklist"],
  },
  {
    id: "ai-reasoning",
    name: "AI Reasoning Agent",
    domain: "Logic, workflows, planning, decision rules, evaluations, and reasoning quality",
    signals: ["ai", "reasoning", "agent", "orchestrator", "planning", "decision", "evaluate", "moa"],
    responsibilities: ["Decompose the goal into specialist work", "Resolve cross-agent dependencies", "Create validation criteria"],
    boundary: "Owns reasoning design only; does not own marketing copy, UI, or vendor deployment.",
    requiredOutputFormats: ["architecture diagram", "step-by-step plan", "JSON"],
  },
  {
    id: "ai-content",
    name: "AI Content Agent",
    domain: "Writing, SEO, marketing copy, response tone, generated content, and knowledge outputs",
    signals: ["content", "copy", "message", "email", "tone", "communication", "knowledge", "writing"],
    responsibilities: ["Draft user-facing language", "Adapt tone and format", "Check clarity of generated output"],
    boundary: "Owns language output only; does not own conversion strategy, support policy, or product UX structure.",
    requiredOutputFormats: ["code block", "checklist", "step-by-step plan"],
  },
  {
    id: "automation",
    name: "AI Automation Agent",
    domain: "Workflow automation, scheduled jobs, triggers, handoffs",
    signals: ["automation", "workflow", "trigger", "schedule", "task", "handoff", "autonomous"],
    responsibilities: ["Find repeatable workflow steps", "Define trigger and handoff rules", "Reduce manual platform operations"],
    boundary: "Owns workflow automation only; does not own CI/CD runners, database design, or user support content.",
    requiredOutputFormats: ["step-by-step plan", "JSON", "config"],
  },
  {
    id: "ux-ui",
    name: "UX/UI Agent",
    domain: "User journeys, flows, wireframes, visual hierarchy, accessibility, and usability",
    signals: ["ux", "ui", "design", "usability", "accessibility", "layout", "experience"],
    responsibilities: ["Clarify screen hierarchy", "Protect accessibility and scanability", "Make results visible to the user"],
    boundary: "Owns experience design only; does not own implementation internals, backend contracts, or revenue model.",
    requiredOutputFormats: ["architecture diagram", "checklist", "step-by-step plan"],
  },
  {
    id: "growth",
    name: "Growth Agent",
    domain: "Funnels, campaigns, social growth, activation, conversion, retention, and expansion loops",
    signals: ["growth", "conversion", "retention", "activation", "launch", "marketing", "expand", "expansion"],
    responsibilities: ["Identify adoption levers", "Tie platform work to business outcomes", "Define launch and expansion actions"],
    boundary: "Owns growth motion only; does not own pricing, product UI implementation, or support operations.",
    requiredOutputFormats: ["checklist", "step-by-step plan", "JSON"],
  },
  {
    id: "support",
    name: "Support Agent",
    domain: "Onboarding, troubleshooting, support flows, help content, and service quality",
    signals: ["support", "help", "ticket", "customer", "service", "faq", "troubleshoot"],
    responsibilities: ["Prepare user support paths", "Identify failure recovery messages", "Turn issues into clear next steps"],
    boundary: "Owns support readiness only; does not own marketing strategy, infrastructure, or application code.",
    requiredOutputFormats: ["checklist", "logs or error analysis", "step-by-step plan"],
  },
  {
    id: "research",
    name: "Research Agent",
    domain: "New tools, upgrades, market evidence, technical evidence, user research, and competitor research",
    signals: ["research", "market", "competitor", "evidence", "learn", "discover", "benchmark"],
    responsibilities: ["List assumptions that need evidence", "Collect market and technical unknowns", "Convert findings into decisions"],
    boundary: "Owns evidence gathering only; does not own final product decisions, implementation, or deployment.",
    requiredOutputFormats: ["logs or error analysis", "checklist", "JSON"],
  },
  {
    id: "integration",
    name: "Integration Agent",
    domain: "External platforms, plugins, connectors, payments, webhooks, APIs, and interoperability",
    signals: ["integration", "connector", "payment", "payments", "webhook", "crm", "email", "calendar", "api"],
    responsibilities: ["Map external system dependencies", "Define integration contracts", "Plan webhook and connector handoffs"],
    boundary: "Owns third-party interfaces only; does not own internal API logic, security policy, or growth campaigns.",
    requiredOutputFormats: ["config", "JSON", "step-by-step plan"],
  },
  {
    id: "business",
    name: "Business Agent",
    domain: "Pricing, plans, offers, partnerships, revenue, and positioning strategy",
    signals: ["business", "pricing", "plans", "offers", "partnership", "revenue", "positioning"],
    responsibilities: ["Design pricing, plans, offers, and partnerships", "Own revenue and positioning strategy", "Align rollout work with commercial goals"],
    boundary: "Owns commercial strategy only; does not own growth campaigns, product implementation, or support policy.",
    requiredOutputFormats: ["checklist", "step-by-step plan", "JSON"],
  },
];

export const COMMUNICATION_RULES = [
  "User communicates with MOA only.",
  "All other agents communicate with MOA only.",
  "MOA assigns every task; no specialist self-assigns.",
  "All 15 specialist agents remain active under strict domain boundaries.",
  "Specialists return structured outputs to MOA in approved formats only.",
  "MOA validates outputs before final synthesis.",
  "MOA returns one combined result to the user.",
];

export const CONFLICT_REJECTION_RULES = [
  "Reject outputs that overlap another agent domain.",
  "Reject outputs that contradict architecture, naming, or brand rules.",
  "Reject outputs that are unclear, incomplete, unstable, or not actionable.",
  "Reject outputs that bypass MOA or attempt to speak directly to the user.",
];

export const MOA_CONTROLLER_CONTRACT = {
  role: "Master Orchestrator Agent for the MindReply ecosystem",
  coreRules: [
    "Only MOA talks to the user.",
    "All other agents talk only to MOA.",
    "MOA assigns tasks; no specialist self-assigns.",
    "MOA merges, validates, and unifies all outputs.",
    "MOA enforces strict domain boundaries.",
  ],
  routingLogic: [
    "Identify required domains.",
    "Select the correct agents.",
    "Give each agent a precise scoped task.",
    "Wait for all outputs.",
    "Validate correctness and consistency.",
    "Merge into one final response.",
  ],
  conflictRejectionRules: CONFLICT_REJECTION_RULES,
  finalAnswerStandard: "Clean, structured, minimal, premium, actionable, and aligned with MindReply brand.",
};

export const ROLLOUT_PHASES = [
  { id: "phase-1", name: "Stabilize", focus: "MOA, routing, validation, and visible user result are available in-app.", status: "active" },
  { id: "phase-2", name: "Automate", focus: "Connect orchestrated next actions to durable jobs, alerts, and handoffs.", status: "queued" },
  { id: "phase-3", name: "Expand", focus: "Add integrations, support flows, growth loops, research inputs, and business strategy.", status: "queued" },
  { id: "phase-4", name: "Scale", focus: "Harden performance, observability, security, and multi-team governance.", status: "queued" },
] as const;

const DEFAULT_GOAL = "Coordinate platform work through the Master Orchestrator Agent.";

function wordsFor(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9+/ -]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function scoreAgent(agent: SpecialistAgent, goalWords: string[], goalText: string) {
  return agent.signals.reduce((score, signal) => {
    const signalText = signal.toLowerCase();
    if (goalWords.includes(signalText) || goalText.includes(signalText)) return score + 2;
    return score;
  }, 0);
}

function buildOutput(agent: SpecialistAgent, goal: string, score: number, priority: AgentPriority) {
  const focus = priority === "primary" ? "Lead" : priority === "support" ? "Support" : "Observe";
  return {
    headline: `${focus} ${agent.domain.toLowerCase()}`,
    assessment: `${agent.name} is active for "${goal}" with ${priority} routing priority.`,
    actionItems: agent.responsibilities.map((item) => `${item} for this goal`),
    evidence: score > 0 ? `Matched ${score / 2} routing signal(s).` : "Kept active by all-specialist MOA policy.",
    requiredFormat: agent.requiredOutputFormats[0],
    boundaryCheck: agent.boundary,
  };
}

export function routeGoalToAgents(goal: string): RoutedAgent[] {
  const normalizedGoal = String(goal || DEFAULT_GOAL).trim();
  const goalText = normalizedGoal.toLowerCase();
  const goalWords = wordsFor(normalizedGoal);
  const scores = MOA_AGENTS.map((agent) => ({ agent, score: scoreAgent(agent, goalWords, goalText) }));
  const topPositiveScores = [...new Set(scores.map((item) => item.score).filter((score) => score > 0))]
    .sort((a, b) => b - a)
    .slice(0, 3);

  return scores.map(({ agent, score }) => {
    const priority: AgentPriority =
      score >= 4 || (score > 0 && topPositiveScores.includes(score)) ? "primary" : score > 0 ? "support" : "observer";

    return {
      ...agent,
      status: "active",
      priority,
      matchedSignals: agent.signals.filter((signal) => goalText.includes(signal.toLowerCase())),
      output: buildOutput(agent, normalizedGoal, score, priority),
    };
  });
}

export function validateAgentOutputs(routedAgents: RoutedAgent[]): ValidationResult {
  const expectedNames = MOA_AGENTS.map((agent) => agent.name);
  const routedNames = routedAgents.map((agent) => agent.name);
  const missingAgents = expectedNames.filter((name) => !routedNames.includes(name));
  const rogueControllerAgents = routedAgents.filter((agent) => agent.id === "moa").map((agent) => agent.name);
  const inactiveAgents = routedAgents.filter((agent) => agent.status !== "active").map((agent) => agent.name);
  const domainBoundaryViolations = routedAgents.filter((agent) => !agent.boundary || !agent.output?.boundaryCheck).map((agent) => agent.name);
  const incompleteOutputs = routedAgents
    .filter(
      (agent) =>
        !agent.output ||
        !agent.output.assessment ||
        !agent.output.actionItems?.length ||
        !agent.output.requiredFormat ||
        !agent.output.boundaryCheck,
    )
    .map((agent) => agent.name);
  const duplicateAgents = routedNames.filter((name, index) => routedNames.indexOf(name) !== index);
  const valid =
    missingAgents.length === 0 &&
    rogueControllerAgents.length === 0 &&
    inactiveAgents.length === 0 &&
    incompleteOutputs.length === 0 &&
    domainBoundaryViolations.length === 0 &&
    duplicateAgents.length === 0;
  const penalty =
    missingAgents.length * 8 +
    rogueControllerAgents.length * 8 +
    inactiveAgents.length * 5 +
    incompleteOutputs.length * 5 +
    domainBoundaryViolations.length * 6 +
    duplicateAgents.length * 3;

  return {
    valid,
    checkedAgents: routedAgents.length,
    expectedAgents: expectedNames.length,
    missingAgents,
    inactiveAgents: [...inactiveAgents, ...rogueControllerAgents],
    incompleteOutputs,
    domainBoundaryViolations,
    duplicateAgents,
    confidenceScore: Math.max(0, 100 - penalty),
    validationSummary: valid
      ? "MOA validation passed: every domain specialist is active, bounded, and returned usable structured output."
      : "MOA validation failed: one or more specialist outputs need attention before final synthesis.",
  };
}

function buildNextActions(routedAgents: RoutedAgent[]) {
  const primary = routedAgents.filter((agent) => agent.priority === "primary");
  const selected = primary.length > 0 ? primary : routedAgents.slice(0, 5);

  return [
    "MOA confirms scope, success criteria, and validation gates before execution.",
    ...selected.slice(0, 6).map((agent) => `${agent.name}: ${agent.output.actionItems[0]}.`),
    "MOA merges specialist outputs into one prioritized execution queue for the user.",
  ];
}

export function orchestrateGoal(input: { goal: string } | string): OrchestratedGoal {
  const goal = typeof input === "string" ? input : input?.goal;
  const normalizedGoal = String(goal || DEFAULT_GOAL).trim();
  const taskRoutingLayer = routeGoalToAgents(normalizedGoal);
  const validation = validateAgentOutputs(taskRoutingLayer);
  const primaryAgents = taskRoutingLayer.filter((agent) => agent.priority === "primary").map((agent) => agent.name);

  return {
    userGoal: normalizedGoal,
    goal: normalizedGoal,
    masterOrchestratorAgent: MASTER_ORCHESTRATOR_AGENT,
    taskRoutingLayer,
    validation,
    finalCombinedResult: {
      summary: `Master Orchestrator Agent processed "${normalizedGoal}" through ${taskRoutingLayer.length} active domain specialists, validated boundaries and structured outputs, and synthesized one combined execution result.`,
      primaryAgents,
      nextActions: buildNextActions(taskRoutingLayer),
      visibleResult: validation.valid ? "Ready for user review and execution." : "Needs remediation before execution.",
      rolloutPhase: ROLLOUT_PHASES[0].name,
    },
  };
}

export function getAgentBlueprint() {
  return {
    masterOrchestratorAgent: MASTER_ORCHESTRATOR_AGENT,
    agents: MOA_AGENTS,
    communicationRules: COMMUNICATION_RULES,
    controllerContract: MOA_CONTROLLER_CONTRACT,
    conflictRejectionRules: CONFLICT_REJECTION_RULES,
    highLevelFlow: [
      "USER",
      "Master Orchestrator Agent (MOA)",
      "Task Routing Layer",
      "15 active specialist agents",
      "MOA validates outputs",
      "Final combined result to USER",
    ],
    rolloutPhases: ROLLOUT_PHASES,
  };
}
