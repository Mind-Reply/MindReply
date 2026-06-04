import { logMetric } from "@/lib/metrics";

export type OrchestrationRole = "architect" | "integrator" | "researcher" | "marketing" | "deployment";

type OrchestrationInput = {
  objective: string;
  context?: string;
  urgency?: "normal" | "high" | "critical";
};

type AgentReport = {
  role: OrchestrationRole;
  name: string;
  diagnosis: string;
  actions: string[];
  verification: string;
};

const AGENTS: Array<{ role: OrchestrationRole; name: string }> = [
  { role: "architect", name: "Architecture Agent" },
  { role: "integrator", name: "Integration Agent" },
  { role: "researcher", name: "Research Agent" },
  { role: "marketing", name: "Marketing Agent" },
  { role: "deployment", name: "Deployment Agent" },
];

function clean(input: string) {
  return input.trim().replace(/\s+/g, " ");
}

function riskLevel(objective: string, urgency: OrchestrationInput["urgency"]) {
  const text = objective.toLowerCase();
  if (urgency === "critical" || /deploy|production|database|security|secret|payment/.test(text)) return "high";
  if (urgency === "high" || /booking|agent|api|workflow|vercel|azure/.test(text)) return "medium";
  return "controlled";
}

function reportFor(role: OrchestrationRole, objective: string, context: string): AgentReport {
  if (role === "architect") {
    return {
      role,
      name: "Architecture Agent",
      diagnosis: "Align the request with the App Router boundary, shared library layer, route handlers, and Drizzle schema before expanding behavior.",
      actions: [
        "Confirm every user-facing route has an App Router page or route handler.",
        "Keep domain logic in lib modules that can be reused by pages, APIs, and scripts.",
        "Avoid module-level database failures by preserving fallback-capable imports.",
      ],
      verification: "Run TypeScript and production build after architecture changes.",
    };
  }

  if (role === "integrator") {
    return {
      role,
      name: "Integration Agent",
      diagnosis: "Synchronize frontend forms, API payloads, schema fields, fallback data, and deployment environment variables.",
      actions: [
        "Route UI submissions through stable API contracts.",
        "Log tool, agent, orchestration, and background execution events through metrics.",
        "Keep fallback JSON shapes identical to database-backed JSON shapes.",
      ],
      verification: "Smoke-check representative API endpoints with and without DATABASE_URL.",
    };
  }

  if (role === "researcher") {
    return {
      role,
      name: "Research Agent",
      diagnosis: "Treat current framework, platform, and provider behavior as changeable and verify deployment-sensitive assumptions from primary docs when needed.",
      actions: [
        "Prefer official Next.js, Vercel, Azure, GitHub Actions, Drizzle, and OpenAI/Azure OpenAI references for unstable platform details.",
        "Convert findings into repo-native configuration, scripts, docs, or checks.",
        "Record deployment-critical assumptions in README or workflow files.",
      ],
      verification: "Ensure deployment docs and workflows reference the exact environment and commands used by the repo.",
    };
  }

  if (role === "marketing") {
    return {
      role,
      name: "Marketing Agent",
      diagnosis: "Preserve MindReply's premium navy/gold positioning while making each page operational, not decorative.",
      actions: [
        "Keep the hero, membership tiers, professional cards, lexicons, and micro-tool descriptions consistent.",
        "Use high-authority language that explains business value without creating dead-end CTAs.",
        "Ensure every public link resolves to a production route.",
      ],
      verification: "Build output must list the public routes advertised by the landing page.",
    };
  }

  return {
    role,
    name: "Deployment Agent",
    diagnosis: "Protect Vercel and Azure deployment paths with deterministic install, typecheck, build, Docker, health, and seed behavior.",
    actions: [
      "Run npm ci, typecheck, and production build before deployment.",
      "Expose /api/health with database and Azure OpenAI configuration state.",
      "Use GitHub Actions secrets for database, Azure Web App, and Azure OpenAI settings.",
    ],
    verification: "CI and Azure workflows should use npm ci, npm run typecheck, and npm run build.",
  };
}

export async function runOrchestration(input: OrchestrationInput) {
  const objective = clean(input.objective);
  if (!objective) throw new Error("objective is required");

  const context = clean(input.context ?? "MindReply production recovery and platform execution");
  const reports = AGENTS.map((agent) => reportFor(agent.role, objective, context));
  const tasks = reports.flatMap((report) =>
    report.actions.map((action, index) => ({
      id: `${report.role}-${index + 1}`,
      owner: report.role,
      title: action,
      status: "ready",
      priority: report.role === "deployment" || report.role === "integrator" ? "high" : "normal",
    })),
  );

  const metric = await logMetric({
    eventName: "orchestration.run",
    eventValue: {
      objectiveLength: objective.length,
      contextLength: context.length,
      taskCount: tasks.length,
      risk: riskLevel(objective, input.urgency),
    },
  });

  return {
    id: `orch-${Date.now()}`,
    status: "completed",
    objective,
    context,
    risk: riskLevel(objective, input.urgency),
    agents: reports,
    tasks,
    nextActions: tasks.slice(0, 6),
    metricLogged: metric.logged,
  };
}

export async function runBackgroundReasoningLoop(input: { objective: string; cycles?: number; context?: string }) {
  const objective = clean(input.objective);
  if (!objective) throw new Error("objective is required");

  const cycles = Math.max(1, Math.min(input.cycles ?? 3, 6));
  const phases = ["diagnose", "design", "execute", "verify", "deploy", "observe"].slice(0, cycles);
  const iterations = phases.map((phase, index) => ({
    cycle: index + 1,
    phase,
    observation: `${phase} pass for ${objective}`,
    decision: phase === "verify" ? "Run authoritative checks and keep fallback paths intact." : "Advance the highest-impact production task without breaking App Router boundaries.",
  }));

  const metric = await logMetric({
    eventName: "background.reasoning_loop",
    eventValue: {
      objectiveLength: objective.length,
      cycles,
      contextLength: clean(input.context ?? "").length,
    },
  });

  return {
    id: `loop-${Date.now()}`,
    status: "completed",
    objective,
    cycles,
    iterations,
    result: "The reasoning loop produced an execution-ready sequence with verification built into each cycle.",
    metricLogged: metric.logged,
  };
}
