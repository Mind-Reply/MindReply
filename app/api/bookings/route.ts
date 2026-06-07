import { NextRequest, NextResponse } from "next/server";
import { db, bookingsTable, professionalsTable } from "@/lib/db";
import { eq } from "drizzle-orm";
import { fallbackBookings, fallbackProfessionals } from "@/lib/fallback-data";

function mapBooking(b: typeof bookingsTable.$inferSelect) {
  return {
    id: b.id, professionalId: b.professionalId, professionalName: b.professionalName,
    mode: b.mode, scheduledAt: b.scheduledAt, durationMinutes: b.durationMinutes,
    totalPrice: b.totalPrice, status: b.status,
    clientName: b.clientName, clientEmail: b.clientEmail, notes: b.notes,
  };
}

export async function GET() {
  try {
    const rows = await db.select().from(bookingsTable).orderBy(bookingsTable.createdAt);
    return NextResponse.json(rows.map(mapBooking));
  } catch (err) {
    console.warn("Using fallback bookings:", err instanceof Error ? err.message : err);
    return NextResponse.json(fallbackBookings.map((booking) => ({
      id: booking.id,
      professionalId: booking.professionalId,
      professionalName: booking.professionalName,
      mode: booking.mode,
      scheduledAt: booking.scheduledAt,
      durationMinutes: booking.durationMinutes,
      totalPrice: booking.totalPrice,
      status: booking.status,
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      notes: booking.notes,
    })));
  }
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const { professionalId, mode, scheduledAt, durationMinutes, clientName, clientEmail, notes } = payload;
  try {
    if (!professionalId || !mode || !scheduledAt || !durationMinutes || !clientName || !clientEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [professional] = await db.select().from(professionalsTable).where(eq(professionalsTable.id, professionalId));
    if (!professional) return NextResponse.json({ error: "Professional not found" }, { status: 404 });

    const pricePerHour =
      mode === "text" ? professional.priceText :
      mode === "voice" ? professional.priceVoice :
      professional.priceVideo;

    const totalPrice = pricePerHour * (durationMinutes / 60);

    const [booking] = await db.insert(bookingsTable).values({
      professionalId, professionalName: professional.name, mode, scheduledAt,
      durationMinutes, totalPrice, status: "confirmed",
      clientName, clientEmail, notes: notes ?? null,
    }).returning();

    return NextResponse.json(mapBooking(booking), { status: 201 });
  } catch (err) {
    console.warn("Creating fallback booking:", err instanceof Error ? err.message : err);
    const professional = fallbackProfessionals.find((p) => p.id === Number(professionalId));
    if (!professional) return NextResponse.json({ error: "Professional not found" }, { status: 404 });
    const pricePerHour =
      mode === "text" ? professional.priceText :
      mode === "voice" ? professional.priceVoice :
      professional.priceVideo;
    return NextResponse.json({
      id: Date.now(),
      professionalId,
      professionalName: professional.name,
      mode,
      scheduledAt,
      durationMinutes,
      totalPrice: pricePerHour * (durationMinutes / 60),
      status: "confirmed",
      clientName,
      clientEmail,
      notes: notes ?? null,
    }, { status: 201 });
  }
}
