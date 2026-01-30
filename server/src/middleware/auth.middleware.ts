// src/middleware/auth.middleware.ts
import { NextFunction, Response } from "express";
import { Request } from "express-serve-static-core";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = (req.headers.authorization || req.headers.Authorization) as string | undefined;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Expect format: "Bearer <token>"
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Malformed authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
