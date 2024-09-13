import { db } from "../drizzle/db";
import { Transaction, TransactionsTable } from "../drizzle/schema";
import { findUserById } from "../utils/users";
import { HttpError } from "../middlewares/HttpError";
import { eq } from "drizzle-orm";

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

export const getTransactions = async (user_id: string) => {
  const userExists = await findUserById(user_id);

  if (!userExists) {
    throw new HttpError("User not found", 404);
  }

  const result = await db
    .select()
    .from(TransactionsTable)
    .where(eq(TransactionsTable.user_id, user_id));
  return result;
};

export const getTransaction = async (transaction_id: string) => {
  const [result] = await db
    .select()
    .from(TransactionsTable)
    .where(eq(TransactionsTable.id, transaction_id));
  return result;
};

export const updateTransaction = async (data: Transaction) => {
  const { user_id, category_id, type, amount, description, transaction_date } =
    data;

  if (!user_id) {
    throw new HttpError("User ID missing", 400);
  }

  const userExists = await findUserById(user_id);

  if (!userExists) {
    throw new HttpError("User not found", 404);
  }

  const [result] = await db
    .update(TransactionsTable)
    .set({
      type,
      amount,
      description,
      transaction_date,
    })
    .returning({
      user_id: TransactionsTable.user_id,
      type: TransactionsTable.type,
      description: TransactionsTable.description,
      transaction_date: TransactionsTable.transaction_date,
    });

  return result;
};

export const deleteTransaction = async (transaction_id: string) => {
  const [transactionExists] = await db
    .select()
    .from(TransactionsTable)
    .where(eq(TransactionsTable.id, transaction_id));

  if (transactionExists) {
    const result = await db
      .delete(TransactionsTable)
      .where(eq(TransactionsTable.id, transaction_id));
    return result;
  } else {
    throw new HttpError("Transaction not found", 404);
  }
};
