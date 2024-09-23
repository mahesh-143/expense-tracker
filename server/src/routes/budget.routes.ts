import { Router } from "express";
import * as budgetController from "../controllers/budget.controller";
import authenticateToken from "../middlewares/authenticateToken";
import { asyncHandler } from "../utils/asyncHandler";
const router = Router();

router.post(
  "/create",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const newBudget = await budgetController.setBudget(req.body);
    res.status(201).json(newBudget);
  }),
);

router.get(
  "/:user_id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    const budget = await budgetController.getBudget(user_id);
    res.status(200).json(budget);
  }),
);

router.put(
  "/edit/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const updatedBudget = await budgetController.updateBudget(req.body, id);
    res.status(200).json(updatedBudget);
  }),
);

router.delete(
  "/delete/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await budgetController.deleteBudget(id);
    res.status(200).json(result);
  }),
);

export default router;
