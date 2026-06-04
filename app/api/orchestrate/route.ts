import { NextRequest, NextResponse } from "next/server";
import { runOrchestration } from "@/lib/orchestration";

export async function GET() {
  return NextResponse.json({
    service: "mindreply-orchestrator",
    status: "ready",
    agents: ["architect", "integrator", "researcher", "marketing", "deployment"],
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await runOrchestration({
      objective: body.objective,
      context: body.context,
      urgency: body.urgency,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Orchestration failed:", error);
    return NextResponse.json({ error: "objective is required" }, { status: 400 });
  }
}
