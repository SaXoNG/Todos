import { Request, Response, NextFunction } from "express";
import isValidId from "../../utils/isValidId";
import isValidStatus from "../../utils/isValidStatus";
import { BadRequestError } from "../../errors/BadRequestError";

function moveTodoValidation(req: Request, res: Response, next: NextFunction) {
  const { todoId } = req.params;
  const { status, beforeId, afterId } = req.body;

  if (!isValidId(todoId)) {
    throw new BadRequestError("todoId is incorrect");
  }

  if (beforeId === todoId) {
    throw new BadRequestError("beforeId and todoId cannot be the same");
  }

  if (afterId === todoId) {
    throw new BadRequestError("afterId and todoId cannot be the same");
  }

  if (afterId && beforeId && beforeId === afterId) {
    throw new BadRequestError("beforeId and afterId cannot be the same");
  }

  if (beforeId && !isValidId(beforeId)) {
    throw new BadRequestError("beforeId is incorrect");
  }

  if (afterId && !isValidId(afterId)) {
    throw new BadRequestError("afterId is incorrect");
  }

  if (status !== undefined && !isValidStatus(status)) {
    throw new BadRequestError("Invalid status");
  }

  next();
}

export default moveTodoValidation;
