import { NextResponse } from "next/server";
import { getAgentAccelerationCommand } from "@/lib/agent-acceleration";

export async function GET() {
  return NextResponse.json(getAgentAccelerationCommand());
}
