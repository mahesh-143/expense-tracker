import {
  createCategory,
  getCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/category.controller";
import { db } from "../drizzle/db";
import { findUserById } from "../utils/users";
import { HttpError } from "../middlewares/HttpError";
import { CategoryTable } from "../drizzle/schema";

// Mock the db and user utility
jest.mock("../drizzle/db");
jest.mock("../utils/users");

describe("Category Service", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  describe("createCategory", () => {
    it("should throw an error if required fields are missing", async () => {
      await expect(
        createCategory({ user_id: "", name: "", type: null }),
      ).rejects.toThrow(new HttpError("Missing required feilds", 400));
    });

    it("should throw an error if user does not exist", async () => {
      (findUserById as jest.Mock).mockResolvedValue(null);

      await expect(
        createCategory({ user_id: "1", name: "Groceries", type: "expense" }),
      ).rejects.toThrow(new HttpError("User not found", 404));
    });

    it("should create a new category if user exists", async () => {
      (findUserById as jest.Mock).mockResolvedValue(true);
      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest
            .fn()
            .mockResolvedValue([
              { user_id: "1", name: "Groceries", type: "expense" },
            ]),
        }),
      });

      const result = await createCategory({
        user_id: "1",
        name: "Groceries",
        type: "expense",
      });
      expect(result).toEqual({
        name: "Groceries",
        user_id: "1",
        created_at: expect.any(Date),
        type: "expense",
      });
      expect(db.insert).toHaveBeenCalledWith({
        CategoryTable,
      });
    });
  });

  describe("getCategory", () => {
    it("should throw an error if user does not exist", async () => {
      (findUserById as jest.Mock).mockResolvedValue(null);

      await expect(getCategory("1")).rejects.toThrow(
        new HttpError("User not found", 404),
      );
    });

    it("should throw an error if no categories found", async () => {
      (findUserById as jest.Mock).mockResolvedValue(true);
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(getCategory("1")).rejects.toThrow(
        new HttpError("No categories found", 404),
      );
    });

    it("should return categories if found", async () => {
      const mockCategories = [
        { user_id: "1", name: "Groceries", type: "expense" },
      ];

      (findUserById as jest.Mock).mockResolvedValue(true);
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue(mockCategories),
        }),
      });

      const result = await getCategory("1");
      expect(result).toEqual(mockCategories);
      expect(findUserById).toHaveBeenCalledWith("1");
    });
  });

  describe("deleteCategory", () => {
    it("should throw an error if category not found", async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(deleteCategory("1")).rejects.toThrow(
        new HttpError("Category not found", 404),
      );
    });

    it("should delete category if it exists", async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([{ id: "1" }]),
        }),
      });
      (db.delete as jest.Mock).mockReturnValue({
        where: jest
          .fn()
          .mockResolvedValue({ message: "Transaction deleted successfully" }),
      });

      const response = await deleteCategory("1");
      expect(response).toEqual({ message: "Category deleted successfully" });
      expect(db.delete).toHaveBeenCalledWith(CategoryTable);
    });
  });

  describe("updateCategory", () => {
    it("should throw an error if required fields are missing", async () => {
      await expect(
        updateCategory({ user_id: "", name: "", type: "expense" }, "1"),
      ).rejects.toThrow(new HttpError("Missing required feilds", 400));
    });

    it("should throw an error if category ID is missing", async () => {
      await expect(
        updateCategory(
          { user_id: "1", name: "Groceries", type: "expense" },
          "",
        ),
      ).rejects.toThrow(new HttpError("Category ID missing", 400));
    });

    it("should throw an error if user does not exist", async () => {
      (findUserById as jest.Mock).mockResolvedValue(null);

      await expect(
        updateCategory(
          { user_id: "1", name: "Groceries", type: "expense" },
          "1",
        ),
      ).rejects.toThrow(new HttpError("User not found", 404));
    });

    it("should throw an error if category not found", async () => {
      (findUserById as jest.Mock).mockResolvedValue(true);
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      await expect(
        updateCategory(
          { user_id: "1", name: "Groceries", type: "expense" },
          "1",
        ),
      ).rejects.toThrow(new HttpError("Category not found", 404));
    });

    it("should update the category if all conditions are met", async () => {
      const mockUpdatedCategory = {
        category_id: "1",
        user_id: "1",
        name: "Groceries",
        type: "expense",
      };

      (findUserById as jest.Mock).mockResolvedValue(true);
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([{ id: "1" }]),
        }),
      });

      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockUpdatedCategory]),
        }),
      });

      const result = await updateCategory(
        { user_id: "1", name: "Groceries", type: "expense" },
        "1",
      );

      expect(result).toEqual(mockUpdatedCategory);
      expect(db.update).toHaveBeenCalledWith(CategoryTable);
    });
  });
});
