import { NextRequest, NextResponse } from "next/server";
import { isToolSlug, runTool } from "@/lib/tool-engine";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!isToolSlug(slug)) return NextResponse.json({ error: "Unknown tool" }, { status: 404 });

    const { text, tone, targetTone, userId } = await req.json();
    if (!text) return NextResponse.json({ error: "text is required" }, { status: 400 });

    const response = await runTool(slug, {
      text,
      tone: tone ?? targetTone,
      userId: userId ?? null,
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error("Tool request failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
