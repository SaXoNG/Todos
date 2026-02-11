import { create } from "zustand";

import type { ListInfoType } from "../types/TodoListType";
import { useNotificationStore } from "./notificationStore";
import { useUIStore } from "./UIStore";
import type { CreateTodoPayload } from "../types/CreateTodoPayload";
import type { TodoType, TODO_STATUS } from "../types/TodoType";
import type { MoveTodoPayload } from "../types/moveTodoPayload";
import { api } from "../api/axios";
import { useModalStore } from "./modalStore";
import { useSavedListsStore } from "./savedListsStore";

interface TodosState {
  listInfo: ListInfoType | null;
  todos: TodoType[];
  fetchTodoList: (listID: string) => void;
  createTodoList: (value: string) => void;
  deleteTodolist: (value: string) => void;
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

      useSavedListsStore.getState().addOrMoveToFront({ id, title });
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

  createTodoList: async (listTitle: string) => {
    const uiStore = useUIStore.getState();
    const modalStore = useModalStore.getState();
    const notificationStore = useNotificationStore.getState();
    const savedListsStore = useSavedListsStore.getState();

    try {
      uiStore.setGlobalLoading(true);

      const res = await api.post("/lists", { title: listTitle });
      const { id, title } = res.data;

      set({ listInfo: { id, title }, todos: [] });

      modalStore.openModal({
        type: "single",
        title: "Your new list is ready! 🎉",
        description: `Here’s the ID: ${id}\nKeep it safe so you can access it anytime.`,
        id,
      });

      savedListsStore.addOrMoveToFront({ id, title });
    } catch (error) {
      console.error("Error creating new todo list:", error);

      notificationStore.showNotification({
        title: "Something went wrong",
        text: "Todo List creation went wrong, try again later!",
        type: "error",
      });
    } finally {
      uiStore.setGlobalLoading(false);
    }
  },

  deleteTodolist: async (listId) => {
    try {
      useUIStore.getState().setGlobalLoading(true);

      await api.delete(`/lists/${listId}`);

      set({ listInfo: null });

      useModalStore.getState().openModal({
        type: "single",
        title: "Your list was deleted!",
        description: ``,
        id: listId,
      });

      useSavedListsStore.getState().removeList(listId);
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
