import { Request, Response, NextFunction } from "express";
import { db } from "../drizzle/db";
import { UserTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { generateTokens } from "../utils/jwt";

export const register = async (
  req: Request & {
    body: { email: string; password: string; username: string };
  },
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Request body is empty" });
    }

    const [userExist] = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, email));

    if (userExist) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await db
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
    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(user.id, jti);
    res.json({ user, accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
    next(error);
  }
};

export const login = async (
  req: Request & {
    body: { email: string; password: string };
  },
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const [foundUser] = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, email));

    if (!foundUser) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    const validPassword = await bcrypt.compare(password, foundUser.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(foundUser.id, jti);
    const { password: _, ...user } = foundUser;
    res.json({
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    next(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
