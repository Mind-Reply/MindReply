import { NextResponse } from "next/server";
import { productionRequirements } from "@/lib/production-requirements";

export async function GET() {
  return NextResponse.json({
    status: "ready",
    requiredServices: productionRequirements,
  });
}
