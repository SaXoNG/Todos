import { create } from "zustand";
import type { ListInfoType } from "../types/TodoListType";

type ModalData =
  | { type: "single"; id: string; title: string; description?: string }
  | {
      type: "allLists";
      title: string;
      allLists: ListInfoType[];
    };

type ModalStore = {
  data: ModalData | null;
  openModal: (data: ModalData) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  data: null,
  openModal: (data) => set({ data }),
  closeModal: () => set({ data: null }),
}));
