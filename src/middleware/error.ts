import { Request, Response, NextFunction } from "express";
import { Error } from "mongoose";

interface ErrorResponse {
  message: string;
  stack?: string;
}

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Mongoose bad ObjectId
  if (err.name === "CastError") {
    message = "Resource not found";
  }

  // Handle Mongoose validation error
  if (err.name === "ValidationError") {
    const validationError = err as Error.ValidationError;
    message = Object.values(validationError.errors)
      .map((val) => val.message)
      .join(", ");
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

export default errorHandler;
