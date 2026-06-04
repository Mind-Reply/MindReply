import { NextRequest, NextResponse } from "next/server";
import { executeTask, taskCatalog, type TaskKind } from "@/lib/task-engine";

export async function GET() {
  return NextResponse.json({
    service: "mindreply-task-execution",
    status: "ready",
    tasks: taskCatalog,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await executeTask({
      kind: body.kind as TaskKind,
      objective: body.objective,
      context: body.context,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Task execution failed:", error);
    return NextResponse.json({ error: "Valid task kind is required" }, { status: 400 });
  }
}
