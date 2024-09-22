import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "./HttpError";
import { User } from "../drizzle/schema";

const authenticateToken = (
  req: Request & { user?: User },
  res: Response,
  next: NextFunction,
) => {
  // Get the token from the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return next(new HttpError("Unauthorized", 401));
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      return next(new HttpError("Forbidden", 403));
    }

    // Attach user to the request object
    req.user = user as User;
    next();
  });
};

export default authenticateToken;
