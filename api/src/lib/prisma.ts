import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { env } from "../config/env.ts";
import { PrismaClient } from "../generated/prisma/client.ts";

// Prisma 7 memakai driver adapter: koneksi ke database dibuat oleh library
// driver (di sini better-sqlite3), bukan oleh query engine bawaan Prisma.
const adapter = new PrismaBetterSqlite3({ url: env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });
