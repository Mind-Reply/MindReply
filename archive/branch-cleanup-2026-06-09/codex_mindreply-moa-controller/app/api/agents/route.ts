import { NextResponse } from "next/server";
import { getAgentBlueprint, orchestrateGoal } from "@/lib/moa";

export async function GET() {
  return NextResponse.json({
    ...getAgentBlueprint(),
    orchestration: orchestrateGoal({
      goal: "Stabilize and expand MindReply through the full MOA-controlled specialist layer.",
    }),
  });
}
