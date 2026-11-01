import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../lib/http-error.ts";
import { verifyAccessToken } from "../lib/tokens.ts";

declare global {
  namespace Express {
    interface Request {
      // Diisi oleh requireAuth setelah access token terverifikasi.
      userId?: number;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw HttpError.unauthorized("Token akses tidak ditemukan");
  }

  try {
    req.userId = verifyAccessToken(header.slice("Bearer ".length)).userId;
  } catch (error) {
    // Code khusus agar client tahu harus memanggil /auth/refresh.
    if (error instanceof jwt.TokenExpiredError) {
      throw HttpError.unauthorized("Token akses sudah kedaluwarsa", "TOKEN_EXPIRED");
    }
    throw HttpError.unauthorized("Token akses tidak valid");
  }
  next();
}

// Ambil id user dari request yang sudah melewati requireAuth.
export function getUserId(req: Pick<Request, "userId">): number {
  if (req.userId === undefined) {
    throw HttpError.unauthorized();
  }
  return req.userId;
}
