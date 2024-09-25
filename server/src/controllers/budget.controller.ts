import { db } from "../drizzle/db";
import { BudgetTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { findUserById } from "../utils/users";
import { HttpError } from "../middlewares/HttpError";
import { Budget } from "../drizzle/schema";

export const setBudget = async (data: Budget) => {
  const { user_id, category_id, amount } = data;

  if (!user_id || !category_id || !amount) {
    throw new HttpError("Missing required feilds", 400);
  }

  const userExists = await findUserById(user_id);

  if (!userExists) {
    throw new HttpError("User not found", 404);
  }

  const [result] = await db
    .insert(BudgetTable)
    .values({
      user_id,
      category_id,
      amount,
    })
    .returning({
      id: BudgetTable.id,
      user_id: BudgetTable.user_id,
      category_id: BudgetTable.category_id,
      amount: BudgetTable.amount,
      created_at: BudgetTable.created_at,
      updated_at: BudgetTable.updated_at,
    });
  return result;
};

export const getBudget = async (user_id: string) => {
  const userExists = await findUserById(user_id);

  if (!userExists) {
    throw new HttpError("User not found", 404);
  }

  const result = await db
    .select()
    .from(BudgetTable)
    .where(eq(BudgetTable.user_id, user_id));

  if (result.length === 0) {
    throw new HttpError("No Budget found", 404);
  }
  return result;
};

export const deleteBudget = async (id: string) => {
  const [budgetExists] = await db
    .select()
    .from(BudgetTable)
    .where(eq(BudgetTable.id, id));

  if (!budgetExists) {
    throw new HttpError("Category not found", 404);
  }

  await db.delete(BudgetTable).where(eq(BudgetTable.id, id));

  return { message: "Category deleted successfully" };
};

export const updateBudget = async (data: Budget, id: string) => {
  const { user_id, category_id, amount } = data;

  if (!user_id || !category_id || !amount) {
    throw new HttpError("Missing required feilds", 400);
  }

  if (!id) {
    throw new HttpError("Budget ID missing", 400);
  }

  const userExists = await findUserById(user_id);

  if (!userExists) {
    throw new HttpError("User not found", 404);
  }

  const [budgetExists] = await db
    .select()
    .from(BudgetTable)
    .where(eq(BudgetTable.id, id));

  if (!budgetExists) {
    throw new HttpError("Budget not found", 404);
  }

  const [result] = await db
    .update(BudgetTable)
    .set({
      category_id,
      amount,
    })
    .returning({
      id: BudgetTable.id,
      category_id: BudgetTable.id,
      user_id: BudgetTable.user_id,
      amount: BudgetTable.amount,
      created_at: BudgetTable.created_at,
      updated_at: BudgetTable.updated_at,
    });

  return result;
};
