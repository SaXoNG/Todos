import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ListInfoType } from "../types/TodoListType";

interface SavedListsState {
  savedLists: ListInfoType[];

  addOrMoveToFront: (list: ListInfoType) => void;
  removeList: (id: string) => void;
  clearLists: () => void;
}

export const useSavedListsStore = create<SavedListsState>()(
  persist(
    (set, get) => ({
      savedLists: [],

      addOrMoveToFront: (list) => {
        const filtered = get().savedLists.filter((l) => l.id !== list.id);

        set({
          savedLists: [list, ...filtered],
        });
      },

      removeList: (id) => {
        set({
          savedLists: get().savedLists.filter((l) => l.id !== id),
        });
      },

      clearLists: () => {
        set({ savedLists: [] });
      },
    }),
    {
      name: "saved-lists-storage",
    },
  ),
);
