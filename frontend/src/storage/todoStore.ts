import { create } from "zustand";
import axios from "axios";
import type { ListInfoType } from "../types/TodoListType";
import type { TodoStatusType, TodoType } from "../types/TodoType";
import { reorderTodos } from "../utils/reorderTodos";
import { useNotificationStore } from "./notificationStore";
import { useUIStore } from "./UIStore";

interface TodoState {
  listInfo: ListInfoType | null;
  todos: TodoType[];
  fetchTodoList: (listID: string) => void;
  createTodoList: (value: string) => void;
  addTodo: (todo: TodoType) => void;
  deleteTodo: (value: string) => void;
  updateTodo: (value: TodoType) => void;
  updateTodoStatus: (
    todoId: string,
    selectedPosition: number,
    targetPosition: number | null,
    newStatus?: TodoStatusType,
  ) => void;
  updateTodoPosition: (
    todoId: string,
    selectedPosition: number,
    targetPosition: number | null,
  ) => void;
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const useTodoStore = create<TodoState>((set, get) => ({
  listInfo: null,
  todos: [],
  fetchTodoList: async (listID) => {
    useUIStore.getState().setLoading(true);

    try {
      const res = await axios.get(`${BASE_URL}/api/todos/${listID}`);

      const { listId, title, todos } = res.data;

      set({
        listInfo: {
          id: listId,
          title: title,
        },
        todos: todos,
      });

      localStorage.setItem("listID", listId);
    } catch (err) {
      console.error("Error fetching todo list from server:", err);

      useNotificationStore.getState().showNotification({
        title: "Error!",
        text: "List doesn't exist or is empty",
        type: "error",
      });
    } finally {
      useUIStore.getState().setLoading(false);
    }
  },

  createTodoList: async (listTitle) => {
    if (listTitle.length < 3) {
      useNotificationStore.getState().showNotification({
        title: "Error!",
        text: "Title must be at least 3 character",
        type: "error",
      });

      return;
    }

    try {
      useUIStore.getState().setLoading(true);

      const res = await axios.post(`${BASE_URL}/api/lists`, {
        title: listTitle,
      });
      const { id, title } = res.data;

      set({ listInfo: { id, title } });

      useNotificationStore.getState().showNotification({
        title: "New list created. Save this ID!!!",
        text: id,
        type: "success",
      });

      localStorage.setItem("listID", id);
    } catch (error) {
      console.error("Error creating new todo list:", error);

      useNotificationStore.getState().showNotification({
        title: "Something went wrong",
        text: "Todo List creation went wrong, try again later!",
        type: "error",
      });
    } finally {
      useUIStore.getState().setLoading(false);
    }
  },

  addTodo: async (todo) => {
    const currListData = get().listInfo;
    const currTodos = get().todos;

    if (!currListData) {
      return;
    }

    try {
      useUIStore.getState().setLoading("createTodo");
      const { data } = await axios.post(
        `${BASE_URL}/api/todos/${currListData.id}`,
        todo,
      );

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
      useUIStore.getState().setLoading(false);
    }
  },

  deleteTodo: async (todoId) => {
    const currListData = get().listInfo;
    const currTodos = get().todos;

    if (!currListData) {
      return;
    }

    try {
      useUIStore.getState().setLoading(todoId);

      await axios.delete(`${BASE_URL}/api/todos/${currListData.id}/${todoId}`);

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
      useUIStore.getState().setLoading(false);
    }
  },

  updateTodo: async (updatedTodo) => {
    const { id } = updatedTodo;
    const curTodoList = get().listInfo;
    const listID = curTodoList?.id;
    const currTodos = get().todos;

    if (!currTodos || !listID) {
      return;
    }

    useUIStore.getState().setLoading(id);

    set({ todos: currTodos.map((t) => (t.id === id ? updatedTodo : t)) });

    try {
      await axios.put(`${BASE_URL}/api/todos/${listID}/${id}`, updatedTodo);
    } catch (error) {
      console.error("Error updating todo on server:", error);
      set({ todos: currTodos });
    } finally {
      useUIStore.getState().setLoading(false);
    }
  },

  updateTodoStatus: async (
    todoId: string,
    selectedPosition: number,
    targetPosition: number | null,
    newStatus?: TodoStatusType,
  ) => {
    const curTodoList = get().listInfo;
    const curListId = curTodoList?.id;
    const currTodos = get().todos;

    if (!currTodos || !curListId) {
      return;
    }

    const prevTodos = currTodos.map((t) => ({ ...t }));

    const todos = reorderTodos(
      todoId,
      currTodos,
      selectedPosition,
      targetPosition,
    );

    if (newStatus) {
      if (!["todo", "in_process", "completed"].includes(newStatus)) {
        console.error("Invalid status:", newStatus);
        return;
      }
      todos.forEach((t) => {
        if (t.id === todoId) t.status = newStatus;
      });
    }

    const newTodos = todos.sort((a, b) => a.position - b.position);

    useUIStore.getState().setLoading(todoId);

    set({ todos: newTodos });

    try {
      const updatedTodo = newTodos.find((t) => t.id === todoId);
      if (!updatedTodo) throw new Error("Todo not found");

      await axios.put(`${BASE_URL}/api/todos/${curTodoList.id}/${todoId}`, {
        title: updatedTodo.title,
        description: updatedTodo.description,
        status: updatedTodo.status,
      });

      const orderPayload = newTodos.map((t) => ({
        id: t.id,
        position: t.position,
      }));
      await axios.put(
        `${BASE_URL}/api/todos/${curTodoList.id}/reorder`,
        orderPayload,
      );
    } catch (error) {
      console.error("Error updating todo status:", error);
      set({ todos: prevTodos });

      useNotificationStore.getState().showNotification({
        title: "Server error",
        text: "Could not update status",
        type: "error",
      });
    } finally {
      useUIStore.getState().setLoading(false);
    }
  },

  updateTodoPosition: async (todoId, selectedPosition, targetPosition) => {
    const curTodoList = get().listInfo;
    const curListId = curTodoList?.id;
    const currTodos = get().todos;

    if (!currTodos || !curListId) {
      return;
    }

    const prevTodos = currTodos.map((t) => ({ ...t }));
    const newTodos = reorderTodos(
      todoId,
      currTodos,
      selectedPosition,
      targetPosition,
    ).sort((a, b) => a.position - b.position);

    useUIStore.getState().setLoading(todoId);

    set({ todos: newTodos });

    try {
      const orderPayload = newTodos.map((t) => ({
        id: t.id,
        position: t.position,
      }));

      await axios.put(
        `${BASE_URL}/api/todos/${curTodoList.id}/reorder`,
        orderPayload,
      );
    } catch (error) {
      console.error(error);
      set({ todos: prevTodos });

      useNotificationStore.getState().showNotification({
        title: "Server error",
        text: "Could not update position",
        type: "error",
      });
    } finally {
      useUIStore.getState().setLoading(false);
    }
  },
}));
