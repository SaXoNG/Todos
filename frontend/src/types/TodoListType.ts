import type { TodoType } from "./TodoType";

export interface TodoListType {
  id: string | null;
  title: string;
  todos: TodoType[] | null;
}
