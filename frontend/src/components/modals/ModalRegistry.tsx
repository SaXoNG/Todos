export type ModalType = "createListSuccess" | "savedLists";

export type ModalData = {
  [K in keyof ModalPropsMap]: { type: K } & ModalPropsMap[K];
}[keyof ModalPropsMap];

export type ModalPropsMap = {
  createListSuccess: {
    id: string;
    title: string;
    description?: string;
  };
  savedLists: {
    title: string;
  };
};

import type { ComponentType } from "react";
import { CreateListModal } from "./CreateListModal";
import { SavedListsModal } from "./SavedListsModal";

type ModalComponent<T extends ModalType> = ComponentType<
  ModalPropsMap[T] & { onClose: () => void }
>;

export const modalRegistry: {
  [K in ModalType]: ModalComponent<K>;
} = {
  createListSuccess: CreateListModal,
  savedLists: SavedListsModal,
};
