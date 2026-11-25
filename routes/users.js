import { Router } from "express";
import { register, login } from "../conrollers/users.js";
import { validateBody } from "../middlewares/validatejoi.js";
import { registerSchema, signInSchema } from "../validations/users.js";

const router = Router();
router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(signInSchema), login);
export default router;