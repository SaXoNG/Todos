import { useEffect } from "react";

import { TodoList } from "./todoList/TodoList";
import { useTodoStore } from "../storage/todoStore";
import { useUIStore } from "../storage/UIStore";
import { Loader } from "./Loader";
import { TODO_STATUS } from "../types/TodoType";

const todoColumnTitles = ["ToDo", "In Progress", "Done"];

export const TodoTable = () => {
  const setGlobalLoading = useUIStore((state) => state.setGlobalLoading);
  const fetchTodoList = useTodoStore((state) => state.fetchTodoList);

  const globalLoading = useUIStore((state) => state.globalLoading);
  const todosList = useTodoStore((state) => state.listInfo);
  const todos = useTodoStore((state) => state.todos);

  useEffect(() => {
    const listId = localStorage.getItem("listId");

    if (!listId) {
      setGlobalLoading(false);

      return;
    }

    fetchTodoList(listId);
  }, [fetchTodoList, setGlobalLoading]);

  if (globalLoading === true) {
    return (
      <div className="relative h-full">
        <Loader />
      </div>
    );
  }

  if (!todosList || !todos) {
    return (
      <div className="flex-1 flex justify-center items-center font-bold text-6xl">
        List is not selected!
      </div>
    );
  }

  const sortedTodos = [...todos].sort(
    (todo1, todo2) => todo1.position - todo2.position,
  );
  const todoTodos = sortedTodos.filter(
    (todo) => todo.status === TODO_STATUS.TODO,
  );
  const inProgressTodos = sortedTodos.filter(
    (todo) => todo.status === TODO_STATUS.IN_PROCESS,
  );
  const completedTodos = sortedTodos.filter(
    (todo) => todo.status === TODO_STATUS.COMPLETED,
  );

  return (
    <div
      className="grid p-6 gap-x-6 h-full overflow-hidden"
      data-container
      style={{
        gridTemplateColumns: `repeat(${todoColumnTitles.length}, 1fr)`,
        gridTemplateRows: "auto 1fr",
      }}
    >
      {todoColumnTitles.map((title) => {
        return (
          <div key={title} className="h-8 mb-4 text-center text-2xl font-bold">
            {title}
          </div>
        );
      })}

      <TodoList
        todos={todoTodos}
        createTodoForm={true}
        type={TODO_STATUS.TODO}
      />
      <TodoList
        todos={inProgressTodos}
        createTodoForm={false}
        type={TODO_STATUS.IN_PROCESS}
      />
      <TodoList
        todos={completedTodos}
        createTodoForm={false}
        type={TODO_STATUS.COMPLETED}
      />
    </div>
  );
};
