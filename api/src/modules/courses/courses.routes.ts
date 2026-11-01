import { Router } from "express";
import { getUserId, requireAuth } from "../../middleware/auth.ts";
import { validate } from "../../middleware/validate.ts";
import {
  courseIdParamsSchema,
  createCourseSchema,
  listCoursesQuerySchema,
  updateCourseSchema,
} from "./courses.schemas.ts";
import * as coursesService from "./courses.service.ts";

export const coursesRouter = Router();

// Semua endpoint mata kuliah wajib login.
coursesRouter.use(requireAuth);

coursesRouter.get("/", validate({ query: listCoursesQuerySchema }), async (req, res) => {
  const result = await coursesService.listCourses(getUserId(req), req.query);
  res.json(result);
});

coursesRouter.post("/", validate({ body: createCourseSchema }), async (req, res) => {
  const course = await coursesService.createCourse(getUserId(req), req.body);
  res.status(201).json({ data: course });
});

coursesRouter.get("/:id", validate({ params: courseIdParamsSchema }), async (req, res) => {
  const course = await coursesService.getCourse(getUserId(req), req.params.id);
  res.json({ data: course });
});

coursesRouter.patch(
  "/:id",
  validate({ params: courseIdParamsSchema, body: updateCourseSchema }),
  async (req, res) => {
    const course = await coursesService.updateCourse(getUserId(req), req.params.id, req.body);
    res.json({ data: course });
  },
);

coursesRouter.delete("/:id", validate({ params: courseIdParamsSchema }), async (req, res) => {
  await coursesService.deleteCourse(getUserId(req), req.params.id);
  res.status(204).end();
});
