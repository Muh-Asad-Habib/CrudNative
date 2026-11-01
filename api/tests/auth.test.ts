import { createHash } from "node:crypto";
import jwt from "jsonwebtoken";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { env } from "../src/config/env.ts";
import { prisma } from "../src/lib/prisma.ts";
import { api, registerUser, resetDatabase } from "./helpers.ts";

beforeAll(resetDatabase);
afterAll(() => prisma.$disconnect());

describe("POST /api/auth/register", () => {
  it("mendaftarkan user dan mengembalikan token", async () => {
    const res = await api()
      .post("/api/auth/register")
      .send({ name: "Budi", email: "  Budi@Kampus.ac.id ", password: "password123" })
      .expect(201);

    const { user, accessToken, refreshToken } = res.body.data;
    expect(user).toEqual({
      id: expect.any(Number),
      name: "Budi",
      email: "budi@kampus.ac.id",
      createdAt: expect.any(String),
    });
    expect(user).not.toHaveProperty("passwordHash");
    expect(accessToken).toEqual(expect.any(String));
    expect(refreshToken).toMatch(/^[0-9a-f]+$/);

    // Refresh token disimpan sebagai hash, bukan teks asli.
    const stored = await prisma.refreshToken.findFirst({ where: { userId: user.id } });
    expect(stored?.tokenHash).not.toBe(refreshToken);
  });

  it("access token berisi sub = userId (string)", async () => {
    const { user, accessToken } = await registerUser();
    const payload = jwt.decode(accessToken) as jwt.JwtPayload;
    expect(payload.sub).toBe(String(user.id));
    expect(payload.exp! - payload.iat!).toBe(15 * 60);
  });

  it("validasi gagal → 400 dengan detail per field", async () => {
    const res = await api()
      .post("/api/auth/register")
      .send({ name: "", email: "bukan-email", password: "123" })
      .expect(400);

    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    const fields = res.body.error.details.map((detail: { field: string }) => detail.field);
    expect(fields).toEqual(expect.arrayContaining(["name", "email", "password"]));
    for (const detail of res.body.error.details) {
      expect(detail.message).toEqual(expect.any(String));
    }
  });

  it("email yang sudah terdaftar → 409 CONFLICT", async () => {
    await registerUser({ email: "kembar@kampus.ac.id" });
    const res = await api()
      .post("/api/auth/register")
      .send({ name: "Kembar", email: "KEMBAR@kampus.ac.id", password: "password123" })
      .expect(409);

    expect(res.body.error).toEqual({ message: "Email sudah terdaftar", code: "CONFLICT" });
  });
});

