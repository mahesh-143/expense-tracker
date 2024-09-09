import { db } from "../drizzle/db";
import { Transaction, TransactionsTable } from "../drizzle/schema";
import { findUserById } from "../utils/users";
import { HttpError } from "../middlewares/HttpError";

export const createTransaction = async (data: Transaction) => {
  const { user_id, category_id, type, amount, description, transaction_date } =
    data;

  if (!user_id || !category_id || !type || !amount || !transaction_date) {
    throw new HttpError("Request body is empty", 400);
  }

  const userExists = await findUserById(user_id);

  if (!userExists) {
    throw new HttpError("User not found", 404);
  }

  const [result] = await db
    .insert(TransactionsTable)
    .values({
      user_id,
      category_id,
      type,
      amount,
      description,
      transaction_date,
    })
    .returning({
      id: TransactionsTable.id,
      user_id: TransactionsTable.user_id,
      type: TransactionsTable.type,
      amount: TransactionsTable.amount,
      description: TransactionsTable.description,
      date: TransactionsTable.transaction_date,
    });
  return result;
};
