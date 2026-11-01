import { describe, expect, it } from "vitest";
import { simCreate, simDelete, simList, simUpdate, sqlString, type SimState } from "@/lib/labs/crud-sim";
import { createMockDb } from "@/lib/labs/mock-api";

const NOW = () => "2025-02-01T10:00:00.000Z";
const initial = (): SimState => ({ db: createMockDb(), log: [], seq: 0 });

describe("sqlString", () => {
  it("meng-escape tanda kutip tunggal", () => {
    expect(sqlString("Jum'at")).toBe("'Jum''at'");
    expect(sqlString("biasa")).toBe("'biasa'");
  });
});

describe("simulator CRUD", () => {
  it("READ mencatat GET + SELECT", () => {
    const s = simList(initial());
    expect(s.seq).toBe(1);
    expect(s.log[0]).toMatchObject({ id: 1, op: "READ", request: { method: "GET", url: "/api/tasks" } });
    expect(s.log[0].sql).toMatch(/^SELECT/);
    expect(s.log[0].response.status).toBe(200);
  });

  it("CREATE berhasil menambah data dan membuat INSERT yang aman", () => {
    const s = simCreate(initial(), "  Tugas Jum'at ", NOW);
    expect(s.db.tasks).toHaveLength(5);
    expect(s.log[0].request).toEqual({ method: "POST", url: "/api/tasks", body: { title: "  Tugas Jum'at " } });
    expect(s.log[0].sql).toContain("VALUES ('Tugas Jum''at', 0, 'sedang')");
    expect(s.log[0].sql).toContain("-- id baru: 5");
  });

  it("CREATE gagal validasi tidak menjalankan query", () => {
    const s = simCreate(initial(), "   ");
    expect(s.log[0].response.status).toBe(400);
    expect(s.log[0].sql).toBe("-- Validasi gagal: query tidak dijalankan");
    expect(s.db.tasks).toHaveLength(4);
  });

  it("UPDATE mengubah boolean menjadi 1/0 di SQL", () => {
    const s = simUpdate(initial(), 2, { done: true, title: "Bab 4" }, NOW);
    expect(s.log[0].request.method).toBe("PATCH");
    expect(s.log[0].sql).toContain("SET done = 1,");
    expect(s.log[0].sql).toContain("title = 'Bab 4'");
    expect(s.log[0].sql).toContain("WHERE id = 2;");
    expect(s.db.tasks.find((t) => t.id === 2)).toMatchObject({ done: true, title: "Bab 4" });
  });

  it("UPDATE/DELETE pada id yang tidak ada → 404 tanpa query", () => {
    const u = simUpdate(initial(), 99, { done: true });
    expect(u.log[0].response.status).toBe(404);
    expect(u.log[0].sql).toBe("-- Query tidak dijalankan");
    const d = simDelete(initial(), 99);
    expect(d.log[0].response.status).toBe(404);
    expect(d.log[0].sql).toBe("-- Query tidak dijalankan");
  });

  it("DELETE menghapus data dengan status 204", () => {
    const s = simDelete(initial(), 1);
    expect(s.log[0].response.status).toBe(204);
    expect(s.log[0].sql).toBe("DELETE FROM tasks\nWHERE id = 1;");
    expect(s.db.tasks.map((t) => t.id)).toEqual([2, 3, 4]);
  });

  it("log terbaru di atas dan dibatasi 30 entri", () => {
    let s = initial();
    for (let i = 0; i < 35; i++) s = simList(s);
    expect(s.log).toHaveLength(30);
    expect(s.log[0].id).toBe(35);
    expect(s.seq).toBe(35);
  });
});
