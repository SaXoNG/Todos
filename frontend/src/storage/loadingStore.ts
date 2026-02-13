import { create } from "zustand";

interface UIStoreType {
  listFetchLoading: boolean;
  creatingTodoLoading: boolean;
  loadingIDs: string[];

  setListFetchLoading: (value: boolean) => void;
  creatingTodoLoadingToggle: (value: boolean) => void;
  setLoadingItem: (id: string) => void;
  removeLoadingItem: (id: string) => void;
}

export const useLoadingStore = create<UIStoreType>((set, get) => ({
  listFetchLoading: false,
  creatingTodoLoading: false,
  loadingIDs: [],

  setListFetchLoading: (value) => set({ listFetchLoading: value }),
  creatingTodoLoadingToggle: (value) => set({ creatingTodoLoading: value }),
  setLoadingItem: (id: string) => {
    const prevIds = get().loadingIDs;

    set({ loadingIDs: [...prevIds, id] });
  },
  removeLoadingItem: (id: string) => {
    const prevIds = get().loadingIDs;

    set({ loadingIDs: [...prevIds.filter((i) => i !== id)] });
  },
}));
