/**
 * Mock REST API in-memory — meniru kontrak API companion (`api/`):
 * - List   → { data: T[], meta: { page, limit, total, totalPages } }
 * - Detail → { data: T }
 * - Error  → { error: { message, code, details? } }
 * Semua fungsi murni: state DB lama tidak pernah dimutasi.
 */

export type Priority = "rendah" | "sedang" | "tinggi";
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface Task {
  id: number;
  title: string;
  done: boolean;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export interface MockDb {
  tasks: Task[];
  nextId: number;
}

export interface MockRequest {
  method: HttpMethod;
  /** Path + query, mis. `/api/tasks?page=1&limit=5` */
  path: string;
  body?: unknown;
}

export interface MockResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: unknown;
  durationMs: number;
}

export const PRIORITIES: Priority[] = ["rendah", "sedang", "tinggi"];

export const STATUS_TEXT: Record<number, string> = {
  200: "OK",
  201: "Created",
  204: "No Content",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  409: "Conflict",
  422: "Unprocessable Entity",
  500: "Internal Server Error",
};

export function createMockDb(): MockDb {
  const seed: [string, boolean, Priority][] = [
    ["Baca materi HTTP & REST", true, "sedang"],
    ["Kerjakan tugas Basis Data bab 3", false, "tinggi"],
    ["Setup Expo di HP", false, "sedang"],
    ["Review catatan kuliah Pemrograman Web", false, "rendah"],
  ];
  return {
    tasks: seed.map(([title, done, priority], i) => {
      const ts = new Date(Date.UTC(2025, 0, 10 + i, 8, 0, 0)).toISOString();
      return { id: i + 1, title, done, priority, createdAt: ts, updatedAt: ts };
    }),
    nextId: seed.length + 1,
  };
}

interface ValidationIssue {
  field: string;
  message: string;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function validateTask(body: unknown, partial: boolean): { value: Partial<Task>; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  const value: Partial<Task> = {};
  if (!isRecord(body)) {
    return { value, issues: [{ field: "body", message: "Body harus berupa objek JSON" }] };
  }
  if ("title" in body || !partial) {
    if (typeof body.title !== "string" || body.title.trim().length === 0) {
      issues.push({ field: "title", message: "title wajib diisi (string, tidak boleh kosong)" });
    } else if (body.title.trim().length > 100) {
      issues.push({ field: "title", message: "title maksimal 100 karakter" });
    } else {
      value.title = body.title.trim();
    }
  }
  if ("done" in body) {
    if (typeof body.done !== "boolean") issues.push({ field: "done", message: "done harus boolean (true/false)" });
    else value.done = body.done;
  }
  if ("priority" in body) {
    if (!PRIORITIES.includes(body.priority as Priority)) {
      issues.push({ field: "priority", message: `priority harus salah satu dari: ${PRIORITIES.join(", ")}` });
    } else value.priority = body.priority as Priority;
  }
  const allowed = new Set(["title", "done", "priority"]);
  for (const key of Object.keys(body)) {
    if (!allowed.has(key)) issues.push({ field: key, message: `Field "${key}" tidak dikenal` });
  }
  return { value, issues };
}

function respond(status: number, body: unknown, path: string): MockResponse {
  const text = body === null ? "" : JSON.stringify(body);
  const headers: Record<string, string> = {
    "x-powered-by": "Express",
    date: new Date(Date.UTC(2025, 0, 20, 9, 30)).toUTCString(),
  };
  if (status !== 204) {
    headers["content-type"] = "application/json; charset=utf-8";
    headers["content-length"] = String(new TextEncoder().encode(text).length);
  }
  return {
    status,
    statusText: STATUS_TEXT[status] ?? "",
    headers,
    body: status === 204 ? null : body,
    durationMs: 12 + ((path.length * 7 + status) % 38),
  };
}

function error(status: number, code: string, message: string, path: string, details?: ValidationIssue[]) {
  return respond(status, { error: { message, code, ...(details ? { details } : {}) } }, path);
}

function parseIntParam(v: string | null, fallback: number, min: number, max: number) {
  if (v === null || v === "") return fallback;
  const n = Number(v);
  if (!Number.isInteger(n)) return NaN;
  return Math.min(max, Math.max(min, n));
}

export function handleMockRequest(
  db: MockDb,
  req: MockRequest,
  now: () => string = () => new Date().toISOString(),
): { db: MockDb; response: MockResponse } {
  const url = new URL(req.path, "http://localhost:3000");
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const method = req.method;

  if (path === "/api/health") {
    if (method !== "GET") return { db, response: error(405, "METHOD_NOT_ALLOWED", `${method} tidak didukung`, path) };
    return { db, response: respond(200, { status: "ok" }, path) };
  }

  if (path === "/api/tasks") {
    if (method === "GET") {
      const page = parseIntParam(url.searchParams.get("page"), 1, 1, 10_000);
      const limit = parseIntParam(url.searchParams.get("limit"), 10, 1, 50);
      if (Number.isNaN(page) || Number.isNaN(limit)) {
        return {
          db,
          response: error(400, "VALIDATION_ERROR", "Query tidak valid", path, [
            { field: "page/limit", message: "page dan limit harus bilangan bulat" },
          ]),
        };
      }
      let rows = [...db.tasks].sort((a, b) => b.id - a.id);
      const done = url.searchParams.get("done");
      if (done === "true" || done === "false") rows = rows.filter((t) => t.done === (done === "true"));
      const q = url.searchParams.get("q")?.trim().toLowerCase();
      if (q) rows = rows.filter((t) => t.title.toLowerCase().includes(q));
      const total = rows.length;
      const data = rows.slice((page - 1) * limit, page * limit);
      return {
        db,
        response: respond(
          200,
          { data, meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } },
          path,
        ),
      };
    }
    if (method === "POST") {
      const { value, issues } = validateTask(req.body, false);
      if (issues.length) return { db, response: error(400, "VALIDATION_ERROR", "Data tidak valid", path, issues) };
      const ts = now();
      const task: Task = {
        id: db.nextId,
        title: value.title!,
        done: value.done ?? false,
        priority: value.priority ?? "sedang",
        createdAt: ts,
        updatedAt: ts,
      };
      return { db: { tasks: [...db.tasks, task], nextId: db.nextId + 1 }, response: respond(201, { data: task }, path) };
    }
    return { db, response: error(405, "METHOD_NOT_ALLOWED", `${method} tidak didukung di ${path}`, path) };
  }

