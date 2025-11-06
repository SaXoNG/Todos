import { create } from "zustand";
import axios from "axios";
import { clearNotifinicationTimeout } from "../components/Notification";
import type { TodoListType } from "../types/TodoListType";
import type { NotificationType } from "../types/NotificationType";
import type { TodoStatusType, TodoType } from "../types/TodoType";
import { reorderTodos } from "../utils/reorderTodos";

type LoadingType =
  | "createTodo"
  | string // todoID
  | boolean;

interface TodoState {
  isDruggin: boolean;
  todosList: TodoListType | null;
  notification: NotificationType | null;
  loading: LoadingType;
  setLoading: (value: LoadingType) => void;
  setIsDruggin: (value: boolean) => void;
  showNotification: (value: NotificationType | null) => void;
  hideNotification: () => void;
  fetchTodoList: (listID: string) => void;
  createTodoList: (value: string) => void;
  addTodo: (todo: TodoType) => void;
  deleteTodo: (value: string) => void;
  updateTodo: (value: TodoType) => void;
  updateTodoStatus: (
    todoId: string,
    selectedPosition: number,
    targetPosition: number | null,
    newStatus?: TodoStatusType
  ) => void;
  updateTodoPosition: (
    todoId: string,
    selectedPosition: number,
    targetPosition: number | null
  ) => void;
}

const BASE_URL = import.meta.env.VITE_API_URL;;

export const useTodoStore = create<TodoState>((set, get) => ({
  todosList: null,
  notification: null,
  loading: true,
  isDruggin: false,
  setLoading: (value) => set({ loading: value }),
  setIsDruggin: (value) => set({ isDruggin: value }),
  showNotification: (notification) => {
    set({ notification });
    setTimeout(() => set({ notification: null }), clearNotifinicationTimeout);
  },
  hideNotification: () => set({ notification: null }),

  fetchTodoList: async (listID) => {
    set({ loading: true });
    try {
      const res = await axios.get(`${BASE_URL}/api/todos/${listID}`);
      console.log(res);

      set({
        todosList: {
          id: listID,
          title: res.data.title,
          todos: res.data.todos || [],
          ...res.data,
        },
      });
      localStorage.setItem("listID", listID);
    } catch (error) {
      console.error("Error fetching todo list from server:", error);
      set({
        todosList: { id: listID, title: "", todos: [] },
        notification: {
          title: "Error!!!",
          text: "List doesn't exist or is empty",
          type: "error",
        },
      });
      setTimeout(() => set({ notification: null }), clearNotifinicationTimeout);
    } finally {
      set({ loading: false });
    }
  },

  createTodoList: async (listTitle) => {
    if (!listTitle || listTitle.length < 1) {
      set({
        notification: {
          title: "Error",
          text: "Title must be at least 1 character",
          type: "error",
        },
      });
      setTimeout(() => set({ notification: null }), clearNotifinicationTimeout);
      return;
    }

    set({ loading: true });

    try {
      const res = await axios.post(`${BASE_URL}/api/lists`, {
        title: listTitle,
      });

      set({
        todosList: { id: res.data.id, title: res.data.title, todos: [] },
        notification: {
          title: "New list created. Save this ID!!!",
          text: res.data.id,
          type: "success",
        },
      });
      localStorage.setItem("listID", res.data.id);
    } catch (error) {
      console.error("Error creating new todo list:", error);
      set({
        todosList: { id: null, title: "Something went wrong!", todos: [] },
      });
    } finally {
      set({ loading: false });
    }
  },

  addTodo: async (todo) => {
    const currListData = get().todosList;

    if (!currListData || !currListData.id) return;

    console.log("something");
    set({ loading: "createTodo" });

    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/todos/${currListData.id}`,
        todo
      );

      set({
        todosList: {
          ...currListData,
          todos: [data, ...(currListData.todos || [])],
        },
      });
    } catch (error) {
      console.error("Error adding todo to server:", error);
      set({
        notification: {
          title: "Server error",
          text: "Could not add todo",
          type: "error",
        },
      });
    } finally {
      set({ loading: false });
    }
  },

  deleteTodo: async (todoId) => {
    const currListData = get().todosList;
    if (!currListData || !currListData.id || !currListData.todos) return;

    set({ loading: todoId });
    set({
      todosList: {
        ...currListData,
        todos: currListData.todos.filter((t) => t.id !== todoId),
      },
    });

    try {
      await axios.delete(`${BASE_URL}/api/todos/${currListData.id}/${todoId}`);
    } catch (error) {
      console.error("Error deleting todo from server:", error);
      set({
        notification: {
          title: "Server error",
          text: "Could not delete todo",
          type: "error",
        },
      });
      set({
        todosList: { ...currListData },
      });
    } finally {
      set({ loading: false });
    }
  },

  updateTodo: async (updatedTodo) => {
    const { id } = updatedTodo;
    const listID = get().todosList?.id;
    const curTodoList = get().todosList;
    if (!curTodoList?.todos || !listID) return;

    set({
      loading: id,
      todosList: {
        ...curTodoList,
        todos: curTodoList.todos.map((t) => (t.id === id ? updatedTodo : t)),
      },
    });

    try {
      await axios.put(`${BASE_URL}/api/todos/${listID}/${id}`, updatedTodo);
    } catch (error) {
      console.error("Error updating todo on server:", error);
      set({ todosList: curTodoList });
    } finally {
      set({ loading: false });
    }
  },

  updateTodoStatus: async (
    todoId: string,
    selectedPosition: number,
    targetPosition: number | null,
    newStatus?: TodoStatusType
  ) => {
    const curTodoList = get().todosList;
    if (!curTodoList?.todos || !curTodoList.id) return;

    const prevTodos = curTodoList.todos.map((t) => ({ ...t }));

    const todos = reorderTodos(
      todoId,
      [...curTodoList.todos],
      selectedPosition,
      targetPosition
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

    set({ loading: todoId, todosList: { ...curTodoList, todos: newTodos } });

    try {
      const updatedTodo = newTodos.find((t) => t.id === todoId);
      if (!updatedTodo) throw new Error("Todo not found");

      console.log(updatedTodo);

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
        orderPayload
      );
    } catch (error) {
      console.error("Error updating todo status:", error);
      set({
        todosList: { ...curTodoList, todos: prevTodos },
        notification: {
          title: "Server error",
          text: "Could not update status",
          type: "error",
        },
      });
    } finally {
      set({ loading: false });
    }
  },

  updateTodoPosition: async (todoId, selectedPosition, targetPosition) => {
    const curTodoList = get().todosList;
    if (!curTodoList?.todos || !curTodoList.id) return;

    const prevTodos = [...curTodoList.todos];
    const todos = reorderTodos(
      todoId,
      [...curTodoList.todos],
      selectedPosition,
      targetPosition
    );
    const newTodos = todos.sort((a, b) => a.position - b.position);

    set({ loading: todoId, todosList: { ...curTodoList, todos: newTodos } });

    try {
      const orderPayload = newTodos.map((t) => ({
        id: t.id,
        position: t.position,
      }));
      await axios.put(
        `${BASE_URL}/api/todos/${curTodoList.id}/reorder`,
        orderPayload
      );
    } catch (error) {
      console.error(error);
      set({
        todosList: { ...curTodoList, todos: prevTodos },
        notification: {
          title: "Server error",
          text: "Could not update position",
          type: "error",
        },
      });
    } finally {
      set({ loading: false });
    }
  },
}));
