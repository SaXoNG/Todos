import { Request, Response } from "express";

import Todo from "../models/Todo";
import asyncWrapper from "../middleware/asyncWrapper";
import isValidId from "../utils/isValidId";
import TODO_STATUS from "../types/TODO_STATUS";
import FIRST_TODO_POSITION from "../constants/firstTodoPosition";
import prepareForResponse from "../utils/prepareForResponse";
import { NotFoundError } from "../errors/NotFoundError";
import { BadRequestError } from "../errors/BadRequestError";

export const createTodo = asyncWrapper(async (req: Request, res: Response) => {
  const { listId } = req.params;
  let { title, description } = req.body;

  const todos = await Todo.find({ listId, status: TODO_STATUS.TODO })
    .sort({ position: 1 })
    .lean();

  const newPosition =
    todos.length > 0 ? todos[0].position - 1000 : FIRST_TODO_POSITION;

  const newTodo = await Todo.create({
    listId,
    title: title.trim(),
    description,
    position: newPosition,
  });

  res.status(201).json(prepareForResponse(newTodo.toObject()));
});

export const updateTodoText = asyncWrapper(
  async (req: Request, res: Response) => {
    const { todoId } = req.params;
    const { title, description } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { title: title.trim(), description },
      { runValidators: true, new: true },
    ).lean();

    if (!updatedTodo) {
      throw new NotFoundError("Todo not found");
    }

    res.status(200).json(updatedTodo);
  },
);

export const deleteTodo = asyncWrapper(async (req: Request, res: Response) => {
  const { todoId } = req.params;

  if (!isValidId(todoId)) {
    throw new BadRequestError("todoId is incorrect");
  }

  await Todo.findByIdAndDelete(todoId);

  res.sendStatus(204);
});

export const moveTodo = asyncWrapper(async (req: Request, res: Response) => {
  const { todoId } = req.params;
  const { status, beforeId, afterId } = req.body;

  const todo = await Todo.findById(todoId);

  if (!todo) {
    throw new NotFoundError("Todo not found");
  }

  if (status !== undefined && todo.status !== status) {
    todo.status = status;
  }

  const before = beforeId ? await Todo.findById(beforeId) : null;
  const after = afterId ? await Todo.findById(afterId) : null;

  if (beforeId) {
    if (!before) {
      throw new NotFoundError("Todo referenced by beforeId was not found");
    }

    if (before.listId.toString() !== todo.listId.toString()) {
      throw new BadRequestError("beforeId belongs to a different list");
    }

    if (before.status !== todo.status) {
      throw new BadRequestError("beforeId must belong to the same status");
    }
  }

  if (afterId) {
    if (!after) {
      throw new NotFoundError("Todo referenced by afterId was not found");
    }

    if (after.listId.toString() !== todo.listId.toString()) {
      throw new BadRequestError("afterId belongs to a different list");
    }

    if (after.status !== todo.status) {
      throw new BadRequestError("afterId must belong to the same status");
    }
  }

  let newPosition = FIRST_TODO_POSITION;

  if (before && after) {
    newPosition = (before.position + after.position) / 2;
  } else if (!before && after) {
    newPosition = after.position - 1000;
  } else if (before && !after) {
    newPosition = before.position + 1000;
  }

  todo.position = newPosition;

  const savedTodo = await todo.save();

  res.status(200).json(prepareForResponse(savedTodo.toObject()));
});
