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

router.get(
  "/:id/all",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const transactions = await transactionController.getTransactions(id);
    res.status(200).json(transactions);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const transaction = await transactionController.getTransaction(id);
    res.status(200).json(transaction);
  }),
);

router.put(
  "/edit/:id",
  asyncHandler(async (req, res) => {
    const updatedTransaction = await transactionController.updateTransaction(
      req.body,
    );
    res.status(200).json(updatedTransaction);
  }),
);

router.delete(
  "/delete/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedTransaction =
      await transactionController.deleteTransaction(id);
    res.status(200).json(updatedTransaction);
  }),
);

export default router;
