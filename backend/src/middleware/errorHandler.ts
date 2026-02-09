import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { InternalServerError } from "../errors/InternalServerError";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let error: AppError;

  if (err instanceof AppError) {
    error = err;
  } else {
    console.error("Unexpected error:", err);
    error = new InternalServerError();
  }

  res.status(error.statusCode).json({
    status: "error",
    message: error.message,
  });
};
