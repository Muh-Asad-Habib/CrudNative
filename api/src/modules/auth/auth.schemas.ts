import { z } from "zod";

const email = z
  .string({ error: "Email wajib diisi" })
  .trim()
  .toLowerCase()
  .pipe(z.email("Format email tidak valid"));

export const registerSchema = z.object({
  name: z
    .string({ error: "Nama wajib diisi" })
    .trim()
    .min(1, "Nama wajib diisi")
    .max(100, "Nama maksimal 100 karakter"),
  email,
  password: z
    .string({ error: "Password wajib diisi" })
    .min(8, "Password minimal 8 karakter")
    .max(72, "Password maksimal 72 karakter"), // batas input bcrypt
});

export const loginSchema = z.object({
  email,
  password: z.string({ error: "Password wajib diisi" }).min(1, "Password wajib diisi"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string({ error: "Refresh token wajib diisi" }).min(1, "Refresh token wajib diisi"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
