import type { User } from "../../generated/prisma/client.ts";
import { HttpError } from "../../lib/http-error.ts";
import { hashPassword, verifyPassword } from "../../lib/password.ts";
import { prisma } from "../../lib/prisma.ts";
import {
  generateRefreshToken,
  hashToken,
  REFRESH_TOKEN_TTL_MS,
  signAccessToken,
} from "../../lib/tokens.ts";
import type { LoginInput, RegisterInput } from "./auth.schemas.ts";

// Data user yang aman dikirim ke client (tanpa passwordHash).
export function toPublicUser(user: User) {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}

// Hash bcrypt dari string acak. Dipakai saat email tidak terdaftar agar waktu
// respons login tetap sama (tidak bisa dipakai menebak email yang terdaftar).
const DUMMY_PASSWORD_HASH = "$2b$10$IVXN74WDTBP.dQBjLahWjOBSZNFwozrrhxsSUpaFru2//PgkkCB7q";

async function issueTokens(userId: number) {
  const refreshToken = generateRefreshToken();
  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });
  return { accessToken: signAccessToken(userId), refreshToken };
}

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw HttpError.conflict("Email sudah terdaftar");
  }

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash: await hashPassword(input.password),
    },
  });
  return { user: toPublicUser(user), ...(await issueTokens(user.id)) };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  const passwordValid = await verifyPassword(input.password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);

  // Pesan sengaja dibuat sama agar tidak membocorkan email mana yang terdaftar.
  if (!user || !passwordValid) {
    throw HttpError.unauthorized("Email atau password salah");
  }
  return { user: toPublicUser(user), ...(await issueTokens(user.id)) };
}

export async function refresh(refreshToken: string) {
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(refreshToken) },
  });
  if (!stored) {
    throw HttpError.unauthorized("Refresh token tidak valid");
  }

  // Token yang sudah dicabut dipakai lagi = kemungkinan dicuri.
  // Cabut semua sesi user tersebut supaya pencuri (dan user) harus login ulang.
  if (stored.revokedAt) {
    await revokeAllForUser(stored.userId);
    throw HttpError.unauthorized("Refresh token sudah pernah dipakai. Silakan login ulang.");
  }

  if (stored.expiresAt <= new Date()) {
    throw HttpError.unauthorized("Refresh token sudah kedaluwarsa. Silakan login ulang.");
  }

  // Rotasi: cabut token lama. Filter `revokedAt: null` mencegah dua request
  // bersamaan memakai token yang sama dan sama-sama berhasil.
  const { count } = await prisma.refreshToken.updateMany({
    where: { id: stored.id, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  if (count === 0) {
    await revokeAllForUser(stored.userId);
    throw HttpError.unauthorized("Refresh token sudah pernah dipakai. Silakan login ulang.");
  }

  return issueTokens(stored.userId);
}

export async function logout(refreshToken: string) {
  // Selalu sukses (idempotent), walaupun token tidak dikenal.
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashToken(refreshToken), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function getMe(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw HttpError.unauthorized("User tidak ditemukan");
  }
  return toPublicUser(user);
}

async function revokeAllForUser(userId: number) {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
