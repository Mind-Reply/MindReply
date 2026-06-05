import { NextRequest, NextResponse } from "next/server";
import { getIntegrationConnectAction, type IntegrationKey } from "@/lib/integrations";

const keys = new Set(["slack", "gmail", "notion"]);

function isIntegrationKey(value: string): value is IntegrationKey {
  return keys.has(value);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!isIntegrationKey(key)) {
    return NextResponse.json({ error: "Unknown integration" }, { status: 404 });
  }

  const action = getIntegrationConnectAction(key, req.nextUrl.origin);

  if (action.connectUrl) {
    return NextResponse.redirect(action.connectUrl, 302);
  }

  return NextResponse.json({
    status: "fallback",
    integration: action.name,
    connectReady: action.connectReady,
    missingConnectEnv: action.missingConnectEnv,
    nextAction: `Set ${action.missingConnectEnv.join(" or ")} in production, then reconnect ${action.name}.`,
    upgradeNarrative: action.dependencyFrame,
  });
}
