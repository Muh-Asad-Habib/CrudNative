import { z } from "zod";

// Skema query `page` & `limit` yang dipakai bersama oleh endpoint list.
export function paginationQuery(defaultLimit: number) {
  return {
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(defaultLimit),
  };
}

export function paginate(page: number, limit: number) {
  return { skip: (page - 1) * limit, take: limit };
}

export function paginationMeta(page: number, limit: number, total: number) {
  return { page, limit, total, totalPages: Math.ceil(total / limit) };
}
