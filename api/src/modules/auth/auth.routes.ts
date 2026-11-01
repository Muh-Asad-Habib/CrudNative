import { Router } from "express";
import { getUserId, requireAuth } from "../../middleware/auth.ts";
import { authRateLimiter } from "../../middleware/rate-limit.ts";
import { validate } from "../../middleware/validate.ts";
import { loginSchema, refreshTokenSchema, registerSchema } from "./auth.schemas.ts";
import * as authService from "./auth.service.ts";

export const authRouter = Router();

const limiter = authRateLimiter();

authRouter.post("/register", limiter, validate({ body: registerSchema }), async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({ data: result });
});

authRouter.post("/login", limiter, validate({ body: loginSchema }), async (req, res) => {
  const result = await authService.login(req.body);
  res.json({ data: result });
});

authRouter.post("/refresh", limiter, validate({ body: refreshTokenSchema }), async (req, res) => {
  const tokens = await authService.refresh(req.body.refreshToken);
  res.json({ data: tokens });
});

authRouter.post("/logout", limiter, validate({ body: refreshTokenSchema }), async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(204).end();
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await authService.getMe(getUserId(req));
  res.json({ data: user });
});
