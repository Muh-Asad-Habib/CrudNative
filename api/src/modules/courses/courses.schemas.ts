import { z } from "zod";
import { paginationQuery } from "../../lib/pagination.ts";

// Teks opsional: string kosong dianggap null (mengosongkan field).
const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} maksimal ${max} karakter`)
    .nullish()
    .transform((value) => (value === "" ? null : value));

export const courseIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listCoursesQuerySchema = z.object({
  ...paginationQuery(20),
  q: z.string().trim().max(100).optional(),
});

export const createCourseSchema = z.object({
  name: z
    .string({ error: "Nama mata kuliah wajib diisi" })
    .trim()
    .min(1, "Nama mata kuliah wajib diisi")
    .max(100, "Nama mata kuliah maksimal 100 karakter"),
  code: optionalText(20, "Kode"),
  lecturer: optionalText(100, "Nama dosen"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Warna harus berformat #RRGGBB, contoh #4F46E5")
    .nullish(),
});

// PATCH: semua field boleh dikirim sebagian.
export const updateCourseSchema = createCourseSchema.partial();

export type ListCoursesQuery = z.infer<typeof listCoursesQuerySchema>;
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
