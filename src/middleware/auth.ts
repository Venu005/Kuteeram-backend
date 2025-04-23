import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // First check cookies, then headers
    const token =
      req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).send({ error: "Please authenticate" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findOne({ _id: (decoded as any)._id }).select(
      "-password"
    );

    if (!user) {
      res.status(401).send({ error: "Please authenticate" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

export const admin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (
    req.user?.role !== "admin" ||
    req.user?.email !== process.env.ADMIN_EMAIL
  ) {
    res.status(403).send({ error: "Access denied" });
    return;
  }
  next();
};
