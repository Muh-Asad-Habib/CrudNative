import { handleMockRequest, type HttpMethod, type MockDb, type MockResponse, type Task } from "./mock-api";

export type CrudOp = "CREATE" | "READ" | "UPDATE" | "DELETE";

export interface SimLogEntry {
  id: number;
  op: CrudOp;
  request: { method: HttpMethod; url: string; body?: unknown };
  sql: string;
  response: MockResponse;
}

export interface SimState {
  db: MockDb;
  log: SimLogEntry[];
  seq: number;
}

export const OP_INFO: Record<CrudOp, { method: string; sql: string; label: string }> = {
  CREATE: { method: "POST", sql: "INSERT", label: "Membuat data baru" },
  READ: { method: "GET", sql: "SELECT", label: "Membaca data" },
  UPDATE: { method: "PATCH / PUT", sql: "UPDATE", label: "Mengubah data" },
  DELETE: { method: "DELETE", sql: "DELETE", label: "Menghapus data" },
};

export function sqlString(v: string) {
  return `'${v.replace(/'/g, "''")}'`;
}

function apply(
  state: SimState,
  op: CrudOp,
  method: HttpMethod,
  url: string,
  body: unknown,
  sql: (db: MockDb, res: MockResponse) => string,
  now?: () => string,
): SimState {
  const { db, response } = handleMockRequest(state.db, { method, path: url, body }, now);
  const entry: SimLogEntry = {
    id: state.seq + 1,
    op,
    request: body === undefined ? { method, url } : { method, url, body },
    sql: sql(db, response),
    response,
  };
  return { db, log: [entry, ...state.log].slice(0, 30), seq: state.seq + 1 };
}

export function simList(state: SimState): SimState {
  return apply(state, "READ", "GET", "/api/tasks", undefined, () =>
    "SELECT id, title, done, priority, created_at\nFROM tasks\nORDER BY id DESC\nLIMIT 10 OFFSET 0;",
  );
}

export function simCreate(state: SimState, title: string, now?: () => string): SimState {
  return apply(
    state,
    "CREATE",
    "POST",
    "/api/tasks",
    { title },
    (_db, res) =>
      res.status === 201
        ? `INSERT INTO tasks (title, done, priority)\nVALUES (${sqlString(title.trim())}, 0, 'sedang');\n-- id baru: ${(res.body as { data: Task }).data.id}`
        : "-- Validasi gagal: query tidak dijalankan",
    now,
  );
}

export function simUpdate(
  state: SimState,
  id: number,
  patch: Partial<Pick<Task, "title" | "done" | "priority">>,
  now?: () => string,
): SimState {
  const sets = Object.entries(patch).map(([k, v]) =>
    `${k} = ${typeof v === "boolean" ? (v ? 1 : 0) : sqlString(String(v))}`,
  );
  return apply(
    state,
    "UPDATE",
    "PATCH",
    `/api/tasks/${id}`,
    patch,
    (_db, res) =>
      res.status === 200
        ? `UPDATE tasks\nSET ${[...sets, "updated_at = CURRENT_TIMESTAMP"].join(",\n    ")}\nWHERE id = ${id};`
        : "-- Query tidak dijalankan",
    now,
  );
}

export function simDelete(state: SimState, id: number): SimState {
  return apply(state, "DELETE", "DELETE", `/api/tasks/${id}`, undefined, (_db, res) =>
    res.status === 204 ? `DELETE FROM tasks\nWHERE id = ${id};` : "-- Query tidak dijalankan",
  );
}
