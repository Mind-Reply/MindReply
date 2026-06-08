import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

type MemoryRecord = {
  synthesis: string;
  recommended_action: string;
  signal_hash: string;
  updated_at: string;
};

const memory: MemoryRecord[] = [];

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    synthesis?: string;
    recommended_action?: string;
    signal?: string;
  };
  const synthesis = String(body.synthesis ?? "No synthesis provided.").slice(0, 320);
  const recommendedAction = String(body.recommended_action ?? "reply");

  memory.push({
    synthesis,
    recommended_action: recommendedAction,
    signal_hash: digest(String(body.signal ?? "")),
    updated_at: new Date().toISOString(),
  });

  if (memory.length > 50) memory.shift();

  return NextResponse.json({
    synthesis,
    recommended_action: recommendedAction,
    updated: true,
  });
}
