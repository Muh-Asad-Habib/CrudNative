import { mkdirSync } from "node:fs";
import { rm } from "node:fs/promises";
import path from "node:path";
import { env } from "../config/env.ts";

// Folder fisik tempat file lampiran disimpan (path absolut).
export const uploadDir = path.resolve(env.UPLOAD_DIR);
mkdirSync(uploadDir, { recursive: true });

// URL publik file, dilayani oleh express.static di /uploads.
export function toPublicUrl(storedName: string): string {
  return `/uploads/${storedName}`;
}

// Hapus file berdasarkan URL publiknya. Tidak melempar error kalau file sudah tidak ada.
export async function removeUploadedFile(url: string): Promise<void> {
  // path.basename mencegah path traversal (mis. "/uploads/../../.env").
  const filePath = path.join(uploadDir, path.basename(url));
  await rm(filePath, { force: true });
}
