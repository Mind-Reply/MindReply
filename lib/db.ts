import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

type Database = ReturnType<typeof drizzle<typeof schema>>;

let pool: Pool | null = null;
let database: Database | null = null;

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb() {
  if (database) return database;
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set");
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
  });
  database = drizzle(pool, { schema });
  return database;
}

export async function closeDb() {
  await pool?.end();
  pool = null;
  database = null;
}

export const db = new Proxy({} as Database, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
});

export { bookingsTable, lexiconsTable, membershipsTable, metricsTable, professionalsTable, usersTable } from "./schema";
