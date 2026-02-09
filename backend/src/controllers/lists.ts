import { Request, Response } from "express";

import List from "../models/List";
import Todo from "../models/Todo";
import asyncWrapper from "../middleware/asyncWrapper";
import prepareForResponse from "../utils/prepareForResponse";
import { NotFoundError } from "../errors/NotFoundError";
import mongoose from "mongoose";

export const getLists = asyncWrapper(async (req: Request, res: Response) => {
  const lists = await List.find().lean();
  const preparedLists = prepareForResponse(lists);

  res.status(200).json({ lists: preparedLists });
});

export const getList = asyncWrapper(async (req: Request, res: Response) => {
  const { listId } = req.params;

  const list = await List.findById(listId)
    .populate({
      path: "todos",
      options: { sort: { position: 1 } },
    })
    .lean({ virtuals: true });

  if (!list) {
    throw new NotFoundError("List not found");
  }

  const response = {
    ...prepareForResponse(list),
    todos: prepareForResponse(list.todos || []),
  };

  res.status(200).json(response);
});

export const createList = asyncWrapper(async (req: Request, res: Response) => {
  const { title } = req.body;

  const list = await List.create({ title: title.trim() });

  const response = {
    ...prepareForResponse(list.toObject()),
    todos: [],
  };

  return res.status(201).json(response);
});

export const deleteList = asyncWrapper(async (req: Request, res: Response) => {
  const { listId } = req.params;

  const list = await List.findById(listId);

  if (!list) {
    throw new NotFoundError("List not found");
  }

  await Todo.deleteMany({ listId });

  await list.deleteOne();

  res.sendStatus(204);
});
