import { rateLimit } from "express-rate-limit";
import { isTest } from "../config/env.ts";
import { HttpError } from "../lib/http-error.ts";

export const AUTH_RATE_LIMIT = 20;
export const AUTH_RATE_WINDOW_MS = 15 * 60 * 1000;

// Membatasi request ke register/login/refresh/logout untuk mencegah brute force:
// maksimal 20 request per 15 menit per IP. Default-nya dimatikan saat test
// (test khusus rate limit menyalakannya dengan { enabled: true }).
export function authRateLimiter({ enabled = !isTest }: { enabled?: boolean } = {}) {
  return rateLimit({
    windowMs: AUTH_RATE_WINDOW_MS,
    limit: AUTH_RATE_LIMIT,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skip: () => !enabled,
    handler: (_req, _res, next) => {
      next(new HttpError(429, "RATE_LIMITED", "Terlalu banyak percobaan. Coba lagi dalam 15 menit."));
    },
  });
}
