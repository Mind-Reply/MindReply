import { NextResponse } from "next/server";
import {
  getStripeData,
  getGmailData,
  getYoutubeData,
  processWithClaude,
  getDatabaseMetrics,
  getAllData,
} from "@/lib/backend-connectors";

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
      { status: "error", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { connector, action } = await req.json();

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
      default:
        return NextResponse.json(
          { error: "Unknown connector" },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { status: "error", error: String(error) },
      { status: 500 }
    );
  }
}
