import { NextRequest, NextResponse } from "next/server";
import { getPermanentOpsCommand, recordAgentLearning } from "@/lib/permanent-ops-command";

function isAuthorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret && req.headers.get("authorization") === `Bearer ${secret}`);
}

export async function GET() {
  const command = await getPermanentOpsCommand();
  return NextResponse.json({
    status: "ready",
    learning: command.learning,
    guardrails: command.guardrails,
  });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json().catch(() => ({}));
  const result = await recordAgentLearning({
    agentId: typeof payload.agentId === "string" ? payload.agentId : undefined,
    lesson: typeof payload.lesson === "string" ? payload.lesson : "",
    source: typeof payload.source === "string" ? payload.source : undefined,
    impact: typeof payload.impact === "string" ? payload.impact : undefined,
  });

  return NextResponse.json(result, { status: result.recorded ? 200 : 400 });
}
