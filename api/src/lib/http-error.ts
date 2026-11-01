export type ErrorDetail = { field: string; message: string };

// Error yang "sengaja" dilempar oleh kode kita. Error handler akan mengubahnya
// menjadi respons { error: { message, code, details? } } dengan status yang sesuai.
export class HttpError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: ErrorDetail[];

  constructor(status: number, code: string, message: string, details?: ErrorDetail[]) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(message: string) {
    return new HttpError(400, "BAD_REQUEST", message);
  }

  static validation(details: ErrorDetail[], message = "Data yang dikirim tidak valid") {
    return new HttpError(400, "VALIDATION_ERROR", message, details);
  }

  static unauthorized(message = "Silakan login terlebih dahulu", code = "UNAUTHORIZED") {
    return new HttpError(401, code, message);
  }

  static notFound(message = "Data tidak ditemukan") {
    return new HttpError(404, "NOT_FOUND", message);
  }

  static conflict(message: string) {
    return new HttpError(409, "CONFLICT", message);
  }
}
