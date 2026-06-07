import { NextRequest, NextResponse } from "next/server";
import { db, lexiconsTable } from "@/lib/db";
import { eq } from "drizzle-orm";
import { fallbackLexicons } from "@/lib/fallback-data";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const [row] = await db.select().from(lexiconsTable).where(eq(lexiconsTable.id, id));
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      id: row.id, name: row.name, category: row.category, description: row.description,
      terms: typeof row.terms === "string" ? JSON.parse(row.terms) : row.terms,
    });
  } catch (err) {
    console.warn("Using fallback lexicon:", err instanceof Error ? err.message : err);
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    const row = fallbackLexicons.find((lexicon) => lexicon.id === id);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      id: row.id,
      name: row.name,
      category: row.category,
      description: row.description,
      terms: JSON.parse(row.terms),
    });
  }
}
