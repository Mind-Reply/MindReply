import { NextResponse } from "next/server";
import { activeAgentRoster } from "@/lib/agent-roster";
import { getAgentAccelerationCommand } from "@/lib/agent-acceleration";

export async function GET() {
  const acceleration = getAgentAccelerationCommand();
  const byLane = activeAgentRoster.reduce<Record<string, number>>((acc, agent) => {
    acc[agent.lane] = (acc[agent.lane] ?? 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    status: "ready",
    objective: "60 active operating desks for production, revenue, trust, and intelligence acceleration.",
    accelerationTarget: "x66 live operating mode now, with 82x triage target through visible owner, evidence, and handoff routing.",
    acceleration,
    totalActiveAgents: activeAgentRoster.length,
    byLane,
    agents: activeAgentRoster,
  });
}
