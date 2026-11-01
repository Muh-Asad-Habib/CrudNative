import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { corsOrigin } from "../src/app.ts";
import { EXAMPLE_JWT_SECRET } from "../src/config/env.ts";
import { errorHandler } from "../src/middleware/error-handler.ts";
import { AUTH_RATE_LIMIT, authRateLimiter } from "../src/middleware/rate-limit.ts";
import { api } from "./helpers.ts";

describe("App", () => {
  it("CORS_ORIGIN: '*' → semua origin, selain itu daftar dipisah koma", () => {
    expect(corsOrigin("*")).toBe("*");
    expect(corsOrigin(" * ")).toBe("*");
    expect(corsOrigin("http://localhost:8081, http://192.168.1.10:8081,")).toEqual([
      "http://localhost:8081",
      "http://192.168.1.10:8081",
    ]);
  });

  it("GET /api/health → 200 { status: 'ok' }", async () => {
    const res = await api().get("/api/health").expect(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("route yang tidak dikenal → 404 ROUTE_NOT_FOUND", async () => {
    const res = await api().get("/api/tidak-ada").expect(404);
    expect(res.body.error.code).toBe("ROUTE_NOT_FOUND");
    expect(res.body.error.message).toContain("/api/tidak-ada");
  });

  it("body JSON rusak → 400 BAD_REQUEST", async () => {
    const res = await api()
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send('{"email": ')
      .expect(400);
    expect(res.body.error.code).toBe("BAD_REQUEST");
  });

  it("mengirim header keamanan (helmet) dan CORS", async () => {
    const res = await api().get("/api/health").set("Origin", "http://localhost:8081").expect(200);
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["access-control-allow-origin"]).toBe("*");
  });

  it("preflight CORS mengizinkan header Authorization", async () => {
    const res = await api()
      .options("/api/tasks")
      .set("Origin", "http://localhost:8081")
      .set("Access-Control-Request-Method", "PATCH")
      .set("Access-Control-Request-Headers", "authorization,content-type")
      .expect(204);
    expect(res.headers["access-control-allow-origin"]).toBe("*");
    expect(res.headers["access-control-allow-methods"]).toContain("PATCH");
    expect(res.headers["access-control-allow-headers"]).toContain("authorization");
  });

  it("file upload yang tidak ada → 404 ROUTE_NOT_FOUND", async () => {
    const res = await api().get("/uploads/tidak-ada.png").expect(404);
    expect(res.body.error.code).toBe("ROUTE_NOT_FOUND");
  });
});

describe("Validasi environment", () => {
  // env.ts memanggil process.exit(1) kalau tidak valid, jadi dijalankan di proses terpisah.
  function loadEnv(overrides: Record<string, string>) {
    return spawnSync(process.execPath, ["--import", "tsx", "src/config/env.ts"], {
      env: { ...process.env, DATABASE_URL: "file:./test.db", ...overrides },
      encoding: "utf8",
    });
  }

  it("nilai contoh JWT_ACCESS_SECRET sama dengan isi .env.example", () => {
    expect(readFileSync(".env.example", "utf8")).toContain(`JWT_ACCESS_SECRET="${EXAMPLE_JWT_SECRET}"`);
  });

  it("production menolak start kalau JWT_ACCESS_SECRET masih nilai contoh", () => {
    const result = loadEnv({ NODE_ENV: "production", JWT_ACCESS_SECRET: EXAMPLE_JWT_SECRET });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("JWT_ACCESS_SECRET");
  });

  it("production dengan rahasia acak → valid; development boleh memakai nilai contoh", () => {
    const secret = randomBytes(48).toString("hex");
    expect(loadEnv({ NODE_ENV: "production", JWT_ACCESS_SECRET: secret }).status).toBe(0);
    expect(loadEnv({ NODE_ENV: "development", JWT_ACCESS_SECRET: EXAMPLE_JWT_SECRET }).status).toBe(0);
  });
});

describe("Error handler", () => {
  function appWith(handler: express.RequestHandler) {
    const app = express();
    app.get("/test/:value", handler);
    app.use(errorHandler);
    return app;
  }

  it("error tak terduga → 500 INTERNAL_ERROR dengan pesan generik", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const app = appWith(() => {
      throw new Error("rahasia database bocor");
    });

    const res = await request(app).get("/test/1").expect(500);
    expect(res.body).toEqual({
      error: { message: "Terjadi kesalahan pada server", code: "INTERNAL_ERROR" },
    });
    expect(JSON.stringify(res.body)).not.toContain("rahasia");
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it("parameter route dengan encoding rusak → 400 BAD_REQUEST", async () => {
    const app = appWith((_req, res) => {
      res.json({ ok: true });
    });
    const res = await request(app).get("/test/%E0%A4%A").expect(400);
    expect(res.body.error).toEqual({ message: "Request tidak valid", code: "BAD_REQUEST" });
  });
});

describe("Rate limit route auth", () => {
  it(`request ke-${AUTH_RATE_LIMIT + 1} dalam 15 menit → 429 RATE_LIMITED`, async () => {
    const app = express();
    app.post("/login", authRateLimiter({ enabled: true }), (_req, res) => {
      res.json({ ok: true });
    });
    app.use(errorHandler);

    for (let i = 0; i < AUTH_RATE_LIMIT; i += 1) {
      await request(app).post("/login").expect(200);
    }
    const res = await request(app).post("/login").expect(429);
    expect(res.body.error.code).toBe("RATE_LIMITED");
    expect(res.body.error.message).toEqual(expect.any(String));
    expect(res.headers).toHaveProperty("ratelimit-policy");
  });

  it("dimatikan saat NODE_ENV=test (default)", async () => {
    const app = express();
    app.post("/login", authRateLimiter(), (_req, res) => {
      res.json({ ok: true });
    });
    for (let i = 0; i < AUTH_RATE_LIMIT + 5; i += 1) {
      await request(app).post("/login").expect(200);
    }
  });
});
