import { NextRequest, NextResponse } from "next/server";
import { runTool } from "@/lib/tool-engine";

export async function POST(req: NextRequest) {
  try {
    const { goal, text, timeframe, constraints, tone, userId } = await req.json();
    const objective = String(goal ?? text ?? "").trim();
    if (!objective) return NextResponse.json({ error: "goal is required" }, { status: 400 });

    const tf = timeframe ?? "30 days";
    const input = [
      `Objective: ${objective}`,
      `Timeframe: ${tf}`,
      constraints ? `Constraints: ${constraints}` : "",
    ].filter(Boolean).join("\n");
    const response = await runTool("planning-assistant", { text: input, tone, userId: userId ?? null });

    return NextResponse.json({
      ...response,
      plan: response.result,
      steps: response.suggestions,
      timeframe: tf,
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
