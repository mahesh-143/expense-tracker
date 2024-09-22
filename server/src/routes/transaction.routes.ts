import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as transactionController from "../controllers/transaction.controller";
import authenticateToken from "../middlewares/authenticateToken";
const router = Router();

router.post(
  "/create",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const newTransaction = await transactionController.createTransaction(
      req.body,
    );
    res.status(201).json(newTransaction);
  }),
);

router.get(
  "/:id/all",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const transactions = await transactionController.getTransactions(id);
    res.status(200).json(transactions);
  }),
);

router.get(
  "/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const transaction = await transactionController.getTransaction(id);
    res.status(200).json(transaction);
  }),
);

router.put(
  "/edit/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const transaction_id = req.params.id;
    const updatedTransaction = await transactionController.updateTransaction(
      req.body,
      transaction_id,
    );
    res.status(200).json(updatedTransaction);
  }),
);

router.delete(
  "/delete/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedTransaction =
      await transactionController.deleteTransaction(id);
    res.status(200).json(updatedTransaction);
  }),
);

export default router;
