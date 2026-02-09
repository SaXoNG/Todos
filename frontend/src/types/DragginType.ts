import type { TODO_STATUS } from "./TodoType";

export type DragginType = null | {
  width: number;
  offsetX: number;
  offsetY: number;
  x: number;
  y: number;
  status: TODO_STATUS;
};
