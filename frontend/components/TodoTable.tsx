import { JSX } from "react";
import { TodoList } from "./TodoList";
import { TodoType } from "../types/TodoType";

const todoColumnTitle = ["ToDo", "In Progress", "Done"];

type Props = {
  todos: TodoType[] | null | undefined;
};

export const TodoTable = ({ todos }: Props): JSX.Element | null => {
  if (todos === undefined || todos === null) {
    return null;
  }

  const todoTodos = todos.filter((todo) => todo.status === "todo");
  const inProgressTodos = todos.filter((todo) => todo.status === "in_process");
  const doneTodos = todos.filter((todo) => todo.status === "completed");

  return (
    <div
      className="grid p-6 gap-x-6 h-full overflow-hidden"
      data-container
      style={{
        gridTemplateColumns: `repeat(${todoColumnTitle.length}, 1fr)`,
        gridTemplateRows: "auto 1fr",
      }}
    >
      {todoColumnTitle.map((title, i) => {
        return (
          <div key={i} className="h-8 mb-4 text-center text-2xl font-bold">
            {title}
          </div>
        );
      })}

      <TodoList todos={todoTodos} createTodoForm={true} type="todo" />
      <TodoList
        todos={inProgressTodos}
        createTodoForm={false}
        type="in_process"
      />
      <TodoList todos={doneTodos} createTodoForm={false} type="completed" />
    </div>
  );
};
