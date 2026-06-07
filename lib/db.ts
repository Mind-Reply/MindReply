import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

type Database = NodePgDatabase<typeof schema>;

let pool: Pool | null = null;
let database: Database | null = null;

export function getDb(): Database {
  if (database) return database;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL must be set before using DB-backed routes");
  }

  pool = new Pool({ connectionString });
  database = drizzle(pool, { schema });
  return database;
}

export const db = new Proxy({} as Database, {
  get(_target, property, receiver) {
    const activeDb = getDb();
    const value = Reflect.get(activeDb, property, receiver);
    return typeof value === "function" ? value.bind(activeDb) : value;
  },
});

export { professionalsTable, bookingsTable, membershipsTable, lexiconsTable } from "./schema";
