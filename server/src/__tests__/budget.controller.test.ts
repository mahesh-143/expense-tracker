import {
  setBudget,
  deleteBudget,
  updateBudget,
  getBudgets,
} from "../controllers/budget.controller";
import { db } from "../drizzle/db";
import { findUserById } from "../utils/users";
import { HttpError } from "../middlewares/HttpError";
import { BudgetTable } from "../drizzle/schema";

// Mocking database and utility functions
jest.mock("../drizzle/db");
jest.mock("../utils/users");

describe("Budget Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("setBudget", () => {
    it("should throw an error if required fields are missing", async () => {
      await expect(
        setBudget({ user_id: "", category_id: "", amount: 0 }),
      ).rejects.toThrow(new HttpError("Missing required feilds", 400));
    });

    it("should throw an error if user does not exist", async () => {
      (findUserById as jest.Mock).mockResolvedValue(null);

      await expect(
        setBudget({ user_id: "123", category_id: "456", amount: 100 }),
      ).rejects.toThrow(new HttpError("User not found", 404));
    });

    it("should insert budget if user exists", async () => {
      (findUserById as jest.Mock).mockResolvedValue(true);
      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([
            {
              id: "1",
              user_id: "123",
              category_id: "456",
              amount: 100,
              created_at: new Date(),
              updated_at: new Date(),
            },
          ]),
        }),
      });

      const result = await setBudget({
        user_id: "123",
        category_id: "456",
        amount: 100,
      });

      expect(result).toEqual({
        id: "1",
        user_id: "123",
        category_id: "456",
        amount: 100,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
      expect(db.insert).toHaveBeenCalledWith(BudgetTable);
    });
  });

  describe("getBudgets", () => {
    it("should throw an error if user does not exist", async () => {
      (findUserById as jest.Mock).mockResolvedValue(null);

      await expect(getBudgets("123")).rejects.toThrow(
        new HttpError("User not found", 404),
      );
    });

    it("should throw an error if no budget is found", async () => {
      (findUserById as jest.Mock).mockResolvedValue(true);
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(getBudgets("123")).rejects.toThrow(
        new HttpError("No budgets found", 404),
      );
    });

    it("should return budgets if it exists", async () => {
      (findUserById as jest.Mock).mockResolvedValue(true);
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest
            .fn()
            .mockResolvedValue([{ id: "456", user_id: "123", amount: 100 }]),
        }),
      });

      const result = await getBudgets("123");
      expect(result).toEqual([{ id: "456", user_id: "123", amount: 100 }]);
    });
  });

  describe("deleteBudget", () => {
    it("should throw an error if budget does not exist", async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(deleteBudget("1")).rejects.toThrow(
        new HttpError("Budget not found", 404),
      );
    });

    it("should delete budget if it exists", async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([{}]),
        }),
      });
      (db.delete as jest.Mock).mockReturnValue({
        where: jest
          .fn()
          .mockResolvedValue({ message: "Budget deleted successfully" }),
      });

      const result = await deleteBudget("1");
      expect(result).toEqual({ message: "Budget deleted successfully" });
      expect(db.delete).toHaveBeenCalledWith(BudgetTable);
    });
  });

  describe("updateBudget", () => {
    it("should throw an error if required fields are missing", async () => {
      await expect(
        updateBudget({ user_id: "", category_id: "", amount: 0 }, "1"),
      ).rejects.toThrow(new HttpError("Missing required feilds", 400));
    });

    it("should throw an error if budget ID is missing", async () => {
      await expect(
        updateBudget({ user_id: "123", category_id: "456", amount: 100 }, ""),
      ).rejects.toThrow(new HttpError("Budget ID missing", 400));
    });

    it("should update budget if user and budget exist", async () => {
      (findUserById as jest.Mock).mockResolvedValue(true);
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([{}]),
        }),
      });
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([
            {
              id: "1",
              user_id: "123",
              category_id: "456",
              amount: 1000,
              created_at: new Date(),
              updated_at: new Date(),
            },
          ]),
        }),
      });

      const result = await updateBudget(
        { user_id: "123", category_id: "456", amount: 1000 },
        "1",
      );

      expect(result).toEqual({
        id: "1",
        user_id: "123",
        category_id: "456",
        amount: 1000,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
      expect(db.update).toHaveBeenCalledWith(BudgetTable);
    });
  });
});
