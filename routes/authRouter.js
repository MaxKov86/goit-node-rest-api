import express from "express";
import validateBody from "../helpers/validateBody.js";
import { authSchema } from "../schemas/authSchema.js";
import {
  logout,
  register,
  login,
  getCurrent,
} from "../controllers/authControllers.js";
import {
  resendingVerifyEmail,
  updateAvatar,
  verify,
} from "../controllers/user.js";

import authenticate from "../helpers/authenticate.js";
import upload from "../helpers/upload.js";
import { emailSchema } from "../schemas/emailSchema.js";

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
authRouter.get("/verify/:verificationToken", verify);
authRouter.post("/verify", validateBody(emailSchema), resendingVerifyEmail);

export default authRouter;
