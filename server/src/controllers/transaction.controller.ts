import { db } from "../drizzle/db";
import { NewTransaction, TransactionsTable } from "../drizzle/schema";
import { findUserById } from "../utils/users";
import { HttpError } from "../middlewares/HttpError";
import { eq } from "drizzle-orm";

export const createTransaction = async (data: NewTransaction) => {
  const { user_id, category_id, type, amount, description, transaction_date } =
    data;

  if (!user_id || !category_id || !type || !amount || !transaction_date) {
    throw new HttpError("Missing required feilds", 400);
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
      transaction_date: TransactionsTable.transaction_date,
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

  if (result.length === 0) {
    throw new HttpError("No transactions found for this user", 404);
  }
  return result;
};

export const getTransaction = async (transaction_id: string) => {
  const [result] = await db
    .select()
    .from(TransactionsTable)
    .where(eq(TransactionsTable.id, transaction_id));

  if (!result) {
    throw new HttpError("Transaction not found", 404);
  }

  return result;
};

export const updateTransaction = async (
  data: Transaction,
  transaction_id: string,
) => {
  const { user_id, category_id, type, amount, description, transaction_date } =
    data;

  if (!user_id) {
    throw new HttpError("User ID missing", 400);
  }

  if (!transaction_id) {
    throw new HttpError(" Transaction ID missing", 400);
  }

  const userExists = await findUserById(user_id);

  if (!userExists) {
    throw new HttpError("User not found", 404);
  }

  const [transactionExists] = await db
    .select()
    .from(TransactionsTable)
    .where(eq(TransactionsTable.id, transaction_id));

  if (!transactionExists) {
    throw new HttpError("Transaction not found", 404);
  }

  const [result] = await db
    .update(TransactionsTable)
    .set({
      type,
      amount,
      description,
      transaction_date,
      category_id,
    })
    .returning({
      id: TransactionsTable.id,
      user_id: TransactionsTable.user_id,
      type: TransactionsTable.type,
      amount: TransactionsTable.amount,
      description: TransactionsTable.description,
      transaction_date: TransactionsTable.transaction_date,
      category_id: TransactionsTable.category_id,
    });

  return result;
};

export const deleteTransaction = async (transaction_id: string) => {
  const [transactionExists] = await db
    .select()
    .from(TransactionsTable)
    .where(eq(TransactionsTable.id, transaction_id));

  if (!transactionExists) {
    throw new HttpError("Transaction not found", 404);
  }

  await db
    .delete(TransactionsTable)
    .where(eq(TransactionsTable.id, transaction_id));

  return { message: "Transaction deleted successfully" };
};
