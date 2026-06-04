import { NextRequest, NextResponse } from "next/server";
import { runTool } from "@/lib/tool-engine";

export async function POST(req: NextRequest) {
  try {
    const { text, userId } = await req.json();
    if (!text) return NextResponse.json({ error: "text is required" }, { status: 400 });
    return NextResponse.json(await runTool("clarity-booster", { text, userId: userId ?? null }));
  } catch (error) {
    console.error("Note clarification failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
