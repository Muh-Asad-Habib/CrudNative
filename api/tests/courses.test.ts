import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "../src/lib/prisma.ts";
import { api, registerUser, resetDatabase, type TestUser } from "./helpers.ts";

let owner: TestUser;
let stranger: TestUser;

beforeAll(async () => {
  await resetDatabase();
  owner = await registerUser({ name: "Pemilik" });
  stranger = await registerUser({ name: "Orang Lain" });
});
afterAll(() => prisma.$disconnect());

async function createCourse(user: TestUser, body: Record<string, unknown>) {
  const res = await api().post("/api/courses").set(user.auth).send(body).expect(201);
  return res.body.data;
}

describe("Courses CRUD", () => {
  it("wajib login → 401", async () => {
    await api().get("/api/courses").expect(401);
  });

  it("POST membuat mata kuliah dengan taskCount 0", async () => {
    const course = await createCourse(owner, {
      name: "Basis Data",
      code: "IF2240",
      lecturer: "Dr. Siti Rahma",
      color: "#4F46E5",
    });

    expect(course).toEqual({
      id: expect.any(Number),
      name: "Basis Data",
      code: "IF2240",
      lecturer: "Dr. Siti Rahma",
      color: "#4F46E5",
      taskCount: 0,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    expect(course).not.toHaveProperty("userId");
  });

  it("POST dengan data tidak valid → 400 dengan detail per field", async () => {
    const res = await api()
      .post("/api/courses")
      .set(owner.auth)
      .send({ name: "", color: "merah" })
      .expect(400);

    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    const fields = res.body.error.details.map((detail: { field: string }) => detail.field);
    expect(fields).toEqual(expect.arrayContaining(["name", "color"]));
  });

  it("GET list mengembalikan { data, meta } milik user sendiri, urut nama", async () => {
    await createCourse(owner, { name: "Algoritma" });
    await createCourse(stranger, { name: "Milik Orang Lain" });

    const res = await api().get("/api/courses").set(owner.auth).expect(200);
    const names = res.body.data.map((course: { name: string }) => course.name);
    expect(names).toEqual(["Algoritma", "Basis Data"]);
    expect(res.body.meta).toEqual({ page: 1, limit: 20, total: 2, totalPages: 1 });
  });

  it("GET list mendukung pencarian q", async () => {
    const res = await api().get("/api/courses").query({ q: "IF2240" }).set(owner.auth).expect(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe("Basis Data");
  });

  it("GET list mendukung pagination, limit maksimal 50", async () => {
    const page2 = await api().get("/api/courses").query({ limit: 1, page: 2 }).set(owner.auth).expect(200);
    expect(page2.body.meta).toEqual({ page: 2, limit: 1, total: 2, totalPages: 2 });
    expect(page2.body.data.map((course: { name: string }) => course.name)).toEqual(["Basis Data"]);

    const tooMany = await api().get("/api/courses").query({ limit: 51 }).set(owner.auth).expect(400);
    expect(tooMany.body.error.details[0].field).toBe("limit");
  });

  it("GET detail, PATCH, lalu DELETE", async () => {
    const course = await createCourse(owner, { name: "Jaringan Komputer", code: "IF3130" });

    const detail = await api().get(`/api/courses/${course.id}`).set(owner.auth).expect(200);
    expect(detail.body.data.name).toBe("Jaringan Komputer");

    const patched = await api()
      .patch(`/api/courses/${course.id}`)
      .set(owner.auth)
      .send({ lecturer: "Ir. Bambang", code: "" })
      .expect(200);
    expect(patched.body.data).toMatchObject({
      name: "Jaringan Komputer",
      lecturer: "Ir. Bambang",
      code: null,
    });

    await api().delete(`/api/courses/${course.id}`).set(owner.auth).expect(204);
    const gone = await api().get(`/api/courses/${course.id}`).set(owner.auth).expect(404);
    expect(gone.body.error).toEqual({ message: "Mata kuliah tidak ditemukan", code: "NOT_FOUND" });
  });

  it("PATCH color null mengosongkan warna, PATCH name kosong → 400", async () => {
    const course = await createCourse(owner, { name: "Grafika", color: "#10B981" });

    const cleared = await api()
      .patch(`/api/courses/${course.id}`)
      .set(owner.auth)
      .send({ color: null })
      .expect(200);
    expect(cleared.body.data).toMatchObject({ name: "Grafika", color: null });

    const invalid = await api()
      .patch(`/api/courses/${course.id}`)
      .set(owner.auth)
      .send({ name: "   ", color: "merah" })
      .expect(400);
    const fields = invalid.body.error.details.map((detail: { field: string }) => detail.field);
    expect(fields).toEqual(expect.arrayContaining(["name", "color"]));
  });

  it("id bukan angka → 400 VALIDATION_ERROR", async () => {
    const res = await api().get("/api/courses/abc").set(owner.auth).expect(400);
    expect(res.body.error.details[0].field).toBe("id");
  });

  it("taskCount menghitung tugas, dan hapus course membuat courseId tugas = null", async () => {
    const course = await createCourse(owner, { name: "Pemrograman Mobile" });
    const task = await api()
      .post("/api/tasks")
      .set(owner.auth)
      .send({ title: "Tugas RN", courseId: course.id })
      .expect(201);

    const detail = await api().get(`/api/courses/${course.id}`).set(owner.auth).expect(200);
    expect(detail.body.data.taskCount).toBe(1);

    await api().delete(`/api/courses/${course.id}`).set(owner.auth).expect(204);
    const orphan = await api().get(`/api/tasks/${task.body.data.id}`).set(owner.auth).expect(200);
    expect(orphan.body.data.courseId).toBeNull();
    expect(orphan.body.data.course).toBeNull();
  });
});

describe("Courses kepemilikan", () => {
  it("course milik user lain → 404 untuk GET, PATCH, DELETE", async () => {
    const course = await createCourse(owner, { name: "Rahasia" });

    await api().get(`/api/courses/${course.id}`).set(stranger.auth).expect(404);
    await api().patch(`/api/courses/${course.id}`).set(stranger.auth).send({ name: "Dibajak" }).expect(404);
    await api().delete(`/api/courses/${course.id}`).set(stranger.auth).expect(404);

    // Data asli tidak berubah.
    const res = await api().get(`/api/courses/${course.id}`).set(owner.auth).expect(200);
    expect(res.body.data.name).toBe("Rahasia");
  });
});
