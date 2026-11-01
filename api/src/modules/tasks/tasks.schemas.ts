import { z } from "zod";
import { paginationQuery } from "../../lib/pagination.ts";

export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;
export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;
export const TASK_SORTS = [
  "createdAt",
  "-createdAt",
  "deadline",
  "-deadline",
  "priority",
  "-priority",
  "title",
  "-title",
] as const;

const status = z.enum(TASK_STATUSES, { error: "Status harus TODO, IN_PROGRESS, atau DONE" });
const priority = z.enum(TASK_PRIORITIES, { error: "Prioritas harus LOW, MEDIUM, atau HIGH" });

export const taskIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const attachmentParamsSchema = taskIdParamsSchema.extend({
  attachmentId: z.coerce.number().int().positive(),
});

export const listTasksQuerySchema = z.object({
  ...paginationQuery(10),
  status: status.optional(),
  priority: priority.optional(),
  courseId: z.coerce.number().int().positive().optional(),
  q: z.string().trim().max(100).optional(),
  sort: z.enum(TASK_SORTS, { error: `Sort harus salah satu dari: ${TASK_SORTS.join(", ")}` }).default("-createdAt"),
});

export const createTaskSchema = z.object({
  title: z
    .string({ error: "Judul wajib diisi" })
    .trim()
    .min(1, "Judul wajib diisi")
    .max(200, "Judul maksimal 200 karakter"),
  description: z
    .string()
    .trim()
    .max(2000, "Deskripsi maksimal 2000 karakter")
    .nullish()
    .transform((value) => (value === "" ? null : value)),
  // ISO 8601, contoh "2026-11-01T23:59:00.000Z". null = tanpa deadline.
  deadline: z.iso
    .datetime({ offset: true, error: "Deadline harus berformat tanggal ISO 8601" })
    .nullish()
    .transform((value) => (value ? new Date(value) : value)),
  status: status.optional(),
  priority: priority.optional(),
  courseId: z.number({ error: "courseId harus berupa angka" }).int().positive().nullish(),
});

// PATCH: field sama dengan POST, tapi semuanya opsional.
export const updateTaskSchema = createTaskSchema.partial();

export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
