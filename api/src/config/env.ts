import "dotenv/config";
import { z } from "zod";

// Nilai contoh JWT_ACCESS_SECRET di .env.example. Isinya publik (ada di repo),
// jadi hanya boleh dipakai untuk development, tidak boleh di production.
export const EXAMPLE_JWT_SECRET = "ganti-dengan-string-acak-yang-panjang-minimal-32-karakter";

// Semua variabel environment divalidasi sekali di sini.
// Kalau ada yang salah, server langsung berhenti dengan pesan yang jelas (fail fast).
const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    DATABASE_URL: z.string().min(1, "wajib diisi, contoh: file:./dev.db"),
    JWT_ACCESS_SECRET: z.string().min(32, "minimal 32 karakter"),
    CORS_ORIGIN: z.string().min(1).default("*"),
    UPLOAD_DIR: z.string().min(1).default("uploads"),
  })
  .refine((value) => value.NODE_ENV !== "production" || value.JWT_ACCESS_SECRET !== EXAMPLE_JWT_SECRET, {
    path: ["JWT_ACCESS_SECRET"],
    message: "masih memakai nilai contoh dari .env.example, buat string acak untuk production",
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const problems = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  console.error(`Konfigurasi environment tidak valid:\n${problems}\nPeriksa file .env (lihat .env.example).`);
  process.exit(1);
}

export const env = parsed.data;

export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
