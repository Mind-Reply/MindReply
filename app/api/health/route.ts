import { NextResponse } from "next/server";

import { mragentPersistenceConfigured } from "@/lib/mragent";
import { getMRAgentMcpManifest } from "@/lib/mragent-mcp";

export const runtime = "nodejs";

export async function GET() {
  const manifest = getMRAgentMcpManifest();
  const blobConfigured = mragentPersistenceConfigured();

  return NextResponse.json({
    status: "ok",
    service: "mindreply-decision-layer",
    timestamp: new Date().toISOString(),
    checks: {
      intakeLayer: "ready",
      actionLayer: "ready",
      memoryLayer: "ready",
      triageAgent: "ready",
      replyAgent: "ready",
      followUpAgent: "ready",
      riskAgent: "ready",
      privacyDefaults: "ready",
      mcpApp: "ready",
      mcpTools: manifest.tools.map((tool) => tool.name),
      generationPersistence: blobConfigured ? "ready" : "fallback",
      blobConfigured,
      providerConfigured: Boolean(process.env.OPENAI_API_KEY),
    },
  });
}
