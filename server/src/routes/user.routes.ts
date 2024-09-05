import { Router } from "express";
import * as userController from "../controllers/user.controller";
const router = Router();

router.put("/edit/:id", userController.updateUser);
router.delete("/delete", userController.deleteUser);
router.get("/:id", userController.getUser);
export default router;
