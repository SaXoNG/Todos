export type ModalType = "single" | "allLists";

export type ModalData = {
  [K in keyof ModalPropsMap]: { type: K } & ModalPropsMap[K];
}[keyof ModalPropsMap];

export type ModalPropsMap = {
  single: {
    id: string;
    title: string;
    description?: string;
  };
  allLists: {
    title: string;
    allLists: ListInfoType[];
  };
};

import type { ComponentType } from "react";
import type { ListInfoType } from "../../types/TodoListType";
import { SingleTodoContent } from "./SingleModal";
import { SavedListsModal } from "./SavedListsModal";

type ModalComponent<T extends ModalType> = ComponentType<
  ModalPropsMap[T] & { onClose: () => void }
>;

export const modalRegistry: {
  [K in ModalType]: ModalComponent<K>;
} = {
  single: SingleTodoContent,
  allLists: SavedListsModal,
};
