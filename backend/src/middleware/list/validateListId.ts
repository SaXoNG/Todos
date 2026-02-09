import { Request, Response, NextFunction } from "express";
import isValidId from "../../utils/isValidId";
import { BadRequestError } from "../../errors/BadRequestError";

export function validateListId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { listId } = req.params;

  if (!isValidId(listId)) {
    throw new BadRequestError("listId is incorrect");
  }

  next();
}
