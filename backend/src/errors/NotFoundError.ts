import { AppError } from "./AppError";

export class NotFoundError extends AppError {
  statusCode = 404 as const;

  constructor(message: string) {
    super(message);
  }
}
