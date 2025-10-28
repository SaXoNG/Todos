import { create } from "zustand";
import axios from "axios";
import { NotificationType } from "../types/NotificationType";
import { clearNotifinicationTimeout } from "../components/Notification";
import { reorderTodos } from "../utils/reorderTodos";
import { TodoListType } from "../types/TodoListType";
import { TodoStatusType, TodoType } from "../types/TodoType";

type LoadingType =
  | "createTodo"
  | string //todoID
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
  addTodo: (title: TodoType) => void;
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

const BASE_URL = "http://localhost:5000/api";

export const useTodoStore = create<TodoState>((set, get) => ({
  todosList: null,
  notification: null,
  loading: true,
  isDruggin: false,
  setLoading: (value) => set({ loading: value }),
  setIsDruggin: (value) => set({ isDruggin: value }),
  showNotification: (notification) => {
    set({ notification: notification });

    setTimeout(() => set({ notification: null }), clearNotifinicationTimeout);
  },

  hideNotification: () => {
    set({ notification: null });
  },

  fetchTodoList: async (listID) => {
    set({ loading: true });

    try {
      const res = await axios.get(`${BASE_URL}/todos/${listID}`);
      set({ todosList: res.data });

      localStorage.clear();
      localStorage.setItem("listID", listID);
    } catch (error) {
      console.error("Error fetching todo list from server:", error);
      set({
        notification: {
          title: "Error!!!",
          text: "List doesn't exist!",
          type: "error",
        },
      });

      setTimeout(() => {
        set({ notification: null });
      }, clearNotifinicationTimeout);
    }

    set({ loading: false, notification: null });
  },

  createTodoList: async (listTitle) => {
    if (listTitle.length < 1) {
      set({
        notification: {
          title: "Error",
          text: "Title lenght 1 char minimum",
          type: "error",
        },
      });

      setTimeout(() => {
        set({
          notification: null,
        });
      }, clearNotifinicationTimeout);

      return;
    }

    set({ loading: true });

    try {
      const res = await axios.post(`${BASE_URL}/lists`, {
        title: listTitle,
      });
      set({
        todosList: { ...res.data, todos: [] },
        notification: {
          title: "New list created. Save this ID!!!",
          text: res.data.id,
          type: "success",
        },
      });

      localStorage.clear();
      localStorage.setItem("listID", res.data.id);
    } catch (error) {
      console.error("Error creating new todo list on server:", error);
      set({
        todosList: { id: null, title: "Something went wrong!!!", todos: null },
      });
    }

    set({ loading: false });
  },

  addTodo: async (todo) => {
    const currListData = get().todosList;
    if (!currListData || !currListData.id) return;

    set({ loading: "createTodo" });

    try {
      const res = await axios.post(
        `${BASE_URL}/todos/${currListData.id}`,
        todo
      );

      set({
        loading: "createTodo",
        todosList: {
          ...currListData,
          todos: [res.data, ...(currListData.todos || [])],
        },
      });
    } catch (error) {
      console.error("Error adding todo to server:", error);
      set({
        todosList: { ...currListData },
        notification: {
          title: "Something went wrong!",
          text: "Server error",
          type: "error",
        },
      });
    }

    set({ loading: false });
  },

  deleteTodo: async (todoId) => {
    const currListData = get().todosList;
    if (!currListData || !currListData.id || !currListData.todos) return;

    set({ loading: todoId });
    set({
      todosList: {
        ...currListData,
        todos: [...currListData.todos.filter((todo) => todo.id !== todoId)],
      },
    });

    try {
      await axios.delete(`${BASE_URL}/todos/${currListData.id}/${todoId}`);
    } catch (error) {
      console.error("Error deleting todo from server:", error);
      set({
        notification: {
          title: "Something went wrong!",
          text: "Server error",
          type: "error",
        },
      });
    }

    set({ loading: false });
  },

  updateTodo: async (updatedTodo) => {
    const { id } = updatedTodo;
    const listID = get().todosList?.id;
    const curTodoList = get().todosList;

    if (curTodoList?.todos) {
      set({
        loading: updatedTodo.id,
        todosList: {
          ...curTodoList,
          todos: curTodoList.todos.map((todo) =>
            todo.id === id ? updatedTodo : todo
          ),
        },
      });

      try {
        await axios.put(`${BASE_URL}/todos/${listID}/${id}`, updatedTodo);
      } catch (error) {
        console.error("Error updating todo on server:", error);
        set({
          todosList: { ...curTodoList },
        });
      }
    }

    set({ loading: false });
  },

  updateTodoStatus: async (
    todoId,
    selectedPosition,
    targetPosition,
    newStatus
  ) => {
    const curTodoList = get().todosList;
    if (!curTodoList?.todos) return;

    const prevTodos = curTodoList.todos.map((t) => ({ ...t }));

    const todos = reorderTodos(
      todoId,
      curTodoList.todos.map((t) => ({ ...t })),
      selectedPosition,
      targetPosition
    );

    if (newStatus) {
      todos.forEach((t: TodoType) => {
        if (t.id === todoId) t.status = newStatus;
      });
    }

    const newTodos = todos.sort(
      (a: TodoType, b: TodoType) => a.position - b.position
    );

    set({
      loading: todoId,
      todosList: {
        ...curTodoList,
        todos: newTodos,
      },
    });

    try {
      const updatedTodo = get().todosList?.todos?.find(
        (todo) => todo.id === todoId
      );
      const listId = get().todosList;

      if (!updatedTodo) {
        console.error("Todo not found for id:", todoId);
        return;
      }

      await axios.put(`${BASE_URL}/todos/${listId?.id}/${todoId}`, updatedTodo);
      await axios.put(`${BASE_URL}/todos/${curTodoList.id}/reorder`, newTodos);
    } catch (error) {
      console.error(error);
      set({
        notification: {
          title: "Server error",
          text: "Something went wrong, try again!",
          type: "error",
        },
        todosList: {
          ...curTodoList,
          todos: prevTodos,
        },
      });
    }

    set({ loading: false });
  },

  updateTodoPosition: async (
    todoId: string,
    selectedPosition: number,
    targetPosition: number | null
  ) => {
    const curTodoList = get().todosList;
    if (!curTodoList?.todos) return;

    const prevTodos = curTodoList.todos.map((t) => ({ ...t }));
    const todos = reorderTodos(
      todoId,
      curTodoList.todos.map((t) => ({ ...t })),
      selectedPosition,
      targetPosition
    );

    const newTodos = todos.sort(
      (a: TodoType, b: TodoType) => a.position - b.position
    );

    const newOrder = newTodos.map((t: { id: string; position: number }) => ({
      id: t.id,
      position: t.position,
    }));

    set({
      loading: todoId,
      todosList: {
        ...curTodoList,
        todos: newTodos,
      },
    });

    try {
      await axios.put(`${BASE_URL}/todos/${curTodoList.id}/reorder`, newOrder);
    } catch (error) {
      console.error("Error updating todo order on server:", error);
      set({
        todosList: {
          ...curTodoList,
          todos: prevTodos,
        },
      });
    }

    set({ loading: false });
  },
}));
