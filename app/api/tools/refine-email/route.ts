import { NextRequest, NextResponse } from "next/server";
import { runTool } from "@/lib/tool-engine";

export async function POST(req: NextRequest) {
  try {
    const { text, tone, userId } = await req.json();
    if (!text) return NextResponse.json({ error: "text is required" }, { status: 400 });
    return NextResponse.json(await runTool("email-polisher", { text, tone, userId: userId ?? null }));
  } catch (error) {
    console.error("Email refinement failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
