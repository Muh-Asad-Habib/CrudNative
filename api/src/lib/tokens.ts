import { createHash, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.ts";

export const ACCESS_TOKEN_TTL = "15m";
export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 hari

export function signAccessToken(userId: number): string {
  // Payload hanya berisi `sub` (subject) = id user dalam bentuk string.
  return jwt.sign({}, env.JWT_ACCESS_SECRET, {
    algorithm: "HS256",
    subject: String(userId),
    expiresIn: ACCESS_TOKEN_TTL,
  });
}

// Melempar error dari jsonwebtoken (mis. TokenExpiredError) kalau token tidak valid.
export function verifyAccessToken(token: string): { userId: number } {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET, { algorithms: ["HS256"] });
  const userId = typeof payload === "object" ? Number(payload.sub) : Number.NaN;

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new jwt.JsonWebTokenError("Payload token tidak valid");
  }
  return { userId };
}

// Refresh token = string acak biasa (bukan JWT). Yang dikirim ke client adalah
// token aslinya, yang disimpan di database hanya hash-nya.
export function generateRefreshToken(): string {
  return randomBytes(48).toString("hex");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
