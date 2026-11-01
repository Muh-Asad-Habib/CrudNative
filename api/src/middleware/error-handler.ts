import type { ErrorRequestHandler } from "express";
import multer from "multer";
import { z } from "zod";
import { isProduction } from "../config/env.ts";
import { HttpError } from "../lib/http-error.ts";

// Error dari body parser express.json() & router Express punya properti `type` & `status`.
type BodyParserError = Error & { type?: string; status?: number; statusCode?: number };

// Code & pesan untuk error 4xx bawaan Express yang tidak kita tangani secara khusus
// (mis. parameter URL dengan encoding rusak, charset body tidak didukung).
const GENERIC_CLIENT_ERRORS: Record<number, { code: string; message: string }> = {
  400: { code: "BAD_REQUEST", message: "Request tidak valid" },
  403: { code: "FORBIDDEN", message: "Akses ditolak" },
  404: { code: "NOT_FOUND", message: "Data tidak ditemukan" },
  413: { code: "PAYLOAD_TOO_LARGE", message: "Body request terlalu besar" },
  415: { code: "UNSUPPORTED_MEDIA_TYPE", message: "Format body tidak didukung" },
};

function toHttpError(error: unknown): HttpError | null {
  if (error instanceof HttpError) return error;

  if (error instanceof z.ZodError) {
    return HttpError.validation(
      error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })),
    );
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return new HttpError(413, "PAYLOAD_TOO_LARGE", "Ukuran file maksimal 5 MB");
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return HttpError.badRequest('File harus dikirim lewat field "file" (satu file per request)');
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return HttpError.badRequest("Hanya boleh mengunggah satu file per request");
    }
    return HttpError.badRequest(`Upload gagal: ${error.message}`);
  }

  const bodyError = error as BodyParserError;
  if (bodyError?.type === "entity.parse.failed") {
    return HttpError.badRequest("Body bukan JSON yang valid");
  }
  if (bodyError?.type === "entity.too.large") {
    return new HttpError(413, "PAYLOAD_TOO_LARGE", "Body request terlalu besar");
  }

  const status = bodyError?.status ?? bodyError?.statusCode;
  if (typeof status === "number" && status >= 400 && status < 500) {
    const known = GENERIC_CLIENT_ERRORS[status] ?? GENERIC_CLIENT_ERRORS[400]!;
    return new HttpError(GENERIC_CLIENT_ERRORS[status] ? status : 400, known.code, known.message);
  }

  return null;
}

// Express 5 otomatis meneruskan error dari handler async ke sini,
// jadi handler tidak perlu try/catch hanya untuk memanggil next(error).
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const httpError = toHttpError(error);

  if (httpError) {
    res.status(httpError.status).json({
      error: {
        message: httpError.message,
        code: httpError.code,
        ...(httpError.details ? { details: httpError.details } : {}),
      },
    });
    return;
  }

  // Error tak terduga: detailnya hanya dicatat di log, client cukup dapat pesan generik.
  console.error(isProduction ? String(error) : error);
  res.status(500).json({
    error: { message: "Terjadi kesalahan pada server", code: "INTERNAL_ERROR" },
  });
};
