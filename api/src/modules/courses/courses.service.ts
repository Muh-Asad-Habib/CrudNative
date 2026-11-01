import type { Prisma } from "../../generated/prisma/client.ts";
import { HttpError } from "../../lib/http-error.ts";
import { paginate, paginationMeta } from "../../lib/pagination.ts";
import { prisma } from "../../lib/prisma.ts";
import type { CreateCourseInput, ListCoursesQuery, UpdateCourseInput } from "./courses.schemas.ts";

// Kolom userId tidak dikirim ke client; jumlah tugas dihitung oleh database.
const courseQueryArgs = {
  omit: { userId: true },
  include: { _count: { select: { tasks: true } } },
} satisfies Prisma.CourseDefaultArgs;

type CourseWithCount = Prisma.CourseGetPayload<typeof courseQueryArgs>;

function toCourseResponse({ _count, ...course }: CourseWithCount) {
  return { ...course, taskCount: _count.tasks };
}

export async function listCourses(userId: number, query: ListCoursesQuery) {
  const where: Prisma.CourseWhereInput = { userId };
  if (query.q) {
    where.OR = [
      { name: { contains: query.q } },
      { code: { contains: query.q } },
      { lecturer: { contains: query.q } },
    ];
  }

  const [courses, total] = await prisma.$transaction([
    prisma.course.findMany({
      ...courseQueryArgs,
      where,
      orderBy: [{ name: "asc" }, { id: "asc" }],
      ...paginate(query.page, query.limit),
    }),
    prisma.course.count({ where }),
  ]);

  return {
    data: courses.map(toCourseResponse),
    meta: paginationMeta(query.page, query.limit, total),
  };
}

export async function getCourse(userId: number, id: number) {
  // Filter userId sekaligus: course milik user lain diperlakukan seperti tidak ada (404).
  const course = await prisma.course.findFirst({ ...courseQueryArgs, where: { id, userId } });
  if (!course) {
    throw HttpError.notFound("Mata kuliah tidak ditemukan");
  }
  return toCourseResponse(course);
}

export async function createCourse(userId: number, input: CreateCourseInput) {
  const course = await prisma.course.create({
    ...courseQueryArgs,
    data: { ...input, userId },
  });
  return toCourseResponse(course);
}

export async function updateCourse(userId: number, id: number, input: UpdateCourseInput) {
  await getCourse(userId, id);
  const course = await prisma.course.update({ ...courseQueryArgs, where: { id }, data: input });
  return toCourseResponse(course);
}

export async function deleteCourse(userId: number, id: number) {
  await getCourse(userId, id);
  // Tugas yang memakai course ini otomatis courseId = null (onDelete: SetNull di schema).
  await prisma.course.delete({ where: { id } });
}
