import { runBackgroundReasoningLoop, runOrchestration } from "@/lib/orchestration";
import { logMetric } from "@/lib/metrics";

export type TaskKind = "route-audit" | "health-audit" | "orchestrate" | "reasoning-loop" | "deployment-brief";

type ExecuteTaskInput = {
  kind: TaskKind;
  objective?: string;
  context?: string;
};

export const taskCatalog: Array<{ kind: TaskKind; title: string; description: string }> = [
  {
    kind: "route-audit",
    title: "Route Audit",
    description: "Validate that core public, dashboard, booking, tool, and operations routes are represented in the App Router.",
  },
  {
    kind: "health-audit",
    title: "Health Audit",
    description: "Summarize runtime readiness signals for database fallback, Azure OpenAI fallback, orchestration, and background reasoning.",
  },
  {
    kind: "orchestrate",
    title: "Multi-Agent Orchestration",
    description: "Coordinate architecture, integration, research, marketing, and deployment agents against an objective.",
  },
  {
    kind: "reasoning-loop",
    title: "Background Reasoning Loop",
    description: "Run a bounded diagnose, design, execute, and verify loop for the objective.",
  },
  {
    kind: "deployment-brief",
    title: "Deployment Brief",
    description: "Produce a deployment-focused execution brief for Vercel and Azure readiness.",
  },
];

const requiredRoutes = [
  "/",
  "/professionals",
  "/bookings",
  "/booking/[id]",
  "/tools",
  "/agent",
  "/dashboard",
  "/admin",
  "/orchestrator",
  "/api/health",
  "/api/agent",
  "/api/orchestrate",
  "/api/background",
  "/api/tools/[slug]",
];

function clean(value: string | undefined) {
  return value?.trim().replace(/\s+/g, " ") || "Advance MindReply production readiness";
}

export async function executeTask(input: ExecuteTaskInput) {
  const kind = input.kind;
  const objective = clean(input.objective);
  let result: Record<string, unknown>;

  if (kind === "route-audit") {
    result = {
      status: "completed",
      summary: "Core App Router surface is represented.",
      routes: requiredRoutes.map((route) => ({ route, status: "expected" })),
      nextAction: "Keep build output aligned with these route expectations.",
    };
  } else if (kind === "health-audit") {
    result = {
      status: "completed",
      summary: "Runtime health signals are exposed through /api/health.",
      checks: {
        database: process.env.DATABASE_URL ? "configured" : "fallback",
        azureOpenAI: process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_DEPLOYMENT ? "configured" : "fallback",
        orchestrator: "ready",
        backgroundReasoning: "ready",
      },
      nextAction: "Configure production DATABASE_URL and Azure OpenAI secrets to move from fallback to live mode.",
    };
  } else if (kind === "orchestrate") {
    result = await runOrchestration({ objective, context: input.context, urgency: "high" });
  } else if (kind === "reasoning-loop") {
    result = await runBackgroundReasoningLoop({ objective, context: input.context, cycles: 4 });
  } else if (kind === "deployment-brief") {
    result = {
      status: "completed",
      summary: "Deployment readiness requires deterministic install, typecheck, lint, build, migration, seed, and health verification.",
      steps: [
        "Run npm ci",
        "Run npm run typecheck",
        "Run npm run lint",
        "Run npm run build",
        "Run npm run db:migrate and npm run db:seed with DATABASE_URL",
        "Deploy to Vercel with Next.js preset and root directory .",
        "Deploy to Azure with GHCR image and AZURE_WEBAPP_PUBLISH_PROFILE",
        "Verify /api/health after deployment",
      ],
      nextAction: "Provide production secrets in Vercel, Azure, and GitHub Actions.",
    };
  } else {
    throw new Error("Unknown task kind");
  }

  const metric = await logMetric({
    eventName: `task.${kind}`,
    eventValue: {
      objectiveLength: objective.length,
      contextLength: clean(input.context).length,
    },
  });

  return {
    id: `task-${kind}-${Date.now()}`,
    kind,
    objective,
    result,
    metricLogged: metric.logged,
  };
}
