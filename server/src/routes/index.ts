import { Application } from "express";

import auth from "./auth.routes";
import user from "./user.routes";

export const routes = (app: Application): void => {
  app.use("/api/auth", auth);
  app.use("/api/user", user);
};
