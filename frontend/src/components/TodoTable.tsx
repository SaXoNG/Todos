import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import type {
  DragStartEvent,
  DragMoveEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

import { TodoList } from "./todoList/TodoList";
import { useTodoStore } from "../storage/todoStore";
import { useUIStore } from "../storage/UIStore";
import { Loader } from "./Loader";
import { TODO_STATUS, type TodoType } from "../types/TodoType";
import { TodoItem } from "./todo/TodoItem";

const TableColumns = [
  { status: TODO_STATUS.TODO, title: "ToDo" },
  { status: TODO_STATUS.IN_PROCESS, title: "In Progress" },
  { status: TODO_STATUS.COMPLETED, title: "Done" },
];

export const TodoTable = () => {
  const setGlobalLoading = useUIStore((state) => state.setGlobalLoading);
  const loadingTodoId = useUIStore((state) => state.loadingTodoId);
  const fetchTodoList = useTodoStore((state) => state.fetchTodoList);
  const moveTodo = useTodoStore((state) => state.moveTodo);

  const globalLoading = useUIStore((state) => state.globalLoading);
  const todosList = useTodoStore((state) => state.listInfo);
  const todos = useTodoStore((state) => state.todos);

  const [activeTodo, setActiveTodo] = useState<TodoType | null>(null);
  const [lastOver, setLastOver] = useState<{ id: string } | null>(null);
  const [dragTodosByStatus, setDragTodosByStatus] = useState<
    Record<TODO_STATUS, TodoType[]>
  >({
    [TODO_STATUS.TODO]: [],
    [TODO_STATUS.IN_PROCESS]: [],
    [TODO_STATUS.COMPLETED]: [],
  });

  useEffect(() => {
    const listId = localStorage.getItem("listId");
    if (!listId) {
      setGlobalLoading(false);
      return;
    }
    fetchTodoList(listId);
  }, [fetchTodoList, setGlobalLoading]);

  useEffect(() => {
    const sortedTodos = [...todos].sort((a, b) => a.position - b.position);
    setDragTodosByStatus({
      [TODO_STATUS.TODO]: sortedTodos.filter(
        (t) => t.status === TODO_STATUS.TODO,
      ),
      [TODO_STATUS.IN_PROCESS]: sortedTodos.filter(
        (t) => t.status === TODO_STATUS.IN_PROCESS,
      ),
      [TODO_STATUS.COMPLETED]: sortedTodos.filter(
        (t) => t.status === TODO_STATUS.COMPLETED,
      ),
    });

    console.log(sortedTodos);
  }, [todos]);

  if (globalLoading) {
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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const todo = todos.find((t) => t.id === String(active.id)) || null;
    setActiveTodo(todo);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { over } = event;
    if (!over || !activeTodo) return;

    if ((lastOver && over.id === lastOver.id) || over.id === activeTodo.id) {
      return;
    } else {
      setLastOver({ id: String(over.id) });
    }

    setDragTodosByStatus((prev) => {
      const currentColumn = activeTodo.status;
      const oldIndex = prev[currentColumn].findIndex(
        (t) => t.id === activeTodo.id,
      );

      if (!currentColumn) return prev;

      let targetColumn: TODO_STATUS | null = null;
      let newIndex = 0;

      if (String(over.id).startsWith("column-target-")) {
        targetColumn = String(over.id).replace(
          "column-target-",
          "",
        ) as TODO_STATUS;
        newIndex = prev[targetColumn].length;
      } else if (over.data.current?.sortable?.containerId) {
        targetColumn = over.data.current.sortable.containerId as TODO_STATUS;
        const todoIndex = prev[targetColumn].findIndex((t) => t.id === over.id);

        newIndex = todoIndex >= 0 ? todoIndex : prev[targetColumn].length;
      }

      if (!targetColumn) return prev;

      const newState: Record<TODO_STATUS, TodoType[]> = {
        [TODO_STATUS.TODO]: prev[TODO_STATUS.TODO].filter(
          (t) => t.id !== activeTodo.id,
        ),
        [TODO_STATUS.IN_PROCESS]: prev[TODO_STATUS.IN_PROCESS].filter(
          (t) => t.id !== activeTodo.id,
        ),
        [TODO_STATUS.COMPLETED]: prev[TODO_STATUS.COMPLETED].filter(
          (t) => t.id !== activeTodo.id,
        ),
      };

      if (currentColumn === targetColumn && oldIndex === newIndex) return prev;

      newState[targetColumn].splice(newIndex, 0, activeTodo);

      return newState;
    });
  };

  const handleDragEnd = ({ over }: DragEndEvent) => {
    if (!activeTodo || !over) {
      setActiveTodo(null);
      return;
    }

    let targetStatus: TODO_STATUS | null = null;

    if (String(over.id).startsWith("column-target-")) {
      targetStatus = String(over.id).replace(
        "column-target-",
        "",
      ) as TODO_STATUS;
    } else if (over.data.current?.sortable?.containerId) {
      targetStatus = over.data.current.sortable.containerId as TODO_STATUS;
    }

    if (!targetStatus) {
      setActiveTodo(null);
      return;
    }

    const newTodos = dragTodosByStatus[targetStatus];
    const newIndex = newTodos.findIndex((t) => t.id === activeTodo.id);

    const oldTodos = todos
      .filter((t) => t.status === activeTodo.status)
      .sort((a, b) => a.position - b.position);

    const oldIndex = oldTodos.findIndex((t) => t.id === activeTodo.id);

    if (activeTodo.status === targetStatus && oldIndex === newIndex) {
      console.log("Hi there");

      setActiveTodo(null);
      return;
    }

    const beforeId = newIndex > 0 ? newTodos[newIndex - 1].id : null;

    const afterId =
      newIndex < newTodos.length - 1 ? newTodos[newIndex + 1].id : null;

    moveTodo(activeTodo.id, beforeId, afterId, targetStatus);

    setActiveTodo(null);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={loadingTodoId ? undefined : handleDragStart}
      onDragMove={loadingTodoId ? undefined : handleDragMove}
      onDragEnd={loadingTodoId ? undefined : handleDragEnd}
    >
      <div
        className="grid p-6 gap-x-6 h-full overflow-hidden"
        style={{ gridTemplateColumns: `repeat(${TableColumns.length}, 1fr)` }}
      >
        {TableColumns.map(({ status, title }) => (
          <div key={status} className="flex flex-col h-full overflow-hidden">
            <div className="h-8 mb-4 text-center text-2xl font-bold">
              {title}
            </div>
            <SortableContext
              id={status}
              items={dragTodosByStatus[status].map((todo) => todo.id)}
              strategy={verticalListSortingStrategy}
            >
              <TodoList
                todos={dragTodosByStatus[status]}
                createTodoForm={status === TODO_STATUS.TODO}
                type={status}
              />
            </SortableContext>
          </div>
        ))}
      </div>

      <DragOverlay style={{ pointerEvents: "none" }}>
        {activeTodo ? <TodoItem todo={activeTodo} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
