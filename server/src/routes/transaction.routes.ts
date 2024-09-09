import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as transactionController from "../controllers/transaction.controller";
const router = Router();

router.post(
  "/create",
  asyncHandler(async (req, res) => {
    const newTransaction = await transactionController.createTransaction(
      req.body,
    );
    res.status(201).json(newTransaction);
  }),
);
export default router;
