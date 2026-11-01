import { randomBytes } from "node:crypto";
import type { RequestHandler } from "express";
import multer from "multer";
import { HttpError } from "../lib/http-error.ts";
import { uploadDir } from "../lib/storage.ts";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// Hanya gambar yang diizinkan. Ekstensi file ditentukan dari mimetype,
// bukan dari nama file kiriman client.
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${randomBytes(8).toString("hex")}${EXTENSIONS[file.mimetype]}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype in EXTENSIONS) {
      cb(null, true);
    } else {
      cb(new HttpError(415, "UNSUPPORTED_MEDIA_TYPE", "Format file harus JPEG, PNG, atau WEBP"));
    }
  },
});

const singleFile = upload.single("file");

// Error dari parser multipart (busboy), mis. boundary tidak ada atau body terpotong,
// adalah kesalahan request dari client (400), bukan error server. Error sistem
// (punya `errno`, mis. disk penuh) tetap diteruskan apa adanya → 500.
function isMalformedMultipart(error: unknown): boolean {
  return (
    error instanceof Error &&
    !(error instanceof HttpError) &&
    !(error instanceof multer.MulterError) &&
    !("errno" in error)
  );
}

// Middleware untuk satu file pada field "file"; hasilnya tersedia di req.file.
// Tipe generiknya `any` agar bisa dirangkai setelah validate() tanpa menghilangkan tipe req.params.
export const uploadImage: RequestHandler<any, any, any, any> = (req, res, next) => {
  singleFile(req, res, (error?: unknown) => {
    if (isMalformedMultipart(error)) {
      next(HttpError.badRequest("Body multipart/form-data tidak valid"));
      return;
    }
    next(error);
  });
};
