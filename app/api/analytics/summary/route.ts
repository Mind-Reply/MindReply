import { NextResponse } from "next/server";
import { db, professionalsTable, bookingsTable } from "@/lib/db";
import { fallbackBookings, fallbackProfessionals } from "@/lib/fallback-data";

function summarize(professionals: typeof fallbackProfessionals, bookings: typeof fallbackBookings) {
  const totalProfessionals = professionals.length;
  const availableProfessionals = professionals.filter((p) => p.availabilityStatus === "available").length;
  const totalBookings = bookings.length;
  const avgRating = totalProfessionals > 0
    ? professionals.reduce((sum, p) => sum + p.rating, 0) / totalProfessionals
    : 0;

  const roleCounts: Record<string, number> = {};
  for (const p of professionals) {
    roleCounts[p.role] = (roleCounts[p.role] ?? 0) + 1;
  }
  const popularRoles = Object.entries(roleCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([role, count]) => ({ role, count }));

  return {
    totalProfessionals,
    availableProfessionals,
    totalBookings,
    activeMembers: 1240,
    avgRating: Math.round(avgRating * 10) / 10,
    popularRoles,
  };
}

export async function GET() {
  try {
    const allProfessionals = await db.select().from(professionalsTable);
    const allBookings = await db.select().from(bookingsTable);

    const totalProfessionals = allProfessionals.length;
    const availableProfessionals = allProfessionals.filter((p) => p.availabilityStatus === "available").length;
    const totalBookings = allBookings.length;
    const avgRating = totalProfessionals > 0
      ? allProfessionals.reduce((sum, p) => sum + p.rating, 0) / totalProfessionals
      : 0;

    const roleCounts: Record<string, number> = {};
    for (const p of allProfessionals) {
      roleCounts[p.role] = (roleCounts[p.role] ?? 0) + 1;
    }
    const popularRoles = Object.entries(roleCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([role, count]) => ({ role, count }));

    return NextResponse.json({
      totalProfessionals, availableProfessionals, totalBookings,
      activeMembers: 1240,
      avgRating: Math.round(avgRating * 10) / 10,
      popularRoles,
    });
  } catch (err) {
    console.warn("Using fallback analytics:", err instanceof Error ? err.message : err);
    return NextResponse.json(summarize(fallbackProfessionals, fallbackBookings));
  }
}
