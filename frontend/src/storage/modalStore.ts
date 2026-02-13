import { create } from "zustand";

type ModalData =
  | {
      type: "createListSuccess";
      id: string;
      title: string;
      description?: string;
    }
  | {
      type: "savedLists";
      title: string;
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
