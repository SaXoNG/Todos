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
    beforeId: string | null,
    targetId: string | null,
    newStatus: TODO_STATUS,
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

      localStorage.removeItem("listId");
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
    beforeId: string | null,
    targetId: string | null,
    newStatus: TODO_STATUS,
  ) => {
    const currTodos = get().todos;
    if (!currTodos) {
      return;
    }

    const prevTodos = currTodos.map((t) => ({ ...t }));
    const todoToUpdate = currTodos.find((todo) => todo.id === todoId);
    const preparedPayload: MoveTodoPayload = { todoId };

    if (beforeId) {
      preparedPayload.beforeId = beforeId;
    }

    if (targetId) {
      preparedPayload.afterId = targetId;
    }

    if (newStatus !== todoToUpdate?.status) {
      preparedPayload.status = newStatus;
    }

    try {
      useUIStore.getState().setLoadingTodoId(todoId);

      const { data: updatedTodo } = await api.patch(
        `/todos/${todoId}/move`,
        preparedPayload,
      );

      set({
        todos: prevTodos
          .map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
          .sort((t1, t2) => t1.position - t2.position),
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
