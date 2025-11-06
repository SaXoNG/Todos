import type { TodoStatusType } from "./TodoType";

export type DragginType = null | {
  width: number;
  offsetX: number;
  offsetY: number;
  x: number;
  y: number;
  status: TodoStatusType;
};
