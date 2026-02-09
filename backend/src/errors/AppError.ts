import type { StatusCodes } from "http-status-codes";

export abstract class AppError extends Error {
  abstract statusCode: StatusCodes;
  isOperational = true;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
