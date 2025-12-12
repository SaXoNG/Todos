import { create } from "zustand";

type LoadingType =
  | "createTodo"
  | string // todoID
  | boolean;

interface UIStoreType {
  isDruggin: boolean;
  loading: LoadingType;
  setLoading: (value: LoadingType) => void;
  setIsDruggin: (value: boolean) => void;
}

export const useUIStore = create<UIStoreType>((set) => ({
  todosList: null,
  loading: true,
  isDruggin: false,
  setLoading: (value) => set({ loading: value }),
  setIsDruggin: (value) => set({ isDruggin: value }),
}));
