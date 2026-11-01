import { Router } from "express";
import { HttpError } from "../../lib/http-error.ts";
import { getUserId, requireAuth } from "../../middleware/auth.ts";
import { uploadImage } from "../../middleware/upload.ts";
import { validate } from "../../middleware/validate.ts";
import {
  attachmentParamsSchema,
  createTaskSchema,
  listTasksQuerySchema,
  taskIdParamsSchema,
  updateTaskSchema,
} from "./tasks.schemas.ts";
import * as tasksService from "./tasks.service.ts";

export const tasksRouter = Router();

// Semua endpoint tugas wajib login.
tasksRouter.use(requireAuth);

tasksRouter.get("/", validate({ query: listTasksQuerySchema }), async (req, res) => {
  const result = await tasksService.listTasks(getUserId(req), req.query);
  res.json(result);
});

tasksRouter.post("/", validate({ body: createTaskSchema }), async (req, res) => {
  const task = await tasksService.createTask(getUserId(req), req.body);
  res.status(201).json({ data: task });
});

tasksRouter.get("/:id", validate({ params: taskIdParamsSchema }), async (req, res) => {
  const task = await tasksService.getTask(getUserId(req), req.params.id);
  res.json({ data: task });
});

tasksRouter.patch(
  "/:id",
  validate({ params: taskIdParamsSchema, body: updateTaskSchema }),
  async (req, res) => {
    const task = await tasksService.updateTask(getUserId(req), req.params.id, req.body);
    res.json({ data: task });
  },
);

tasksRouter.delete("/:id", validate({ params: taskIdParamsSchema }), async (req, res) => {
  await tasksService.deleteTask(getUserId(req), req.params.id);
  res.status(204).end();
});

// Upload lampiran: multipart/form-data dengan field "file".
tasksRouter.post(
  "/:id/attachments",
  validate({ params: taskIdParamsSchema }),
  uploadImage,
  async (req, res) => {
    if (!req.file) {
      throw HttpError.validation([{ field: "file", message: "File gambar wajib diunggah" }]);
    }
    const attachment = await tasksService.addAttachment(getUserId(req), req.params.id, req.file);
    res.status(201).json({ data: attachment });
  },
);

tasksRouter.delete(
  "/:id/attachments/:attachmentId",
  validate({ params: attachmentParamsSchema }),
  async (req, res) => {
    await tasksService.deleteAttachment(getUserId(req), req.params.id, req.params.attachmentId);
    res.status(204).end();
  },
);
