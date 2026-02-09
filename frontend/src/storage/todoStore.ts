import { create } from "zustand";

import type { ListInfoType } from "../types/TodoListType";
import { useNotificationStore } from "./notificationStore";
import { useUIStore } from "./UIStore";
import type { CreateTodoPayload } from "../types/CreateTodoPayload";
import type { TodoType, TODO_STATUS } from "../types/TodoType";
import type { MoveTodoPayload } from "../types/moveTodoPayload";
import { api } from "../api/axios";

interface TodosState {
  listInfo: ListInfoType | null;
  todos: TodoType[];
  fetchTodoList: (listID: string) => void;
  createTodoList: (value: string) => void;
  createTodo: (todo: CreateTodoPayload) => void;
  deleteTodo: (value: string) => void;
  updateTodoText: (value: TodoType) => void;
  moveTodo: (
    todoId: string,
    targetId: string | null,
    newStatus?: TODO_STATUS,
  ) => void;
}

export const useTodoStore = create<TodosState>((set, get) => ({
  listInfo: null,
  todos: [],
  fetchTodoList: async (listID) => {
    useUIStore.getState().setGlobalLoading(true);

    try {
      const res = await api.get(`/lists/${listID}`);
      const { id, title, todos } = res.data;

      set({
        listInfo: {
          id,
          title: title,
        },
        todos: todos,
      });

      localStorage.setItem("listId", id);
    } catch (err) {
      console.error("Error fetching todo list from server:", err);

      useNotificationStore.getState().showNotification({
        title: "Error!",
        text: "List doesn't exist or is empty",
        type: "error",
      });
    } finally {
      useUIStore.getState().setGlobalLoading(false);
    }
  },

  createTodoList: async (listTitle) => {
    try {
      useUIStore.getState().setGlobalLoading(true);

      const res = await api.post(`/lists`, {
        title: listTitle,
      });

      const { id, title } = res.data;

      set({ listInfo: { id, title }, todos: [] });

      useNotificationStore.getState().showNotification({
        title: "New list created. Save this ID!!!",
        text: id,
        type: "success",
      });

      localStorage.setItem("listId", id);
    } catch (error) {
      console.error("Error creating new todo list:", error);

      useNotificationStore.getState().showNotification({
        title: "Something went wrong",
        text: "Todo List creation went wrong, try again later!",
        type: "error",
      });
    } finally {
      useUIStore.getState().setGlobalLoading(false);
    }
  },

  createTodo: async (todo) => {
    const currListData = get().listInfo;
    const currTodos = get().todos;

    try {
      useUIStore.getState().setCreatingTodo(true);
      const { data } = await api.post(`/todos/${currListData?.id}`, todo);

      set({
        todos: [data, ...currTodos],
      });
    } catch (error) {
      console.error("Error adding todo to server:", error);

      useNotificationStore.getState().showNotification({
        title: "Server error",
        text: "Could not add todo",
        type: "error",
      });
    } finally {
      useUIStore.getState().setCreatingTodo(false);
    }
  },

  deleteTodo: async (todoId) => {
    const currTodos = get().todos;

    try {
      useUIStore.getState().setLoadingTodoId(todoId);

      await api.delete(`/todos/${todoId}`);

      set({
        todos: currTodos.filter((t) => t.id !== todoId),
      });
    } catch (error) {
      console.error("Error deleting todo from server:", error);

      useNotificationStore.getState().showNotification({
        title: "Server error",
        text: "Could not delete todo",
        type: "error",
      });

      set({ todos: currTodos });
    } finally {
      useUIStore.getState().setLoadingTodoId(null);
    }
  },

  updateTodoText: async (updatedTodo) => {
    const { id, title, description } = updatedTodo;
    const currTodos = get().todos;

    set({ todos: currTodos.map((t) => (t.id === id ? updatedTodo : t)) });

    try {
      useUIStore.getState().setLoadingTodoId(id);

      await api.patch(`/todos/${id}`, { title, description });
    } catch (error) {
      console.error("Error updating todo on server:", error);
      set({ todos: currTodos });
    } finally {
      useUIStore.getState().setLoadingTodoId(null);
    }
  },

  moveTodo: async (
    todoId: string,
    targetId: string | null,
    newStatus?: TODO_STATUS,
  ) => {
    const currTodos = get().todos;
    if (!currTodos) {
      return;
    }

    const prevTodos = currTodos.map((t) => ({ ...t }));

    const todoToUpdate = currTodos.find((t) => t.id === todoId);
    if (!todoToUpdate) {
      return;
    }

    const targetStatus = newStatus ?? todoToUpdate.status;

    const filteredTodos = currTodos
      .filter((t) => t.id !== todoId && t.status === targetStatus)
      .sort((a, b) => a.position - b.position);

    const preparedPayload: MoveTodoPayload = { todoId };

    let beforeTodo: TodoType | null = null;
    let afterTodo: TodoType | null = null;

    if (targetId) {
      afterTodo = filteredTodos.find((t) => t.id === targetId) ?? null;

      if (afterTodo) {
        const index = filteredTodos.findIndex((t) => t.id === targetId);
        beforeTodo = index > 0 ? filteredTodos[index - 1] : null;

        preparedPayload.afterId = afterTodo.id;
        if (beforeTodo) {
          preparedPayload.beforeId = beforeTodo.id;
        }
      }
    } else if (filteredTodos.length > 0) {
      beforeTodo = filteredTodos[filteredTodos.length - 1];
      preparedPayload.beforeId = beforeTodo.id;
    }

    let newPosition: number;

    if (beforeTodo && afterTodo) {
      newPosition = (beforeTodo.position + afterTodo.position) / 2;
    } else if (!beforeTodo && afterTodo) {
      newPosition = afterTodo.position - 1000;
    } else if (beforeTodo && !afterTodo) {
      newPosition = beforeTodo.position + 1000;
    } else {
      newPosition = 0;
    }

    if (newStatus !== undefined && newStatus !== todoToUpdate.status) {
      preparedPayload.status = newStatus;
    }

    const optimisticTodos = currTodos.map((t) =>
      t.id === todoId
        ? {
            ...t,
            position: newPosition,
            status: newStatus ? newStatus : t.status,
          }
        : t,
    );

    set({ todos: optimisticTodos });

    try {
      useUIStore.getState().setLoadingTodoId(todoId);

      const { data: updatedTodo } = await api.patch(
        `/todos/${todoId}/move`,
        preparedPayload,
      );

      set({
        todos: get().todos?.map((t) =>
          t.id === updatedTodo.id ? updatedTodo : t,
        ),
      });
    } catch (error) {
      console.error("Error updating todo:", error);
      set({ todos: prevTodos });

      useNotificationStore.getState().showNotification({
        title: "Server error",
        text: "Could not update todo",
        type: "error",
      });
    } finally {
      useUIStore.getState().setLoadingTodoId(null);
    }
  },
}));
