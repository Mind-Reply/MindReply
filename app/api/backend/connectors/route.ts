import { NextResponse } from "next/server";
import {
  getStripeData,
  getGmailData,
  getYoutubeData,
  processWithClaude,
  getDatabaseMetrics,
  getAllData,
} from "../../../../lib/backend-connectors";

export async function GET() {
  try {
    const allData = await getAllData();

    return NextResponse.json(allData, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { status: "error", error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { connector, action } = await req.json();

    const allowedConnectors = ["stripe", "gmail", "youtube", "database", "claude", "all"];
    if (typeof connector !== 'string' || !allowedConnectors.includes(connector)) {
      return NextResponse.json(
        { error: "Unknown connector" },
        { status: 400 }
      );
    }

    let result;

    switch (connector) {
      case "stripe":
        result = await getStripeData();
        break;
      case "gmail":
        result = await getGmailData();
        break;
      case "youtube":
        result = await getYoutubeData();
        break;
      case "database":
        result = await getDatabaseMetrics();
        break;
      case "claude":
        result = await processWithClaude(action || "Analyze all data", {});
        break;
      case "all":
        result = await getAllData();
        break;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { status: "error", error: "Internal server error" },
      { status: 500 }
    );
  }
}
