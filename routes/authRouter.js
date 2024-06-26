import express from "express";
import validateBody from "../helpers/validateBody.js";
import { authSchema } from "../schemas/authSchema.js";
import {
  logout,
  register,
  login,
  getCurrent,
} from "../controllers/authControllers.js";
import { updateAvatar } from "../controllers/user.js";

import authenticate from "../helpers/authenticate.js";
import upload from "../helpers/upload.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(authSchema), register);
authRouter.post("/login", validateBody(authSchema), login);
authRouter.get("/current", authenticate, getCurrent);
authRouter.post("/logout", authenticate, logout);
authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatar
);

export default authRouter;
