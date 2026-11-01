// Environment khusus test: database & folder upload terpisah dari development.
export const testEnv = {
  NODE_ENV: "test",
  DATABASE_URL: "file:./test.db",
  JWT_ACCESS_SECRET: "rahasia-khusus-test-yang-panjangnya-lebih-dari-32-karakter",
  CORS_ORIGIN: "*",
  UPLOAD_DIR: "uploads-test",
} as const;
