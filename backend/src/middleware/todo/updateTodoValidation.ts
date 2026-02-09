import { Request, Response, NextFunction } from "express";
import isValidId from "../../utils/isValidId";
import TODO_TITLE_MAX_LENGTH from "../../constants/todoTitleMaxLength";
import { BadRequestError } from "../../errors/BadRequestError";

function updateTodoValidation(req: Request, res: Response, next: NextFunction) {
  const { todoId } = req.params;
  const { title, description } = req.body;

  if (!isValidId(todoId)) {
    throw new BadRequestError("todoId is incorrect");
  }

  if (title !== undefined) {
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
  }

  if (description !== undefined && typeof description !== "string") {
    throw new BadRequestError("Description must be a string");
  }

  if (!title && !description) {
    throw new BadRequestError(
      "Provide at least one field ('title' or 'description') to update",
    );
  }

  next();
}

export default updateTodoValidation;
