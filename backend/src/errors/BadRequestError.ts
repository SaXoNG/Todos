import { AppError } from "./AppError";

export class BadRequestError extends AppError {
  statusCode = 400 as const;

  constructor(message: string) {
    super(message);
  }
}