import { NextRequest, NextResponse } from "next/server";
import { isRevenueOwnerAuthorized } from "@/lib/owner-auth";
import { buildOpsReport, relayOpsReportToAzure, sendOpsReportEmail } from "@/lib/ops-report";

function isAuthorized(req: NextRequest) {
  return isRevenueOwnerAuthorized(req);
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Owner authorization required" }, { status: 401 });
  }

  return NextResponse.json(await buildOpsReport());
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const report = await buildOpsReport();
  const [email, azureRelay] = await Promise.all([
    sendOpsReportEmail(report),
    relayOpsReportToAzure(report),
  ]);

  return NextResponse.json({
    status: email.sent ? "sent" : "not_sent",
    report,
    email,
    azureRelay,
  });
}
