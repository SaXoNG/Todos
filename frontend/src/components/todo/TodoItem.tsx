"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type JSX,
} from "react";
import { useTodoStore } from "../../storage/todoStore";
import { IconBtn } from "../IconBtn";
import { Loader } from "../Loader";
import type { TODO_STATUS, TodoType } from "../../types/TodoType";
import type { DragginType } from "../../types/DragginType";
import { useUIStore } from "../../storage/UIStore";
import { useNotificationStore } from "../../storage/notificationStore";
import { TodoEditForm } from "./TodoEditForm";

type Props = {
  todo: TodoType;
};

export const TodoItem = ({ todo }: Props): JSX.Element => {
  const { id, title, description, status } = todo;

  const setIsDragging = useUIStore((state) => state.setIsDragging);
  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );
  const loadingTodoId = useUIStore((state) => state.loadingTodoId);
  const isDragging = useUIStore((state) => state.isDragging);

  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const updateTodoText = useTodoStore((state) => state.updateTodoText);
  const moveTodo = useTodoStore((state) => state.moveTodo);

  const [isEditText, setIsEditText] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [dragging, setDragging] = useState<DragginType | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const todoRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<DragginType | null>(null);
  const scrollIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    draggingRef.current = dragging;
  }, [dragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.button === 2) return;

    const target = e.target as HTMLElement;
    if (target.closest("button")) return;

    setIsDragging(true);

    if (todoRef.current) {
      const rect = todoRef.current.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      const columnEl = target.closest("[data-column]") as HTMLElement | null;
      const statusAttr = columnEl?.getAttribute("data-column") as
        | TODO_STATUS
        | undefined;

      setDragging({
        width: rect.width,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
        x: rect.left + scrollX,
        y: rect.top + scrollY,
        status: statusAttr || status,
      });

      todoRef.current.style.pointerEvents = "none";
    }

    document.body.style.setProperty("cursor", "grabbing", "important");
  };

  const handleMouseMove = (e: MouseEvent) => {
    setDragging((prev) => {
      if (!prev) return null;

      const columnEl = document
        .elementFromPoint(e.clientX, e.clientY)
        ?.closest("[data-column]") as HTMLElement | null;
      const statusAttr = columnEl?.getAttribute("data-column") as
        | TODO_STATUS
        | undefined;

      return {
        ...prev,
        x: e.pageX - prev.offsetX,
        y: e.pageY - prev.offsetY,
        status: statusAttr || prev.status,
      };
    });
  };

  const handleAutoScroll = useCallback(() => {
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

    scrollIntervalRef.current = requestAnimationFrame(handleAutoScroll);
  }, []);

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      if (scrollIntervalRef.current !== null) {
        cancelAnimationFrame(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }

      setIsDragging(false);

      if (!draggingRef.current) {
        return;
      }

      const columnEl = (e.target as HTMLElement).closest("[data-column]");
      const todoEl = (e.target as HTMLElement).closest("[data-id]");
      const targetTodoId = todoEl?.getAttribute("data-id") || null;

      if (targetTodoId === id || !columnEl) {
        setDragging(null);
        if (todoRef.current) todoRef.current.style.pointerEvents = "";
        document.body.style.removeProperty("cursor");
        return;
      }

      const columnStatus = columnEl.getAttribute(
        "data-column",
      ) as TODO_STATUS | null;
      const newStatus = columnStatus || draggingRef.current.status || status;

      setDragging(null);
      if (todoRef.current) todoRef.current.style.pointerEvents = "";

      moveTodo(id, targetTodoId, newStatus);

      document.body.style.removeProperty("cursor");
    },
    [id, setIsDragging, status, moveTodo],
  );

  useEffect(() => {
    if (!dragging) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    scrollIntervalRef.current = requestAnimationFrame(handleAutoScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      if (scrollIntervalRef.current !== null) {
        cancelAnimationFrame(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };
  }, [dragging, handleAutoScroll, handleMouseUp]);

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
    : { cursor: isDragging ? "grabbing" : "grab" };

  const isDraggingThisTodo = dragging !== null;

  return (
    <>
      {isEditText ? (
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
        <>
          {isDraggingThisTodo && (
            <div
              style={{
                height: todoRef.current?.offsetHeight || 60,
                width: "100%",
                pointerEvents: "none",
                opacity: 0,
              }}
              data-id={id}
            />
          )}

          <div
            ref={todoRef}
            onMouseDown={handleMouseDown}
            style={style}
            className="relative background-transtion flex flex-col gap-2 bg-gray-400 p-2 rounded"
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
        </>
      )}
    </>
  );
};
