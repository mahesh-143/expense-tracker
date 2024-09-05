import { Request, Response, NextFunction } from "express";
import { db } from "../drizzle/db";
import { eq } from "drizzle-orm";
import { UserTable } from "../drizzle/schema";
import { findUserByEmail, findUserById } from "../utils/users";

export const getUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const userProfile = await findUserById(id);

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: _, ...user } = userProfile;
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request & { body: { id: string } },
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.body;
    const userExists = await findUserById(id);

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }
    const result = await db.delete(UserTable).where(eq(UserTable.id, id));
    res.status(200).json({ result, message: "User deleted!" });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request & { body: { id: string; email: string; username: string } },
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, email, username } = req.body;
    if (!email || !username) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    const userExists = await findUserById(id);

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingEmailUser = await findUserByEmail(email);

    if (existingEmailUser) {
      return res.status(409).json({ message: "Email already in use" });
    }
    const [updatedUser] = await db
      .update(UserTable)
      .set({ email, username })
      .where(eq(UserTable.id, id))
      .returning({
        id: UserTable.id,
        username: UserTable.username,
        email: UserTable.email,
      });

    res.status(200).json({ message: "User Updated!", updatedUser });
  } catch (error) {
    next(error);
  }
};
