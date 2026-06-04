import { NextRequest, NextResponse } from "next/server";
import { logMetric } from "@/lib/metrics";

export async function POST(req: NextRequest) {
  try {
    const { goal, timeframe, constraints } = await req.json();
    if (!goal) return NextResponse.json({ error: "goal is required" }, { status: 400 });

    const tf = timeframe ?? "30 days";
    const steps = [
      `Define success metrics for: ${goal}`,
      "Identify key stakeholders and decision-makers",
      "Break the goal into 3 actionable milestones",
      "Schedule weekly check-ins to monitor progress",
      "Review and adjust the plan at the midpoint",
      "Document learnings and results upon completion",
    ];

    const plan = `A structured ${tf} plan to achieve: ${goal}. ${constraints ? `Constraints considered: ${constraints}.` : ""} The approach focuses on measurable milestones, stakeholder alignment, and consistent review cycles.`;
    const metric = await logMetric({
      eventName: "tool.planning-assistant",
      eventValue: { timeframe: tf, goalLength: String(goal).length, steps: steps.length },
    });

    return NextResponse.json({ result: plan, plan, steps, timeframe: tf, creditCost: 1, metricLogged: metric.logged });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
