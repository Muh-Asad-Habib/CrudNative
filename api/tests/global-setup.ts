import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import { testEnv } from "./test-env.ts";

const TEST_FILES = ["test.db", "test.db-journal", "uploads-test"];

function cleanup() {
  for (const file of TEST_FILES) {
    rmSync(file, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
}

// Dijalankan sekali sebelum semua file test: buat test.db baru lalu terapkan migrasi.
export function setup() {
  cleanup();
  execSync("npx prisma migrate deploy", {
    env: { ...process.env, ...testEnv },
    stdio: "pipe",
  });
}

export function teardown() {
  try {
    cleanup();
  } catch (error) {
    // Di Windows file .db kadang masih terkunci sesaat; tidak perlu menggagalkan test.
    console.warn("Gagal membersihkan file test:", error);
  }
}
