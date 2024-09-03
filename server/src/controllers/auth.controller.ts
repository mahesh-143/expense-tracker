import { Request, Response, NextFunction } from "express";
import { db } from "../drizzle/db";
import { UserTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/jwt";

export const register = async (
  req: Request & {
    body: { email: string; password: string; username: string };
  },
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body;
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    const userExist = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, email));

    if (userExist.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db
      .insert(UserTable)
      .values({
        email: email,
        username: username,
        password: hashedPassword,
      })
      .returning({
        id: UserTable.id,
        email: UserTable.email,
        username: UserTable.username,
      });
    const token = generateAccessToken(user[0].id);
    res.json({ user: user[0], token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
    next(error);
  }
};
