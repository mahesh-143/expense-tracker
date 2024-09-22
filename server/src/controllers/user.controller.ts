import { db } from "../drizzle/db";
import { eq } from "drizzle-orm";
import { User, UserTable } from "../drizzle/schema";
import { findUserByEmail, findUserById } from "../utils/users";
import { HttpError } from "../middlewares/HttpError";

export const getUser = async (id: string) => {
  const userProfile = await findUserById(id);

  if (!userProfile) {
    throw new HttpError("User not found", 404);
  }

  const { password: _, ...user } = userProfile;
  return user;
};

export const deleteUser = async (id: string) => {
  const userExists = await findUserById(id);

  if (!userExists) {
    throw new HttpError("User not found", 404);
  }
  await db.delete(UserTable).where(eq(UserTable.id, id));
  return { message: "user deleted" };
};

export const updateUser = async (data: User, user_id: string) => {
  const { id, email, username } = data;

  if (!email || !username) {
    throw new HttpError("Missing required feilds", 400);
  }

  const userExists = await findUserById(user_id);

  if (!userExists) {
    throw new HttpError("User not found", 404);
  }

  const existingEmailUser = await findUserByEmail(email);

  if (existingEmailUser) {
    throw new HttpError("Email already in use", 409);
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

  return updatedUser;
};
