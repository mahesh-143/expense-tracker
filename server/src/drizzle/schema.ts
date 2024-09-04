import { date, decimal, text } from "drizzle-orm/pg-core";
import { pgTable, pgEnum, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const typeEnum = pgEnum("type", ["expense", "income"]);

export const UserTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 255 }).notNull(),
  password: varchar("password").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const CategoryTable = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => UserTable.id, {
    onDelete: "cascade",
  }),
  name: varchar("name", { length: 55 }).notNull(),
  type: typeEnum("type"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const TransactionsTable = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => UserTable.id, {
    onDelete: "cascade",
  }),
  category_id: uuid("category_id").references(() => CategoryTable.id, {
    onDelete: "set null",
  }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  transaction_date: date("transaction_date").notNull(),
  type: typeEnum("type"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const Budget = pgTable("budget", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => UserTable.id, {
    onDelete: "cascade",
  }),
  category_id: uuid("category_id").references(() => CategoryTable.id, {
    onDelete: "set null",
  }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const InvestmentTable = pgTable("investments", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => UserTable.id, {
    onDelete: "cascade",
  }),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }),
  purchace_date: date("purchaceDate").notNull(),
  purchase_price: decimal("purchase_price", {
    precision: 10,
    scale: 2,
  }).notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  current_value: decimal("current_value", {
    precision: 10,
    scale: 2,
  }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});
