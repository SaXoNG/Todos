import type { ListInfoType } from "../types/TodoListType";

export const addOrMoveListToFront = (id: string, title: string) => {
  const stored = localStorage.getItem("savedLists");
  const savedLists: ListInfoType[] = stored ? JSON.parse(stored) : [];

  const filtered = savedLists.filter((l) => l.id !== id);

  filtered.unshift({ id, title });

  localStorage.setItem("savedLists", JSON.stringify(filtered));
};
