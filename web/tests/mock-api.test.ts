import { describe, expect, it } from "vitest";
import { createMockDb, handleMockRequest, type HttpMethod, type MockDb, type Task } from "@/lib/labs/mock-api";

const NOW = "2025-02-01T10:00:00.000Z";
const call = (db: MockDb, method: HttpMethod, path: string, body?: unknown) =>
  handleMockRequest(db, { method, path, body }, () => NOW);

type ListBody = { data: Task[]; meta: { page: number; limit: number; total: number; totalPages: number } };
type ErrorBody = { error: { message: string; code: string; details?: { field: string; message: string }[] } };

const seedDb = (count: number): MockDb => {
  let db = createMockDb();
  for (let i = 0; i < count; i++) db = call(db, "POST", "/api/tasks", { title: `Tugas ${i + 1}` }).db;
  return db;
};

describe("health & routing", () => {
  it("GET /api/health → 200", () => {
    const { response } = call(createMockDb(), "GET", "/api/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
    expect(response.headers["content-type"]).toContain("application/json");
  });

  it("method lain di /api/health → 405", () => {
    const body = call(createMockDb(), "POST", "/api/health").response.body as ErrorBody;
    expect(body.error.code).toBe("METHOD_NOT_ALLOWED");
  });

  it("route tak dikenal → 404 ROUTE_NOT_FOUND", () => {
    const { response } = call(createMockDb(), "GET", "/api/mahasiswa");
    expect(response.status).toBe(404);
    expect((response.body as ErrorBody).error.code).toBe("ROUTE_NOT_FOUND");
  });

  it("method tak didukung di koleksi → 405", () => {
    expect(call(createMockDb(), "DELETE", "/api/tasks").response.status).toBe(405);
  });

  it("trailing slash tetap cocok", () => {
    expect(call(createMockDb(), "GET", "/api/tasks/").response.status).toBe(200);
  });
});

describe("GET /api/tasks", () => {
  it("mengembalikan data terbaru dulu dengan meta pagination default", () => {
    const { response } = call(createMockDb(), "GET", "/api/tasks");
    const body = response.body as ListBody;
    expect(response.status).toBe(200);
    expect(body.data.map((t) => t.id)).toEqual([4, 3, 2, 1]);
    expect(body.meta).toEqual({ page: 1, limit: 10, total: 4, totalPages: 1 });
  });

  it("pagination dengan page & limit", () => {
    const db = seedDb(8); // total 12
    const body = call(db, "GET", "/api/tasks?page=2&limit=5").response.body as ListBody;
    expect(body.meta).toEqual({ page: 2, limit: 5, total: 12, totalPages: 3 });
    expect(body.data.map((t) => t.id)).toEqual([7, 6, 5, 4, 3]);
  });

  it("limit dibatasi maksimal 50 dan minimal 1", () => {
    const db = createMockDb();
    expect((call(db, "GET", "/api/tasks?limit=500").response.body as ListBody).meta.limit).toBe(50);
    expect((call(db, "GET", "/api/tasks?limit=0").response.body as ListBody).meta.limit).toBe(1);
  });

  it("page/limit bukan bilangan bulat → 400 VALIDATION_ERROR", () => {
    const { response } = call(createMockDb(), "GET", "/api/tasks?page=abc");
    expect(response.status).toBe(400);
    expect((response.body as ErrorBody).error.code).toBe("VALIDATION_ERROR");
  });

  it("filter done & pencarian q (tidak case-sensitive)", () => {
    const db = createMockDb();
    const done = call(db, "GET", "/api/tasks?done=true").response.body as ListBody;
    expect(done.data.every((t) => t.done)).toBe(true);
    expect(done.meta.total).toBe(1);
    const search = call(db, "GET", "/api/tasks?q=BASIS").response.body as ListBody;
    expect(search.data.map((t) => t.title)).toEqual(["Kerjakan tugas Basis Data bab 3"]);
  });

  it("halaman kosong tetap punya totalPages minimal 1", () => {
    const body = call(createMockDb(), "GET", "/api/tasks?q=tidak-ada-yang-cocok").response.body as ListBody;
    expect(body.data).toEqual([]);
    expect(body.meta.totalPages).toBe(1);
  });
});

describe("POST /api/tasks", () => {
  it("membuat tugas baru (201) dengan nilai default dan tidak memutasi DB lama", () => {
    const before = createMockDb();
    const snapshot = structuredClone(before);
    const { db, response } = call(before, "POST", "/api/tasks", { title: "  Kuis Jaringan  " });
    expect(response.status).toBe(201);
    expect((response.body as { data: Task }).data).toEqual({
      id: 5,
      title: "Kuis Jaringan",
      done: false,
      priority: "sedang",
      createdAt: NOW,
      updatedAt: NOW,
    });
    expect(db.tasks).toHaveLength(5);
    expect(db.nextId).toBe(6);
    expect(before).toEqual(snapshot);
  });

  it("validasi: title wajib, priority harus valid, field asing ditolak", () => {
    const { db, response } = call(createMockDb(), "POST", "/api/tasks", {
      title: "",
      priority: "darurat",
      deadline: "besok",
    });
    expect(response.status).toBe(400);
    const fields = (response.body as ErrorBody).error.details!.map((d) => d.field);
    expect(fields).toEqual(["title", "priority", "deadline"]);
    expect(db.tasks).toHaveLength(4);
  });

  it("body bukan objek → 400", () => {
    const body = call(createMockDb(), "POST", "/api/tasks", ["array"]).response.body as ErrorBody;
    expect(body.error.details?.[0].field).toBe("body");
  });

  it("title lebih dari 100 karakter ditolak", () => {
    expect(call(createMockDb(), "POST", "/api/tasks", { title: "a".repeat(101) }).response.status).toBe(400);
  });
});

describe("/api/tasks/:id", () => {
  it("GET detail & 404 & id tidak valid", () => {
    const db = createMockDb();
    expect((call(db, "GET", "/api/tasks/2").response.body as { data: Task }).data.id).toBe(2);
    const missing = call(db, "GET", "/api/tasks/99").response;
    expect(missing.status).toBe(404);
    expect((missing.body as ErrorBody).error.code).toBe("NOT_FOUND");
    expect(call(db, "GET", "/api/tasks/abc").response.status).toBe(400);
    expect(call(db, "GET", "/api/tasks/0").response.status).toBe(400);
  });

  it("PATCH mengubah sebagian field dan updatedAt", () => {
    const { db, response } = call(createMockDb(), "PATCH", "/api/tasks/2", { done: true });
    const task = (response.body as { data: Task }).data;
    expect(response.status).toBe(200);
    expect(task).toMatchObject({ id: 2, done: true, priority: "tinggi", updatedAt: NOW });
    expect(task.createdAt).not.toBe(NOW);
    expect(db.tasks.find((t) => t.id === 2)?.done).toBe(true);
  });

  it("PUT mengganti seluruh data: done wajib, priority kembali default", () => {
    const db = createMockDb();
    const invalid = call(db, "PUT", "/api/tasks/2", { title: "Baru" }).response;
    expect(invalid.status).toBe(400);
    expect((invalid.body as ErrorBody).error.details!.map((d) => d.field)).toContain("done");

    const ok = call(db, "PUT", "/api/tasks/2", { title: "Baru", done: false }).response;
    expect((ok.body as { data: Task }).data).toMatchObject({ title: "Baru", done: false, priority: "sedang" });
  });

  it("PATCH dengan tipe salah → 400", () => {
    const res = call(createMockDb(), "PATCH", "/api/tasks/1", { done: "ya" }).response;
    expect((res.body as ErrorBody).error.details).toEqual([{ field: "done", message: expect.any(String) }]);
  });

  it("DELETE → 204 tanpa body, lalu 404", () => {
    const first = call(createMockDb(), "DELETE", "/api/tasks/1");
    expect(first.response.status).toBe(204);
    expect(first.response.body).toBeNull();
    expect(first.response.headers["content-type"]).toBeUndefined();
    expect(first.db.tasks.map((t) => t.id)).toEqual([2, 3, 4]);
    expect(call(first.db, "DELETE", "/api/tasks/1").response.status).toBe(404);
  });

  it("ID tidak dipakai ulang setelah dihapus", () => {
    const afterDelete = call(createMockDb(), "DELETE", "/api/tasks/4").db;
    const created = call(afterDelete, "POST", "/api/tasks", { title: "Baru" }).response.body as { data: Task };
    expect(created.data.id).toBe(5);
  });
});