describe("POST /api/auth/login", () => {
  it("login dengan kredensial benar", async () => {
    const { user, password } = await registerUser({ email: "login@kampus.ac.id" });
    const res = await api()
      .post("/api/auth/login")
      .send({ email: "login@kampus.ac.id", password })
      .expect(200);

    expect(res.body.data.user.id).toBe(user.id);
    expect(res.body.data.accessToken).toEqual(expect.any(String));
    expect(res.body.data.refreshToken).toEqual(expect.any(String));
  });

  it("password salah → 401 dengan pesan generik", async () => {
    await registerUser({ email: "salah@kampus.ac.id" });
    const res = await api()
      .post("/api/auth/login")
      .send({ email: "salah@kampus.ac.id", password: "password-salah" })
      .expect(401);

    expect(res.body.error).toEqual({ message: "Email atau password salah", code: "UNAUTHORIZED" });
  });

  it("email tidak terdaftar → 401 dengan pesan yang sama", async () => {
    const res = await api()
      .post("/api/auth/login")
      .send({ email: "tidak-ada@kampus.ac.id", password: "password123" })
      .expect(401);

    expect(res.body.error.message).toBe("Email atau password salah");
  });

  it("body kosong → 400 VALIDATION_ERROR", async () => {
    const res = await api().post("/api/auth/login").send({}).expect(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("GET /api/auth/me", () => {
  it("mengembalikan user yang sedang login", async () => {
    const { user, auth } = await registerUser();
    const res = await api().get("/api/auth/me").set(auth).expect(200);
    expect(res.body.data).toEqual(user);
  });

  it("tanpa token → 401 UNAUTHORIZED", async () => {
    const res = await api().get("/api/auth/me").expect(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("token rusak → 401 UNAUTHORIZED", async () => {
    const res = await api().get("/api/auth/me").set("Authorization", "Bearer bukan.token.valid").expect(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("token kedaluwarsa → 401 TOKEN_EXPIRED", async () => {
    const { user } = await registerUser();
    const expired = jwt.sign({}, env.JWT_ACCESS_SECRET, { subject: String(user.id), expiresIn: -10 });
    const res = await api().get("/api/auth/me").set("Authorization", `Bearer ${expired}`).expect(401);
    expect(res.body.error.code).toBe("TOKEN_EXPIRED");
  });

  it("token valid tapi user sudah dihapus → 401 UNAUTHORIZED", async () => {
    const { user, auth } = await registerUser();
    await prisma.user.delete({ where: { id: user.id } });
    const res = await api().get("/api/auth/me").set(auth).expect(401);
    expect(res.body.error).toEqual({ message: "User tidak ditemukan", code: "UNAUTHORIZED" });
  });
});

describe("Refresh token", () => {
  it("rotasi: refresh menerbitkan pasangan token baru", async () => {
    const { refreshToken } = await registerUser();
    const res = await api().post("/api/auth/refresh").send({ refreshToken }).expect(200);

    expect(res.body.data).toEqual({ accessToken: expect.any(String), refreshToken: expect.any(String) });
    expect(res.body.data.refreshToken).not.toBe(refreshToken);

    // Access token baru bisa dipakai.
    await api().get("/api/auth/me").set("Authorization", `Bearer ${res.body.data.accessToken}`).expect(200);
  });

  it("deteksi pemakaian ulang: token lama dipakai lagi → 401 dan semua sesi dicabut", async () => {
    const { refreshToken: first } = await registerUser();
    const rotated = await api().post("/api/auth/refresh").send({ refreshToken: first }).expect(200);
    const second = rotated.body.data.refreshToken;

    // Token pertama sudah dicabut → dianggap dicuri.
    const reuse = await api().post("/api/auth/refresh").send({ refreshToken: first }).expect(401);
    expect(reuse.body.error.code).toBe("UNAUTHORIZED");

    // Token hasil rotasi ikut dicabut.
    await api().post("/api/auth/refresh").send({ refreshToken: second }).expect(401);
  });

  it("refresh token tidak dikenal → 401", async () => {
    const res = await api().post("/api/auth/refresh").send({ refreshToken: "abc123" }).expect(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("refresh token acak 96 karakter hex, database hanya menyimpan hash SHA-256", async () => {
    const { refreshToken } = await registerUser();
    expect(refreshToken).toMatch(/^[0-9a-f]{96}$/);

    const expectedHash = createHash("sha256").update(refreshToken).digest("hex");
    expect(await prisma.refreshToken.findUnique({ where: { tokenHash: expectedHash } })).not.toBeNull();
    expect(await prisma.refreshToken.findUnique({ where: { tokenHash: refreshToken } })).toBeNull();
  });

  it("refresh token kedaluwarsa → 401", async () => {
    const { refreshToken } = await registerUser();
    await prisma.refreshToken.update({
      where: { tokenHash: createHash("sha256").update(refreshToken).digest("hex") },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });

    const res = await api().post("/api/auth/refresh").send({ refreshToken }).expect(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("refresh token kosong → 400 VALIDATION_ERROR", async () => {
    const res = await api().post("/api/auth/refresh").send({}).expect(400);
    expect(res.body.error.details[0].field).toBe("refreshToken");
  });

  it("logout mencabut refresh token → 204, lalu refresh ditolak", async () => {
    const { refreshToken } = await registerUser();
    await api().post("/api/auth/logout").send({ refreshToken }).expect(204);
    await api().post("/api/auth/refresh").send({ refreshToken }).expect(401);
  });

  it("logout dengan token tidak dikenal tetap 204 (idempotent)", async () => {
    await api().post("/api/auth/logout").send({ refreshToken: "tidak-dikenal" }).expect(204);
  });
});
