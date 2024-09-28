import {
  getTransaction,
  getTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "../controllers/transaction.controller";
import { db } from "../drizzle/db";
import { findUserById } from "../utils/users";
import { HttpError } from "../middlewares/HttpError";
import { TransactionsTable } from "../drizzle/schema";

// Mocking database and utility functions
jest.mock("../drizzle/db");
jest.mock("../utils/users");

describe("Transaction Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTransaction", () => {
    it("should throw an error if required fields are missing", async () => {
      await expect(
        createTransaction({
          user_id: "",
          category_id: "",
          type: null,
          amount: 0,
          description: "",
          transaction_date: "",
        }),
      ).rejects.toThrow(new HttpError("Missing required feilds", 400));
    });

    it("should throw an error if user does not exist", async () => {
      (findUserById as jest.Mock).mockResolvedValue(null);

      await expect(
        createTransaction({
          user_id: "123",
          category_id: "456",
          type: "income",
          amount: 100,
          description: "",
          transaction_date: "27-09-2024",
        }),
      ).rejects.toThrow(new HttpError("User not found", 404));
    });

    it("should insert transaction if user exists", async () => {
      (findUserById as jest.Mock).mockResolvedValue(true);
      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([
            {
              id: "1",
              user_id: "123",
              category_id: "456",
              type: "income",
              amount: 100,
              description: "",
              transaction_date: "24-09-2024",
              created_at: new Date(),
              updated_at: new Date(),
            },
          ]),
        }),
      });
      const result = await createTransaction({
        user_id: "123",
        category_id: "456",
        type: "income",
        amount: 100,
        description: "",
        transaction_date: "24-09-2024",
      });

      expect(result).toEqual({
        id: "1",
        user_id: "123",
        category_id: "456",
        type: "income",
        amount: 100,
        description: "",
        transaction_date: "24-09-2024",
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
      expect(db.insert).toHaveBeenCalledWith(TransactionsTable);
    });
  });

  describe("getTransaction", () => {
    it("should throw an error if no transaction is found", async () => {
      (findUserById as jest.Mock).mockResolvedValue(true);
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(getTransaction("123")).rejects.toThrow(
        new HttpError("Transaction not found", 404),
      );
    });

    it("should return transaction if it exists", async () => {
      (findUserById as jest.Mock).mockResolvedValue(true);
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([{ user_id: "123", amount: 100 }]),
        }),
      });

      const result = await getTransaction("123");
      expect(result).toEqual({ user_id: "123", amount: 100 });
    });
  });

  describe("deleteTransaction", () => {
    it("should throw an error if transaction does not exist", async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(deleteTransaction("1")).rejects.toThrow(
        new HttpError("Transaction not found", 404),
      );
    });

    it("should delete transaction if it exists", async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([{}]),
        }),
      });
      (db.delete as jest.Mock).mockReturnValue({
        where: jest
          .fn()
          .mockResolvedValue({ message: "Transaction deleted successfully" }),
      });

      const result = await deleteTransaction("1");
      expect(result).toEqual({ message: "Transaction deleted successfully" });
      expect(db.delete).toHaveBeenCalledWith(TransactionsTable);
    });
  });

  describe("updateTransaction", () => {
    it("should throw an error if user_id is missing", async () => {
      await expect(
        updateTransaction(
          {
            category_id: "456",
            type: "income",
            amount: 100,
            description: "",
            transaction_date: "24-09-2024",
          },
          "1", // Valid transaction_id, but missing user_id in data
        ),
      ).rejects.toThrow(new HttpError("User ID missing", 400));
    });

    it("should throw an error if transaction ID is missing", async () => {
      await expect(
        updateTransaction(
          {
            user_id: "123",
            category_id: "456",
            type: "income",
            amount: 100,
            description: "",
            transaction_date: "24-09-2024",
          },
          "", // Missing transaction_id
        ),
      ).rejects.toThrow(new HttpError("Transaction ID missing", 400));
    });

    it("should update transaction if user and transaction exist", async () => {
      (findUserById as jest.Mock).mockResolvedValue(true);
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([{}]), // Simulating transaction exists
        }),
      });
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([
            {
              id: "1",
              user_id: "123",
              category_id: "456",
              type: "income",
              amount: 1000,
              description: "Test description",
              transaction_date: "24-09-2024",
            },
          ]),
        }),
      });

      const result = await updateTransaction(
        {
          user_id: "123",
          category_id: "456",
          type: "income",
          amount: 1000,
          description: "Test description",
          transaction_date: "24-09-2024",
        },
        "1",
      );

      expect(result).toEqual({
        id: "1",
        user_id: "123",
        category_id: "456",
        type: "income",
        amount: 1000,
        description: "Test description",
        transaction_date: "24-09-2024",
      });
      expect(db.update).toHaveBeenCalledWith(TransactionsTable);
    });
  });
});
