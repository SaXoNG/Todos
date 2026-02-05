import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type JSX,
} from "react";
import { useTodoStore } from "../storage/todoStore";
import { handleMouseDown } from "../utils/onMouseDown";
import { IconBtn } from "./IconBtn";
import { TextField } from "@mui/material";
import { Loader } from "./Loader";
import type { TodoStatusType, TodoType } from "../types/TodoType";
import type { DragginType } from "../types/DragginType";
import { useUIStore } from "../storage/UIStore";
import { useNotificationStore } from "../storage/notificationStore";

type Props = {
  todo: TodoType;
};

export const TodoItem = ({ todo }: Props): JSX.Element => {
  const { id, title, description } = todo;

  const setIsDruggin = useUIStore((state) => state.setIsDruggin);

  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const updateTodo = useTodoStore((state) => state.updateTodo);
  const updateTodoStatus = useTodoStore((state) => state.updateTodoStatus);
  const updateTodoPosition = useTodoStore((state) => state.updateTodoPosition);

  const loading = useUIStore((state) => state.loading);
  const isDruggin = useUIStore((state) => state.isDruggin);

  const [isUpdating, setIsUpdating] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [dragging, setDragging] = useState<DragginType | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const todoRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(dragging);

  const handleUpdateTodoText = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedTodo = {
      ...todo,
      title: newTitle,
      description: newDescription,
    };

    if (newTitle.length === 0) {
      showNotification({
        type: "error",
        title: "Error",
        text: "Title is required",
      });

      return;
    }

    if (newTitle !== title || newDescription !== description) {
      try {
        setIsUpdating(false);

        await updateTodo(updatedTodo);
      } catch {
        setIsUpdating(true);
        showNotification({
          type: "error",
          title: "Something went wrong!",
          text: "Server error!",
        });
      }
    }
  };

  const handleCancel = () => {
    setIsUpdating(false);
    setNewTitle(title);
    setNewDescription(description);
  };

  useEffect(() => {
    draggingRef.current = dragging;
  }, [dragging]);

  useEffect(() => {
    if (!dragging) return;

    let scrollInterval: number;

    const handleMouseMove = (e: MouseEvent) => {
      setDragging((prev) => {
        if (!prev) return null;

        const columnEl = document
          .elementFromPoint(e.clientX, e.clientY)
          ?.closest("[data-column]") as HTMLElement | null;

        const status = columnEl?.getAttribute("data-column") as TodoStatusType;

        return {
          ...prev,
          x: e.pageX - prev.offsetX,
          y: e.pageY - prev.offsetY,
          status: status || prev.status,
        };
      });
    };

    const handleAutoScroll = () => {
      if (!draggingRef.current) return;

      const column = document.querySelector<HTMLDivElement>(
        `[data-column="${draggingRef.current.status}"]`,
      );
      if (!column) return;

      const SCROLL_SPEED = 10;
      const viewportHeight = window.innerHeight;

      const SCROLL_MARGIN_TOP = viewportHeight * 0.4;
      const SCROLL_MARGIN_BOTTOM = viewportHeight * 0.15;

      const cursorY = draggingRef.current.y - window.scrollY;

      if (cursorY > viewportHeight - SCROLL_MARGIN_BOTTOM) {
        column.scrollTop += SCROLL_SPEED;
      } else if (cursorY < SCROLL_MARGIN_TOP) {
        column.scrollTop -= SCROLL_SPEED;
      }

      scrollInterval = requestAnimationFrame(handleAutoScroll);
    };

    const handleMouseUp = (e: MouseEvent) => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(scrollInterval);

      setIsDruggin(false);

      if (!draggingRef.current) return;

      const columnEl = (e.target as HTMLElement).closest("[data-column]");
      const columnStatus = columnEl?.getAttribute(
        "data-column",
      ) as TodoStatusType | null;
      const newStatus =
        columnStatus || draggingRef.current.status || todo.status;

      const todoEl = (e.target as HTMLElement).closest("[data-position]");
      const targetPosition = todoEl
        ? Number(todoEl.getAttribute("data-position"))
        : null;

      setDragging(null);
      if (todoRef.current) todoRef.current.style.pointerEvents = "";

      if (newStatus === todo.status) {
        updateTodoPosition(todo.id, todo.position, targetPosition);
      } else {
        updateTodoStatus(todo.id, todo.position, targetPosition, newStatus);
      }

      document.body.style.removeProperty("cursor");
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    scrollInterval = requestAnimationFrame(handleAutoScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(scrollInterval);
    };
  }, [dragging, todo, updateTodoStatus, updateTodoPosition, setIsDruggin]);

  const style: CSSProperties = dragging
    ? {
        position: "absolute",
        backgroundColor: "#6B7280",
        cursor: "grabbing",
        width: dragging.width,
        left: dragging.x,
        top: dragging.y,
        zIndex: 1000,
        pointerEvents: "none",
      }
    : { cursor: isDruggin ? "grabbing" : "grab" };

  return (
    <>
      {isUpdating ? (
        <form
          noValidate
          onSubmit={handleUpdateTodoText}
          className="flex flex-col gap-2 bg-gray-400 p-2 rounded"
        >
          <div className="flex w-full justify-between items-center">
            <div>
              <TextField
                ref={inputRef}
                label="Title"
                variant="outlined"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                      borderWidth: 2,
                    },
                    "&:hover fieldset": {
                      borderColor: "#134e4a",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#134e4a",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#134e4a",
                  },
                }}
              />
            </div>

            <div className="flex gap-2">
              <IconBtn icon="cancel" onClick={() => handleCancel()} />
              <IconBtn type="submit" icon="done" />
            </div>
          </div>
          <div>
            <TextField
              label="Description"
              variant="outlined"
              multiline
              minRows={1}
              maxRows={8}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "black",
                    borderWidth: 2,
                  },
                  "&:hover fieldset": {
                    borderColor: "#134e4a",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#134e4a",
                  },
                },
                "& .MuiInputBase-input": {
                  fontWeight: 400,
                  fontSize: "14px",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#134e4a",
                },
              }}
            />
          </div>
        </form>
      ) : (
        <div
          ref={todoRef}
          onMouseDown={(e) =>
            handleMouseDown(e, todoRef.current, setDragging, setIsDruggin)
          }
          style={style}
          className="relative background-transtion flex flex-col gap-2 bg-gray-400 p-2 rounded"
        >
          {loading === todo.id && <Loader />}

          <div className="flex justify-between items-start">
            <div className="text-xl font-semibold break-words whitespace-normal max-w-[80%] px-2">
              {title}
            </div>
            <div className="flex gap-1">
              <IconBtn
                icon="edit"
                onClick={() => {
                  setIsUpdating(true);
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
              />
              <IconBtn icon="delete" onClick={() => deleteTodo(id)} />
            </div>
          </div>
          <div className="px-2 break-words">{description}</div>
        </div>
      )}
    </>
  );
};
