import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.ts";
import { uploadDir } from "./lib/storage.ts";
import { errorHandler } from "./middleware/error-handler.ts";
import { notFound } from "./middleware/not-found.ts";
import { authRouter } from "./modules/auth/auth.routes.ts";
import { coursesRouter } from "./modules/courses/courses.routes.ts";
import { tasksRouter } from "./modules/tasks/tasks.routes.ts";

// CORS_ORIGIN="*" → semua origin boleh; selain itu daftar origin dipisah koma.
export function corsOrigin(value: string): string | string[] {
  if (value.trim() === "*") return "*";
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

// App dibuat lewat fungsi (bukan langsung listen) agar bisa dipakai Supertest di test.
export function createApp() {
  const app = express();

  // Gambar di /uploads boleh ditampilkan dari origin lain (mis. Expo Web).
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(cors({ origin: corsOrigin(env.CORS_ORIGIN) }));
  app.use(express.json());
  if (env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  app.use("/uploads", express.static(uploadDir));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  app.use("/api/auth", authRouter);
  app.use("/api/courses", coursesRouter);
  app.use("/api/tasks", tasksRouter);

  // Urutan penting: 404 setelah semua route, error handler paling akhir.
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
