import request from "supertest";
import express from "express";
import transactionRoutes from "../routes/transaction.routes";
import * as transactionController from "../controllers/transaction.controller";
import authenticateToken from "../middlewares/authenticateToken";

// Mock the authenticateToken middleware
jest.mock("../middlewares/authenticateToken", () =>
  jest.fn((req, res, next) => next()),
);

// Mock the controller methods
jest.mock("../controllers/transaction.controller");
jest.mock("../middlewares/authenticateToken");

const app = express();
app.use(express.json());
app.use("/transactions", transactionRoutes);

describe("Transaction Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /create", () => {
    it("should create a new transaction and return 201", async () => {
      const mockTransaction = { id: "1", type: "income", amount: 100 };
      (transactionController.createTransaction as jest.Mock).mockResolvedValue(
        mockTransaction,
      );

      const response = await request(app).post("/transactions/create").send({
        type: "income",
        amount: 100,
        description: "Test",
        transaction_date: "2024-09-24",
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockTransaction);
      expect(transactionController.createTransaction).toHaveBeenCalledWith({
        type: "income",
        amount: 100,
        description: "Test",
        transaction_date: "2024-09-24",
      });
    });
  });

  describe("GET /:id/all", () => {
    it("should get all transactions for a user and return 200", async () => {
      const mockTransactions = [
        { id: "1", type: "income", amount: 100 },
        { id: "2", type: "expense", amount: 50 },
      ];
      (transactionController.getTransactions as jest.Mock).mockResolvedValue(
        mockTransactions,
      );

      const response = await request(app).get("/transactions/1/all");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTransactions);
      expect(transactionController.getTransactions).toHaveBeenCalledWith("1");
    });
  });

  describe("GET /:id", () => {
    it("should get a specific transaction and return 200", async () => {
      const mockTransaction = { id: "1", type: "income", amount: 100 };
      (transactionController.getTransaction as jest.Mock).mockResolvedValue(
        mockTransaction,
      );

      const response = await request(app).get("/transactions/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTransaction);
      expect(transactionController.getTransaction).toHaveBeenCalledWith("1");
    });
  });

  describe("PUT /edit/:id", () => {
    it("should update a transaction and return 200", async () => {
      const mockUpdatedTransaction = {
        id: "1",
        type: "income",
        amount: 150,
      };
      (transactionController.updateTransaction as jest.Mock).mockResolvedValue(
        mockUpdatedTransaction,
      );

      const response = await request(app).put("/transactions/edit/1").send({
        type: "income",
        amount: 150,
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedTransaction);
      expect(transactionController.updateTransaction).toHaveBeenCalledWith(
        {
          type: "income",
          amount: 150,
        },
        "1",
      );
    });
  });

  describe("DELETE /delete/:id", () => {
    it("should delete a transaction and return 200", async () => {
      const mockDeletedTransaction = { success: true };
      (transactionController.deleteTransaction as jest.Mock).mockResolvedValue(
        mockDeletedTransaction,
      );

      const response = await request(app).delete("/transactions/delete/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDeletedTransaction);
      expect(transactionController.deleteTransaction).toHaveBeenCalledWith("1");
    });
  });
});
