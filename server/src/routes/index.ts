import { Application } from "express";

import auth from "./auth.routes";

export const routes = (app: Application): void => {
  app.use("/api/auth", auth);
};
