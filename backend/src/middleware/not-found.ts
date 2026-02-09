import { Request, Response } from "express";
import { NotFoundError } from "../errors/NotFoundError";

const notFound = (req: Request, res: Response) => {
  throw new NotFoundError("Route does not exist");
};

export default notFound;
