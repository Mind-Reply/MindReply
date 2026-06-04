import { NextResponse } from "next/server";
import { hasDatabaseUrl } from "@/lib/db";
import { isClerkConfigured } from "@/lib/admin";

export async function GET() {
  const databaseConfigured = hasDatabaseUrl();
  const authConfigured = isClerkConfigured();
  const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY && (process.env.STRIPE_PRICE_CURATOR || process.env.STRIPE_PRICE_STRATEGIST));

  return NextResponse.json({
    status: "ok",
    service: "mindreply",
    timestamp: new Date().toISOString(),
    checks: {
      app: "ok",
      database: databaseConfigured ? "configured" : "fallback",
      databaseConfigured,
      auth: authConfigured ? "configured" : "fallback",
      authConfigured,
      stripe: stripeConfigured ? "configured" : "fallback",
      stripeConfigured,
      azureOpenAI: process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_DEPLOYMENT ? "configured" : "fallback",
      orchestrator: "ready",
      backgroundReasoning: "ready",
      nodeEnv: process.env.NODE_ENV ?? "development",
    },
  });
}
