import { useEffect, type JSX } from "react";

import { TodoList } from "./TodoList";
import { useTodoStore } from "../storage/todoStore";
import { useUIStore } from "../storage/UIStore";
import { Loader } from "./Loader";

const todoColumnTitles = ["ToDo", "In Progress", "Done"];

export const TodoTable = (): JSX.Element => {
  const setLoading = useUIStore((state) => state.setLoading);
  const fetchTodoList = useTodoStore((state) => state.fetchTodoList);

  const loading = useUIStore((state) => state.loading);
  const todosList = useTodoStore((state) => state.listInfo);
  const todos = useTodoStore((state) => state.todos);

  useEffect(() => {
    const listId = localStorage.getItem("listID");

    if (!listId) {
      setLoading(false);

      return;
    }

    fetchTodoList(listId);
  }, [fetchTodoList, setLoading]);

  if (loading === true) {
    return (
      <div className="relative h-full">
        <Loader />
      </div>
    );
  }

  if (!todosList) {
    return (
      <div className="flex-1 flex justify-center items-center font-bold text-6xl">
        List is not selected!
      </div>
    );
  }

  const todoTodos = todos.filter((todo) => todo.status === "todo");
  const inProgressTodos = todos.filter((todo) => todo.status === "in_process");
  const doneTodos = todos.filter((todo) => todo.status === "completed");

  return (
    <div
      className="grid p-6 gap-x-6 h-full overflow-hidden"
      data-container
      style={{
        gridTemplateColumns: `repeat(${todoColumnTitles.length}, 1fr)`,
        gridTemplateRows: "auto 1fr",
      }}
    >
      {todoColumnTitles.map((title, i) => {
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
