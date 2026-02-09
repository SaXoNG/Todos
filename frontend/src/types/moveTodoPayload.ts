import type { TODO_STATUS } from "./TodoType";

export type MoveTodoPayload = {
  todoId: string;
  beforeId?: string;
  afterId?: string;
  status?: TODO_STATUS;
};
