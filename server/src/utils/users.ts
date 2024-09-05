import { db } from "../drizzle/db";
import { UserTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { User } from "../drizzle/schema";

export async function findUserById(userId: string): Promise<User | null> {
  const [user] = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.id, userId));
  return user || null;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const [user] = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.email, email));
  return user || null;
}
