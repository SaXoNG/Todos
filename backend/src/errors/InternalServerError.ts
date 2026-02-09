import { AppError } from "./AppError";

export class InternalServerError extends AppError {
  statusCode = 500 as const;

  constructor(message = "Internal server error") {
    super(message);
  }
}
