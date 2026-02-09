import type { JSX } from "react";
import type { TODO_STATUS, TodoType } from "../../types/TodoType";
import { CreateTodo } from "../todo/CreateTodo";
import { TodoItem } from "../todo/TodoItem";

type Props = {
  todos: TodoType[];
  createTodoForm: boolean;
  type: TODO_STATUS;
};

export const TodoList = ({
  todos,
  createTodoForm,
  type,
}: Props): JSX.Element => {
  return (
    <div
      data-column={type}
      className="col-span-1 h-full flex flex-col border-3 p-5 pt-0 overflow-y-auto rounded"
    >
      {createTodoForm && (
        <CreateTodo firstTodoId={todos[0]?.id} />
      )}
      {todos.map((todo) => {
        return (
          <div key={todo.id} data-id={todo.id} className="pt-3">
            <TodoItem todo={todo} />
          </div>
        );
      })}
      {!createTodoForm && todos.length === 0 && (
        <div className="text-center font-bold text-4xl">Colum is empty</div>
      )}
    </div>
  );
};
