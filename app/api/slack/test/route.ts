import { NextRequest, NextResponse } from "next/server";
import { isRevenueOwnerAuthorized } from "@/lib/owner-auth";
import { isSlackConfigured, sendSlackNotification } from "@/lib/slack";

export async function GET() {
  return NextResponse.json({
    status: isSlackConfigured() ? "configured" : "fallback",
    configured: isSlackConfigured(),
    requiredEnv: ["SLACK_WEBHOOK_URL", "REVENUE_OWNER_SECRET"],
  });
}

export async function POST(req: NextRequest) {
  if (!isRevenueOwnerAuthorized(req)) {
    return NextResponse.json({ error: "Owner authorization required" }, { status: 401 });
  }

  const result = await sendSlackNotification({
    title: "MindReply Slack test",
    message: "Slack notifications are connected for production ops.",
    severity: "info",
    fields: {
      service: "mindreply",
      route: "/api/slack/test",
    },
  });

  return NextResponse.json(result, { status: result.sent ? 200 : 503 });
}
