import { NextRequest, NextResponse } from "next/server";
import { runAgent } from "@/lib/agent-engine";
import { normalizeLanguage } from "@/lib/language";

export async function GET() {
  return NextResponse.json({
    status: "ready",
    service: "mr-agent",
    modes: ["ai-webchat", "openai", "azure-openai", "anthropic", "openrouter", "groq", "blackbox-configurable"],
    accepts: "POST { message }",
  });
}

export async function POST(req: NextRequest) {
  try {
    const { message, userId, language } = await req.json();
    if (!message) return NextResponse.json({ error: "message is required" }, { status: 400 });

    const requestLanguage = normalizeLanguage(language) ?? normalizeLanguage(req.headers.get("x-mr-language")) ?? "EN";
    const response = await runAgent(message, userId ?? null, requestLanguage);
    return NextResponse.json(response);
  } catch (error) {
    console.error("MR Agent request failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
