import type { Prisma } from "../../generated/prisma/client.ts";
import { HttpError } from "../../lib/http-error.ts";
import { paginate, paginationMeta } from "../../lib/pagination.ts";
import { prisma } from "../../lib/prisma.ts";
import { removeUploadedFile, toPublicUrl } from "../../lib/storage.ts";
import type { CreateTaskInput, ListTasksQuery, UpdateTaskInput } from "./tasks.schemas.ts";

// Bentuk Task yang dikirim ke client: tanpa userId, plus ringkasan course & daftar lampiran.
const taskQueryArgs = {
  omit: { userId: true },
  include: {
    course: { select: { id: true, name: true, color: true } },
    attachments: { orderBy: { id: "asc" } },
  },
} satisfies Prisma.TaskDefaultArgs;

type SortWithoutPriority = Exclude<ListTasksQuery["sort"], "priority" | "-priority">;

// Tanda "-" di depan = urutan menurun (desc). `id` dipakai sebagai pengurut kedua
// agar urutan stabil saat pagination. Tugas tanpa deadline selalu di akhir.
const ORDER_BY: Record<SortWithoutPriority, Prisma.TaskOrderByWithRelationInput[]> = {
  createdAt: [{ createdAt: "asc" }, { id: "asc" }],
  "-createdAt": [{ createdAt: "desc" }, { id: "desc" }],
  deadline: [{ deadline: { sort: "asc", nulls: "last" } }, { id: "asc" }],
  "-deadline": [{ deadline: { sort: "desc", nulls: "last" } }, { id: "desc" }],
  title: [{ title: "asc" }, { id: "asc" }],
  "-title": [{ title: "desc" }, { id: "desc" }],
};

function buildWhere(userId: number, query: ListTasksQuery): Prisma.TaskWhereInput {
  const where: Prisma.TaskWhereInput = { userId };
  if (query.status) where.status = query.status;
  if (query.priority) where.priority = query.priority;
  if (query.courseId) where.courseId = query.courseId;
  if (query.q) {
    where.OR = [{ title: { contains: query.q } }, { description: { contains: query.q } }];
  }
  return where;
}

// Prioritas disimpan sebagai teks, jadi ORDER BY biasa mengurutkan secara alfabet
// (HIGH, LOW, MEDIUM). Supaya urutannya benar, data diambil per kelompok prioritas
// secara berurutan, dan skip/take tetap dikerjakan oleh database.
async function findTasksByPriority(
  where: Prisma.TaskWhereInput,
  direction: "asc" | "desc",
  skip: number,
  take: number,
) {
  const order = direction === "desc" ? ["HIGH", "MEDIUM", "LOW"] : ["LOW", "MEDIUM", "HIGH"];
  const tasks = [];
  let toSkip = skip;
  let toTake = take;

  for (const priority of order) {
    if (toTake === 0) break;
    const groupWhere: Prisma.TaskWhereInput = { AND: [where, { priority }] };

    const count = await prisma.task.count({ where: groupWhere });
    if (toSkip >= count) {
      toSkip -= count;
      continue;
    }

    const rows = await prisma.task.findMany({
      ...taskQueryArgs,
      where: groupWhere,
      orderBy: [{ deadline: { sort: "asc", nulls: "last" } }, { id: "desc" }],
      skip: toSkip,
      take: toTake,
    });
    tasks.push(...rows);
    toSkip = 0;
    toTake -= rows.length;
  }
  return tasks;
}

export async function listTasks(userId: number, query: ListTasksQuery) {
  const where = buildWhere(userId, query);
  const { skip, take } = paginate(query.page, query.limit);

  const total = await prisma.task.count({ where });
  const tasks =
    query.sort === "priority" || query.sort === "-priority"
      ? await findTasksByPriority(where, query.sort === "priority" ? "asc" : "desc", skip, take)
      : await prisma.task.findMany({ ...taskQueryArgs, where, orderBy: ORDER_BY[query.sort], skip, take });

  return { data: tasks, meta: paginationMeta(query.page, query.limit, total) };
}

export async function getTask(userId: number, id: number) {
  // Tugas milik user lain diperlakukan seperti tidak ada (404), bukan 403.
  const task = await prisma.task.findFirst({ ...taskQueryArgs, where: { id, userId } });
  if (!task) {
    throw HttpError.notFound("Tugas tidak ditemukan");
  }
  return task;
}

async function assertTaskOwned(userId: number, id: number) {
  const task = await prisma.task.findFirst({ where: { id, userId }, select: { id: true } });
  if (!task) {
    throw HttpError.notFound("Tugas tidak ditemukan");
  }
}

// courseId boleh kosong, tapi kalau diisi harus mata kuliah milik user sendiri.
async function assertCourseOwned(userId: number, courseId: number | null | undefined) {
  if (courseId == null) return;
  const course = await prisma.course.findFirst({ where: { id: courseId, userId }, select: { id: true } });
  if (!course) {
    throw HttpError.validation([{ field: "courseId", message: "Mata kuliah tidak ditemukan" }]);
  }
}

export async function createTask(userId: number, input: CreateTaskInput) {
  await assertCourseOwned(userId, input.courseId);
  return prisma.task.create({ ...taskQueryArgs, data: { ...input, userId } });
}

export async function updateTask(userId: number, id: number, input: UpdateTaskInput) {
  await assertTaskOwned(userId, id);
  await assertCourseOwned(userId, input.courseId);
  return prisma.task.update({ ...taskQueryArgs, where: { id }, data: input });
}

export async function deleteTask(userId: number, id: number) {
  const task = await getTask(userId, id);
  // Baris Attachment ikut terhapus (onDelete: Cascade), file fisiknya dihapus manual.
  await prisma.task.delete({ where: { id } });
  await Promise.all(task.attachments.map((attachment) => removeUploadedFile(attachment.url)));
}

export async function addAttachment(userId: number, taskId: number, file: Express.Multer.File) {
  try {
    await assertTaskOwned(userId, taskId);
    return await prisma.attachment.create({
      data: {
        taskId,
        url: toPublicUrl(file.filename),
        filename: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      },
    });
  } catch (error) {
    // File sudah terlanjur tersimpan oleh multer; hapus lagi kalau gagal disimpan ke database.
    await removeUploadedFile(file.filename);
    throw error;
  }
}

export async function deleteAttachment(userId: number, taskId: number, attachmentId: number) {
  const attachment = await prisma.attachment.findFirst({
    where: { id: attachmentId, taskId, task: { userId } },
  });
  if (!attachment) {
    throw HttpError.notFound("Lampiran tidak ditemukan");
  }

  await prisma.attachment.delete({ where: { id: attachment.id } });
  await removeUploadedFile(attachment.url);
}
