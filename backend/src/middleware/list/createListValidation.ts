import { Request, Response, NextFunction } from "express";
import LIST_TITLE_MAX_LENGTH from "../../constants/listTitleMaxLength";
import { BadRequestError } from "../../errors/BadRequestError";

function createListValidation(req: Request, res: Response, next: NextFunction) {
  const { title } = req.body;
  const trimmedTitle = title.trim();

  if (!title || typeof title !== "string") {
    throw new BadRequestError("Title is required and should be a string");
  }

  if (trimmedTitle.length === 0) {
    throw new BadRequestError("Title cannot be empty");
  }

  if (trimmedTitle.length > LIST_TITLE_MAX_LENGTH) {
    throw new BadRequestError("Title cannot exceed 50 characters");
  }

  next();
}

export default createListValidation;
