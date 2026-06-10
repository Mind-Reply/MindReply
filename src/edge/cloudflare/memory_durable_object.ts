type ActionKind = "reply" | "schedule" | "resolve" | "escalate";

type SqlCursor<T> = {
  one(): T;
  toArray(): T[];
};

type SqlStorage = {
  exec<T = unknown>(query: string, ...bindings: unknown[]): SqlCursor<T>;
};

type DurableStorage = {
  sql: SqlStorage;
  setAlarm(timestamp: number): Promise<void>;
  deleteAlarm(): Promise<void>;
};

type DurableObjectState = {
  storage: DurableStorage;
  blockConcurrencyWhile(callback: () => Promise<void>): void;
};

declare class DurableObject<Env> {
  protected ctx: DurableObjectState;
  protected env: Env;
  constructor(ctx: DurableObjectState, env: Env);
}

type DurableObjectNamespace<T> = {
  getByName(name: string): T;
};

export type MemoryInput = {
  synthesis: string;
  recommended_action: ActionKind;
  signal?: string;
  pattern?: string;
  next_check_timestamp?: string;
};

export type MemoryRecord = {
  id: number;
  synthesis: string;
  recommended_action: ActionKind;
  signal_hash: string;
  pattern: string;
  updated_at: string;
  next_check_timestamp: string | null;
};

export type MemorySummary = {
  synthesis: string;
  recommended_action: ActionKind;
  record_count: number;
  last_updated_at: string | null;
};

export interface Env {
  WORKSPACE_MEMORY: DurableObjectNamespace<WorkspaceMemory>;
}

function cleanText(value: string, limit = 320) {
  return value.replace(/\s+/g, " ").trim().slice(0, limit) || "No synthesis provided.";
}

function parseAction(value: string): ActionKind {
  if (value === "schedule" || value === "resolve" || value === "escalate") return value;
  return "reply";
}

async function digest(value: string) {
  const encoded = new TextEncoder().encode(value);
  const bytes = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export class WorkspaceMemory extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      this.migrate();
    });
  }

  async remember(input: MemoryInput): Promise<MemoryRecord> {
    const now = new Date().toISOString();
    const synthesis = cleanText(input.synthesis);
    const recommendedAction = parseAction(input.recommended_action);
    const signalHash = await digest(input.signal ?? "");
    const pattern = cleanText(input.pattern ?? "tone-follow-up-risk", 120);
    const nextCheck = input.next_check_timestamp ?? null;
    const dueAtMs = nextCheck ? Date.parse(nextCheck) : null;

    const result = this.ctx.storage.sql.exec<{ id: number }>(
      `INSERT INTO memory_records (
        synthesis,
        recommended_action,
        signal_hash,
        pattern,
        updated_at,
        next_check_timestamp,
        due_at_ms
      ) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id`,
      synthesis,
      recommendedAction,
      signalHash,
      pattern,
      now,
      nextCheck,
      Number.isFinite(dueAtMs) ? dueAtMs : null,
    );

    await this.scheduleNextAlarm();

    return {
      id: result.one().id,
      synthesis,
      recommended_action: recommendedAction,
      signal_hash: signalHash,
      pattern,
      updated_at: now,
      next_check_timestamp: nextCheck,
    };
  }

  async summary(limit = 5): Promise<MemorySummary> {
    const count = this.ctx.storage.sql.exec<{ value: number }>("SELECT COUNT(*) as value FROM memory_records").one();
    const rows = this.ctx.storage.sql
      .exec<Pick<MemoryRecord, "synthesis" | "recommended_action" | "updated_at">>(
        `SELECT synthesis, recommended_action, updated_at
         FROM memory_records
         ORDER BY id DESC
         LIMIT ?`,
        Math.max(1, Math.min(limit, 20)),
      )
      .toArray();

    const latest = rows[0];
    return {
      synthesis: latest?.synthesis ?? "No synthesis retained.",
      recommended_action: parseAction(latest?.recommended_action ?? "reply"),
      record_count: count.value,
      last_updated_at: latest?.updated_at ?? null,
    };
  }

  async alarm(): Promise<void> {
    const now = Date.now();
    this.ctx.storage.sql.exec(
      `UPDATE memory_records
       SET surfaced_at = datetime('now')
       WHERE due_at_ms IS NOT NULL
         AND due_at_ms <= ?
         AND surfaced_at IS NULL`,
      now,
    );
    await this.scheduleNextAlarm();
  }

  private migrate() {
    this.ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS _sql_schema_migrations (
        id INTEGER PRIMARY KEY,
        applied_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    const current = this.ctx.storage.sql
      .exec<{ version: number }>("SELECT COALESCE(MAX(id), 0) as version FROM _sql_schema_migrations")
      .one().version;

    if (current < 1) {
      this.ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS memory_records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          synthesis TEXT NOT NULL,
          recommended_action TEXT NOT NULL,
          signal_hash TEXT NOT NULL,
          pattern TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          next_check_timestamp TEXT,
          due_at_ms INTEGER,
          surfaced_at TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_memory_due ON memory_records(due_at_ms, surfaced_at);
        CREATE INDEX IF NOT EXISTS idx_memory_updated ON memory_records(updated_at);
        INSERT INTO _sql_schema_migrations (id) VALUES (1);
      `);
    }
  }

  private async scheduleNextAlarm() {
    const row = this.ctx.storage.sql
      .exec<{ due_at_ms: number | null }>(
        `SELECT MIN(due_at_ms) as due_at_ms
         FROM memory_records
         WHERE due_at_ms IS NOT NULL
           AND surfaced_at IS NULL`,
      )
      .one();

    if (typeof row.due_at_ms === "number") {
      await this.ctx.storage.setAlarm(row.due_at_ms);
      return;
    }
    await this.ctx.storage.deleteAlarm();
  }
}

async function readBody(request: Request): Promise<MemoryInput> {
  const body = (await request.json().catch(() => ({}))) as Partial<MemoryInput>;
  return {
    synthesis: String(body.synthesis ?? ""),
    recommended_action: parseAction(String(body.recommended_action ?? "reply")),
    signal: String(body.signal ?? ""),
    pattern: String(body.pattern ?? "tone-follow-up-risk"),
    next_check_timestamp: body.next_check_timestamp ? String(body.next_check_timestamp) : undefined,
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const workspaceKey = cleanText(url.searchParams.get("workspace_key") ?? "default", 120);
    const stub = env.WORKSPACE_MEMORY.getByName(workspaceKey);

    if (request.method === "POST" && url.pathname === "/memory") {
      const record = await stub.remember(await readBody(request));
      return jsonResponse({
        synthesis: record.synthesis,
        recommended_action: record.recommended_action,
        updated: true,
        record_id: record.id,
      });
    }

    if (request.method === "GET" && url.pathname === "/memory") {
      return jsonResponse(await stub.summary());
    }

    return jsonResponse({ synthesis: "Route not found.", recommended_action: "resolve" }, 404);
  },
};
