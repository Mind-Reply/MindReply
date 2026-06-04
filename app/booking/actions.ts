"use server";

import { db, hasDatabaseUrl, bookingsTable, professionalsTable } from "@/lib/db";
import { fallbackProfessionals } from "@/lib/fallback-data";
import { eq } from "drizzle-orm";

export type BookingActionInput = {
  professionalId: number;
  mode: "text" | "voice" | "video";
  scheduledAt: string;
  durationMinutes: number;
  clientName: string;
  clientEmail: string;
  notes?: string | null;
};

function mapBooking(booking: {
  id: number;
  professionalId: number;
  professionalName: string;
  mode: "text" | "voice" | "video";
  scheduledAt: string;
  durationMinutes: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  clientName: string;
  clientEmail: string;
  notes: string | null;
}) {
  return {
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
  };
}

type BookingActionBooking = ReturnType<typeof mapBooking>;
type BookingActionResult =
  | { ok: true; booking: BookingActionBooking }
  | { ok: false; error: string };

export async function createBookingAction(input: BookingActionInput): Promise<BookingActionResult> {
  if (!input.professionalId || !input.mode || !input.scheduledAt || !input.durationMinutes || !input.clientName || !input.clientEmail) {
    return { ok: false, error: "Missing required booking fields" };
  }

  if (!hasDatabaseUrl()) {
    const professional = fallbackProfessionals.find((p) => p.id === Number(input.professionalId));
    if (!professional) return { ok: false, error: "Professional not found" };

    const pricePerHour = input.mode === "text" ? professional.priceText : input.mode === "voice" ? professional.priceVoice : professional.priceVideo;
    return {
      ok: true,
      booking: mapBooking({
        id: Date.now(),
        professionalId: professional.id,
        professionalName: professional.name,
        mode: input.mode,
        scheduledAt: input.scheduledAt,
        durationMinutes: input.durationMinutes,
        totalPrice: pricePerHour * (input.durationMinutes / 60),
        status: "confirmed",
        clientName: input.clientName,
        clientEmail: input.clientEmail,
        notes: input.notes ?? null,
      }),
    };
  }

  const [professional] = await db.select().from(professionalsTable).where(eq(professionalsTable.id, input.professionalId));
  if (!professional) return { ok: false, error: "Professional not found" };

  const pricePerHour = input.mode === "text" ? professional.priceText : input.mode === "voice" ? professional.priceVoice : professional.priceVideo;
  const [booking] = await db.insert(bookingsTable).values({
    professionalId: input.professionalId,
    professionalName: professional.name,
    mode: input.mode,
    scheduledAt: input.scheduledAt,
    durationMinutes: input.durationMinutes,
    totalPrice: pricePerHour * (input.durationMinutes / 60),
    status: "confirmed",
    clientName: input.clientName,
    clientEmail: input.clientEmail,
    notes: input.notes ?? null,
  }).returning();

  return { ok: true, booking: mapBooking(booking) };
}
