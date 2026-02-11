import { create } from "zustand";
import type { ListInfoType } from "../types/TodoListType";

type SingleModal = {
  type: "single";
  title: string;
  description: string;
  id: string;
};

type AllListsModal = {
  type: "allLists";
  title: string;
  allLists: ListInfoType[];
};

export type ModalData = SingleModal | AllListsModal;

type ModalStore = {
  data: ModalData | null;
  openModal: (modal: ModalData) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  data: null,
  openModal: (modal) => set({ data: modal }),
  closeModal: () => set({ data: null }),
}));
