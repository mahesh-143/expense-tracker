import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const UserTable = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 255 }).notNull(),
  password: varchar("password").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
});
