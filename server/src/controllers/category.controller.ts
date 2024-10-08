import { db } from "../drizzle/db";
import { CategoryTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { findUserById } from "../utils/users";
import { HttpError } from "../middlewares/HttpError";
import { NewCategory } from "../drizzle/schema";

export const createCategory = async (data: NewCategory) => {
  const { user_id, name, type } = data;

  if (!user_id || !name || !type) {
    throw new HttpError("Missing required feilds", 400);
  }

  const userExists = await findUserById(user_id);

  if (!userExists) {
    throw new HttpError("User not found", 404);
  }

  const [result] = await db
    .insert(CategoryTable)
    .values({
      user_id,
      name,
      type,
    })
    .returning({
      user_id: CategoryTable.user_id,
      name: CategoryTable.name,
      type: CategoryTable.type,
      created_at: CategoryTable.created_at,
    });
  return result;
};

export const getCategory = async (user_id: string) => {
  const userExists = await findUserById(user_id);

  if (!userExists) {
    throw new HttpError("User not found", 404);
  }

  const result = await db
    .select()
    .from(CategoryTable)
    .where(eq(CategoryTable.user_id, user_id));

  if (result.length === 0) {
    throw new HttpError("No categories found", 404);
  }

  return result;
};

export const deleteCategory = async (id: string) => {
  const [categoryExists] = await db
    .select()
    .from(CategoryTable)
    .where(eq(CategoryTable.id, id));

  if (!categoryExists) {
    throw new HttpError("Category not found", 404);
  }

  await db.delete(CategoryTable).where(eq(CategoryTable.id, id));

  return { message: "Category deleted successfully" };
};

export const updateCategory = async (data: NewCategory, id: string) => {
  const { user_id, name, type } = data;

  if (!user_id || !name || !type) {
    throw new HttpError("Missing required feilds", 400);
  }

  if (!id) {
    throw new HttpError("Category ID missing", 400);
  }

  const userExists = await findUserById(user_id);

  if (!userExists) {
    throw new HttpError("User not found", 404);
  }

  const [categoryExists] = await db
    .select()
    .from(CategoryTable)
    .where(eq(CategoryTable.id, id));

  if (!categoryExists) {
    throw new HttpError("Category not found", 404);
  }

  const [result] = await db
    .update(CategoryTable)
    .set({
      name,
      type,
    })
    .returning({
      category_id: CategoryTable.id,
      user_id: CategoryTable.user_id,
      name: CategoryTable.name,
      type: CategoryTable.type,
    });

  return result;
};
