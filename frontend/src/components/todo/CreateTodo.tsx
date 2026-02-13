import { useRef, useState, type JSX } from "react";
import { useTodoStore } from "../../storage/todoStore";
import { useNotificationStore } from "../../storage/notificationStore";
import type { CreateTodoPayload } from "../../types/CreateTodoPayload";
import { CreateTodoForm } from "./CreateTodoForm";

type Props = {
  firstTodoId: string | null;
};

export const CreateTodo = ({ firstTodoId }: Props): JSX.Element => {
  const createTodo = useTodoStore((state) => state.createTodo);

  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  const [openCreatingForm, setOpenCreatingForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.trim().length < 3) {
      showNotification({
        title: "Min length for todo title is 3 chars",
        type: "warning",
      });

      return;
    }

    if (title.length > 50) {
      showNotification({
        title: "Max length is 50 chars",
        type: "warning",
      });

      return;
    }

    const newTodo: CreateTodoPayload = {
      title,
      description,
    };

    try {
      await createTodo(newTodo);

      setOpenCreatingForm(false);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const handleCancel = () => {
    setOpenCreatingForm(false);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="pt-5" data-id={firstTodoId}>
      {openCreatingForm ? (
        <CreateTodoForm
          handleSubmit={handleSubmit}
          inputRef={inputRef}
          setTitle={setTitle}
          title={title}
          setDescription={setDescription}
          description={description}
          handleCancel={handleCancel}
        />
      ) : (
        <div
          className="flex h-full border-2 justify-center items-center p-2 max-h-20 rounded"
          onClick={() => {
            setOpenCreatingForm(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
        >
          +
        </div>
      )}
    </div>
  );
};
