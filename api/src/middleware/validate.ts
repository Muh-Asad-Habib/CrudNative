import type { Request, RequestHandler } from "express";
import { z } from "zod";
import { HttpError, type ErrorDetail } from "../lib/http-error.ts";

// Pesan error bawaan Zod dalam Bahasa Indonesia.
z.config(z.locales.id());

type Schemas = {
  params?: z.ZodType;
  query?: z.ZodType;
  body?: z.ZodType;
};

// Tipe hasil parsing; kalau skemanya tidak diberikan, pakai tipe bawaan Express.
type Output<S, Fallback> = S extends z.ZodType ? z.output<S> : Fallback;

type Location = keyof Schemas;

function toDetails(location: Location, error: z.ZodError): ErrorDetail[] {
  return error.issues.map((issue) => ({
    field: issue.path.length > 0 ? issue.path.join(".") : location,
    message: issue.message,
  }));
}

/**
 * Middleware validasi. Data hasil parsing Zod (sudah di-trim, di-coerce, diberi default)
 * menggantikan req.params / req.query / req.body, dan tipenya ikut terbawa ke handler berikutnya.
 */
export function validate<S extends Schemas>(
  schemas: S,
): RequestHandler<
  Output<S["params"], Request["params"]>,
  unknown,
  Output<S["body"], unknown>,
  Output<S["query"], Request["query"]>
> {
  return (req, _res, next) => {
    const details: ErrorDetail[] = [];
    const parsed: Partial<Record<Location, unknown>> = {};

    for (const location of ["params", "query", "body"] as const) {
      const schema = schemas[location];
      if (!schema) continue;

      const result = schema.safeParse(req[location]);
      if (result.success) {
        parsed[location] = result.data;
      } else {
        details.push(...toDetails(location, result.error));
      }
    }

    if (details.length > 0) {
      throw HttpError.validation(details);
    }

    if ("params" in parsed) req.params = parsed.params as typeof req.params;
    if ("body" in parsed) req.body = parsed.body as typeof req.body;
    if ("query" in parsed) {
      // Di Express 5 req.query hanya getter, jadi ditimpa dengan defineProperty.
      Object.defineProperty(req, "query", { value: parsed.query, writable: true, enumerable: true });
    }
    next();
  };
}
