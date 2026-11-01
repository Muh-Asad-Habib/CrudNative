import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "../src/lib/prisma.ts";
import { uploadDir } from "../src/lib/storage.ts";
import { api, registerUser, resetDatabase, TINY_PNG, type TestUser } from "./helpers.ts";

beforeAll(resetDatabase);
afterAll(async () => {
  // Hapus semua file upload yang dibuat selama test.
  await resetDatabase();
  await prisma.$disconnect();
});

function daysFromNow(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

async function createCourse(user: TestUser, name: string) {
  const res = await api().post("/api/courses").set(user.auth).send({ name, color: "#4F46E5" }).expect(201);
  return res.body.data as { id: number; name: string };
}

async function createTask(user: TestUser, body: Record<string, unknown>) {
  const res = await api().post("/api/tasks").set(user.auth).send(body).expect(201);
  return res.body.data;
}

function titles(res: { body: { data: { title: string }[] } }) {
  return res.body.data.map((task) => task.title);
}

function uploadedFiles() {
  return readdirSync(uploadDir).filter((name) => name !== ".gitkeep");
}

function storedPath(url: string) {
  return path.join(uploadDir, path.basename(url));
}

describe("Tasks CRUD", () => {
  let user: TestUser;
  let course: { id: number; name: string };

  beforeAll(async () => {
    user = await registerUser();
    course = await createCourse(user, "Basis Data");
  });

  it("wajib login → 401", async () => {
    await api().get("/api/tasks").expect(401);
  });

  it("POST dengan field minimal memakai nilai default", async () => {
    const task = await createTask(user, { title: "Tugas Sederhana" });
    expect(task).toEqual({
      id: expect.any(Number),
      title: "Tugas Sederhana",
      description: null,
      deadline: null,
      status: "TODO",
      priority: "MEDIUM",
      courseId: null,
      course: null,
      attachments: [],
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    expect(task).not.toHaveProperty("userId");
  });

  it("POST lengkap menyertakan ringkasan course", async () => {
    const deadline = daysFromNow(3);
    const task = await createTask(user, {
      title: "Laporan ERD",
      description: "Normalisasi sampai 3NF",
      deadline,
      status: "IN_PROGRESS",
      priority: "HIGH",
      courseId: course.id,
    });

    expect(task).toMatchObject({
      title: "Laporan ERD",
      description: "Normalisasi sampai 3NF",
      deadline,
      status: "IN_PROGRESS",
      priority: "HIGH",
      courseId: course.id,
      course: { id: course.id, name: "Basis Data", color: "#4F46E5" },
    });
  });

  it("POST tidak valid → 400 dengan detail untuk setiap field", async () => {
    const res = await api()
      .post("/api/tasks")
      .set(user.auth)
      .send({ title: "", deadline: "besok", status: "SELESAI", priority: "URGENT", courseId: "abc" })
      .expect(400);

    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.message).toEqual(expect.any(String));

    const byField = Object.fromEntries(
      res.body.error.details.map((detail: { field: string; message: string }) => [detail.field, detail.message]),
    );
    expect(Object.keys(byField).sort()).toEqual(["courseId", "deadline", "priority", "status", "title"]);
    expect(byField.title).toBe("Judul wajib diisi");
    expect(byField.deadline).toBe("Deadline harus berformat tanggal ISO 8601");
    expect(byField.status).toBe("Status harus TODO, IN_PROGRESS, atau DONE");
    expect(byField.priority).toBe("Prioritas harus LOW, MEDIUM, atau HIGH");
  });

  it("POST dengan courseId milik user lain → 400 di field courseId", async () => {
    const other = await registerUser();
    const otherCourse = await createCourse(other, "Bukan Milikku");

    const res = await api()
      .post("/api/tasks")
      .set(user.auth)
      .send({ title: "Curang", courseId: otherCourse.id })
      .expect(400);
    expect(res.body.error.details).toEqual([{ field: "courseId", message: "Mata kuliah tidak ditemukan" }]);
  });

  it("GET detail, PATCH sebagian, lalu DELETE", async () => {
    const task = await createTask(user, { title: "Draft", priority: "LOW", deadline: daysFromNow(1) });

    const detail = await api().get(`/api/tasks/${task.id}`).set(user.auth).expect(200);
    expect(detail.body.data.title).toBe("Draft");

    const patched = await api()
      .patch(`/api/tasks/${task.id}`)
      .set(user.auth)
      .send({ status: "DONE", deadline: null, courseId: course.id })
      .expect(200);
    expect(patched.body.data).toMatchObject({
      title: "Draft",
      priority: "LOW",
      status: "DONE",
      deadline: null,
      course: { id: course.id, name: "Basis Data" },
    });

    await api().delete(`/api/tasks/${task.id}`).set(user.auth).expect(204);
    const gone = await api().get(`/api/tasks/${task.id}`).set(user.auth).expect(404);
    expect(gone.body.error).toEqual({ message: "Tugas tidak ditemukan", code: "NOT_FOUND" });
  });

  it("PATCH tidak valid → 400", async () => {
    const task = await createTask(user, { title: "Valid" });
    const res = await api().patch(`/api/tasks/${task.id}`).set(user.auth).send({ title: "  " }).expect(400);
    expect(res.body.error.details).toEqual([{ field: "title", message: "Judul wajib diisi" }]);
  });

  it("PATCH dengan courseId milik user lain → 400 dan tugas tidak berubah", async () => {
    const task = await createTask(user, { title: "Punyaku", courseId: course.id });
    const other = await registerUser();
    const otherCourse = await createCourse(other, "Kuliah Orang Lain");

    const res = await api()
      .patch(`/api/tasks/${task.id}`)
      .set(user.auth)
      .send({ courseId: otherCourse.id })
      .expect(400);
    expect(res.body.error.details).toEqual([{ field: "courseId", message: "Mata kuliah tidak ditemukan" }]);

    const detail = await api().get(`/api/tasks/${task.id}`).set(user.auth).expect(200);
    expect(detail.body.data.course).toMatchObject({ id: course.id });
  });
});

describe("Tasks list: pagination, filter, sort", () => {
  let user: TestUser;
  let basisData: { id: number };
  let mobile: { id: number };

  beforeAll(async () => {
    user = await registerUser();
    basisData = await createCourse(user, "Basis Data");
    mobile = await createCourse(user, "Pemrograman Mobile");

    // Dibuat berurutan supaya urutan createdAt/id dapat ditebak.
    await createTask(user, { title: "Desain ERD", priority: "HIGH", status: "TODO", deadline: daysFromNow(5), courseId: basisData.id });
    await createTask(user, { title: "Kuis SQL", priority: "LOW", status: "DONE", deadline: daysFromNow(-2), courseId: basisData.id });
    await createTask(user, { title: "Baca Materi", priority: "MEDIUM", status: "IN_PROGRESS", description: "Bab navigasi" });
    await createTask(user, { title: "Aplikasi Catatan", priority: "HIGH", status: "IN_PROGRESS", deadline: daysFromNow(10), courseId: mobile.id });
    await createTask(user, { title: "Presentasi", priority: "LOW", status: "TODO", deadline: daysFromNow(1), courseId: mobile.id });
  });

  it("default: urut terbaru dulu, limit 10, setiap item berisi course & attachments", async () => {
    const res = await api().get("/api/tasks").set(user.auth).expect(200);
    expect(titles(res)).toEqual(["Presentasi", "Aplikasi Catatan", "Baca Materi", "Kuis SQL", "Desain ERD"]);
    expect(res.body.meta).toEqual({ page: 1, limit: 10, total: 5, totalPages: 1 });
    for (const task of res.body.data) {
      expect(task).toHaveProperty("course");
      expect(task.attachments).toEqual([]);
    }
  });

  it("pagination menghasilkan meta yang benar", async () => {
    const page1 = await api().get("/api/tasks").query({ limit: 2, page: 1 }).set(user.auth).expect(200);
    const page3 = await api().get("/api/tasks").query({ limit: 2, page: 3 }).set(user.auth).expect(200);

    expect(page1.body.meta).toEqual({ page: 1, limit: 2, total: 5, totalPages: 3 });
    expect(titles(page1)).toEqual(["Presentasi", "Aplikasi Catatan"]);
    expect(page3.body.meta).toEqual({ page: 3, limit: 2, total: 5, totalPages: 3 });
    expect(titles(page3)).toEqual(["Desain ERD"]);
  });

  it("limit > 50 atau page < 1 → 400", async () => {
    const res = await api().get("/api/tasks").query({ limit: 51, page: 0 }).set(user.auth).expect(400);
    const fields = res.body.error.details.map((detail: { field: string }) => detail.field);
    expect(fields).toEqual(expect.arrayContaining(["limit", "page"]));
  });

  it("filter status", async () => {
    const res = await api().get("/api/tasks").query({ status: "IN_PROGRESS" }).set(user.auth).expect(200);
    expect(titles(res).sort()).toEqual(["Aplikasi Catatan", "Baca Materi"]);
    expect(res.body.meta.total).toBe(2);
  });

  it("filter priority + courseId", async () => {
    const res = await api()
      .get("/api/tasks")
      .query({ priority: "HIGH", courseId: basisData.id })
      .set(user.auth)
      .expect(200);
    expect(titles(res)).toEqual(["Desain ERD"]);
  });

  it("pencarian q di judul dan deskripsi", async () => {
    const byTitle = await api().get("/api/tasks").query({ q: "SQL" }).set(user.auth).expect(200);
    expect(titles(byTitle)).toEqual(["Kuis SQL"]);

    const byDescription = await api().get("/api/tasks").query({ q: "navigasi" }).set(user.auth).expect(200);
    expect(titles(byDescription)).toEqual(["Baca Materi"]);
  });

  it("filter tidak valid → 400", async () => {
    const res = await api().get("/api/tasks").query({ status: "SELESAI", sort: "acak" }).set(user.auth).expect(400);
    const fields = res.body.error.details.map((detail: { field: string }) => detail.field);
    expect(fields).toEqual(expect.arrayContaining(["status", "sort"]));
  });

  it("sort title (A-Z) dan -title (Z-A)", async () => {
    const asc = await api().get("/api/tasks").query({ sort: "title" }).set(user.auth).expect(200);
    expect(titles(asc)).toEqual(["Aplikasi Catatan", "Baca Materi", "Desain ERD", "Kuis SQL", "Presentasi"]);

    const desc = await api().get("/api/tasks").query({ sort: "-title" }).set(user.auth).expect(200);
    expect(titles(desc)).toEqual(["Presentasi", "Kuis SQL", "Desain ERD", "Baca Materi", "Aplikasi Catatan"]);
  });

  it("sort deadline: tugas tanpa deadline selalu di akhir", async () => {
    const asc = await api().get("/api/tasks").query({ sort: "deadline" }).set(user.auth).expect(200);
    expect(titles(asc)).toEqual(["Kuis SQL", "Presentasi", "Desain ERD", "Aplikasi Catatan", "Baca Materi"]);

    const desc = await api().get("/api/tasks").query({ sort: "-deadline" }).set(user.auth).expect(200);
    expect(titles(desc)).toEqual(["Aplikasi Catatan", "Desain ERD", "Presentasi", "Kuis SQL", "Baca Materi"]);
  });

  it("sort -priority: HIGH → MEDIUM → LOW (lalu deadline terdekat), termasuk saat dipaginasi", async () => {
    const all = await api().get("/api/tasks").query({ sort: "-priority" }).set(user.auth).expect(200);
    expect(titles(all)).toEqual(["Desain ERD", "Aplikasi Catatan", "Baca Materi", "Kuis SQL", "Presentasi"]);

    const page2 = await api().get("/api/tasks").query({ sort: "-priority", limit: 2, page: 2 }).set(user.auth).expect(200);
    expect(titles(page2)).toEqual(["Baca Materi", "Kuis SQL"]);

    const asc = await api().get("/api/tasks").query({ sort: "priority" }).set(user.auth).expect(200);
    expect(asc.body.data.map((task: { priority: string }) => task.priority)).toEqual(["LOW", "LOW", "MEDIUM", "HIGH", "HIGH"]);
  });
});

describe("Tasks isolasi antar user", () => {
  it("user lain tidak bisa melihat, mengubah, atau menghapus tugas", async () => {
    const alice = await registerUser({ name: "Alice" });
    const bob = await registerUser({ name: "Bob" });
    const task = await createTask(alice, { title: "Milik Alice" });

    const list = await api().get("/api/tasks").set(bob.auth).expect(200);
    expect(list.body.data).toEqual([]);
    expect(list.body.meta.total).toBe(0);

    await api().get(`/api/tasks/${task.id}`).set(bob.auth).expect(404);
    await api().patch(`/api/tasks/${task.id}`).set(bob.auth).send({ title: "Dibajak" }).expect(404);
    await api().delete(`/api/tasks/${task.id}`).set(bob.auth).expect(404);

    const stillThere = await api().get(`/api/tasks/${task.id}`).set(alice.auth).expect(200);
    expect(stillThere.body.data.title).toBe("Milik Alice");
  });
});

describe("Lampiran (attachments)", () => {
  let user: TestUser;
  let taskId: number;

  beforeAll(async () => {
    user = await registerUser();
    taskId = (await createTask(user, { title: "Tugas dengan lampiran" })).id;
  });

  it("upload PNG → 201, file tersimpan dan bisa diakses di /uploads", async () => {
    const res = await api()
      .post(`/api/tasks/${taskId}/attachments`)
      .set(user.auth)
      .attach("file", TINY_PNG, { filename: "foto-papan.png", contentType: "image/png" })
      .expect(201);

    const attachment = res.body.data;
    expect(attachment).toEqual({
      id: expect.any(Number),
      taskId,
      url: expect.stringMatching(/^\/uploads\/.+\.png$/),
      filename: "foto-papan.png",
      mimeType: "image/png",
      size: TINY_PNG.length,
      createdAt: expect.any(String),
    });
    expect(existsSync(storedPath(attachment.url))).toBe(true);

    const file = await api().get(attachment.url).expect(200);
    expect(file.headers["content-type"]).toBe("image/png");

    const task = await api().get(`/api/tasks/${taskId}`).set(user.auth).expect(200);
    expect(task.body.data.attachments).toEqual([attachment]);
  });

  it("tipe file bukan gambar → 415 dan tidak ada file tersimpan", async () => {
    const before = uploadedFiles();
    const res = await api()
      .post(`/api/tasks/${taskId}/attachments`)
      .set(user.auth)
      .attach("file", Buffer.from("halo"), { filename: "catatan.txt", contentType: "text/plain" })
      .expect(415);

    expect(res.body.error.code).toBe("UNSUPPORTED_MEDIA_TYPE");
    expect(uploadedFiles()).toEqual(before);
  });

  it("tanpa file → 400 di field file", async () => {
    const res = await api().post(`/api/tasks/${taskId}/attachments`).set(user.auth).field("judul", "x").expect(400);
    expect(res.body.error.details).toEqual([{ field: "file", message: "File gambar wajib diunggah" }]);
  });

  it("file lebih dari 5 MB → 413", async () => {
    const before = uploadedFiles();
    const res = await api()
      .post(`/api/tasks/${taskId}/attachments`)
      .set(user.auth)
      .attach("file", Buffer.alloc(5 * 1024 * 1024 + 1), { filename: "besar.png", contentType: "image/png" })
      .expect(413);

    expect(res.body.error.code).toBe("PAYLOAD_TOO_LARGE");
    expect(uploadedFiles()).toEqual(before);
  });

  it("upload ke tugas milik user lain → 404 dan file dibuang", async () => {
    const stranger = await registerUser();
    const before = uploadedFiles();
    await api()
      .post(`/api/tasks/${taskId}/attachments`)
      .set(stranger.auth)
      .attach("file", TINY_PNG, { filename: "nyusup.png", contentType: "image/png" })
      .expect(404);

    expect(uploadedFiles()).toEqual(before);
  });

  it("hapus lampiran → 204 dan file ikut terhapus", async () => {
    const upload = await api()
      .post(`/api/tasks/${taskId}/attachments`)
      .set(user.auth)
      .attach("file", TINY_PNG, { filename: "hapus-saya.png", contentType: "image/png" })
      .expect(201);
    const attachment = upload.body.data;

    await api().delete(`/api/tasks/${taskId}/attachments/${attachment.id}`).set(user.auth).expect(204);
    expect(existsSync(storedPath(attachment.url))).toBe(false);

    const again = await api().delete(`/api/tasks/${taskId}/attachments/${attachment.id}`).set(user.auth).expect(404);
    expect(again.body.error.message).toBe("Lampiran tidak ditemukan");
  });

  it("hapus tugas → semua file lampirannya ikut terhapus", async () => {
    const task = await createTask(user, { title: "Akan dihapus" });
    const upload = await api()
      .post(`/api/tasks/${task.id}/attachments`)
      .set(user.auth)
      .attach("file", TINY_PNG, { filename: "ikut-hilang.webp", contentType: "image/webp" })
      .expect(201);
    expect(upload.body.data.url).toMatch(/\.webp$/);

    await api().delete(`/api/tasks/${task.id}`).set(user.auth).expect(204);
    expect(existsSync(storedPath(upload.body.data.url))).toBe(false);
  });

  it("upload JPEG → ekstensi .jpg, boleh ditampilkan lintas origin, dan muncul di list tugas", async () => {
    const res = await api()
      .post(`/api/tasks/${taskId}/attachments`)
      .set(user.auth)
      .attach("file", TINY_PNG, { filename: "Foto Kelas.JPEG", contentType: "image/jpeg" })
      .expect(201);
    expect(res.body.data).toMatchObject({ filename: "Foto Kelas.JPEG", mimeType: "image/jpeg" });
    expect(res.body.data.url).toMatch(/^\/uploads\/[\w-]+\.jpg$/);

    const file = await api().get(res.body.data.url).expect(200);
    expect(file.headers["cross-origin-resource-policy"]).toBe("cross-origin");

    const list = await api().get("/api/tasks").set(user.auth).expect(200);
    const listed = list.body.data.find((task: { id: number }) => task.id === taskId);
    expect(listed.attachments.map((attachment: { id: number }) => attachment.id)).toContain(res.body.data.id);
  });

  it("field selain `file` → 400 BAD_REQUEST dan tidak ada file tersimpan", async () => {
    const before = uploadedFiles();
    const res = await api()
      .post(`/api/tasks/${taskId}/attachments`)
      .set(user.auth)
      .attach("gambar", TINY_PNG, { filename: "salah-field.png", contentType: "image/png" })
      .expect(400);

    expect(res.body.error.code).toBe("BAD_REQUEST");
    expect(uploadedFiles()).toEqual(before);
  });

  it("tanpa token → 401, id tugas tidak valid → 400, tugas tidak ada → 404", async () => {
    const before = uploadedFiles();

    await api()
      .post(`/api/tasks/${taskId}/attachments`)
      .attach("file", TINY_PNG, { filename: "a.png", contentType: "image/png" })
      .expect(401);

    const invalid = await api()
      .post("/api/tasks/abc/attachments")
      .set(user.auth)
      .attach("file", TINY_PNG, { filename: "b.png", contentType: "image/png" })
      .expect(400);
    expect(invalid.body.error.details[0].field).toBe("id");

    const missing = await api()
      .post("/api/tasks/999999/attachments")
      .set(user.auth)
      .attach("file", TINY_PNG, { filename: "c.png", contentType: "image/png" })
      .expect(404);
    expect(missing.body.error).toEqual({ message: "Tugas tidak ditemukan", code: "NOT_FOUND" });

    expect(uploadedFiles()).toEqual(before);
  });

  it("user lain tidak bisa menghapus lampiran → 404 dan file tetap ada", async () => {
    const upload = await api()
      .post(`/api/tasks/${taskId}/attachments`)
      .set(user.auth)
      .attach("file", TINY_PNG, { filename: "punyaku.png", contentType: "image/png" })
      .expect(201);
    const attachment = upload.body.data;
    const stranger = await registerUser();

    await api().delete(`/api/tasks/${taskId}/attachments/${attachment.id}`).set(stranger.auth).expect(404);
    expect(existsSync(storedPath(attachment.url))).toBe(true);

    // attachmentId yang benar tapi taskId salah juga 404.
    const otherTask = await createTask(user, { title: "Tugas lain" });
    await api().delete(`/api/tasks/${otherTask.id}/attachments/${attachment.id}`).set(user.auth).expect(404);
    expect(existsSync(storedPath(attachment.url))).toBe(true);
  });

  it("lebih dari satu file → 400 dan tidak ada file tersimpan", async () => {
    const before = uploadedFiles();
    const res = await api()
      .post(`/api/tasks/${taskId}/attachments`)
      .set(user.auth)
      .attach("file", TINY_PNG, { filename: "satu.png", contentType: "image/png" })
      .attach("file", TINY_PNG, { filename: "dua.png", contentType: "image/png" })
      .expect(400);

    expect(res.body.error).toEqual({
      message: "Hanya boleh mengunggah satu file per request",
      code: "BAD_REQUEST",
    });
    expect(uploadedFiles()).toEqual(before);
  });

  it("body multipart rusak (tanpa boundary / terpotong) → 400, bukan 500", async () => {
    const before = uploadedFiles();
    const expected = { message: "Body multipart/form-data tidak valid", code: "BAD_REQUEST" };

    const noBoundary = await api()
      .post(`/api/tasks/${taskId}/attachments`)
      .set(user.auth)
      .set("Content-Type", "multipart/form-data")
      .send("bukan multipart")
      .expect(400);
    expect(noBoundary.body.error).toEqual(expected);

    const truncated = await api()
      .post(`/api/tasks/${taskId}/attachments`)
      .set(user.auth)
      .set("Content-Type", "multipart/form-data; boundary=BATAS")
      .send(
        '--BATAS\r\nContent-Disposition: form-data; name="file"; filename="putus.png"\r\n' +
          "Content-Type: image/png\r\n\r\n" +
          TINY_PNG.subarray(0, 20).toString("latin1"),
      )
      .expect(400);
    expect(truncated.body.error).toEqual(expected);

    expect(uploadedFiles()).toEqual(before);
  });
});
