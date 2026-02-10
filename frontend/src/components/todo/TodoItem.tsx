import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { JSX } from "react";
import { useState, useRef } from "react";
import { useTodoStore } from "../../storage/todoStore";
import { useUIStore } from "../../storage/UIStore";
import { useNotificationStore } from "../../storage/notificationStore";
import { IconBtn } from "../IconBtn";
import { Loader } from "../Loader";
import { TodoEditForm } from "./TodoEditForm";
import type { TodoType } from "../../types/TodoType";

type Props = { todo: TodoType };

export const TodoItem = ({ todo }: Props): JSX.Element => {
  const { id, title, description } = todo;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  const loadingTodoId = useUIStore((state) => state.loadingTodoId);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const updateTodoText = useTodoStore((state) => state.updateTodoText);
  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  const [isEditText, setIsEditText] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpdateTodoText = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTitle === title && newDescription === description) {
      setIsEditText(false);
      return;
    }
    if (newTitle.trim().length < 3) {
      showNotification({ title: "Min length is 3 chars", type: "warning" });
      return;
    }
    if (newTitle.trim().length > 50) {
      showNotification({ title: "Max length is 50 chars", type: "warning" });
      return;
    }
    try {
      setIsEditText(false);
      await updateTodoText({
        ...todo,
        title: newTitle,
        description: newDescription,
      });
    } catch {
      setIsEditText(true);
      showNotification({ type: "error", title: "Server error!" });
    }
  };

  const handleCancel = () => {
    setIsEditText(false);
    setNewTitle(title);
    setNewDescription(description);
  };

  return isEditText ? (
    <TodoEditForm
      handleUpdateTodoText={handleUpdateTodoText}
      inputRef={inputRef}
      newTitle={newTitle}
      setNewTitle={setNewTitle}
      handleCancel={handleCancel}
      newDescription={newDescription}
      setNewDescription={setNewDescription}
    />
  ) : (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="relative flex flex-col gap-2 bg-gray-400 p-2 rounded"
    >
      {loadingTodoId === id && <Loader />}
      <div className="flex justify-between items-start">
        <div className="text-xl font-semibold break-words whitespace-normal max-w-[80%] px-2">
          {title}
        </div>
        <div className="flex gap-1">
          <IconBtn
            icon="edit"
            onClick={() => {
              setIsEditText(true);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
          />
          <IconBtn icon="delete" onClick={() => deleteTodo(id)} />
        </div>
      </div>
      <div className="px-2 break-words">{description}</div>
    </div>
  );
};
