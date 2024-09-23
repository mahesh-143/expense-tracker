import { Application } from "express";

import auth from "./auth.routes";
import user from "./user.routes";
import category from "./category.routes";
import transaction from "./transaction.routes";
import budget from "./budget.routes";

export const routes = (app: Application): void => {
  app.use("/api/auth", auth);
  app.use("/api/user", user);
  app.use("/api/category", category);
  app.use("/api/transaction", transaction);
  app.use("/api/budget", budget);
};
