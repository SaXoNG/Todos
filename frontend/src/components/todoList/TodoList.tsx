import type { JSX } from "react";
import type { TODO_STATUS, TodoType } from "../../types/TodoType";
import { CreateTodo } from "../todo/CreateTodo";
import { TodoItem } from "../todo/TodoItem";
import { useSortable } from "@dnd-kit/sortable";

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
  const columnTarget = `column-target-${type}`;

  const { attributes, listeners, setNodeRef } = useSortable({
    id: columnTarget,
  });

  return (
    <div className="col-span-1 h-full flex flex-col  border-3 p-5 pt-0 rounded overflow-auto">
      {createTodoForm && <CreateTodo firstTodoId={todos[0]?.id} />}

      {todos.map((todo) => (
        <div key={todo.id} className="pt-3">
          <TodoItem todo={todo} />
        </div>
      ))}

      {!createTodoForm && todos.length === 0 && (
        <div className="text-center font-bold text-4xl">Colum is empty</div>
      )}

      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        data-column={type}
        className="flex-1 cursor-grab"
      />
    </div>
  );
};
