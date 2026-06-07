import { NextResponse } from "next/server";
import { db, membershipsTable } from "@/lib/db";
import { fallbackMemberships } from "@/lib/fallback-data";

export async function GET() {
  try {
    const rows = await db.select().from(membershipsTable);
    return NextResponse.json(rows.map((m) => ({
      id: m.id, tier: m.tier, name: m.name, price: m.price,
      description: m.description, highlighted: m.highlighted,
      features: typeof m.features === "string" ? JSON.parse(m.features) : m.features,
    })));
  } catch (err) {
    console.warn("Using fallback memberships:", err instanceof Error ? err.message : err);
    return NextResponse.json(fallbackMemberships.map((m) => ({
      ...m,
      features: JSON.parse(m.features),
    })));
  }
}
