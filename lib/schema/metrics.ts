import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const metricsTable = pgTable("metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  eventName: text("event_name").notNull(),
  eventValue: text("event_value"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Metric = typeof metricsTable.$inferSelect;
export type InsertMetric = typeof metricsTable.$inferInsert;
