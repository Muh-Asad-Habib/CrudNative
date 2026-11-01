import type { Request, Response } from "express";

export function notFound(req: Request, res: Response) {
  res.status(404).json({
    error: {
      message: `Route ${req.method} ${req.originalUrl} tidak ditemukan`,
      code: "ROUTE_NOT_FOUND",
    },
  });
}
