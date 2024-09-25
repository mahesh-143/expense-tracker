import request from "supertest";
import express, { Express } from "express";
import budgetRouter from "../routes/budget.routes";
import * as budgetController from "../controllers/budget.controller";

// Mock the authenticateToken middleware
jest.mock("../middlewares/authenticateToken", () =>
  jest.fn((req, res, next) => next()),
);

// Mock the budget controller functions
jest.mock("../controllers/budget.controller");

const app: Express = express();
app.use(express.json());
app.use("/budget", budgetRouter);

describe("Budget Routes", () => {
  const mockBudget = { id: "1", user_id: "123", amount: 1000 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /budget/create", () => {
    it("should create a new budget", async () => {
      (budgetController.setBudget as jest.Mock).mockResolvedValue(mockBudget);

      const response = await request(app)
        .post("/budget/create")
        .send({ user_id: "123", amount: 1000 });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockBudget);
      expect(budgetController.setBudget).toHaveBeenCalledWith({
        user_id: "123",
        amount: 1000,
      });
    });
  });

  describe("GET /budget/:user_id", () => {
    it("should return a budget for a user", async () => {
      (budgetController.getBudget as jest.Mock).mockResolvedValue(mockBudget);

      const response = await request(app).get("/budget/123");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBudget);
      expect(budgetController.getBudget).toHaveBeenCalledWith("123");
    });
  });
  describe("PUT /budget/edit/:id", () => {
    it("should update a budget", async () => {
      const updatedBudget = { ...mockBudget, amount: 2000 };
      (budgetController.updateBudget as jest.Mock).mockResolvedValue(
        updatedBudget,
      );

      const response = await request(app)
        .put("/budget/edit/1")
        .send({ amount: 2000 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedBudget);
      expect(budgetController.updateBudget).toHaveBeenCalledWith(
        { amount: 2000 },
        "1",
      );
    });
  });

  describe("DELETE /budget/delete/:id", () => {
    it("should delete a budget", async () => {
      (budgetController.deleteBudget as jest.Mock).mockResolvedValue({
        message: "Budget deleted",
      });

      const response = await request(app).delete("/budget/delete/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Budget deleted" });
      expect(budgetController.deleteBudget).toHaveBeenCalledWith("1");
    });
  });
});
