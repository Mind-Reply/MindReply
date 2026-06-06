const baseUrl = (process.env.SMOKE_BASE_URL || process.env.PRODUCTION_BASE_URL || "https://www.mind-reply.com").replace(/\/$/, "");

type HealthResponse = {
  status: string;
  service: string;
  timestamp: string;
  checks: Record<string, unknown>;
  requirements?: Array<{
    service: string;
    keys: string[];
    healthCheck: string;
    status: string;
    unlocks: string;
  }>;
};

type RequirementsResponse = {
  status: string;
  configuredCount: number;
  fallbackCount: number;
  services: Array<{
    service: string;
    key: string;
    status: "configured" | "fallback";
    requirementKeys: string[];
    nextAction: string;
    owner: {
      id: string;
      role: string;
      lane: string;
      escalation: string;
    } | null;
  }>;
};

const requiredConfiguredChecks = [
  "database",
  "auth",
  "stripe",
  "stripeWebhook",
  "bookingPayments",
  "analytics",
  "monitoring",
  "slack",
  "coreIntegrations",
  "opsReports",
  "siteUrl",
  "azureOpenAI",
] as const;

async function getJson<T>(path: string) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`${path} failed: ${response.status} ${response.statusText}`);
  }
  return await response.json() as T;
}

async function main() {
  let health: HealthResponse;
  let requirements: RequirementsResponse | null = null;

  try {
    health = await getJson<HealthResponse>("/api/health");
    requirements = await getJson<RequirementsResponse>("/api/config/requirements");
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
    return;
  }

  console.log(`Health ${health.status} for ${health.service} at ${health.timestamp}`);
  console.log(`Provider readiness: ${requirements.configuredCount} configured / ${requirements.fallbackCount} fallback`);

  const fallbackChecks = requiredConfiguredChecks.filter((key) => health.checks[key] !== "configured");
  for (const key of requiredConfiguredChecks) {
    console.log(`${key}: ${String(health.checks[key])}`);
  }

  if (fallbackChecks.length > 0) {
    console.error(`Production env audit failed. Fallback checks: ${fallbackChecks.join(", ")}`);
    if (health.requirements?.length) {
      console.error("Missing service requirements:");
      for (const requirement of health.requirements.filter((item) => item.status !== "configured")) {
        console.error(`- ${requirement.service}: ${requirement.keys.join(", ")} -> ${requirement.unlocks}`);
      }
    }
    if (requirements?.services.length) {
      console.error("Operator next actions:");
      for (const service of requirements.services.filter((item) => item.status !== "configured")) {
        const owner = service.owner ? `${service.owner.id} ${service.owner.role}` : "MR-Core Operator";
        console.error(`- ${service.service} (${owner}): ${service.nextAction}`);
      }
    }
    process.exitCode = 1;
    return;
  }

  console.log("Production env audit passed. Required checks are configured.");
}

void main();

export {};
