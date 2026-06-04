import { NextResponse } from "next/server";
import { hasDatabaseUrl } from "@/lib/db";

export async function GET() {
  const databaseConfigured = hasDatabaseUrl();

  return NextResponse.json({
    status: "ok",
    service: "mindreply",
    timestamp: new Date().toISOString(),
    checks: {
      app: "ok",
      database: databaseConfigured ? "configured" : "fallback",
      databaseConfigured,
      azureOpenAI: process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_DEPLOYMENT ? "configured" : "fallback",
      orchestrator: "ready",
      backgroundReasoning: "ready",
      nodeEnv: process.env.NODE_ENV ?? "development",
    },
  });
}
