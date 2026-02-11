import type { ListInfoType } from "./TodoListType";

export type NotificationType = {
  title?: string;
  text?: string;
  type: "error" | "success" | "warning";
  allLists?: ListInfoType[];
};
