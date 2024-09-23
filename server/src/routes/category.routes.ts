import { Router } from "express";
import * as categoryController from "../controllers/category.controller";
import authenticateToken from "../middlewares/authenticateToken";
import { asyncHandler } from "../utils/asyncHandler";
const router = Router();

router.post(
  "/create",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const newCategory = await categoryController.createCategory(req.body);
    res.status(201).json(newCategory);
  }),
);

router.get(
  "/:user_id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    const categories = await categoryController.getCategory(user_id);
    res.status(200).json(categories);
  }),
);

router.put(
  "/edit/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const updatedCategory = await categoryController.updateCategory(
      req.body,
      id,
    );
    res.status(200).json(updatedCategory);
  }),
);

router.delete(
  "/delete/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedCategory = await categoryController.deleteCategory(id);
    res.status(200).json(updatedCategory);
  }),
);

export default router;
