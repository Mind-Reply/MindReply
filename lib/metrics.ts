import { db, hasDatabaseUrl, metricsTable } from "@/lib/db";

type MetricPayload = {
  userId?: number | null;
  eventName: string;
  eventValue?: unknown;
};

export async function logMetric({ userId = null, eventName, eventValue }: MetricPayload) {
  if (!hasDatabaseUrl()) {
    return { logged: false, reason: "database_not_configured" as const };
  }

  try {
    await db.insert(metricsTable).values({
      userId,
      eventName,
      eventValue: eventValue === undefined ? null : JSON.stringify(eventValue),
    });
    return { logged: true as const };
  } catch (error) {
    console.warn("Metric logging skipped:", error);
    return { logged: false, reason: "database_error" as const };
  }
}
