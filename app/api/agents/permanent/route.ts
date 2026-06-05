import { NextRequest, NextResponse } from "next/server";
import { isRevenueOwnerAuthorized } from "@/lib/owner-auth";
import { getPermanentOpsCommand } from "@/lib/permanent-ops-command";

export async function GET(req: NextRequest) {
  if (!isRevenueOwnerAuthorized(req)) {
    return NextResponse.json({ error: "Owner authorization required" }, { status: 401 });
  }

  return NextResponse.json(await getPermanentOpsCommand());
}
