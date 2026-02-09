import { create } from "zustand";

interface UIStoreType {
  isDragging: boolean;

  globalLoading: boolean;
  creatingTodo: boolean;
  loadingTodoId: string | null;

  setGlobalLoading: (value: boolean) => void;
  setCreatingTodo: (value: boolean) => void;
  setLoadingTodoId: (id: string | null) => void;
  setIsDragging: (value: boolean) => void;
}

export const useUIStore = create<UIStoreType>((set) => ({
  isDragging: false,

  globalLoading: false,
  creatingTodo: false,
  loadingTodoId: null,

  setGlobalLoading: (value) => set({ globalLoading: value }),
  setCreatingTodo: (value) => set({ creatingTodo: value }),
  setLoadingTodoId: (id) => set({ loadingTodoId: id }),
  setIsDragging: (value) => set({ isDragging: value }),
}));
