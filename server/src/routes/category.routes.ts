import { Router } from "express";
import * as categoryController from "../controllers/category.controller";
const router = Router();

router.post("/create", categoryController.createCategory);
router.put("/edit/:id", categoryController.updateCategory);
router.get("/:user_id", categoryController.getCategory);
router.delete("/delete/:id", categoryController.deleteCategory);
export default router;
