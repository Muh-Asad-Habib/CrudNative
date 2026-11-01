import { defineConfig } from "vitest/config";
import { testEnv } from "./tests/test-env.ts";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    env: testEnv,
    globalSetup: ["tests/global-setup.ts"],
    // Semua file test memakai satu test.db, jadi dijalankan berurutan.
    fileParallelism: false,
    hookTimeout: 60_000,
    testTimeout: 15_000,
  },
});
