import request from "supertest";
import { createApp } from "../src/app.ts";
import { prisma } from "../src/lib/prisma.ts";
import { removeUploadedFile } from "../src/lib/storage.ts";

export const app = createApp();

export function api() {
  return request(app);
}

// PNG 1x1 piksel, cukup untuk menguji upload tanpa file fixture.
export const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "base64",
);

// Kosongkan semua tabel (anak dulu, baru induk) beserta file lampirannya.
export async function resetDatabase() {
  const attachments = await prisma.attachment.findMany({ select: { url: true } });
  await Promise.all(attachments.map((attachment) => removeUploadedFile(attachment.url)));

  await prisma.attachment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.course.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
}

let userCounter = 0;

export interface TestUser {
  user: { id: number; name: string; email: string };
  accessToken: string;
  refreshToken: string;
  password: string;
  auth: { Authorization: string };
}

// Daftarkan user baru lewat API dan kembalikan token + header Authorization siap pakai.
export async function registerUser(overrides: { name?: string; email?: string } = {}): Promise<TestUser> {
  userCounter += 1;
  const password = "password123";
  const res = await api()
    .post("/api/auth/register")
    .send({
      name: overrides.name ?? `User ${userCounter}`,
      email: overrides.email ?? `user${userCounter}-${Date.now()}@kampus.ac.id`,
      password,
    })
    .expect(201);

  const { user, accessToken, refreshToken } = res.body.data;
  return { user, accessToken, refreshToken, password, auth: { Authorization: `Bearer ${accessToken}` } };
}
