import type { TodoStatusType, TodoType } from "../types/TodoType";
import { CreateTodo } from "./CreateTodo";
import { TodoItem } from "./TodoItem";

type Props = {
  todos: TodoType[];
  createTodoForm: boolean;
  type: TodoStatusType;
};

export const TodoList = ({ todos, createTodoForm, type }: Props) => {
  return (
    <div
      data-column={type}
      className="col-span-1 h-full flex flex-col border-3 p-5 pt-0 overflow-y-auto rounded"
    >
      {createTodoForm && <CreateTodo />}
      <div data-position={-1} className="empty-slot p-2.5" />
      {todos.map((todo) => {
        return (
          <div
            key={todo.id}
            data-id={todo.id}
            data-position={todo.position}
            className="pb-3"
          >
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
