import { NextRequest, NextResponse } from "next/server";
import { runBackgroundReasoningLoop } from "@/lib/orchestration";

export async function GET() {
  return NextResponse.json({
    service: "mindreply-background-reasoning",
    status: "ready",
    maxCycles: 6,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await runBackgroundReasoningLoop({
      objective: body.objective,
      context: body.context,
      cycles: body.cycles,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Background reasoning failed:", error);
    return NextResponse.json({ error: "objective is required" }, { status: 400 });
  }
}
