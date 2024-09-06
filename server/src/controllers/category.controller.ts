import { NextFunction, Request, Response } from "express";
import { db } from "../drizzle/db";
import { CategoryTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { findUserById } from "../utils/users";

type Type = "expense" | "income" | null;

type Category = {
  user_id: string;
  name: string;
  type: Type;
};

export const createCategory = async (
  req: Request & {
    body: Category;
  },
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user_id, name, type } = req.body;

    if (!user_id || !name || !type) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    const userExists = await findUserById(user_id);

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
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
      });
    res.status(201).json({ message: "Category created!", result });
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user_id } = req.params;

    const userExists = await findUserById(user_id);

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = await db
      .select()
      .from(CategoryTable)
      .where(eq(CategoryTable.user_id, user_id));
    res.status(200).json({ result });

    if (result.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const [categoryExists] = await db
      .select()
      .from(CategoryTable)
      .where(eq(CategoryTable.id, id));

    if (categoryExists) {
      const result = await db
        .delete(CategoryTable)
        .where(eq(CategoryTable.id, id));
      res.status(200).json({ message: "Category deleted" });
    } else {
      return res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request & {
    body: Category;
  },
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user_id, name, type } = req.body;

    if (!user_id || !name || !type) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    const userExists = await findUserById(user_id);

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }
    const [result] = await db
      .update(CategoryTable)
      .set({
        name,
        type,
      })
      .returning({
        user_id: CategoryTable.user_id,
        name: CategoryTable.name,
        type: CategoryTable.type,
      });
    res.status(201).json({ message: "Category updated!", result });
  } catch (error) {
    next(error);
  }
};
