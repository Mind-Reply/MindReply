import { NextRequest, NextResponse } from "next/server";
import { db, bookingsTable } from "@/lib/db";
import { eq } from "drizzle-orm";
import { fallbackBookings } from "@/lib/fallback-data";

function mapBooking(b: typeof bookingsTable.$inferSelect) {
  return {
    id: b.id, professionalId: b.professionalId, professionalName: b.professionalName,
    mode: b.mode, scheduledAt: b.scheduledAt, durationMinutes: b.durationMinutes,
    totalPrice: b.totalPrice, status: b.status,
    clientName: b.clientName, clientEmail: b.clientEmail, notes: b.notes,
  };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const [b] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id));
    if (!b) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(mapBooking(b));
  } catch (err) {
    console.warn("Using fallback booking:", err instanceof Error ? err.message : err);
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    const booking = fallbackBookings.find((item) => item.id === id);
    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(booking);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { status } = await req.json();
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    if (!status) return NextResponse.json({ error: "status is required" }, { status: 400 });
    const [b] = await db.update(bookingsTable).set({ status }).where(eq(bookingsTable.id, id)).returning();
    if (!b) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(mapBooking(b));
  } catch (err) {
    console.warn("Updating fallback booking:", err instanceof Error ? err.message : err);
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    const booking = fallbackBookings.find((item) => item.id === id);
    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ...booking, status });
  }
}
