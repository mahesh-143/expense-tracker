import { Router } from "express";
import * as authController from "../controllers/auth.controller";
const router = Router();

// register user
router.post("/register", authController.register);
export default router;
