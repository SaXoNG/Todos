import { Request, Response, NextFunction } from "express";
import isValidId from "../../utils/isValidId";
import TODO_TITLE_MAX_LENGTH from "../../constants/todoTitleMaxLength";
import { BadRequestError } from "../../errors/BadRequestError";

function createTodoValidation(req: Request, res: Response, next: NextFunction) {
  const { listId } = req.params;
  let { title, description } = req.body;

  if (listId === undefined) {
    throw new BadRequestError("listId is required");
  }

  if (!isValidId(listId)) {
    throw new BadRequestError("listId is incorrect");
  }

  if (title === undefined) {
    throw new BadRequestError("Title is required");
  }

  if (typeof title !== "string") {
    throw new BadRequestError("Title must be a string");
  }

  if (title.trim().length === 0) {
    throw new BadRequestError("Title cannot be empty");
  }

  if (title.length > TODO_TITLE_MAX_LENGTH) {
    throw new BadRequestError(
      `Title cannot exceed ${TODO_TITLE_MAX_LENGTH} characters`,
    );
  }

  if (description !== undefined && typeof description !== "string") {
    throw new BadRequestError("Description must be a string");
  }

  next();
}

export default createTodoValidation;