  const match = path.match(/^\/api\/tasks\/([^/]+)$/);
  if (match) {
    const id = Number(match[1]);
    if (!Number.isInteger(id) || id < 1) {
      return {
        db,
        response: error(400, "VALIDATION_ERROR", "ID tidak valid", path, [
          { field: "id", message: "id harus bilangan bulat positif" },
        ]),
      };
    }
    const existing = db.tasks.find((t) => t.id === id);
    if (!existing) return { db, response: error(404, "NOT_FOUND", `Tugas dengan id ${id} tidak ditemukan`, path) };

    if (method === "GET") return { db, response: respond(200, { data: existing }, path) };

    if (method === "PUT" || method === "PATCH") {
      const { value, issues } = validateTask(req.body, method === "PATCH");
      if (method === "PUT" && isRecord(req.body) && typeof req.body.done !== "boolean") {
        issues.push({ field: "done", message: "PUT mengganti seluruh data: done wajib diisi" });
      }
      if (issues.length) return { db, response: error(400, "VALIDATION_ERROR", "Data tidak valid", path, issues) };
      const updated: Task = {
        ...existing,
        ...(method === "PUT" ? { priority: "sedang" as Priority } : {}),
        ...value,
        updatedAt: now(),
      };
      return {
        db: { ...db, tasks: db.tasks.map((t) => (t.id === id ? updated : t)) },
        response: respond(200, { data: updated }, path),
      };
    }

    if (method === "DELETE") {
      return {
        db: { ...db, tasks: db.tasks.filter((t) => t.id !== id) },
        response: respond(204, null, path),
      };
    }
  }

  return { db, response: error(404, "ROUTE_NOT_FOUND", `Route ${method} ${path} tidak ada`, path) };
}

export const STATUS_EXPLAIN: Record<number, string> = {
  200: "Berhasil. Server mengembalikan data yang diminta.",
  201: "Resource baru berhasil dibuat. Biasanya untuk POST.",
  204: "Berhasil, tapi tidak ada isi body. Umum untuk DELETE.",
  400: "Request-mu salah — cek body/parameter. Lihat `details` untuk field yang bermasalah.",
  401: "Belum login / token tidak valid.",
  403: "Sudah login, tapi tidak punya izin.",
  404: "Resource atau route tidak ditemukan.",
  405: "Method HTTP ini tidak didukung di endpoint tersebut.",
  409: "Konflik dengan data yang ada (mis. email sudah terdaftar).",
  500: "Error di sisi server — bukan salahmu sebagai client.",
};
