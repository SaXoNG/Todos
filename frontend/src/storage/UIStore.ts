import { create } from "zustand";

interface UIStoreType {
  globalLoading: boolean;
  creatingTodo: boolean;
  loadingTodoId: string | null;

  setGlobalLoading: (value: boolean) => void;
  setCreatingTodo: (value: boolean) => void;
  setLoadingTodoId: (id: string | null) => void;
}

export const useUIStore = create<UIStoreType>((set) => ({
  globalLoading: false,
  creatingTodo: false,
  loadingTodoId: null,

  setGlobalLoading: (value) => set({ globalLoading: value }),
  setCreatingTodo: (value) => set({ creatingTodo: value }),
  setLoadingTodoId: (id) => set({ loadingTodoId: id }),
}));
