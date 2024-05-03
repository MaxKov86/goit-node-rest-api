import express from "express";
import validateBody from "../helpers/validateBody.js";
import { authSchema } from "../schemas/authSchema.js";
import { register } from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(authSchema), register);

export default authRouter;
