import { NextRequest, NextResponse } from "next/server";
import { orchestrateGoal } from "@/lib/moa";

export async function POST(req: NextRequest) {
  try {
    const { goal } = await req.json();
    if (!goal || !String(goal).trim()) {
      return NextResponse.json({ error: "goal is required" }, { status: 400 });
    }

    return NextResponse.json(orchestrateGoal({ goal: String(goal) }));
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
