import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Dipakai Prisma CLI (migrate, studio). Saat aplikasi berjalan,
    // koneksi dibuat oleh driver adapter di src/lib/prisma.ts.
    url: process.env.DATABASE_URL,
  },
});
