import { NextRequest, NextResponse } from "next/server";
import { buildFallbackSlots } from "@/lib/fallback-data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const professionalId = parseInt(searchParams.get("professionalId") ?? "");
    const date = searchParams.get("date");

    if (isNaN(professionalId)) return NextResponse.json({ error: "professionalId is required" }, { status: 400 });

    const slots = buildFallbackSlots();
    if (date) return NextResponse.json(slots.filter((slot) => slot.date >= date));

    return NextResponse.json(slots);
  } catch (err) {
    console.error("Error getting slots:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
