import { DragginType } from "../types/DragginType";
import { TodoStatusType } from "../types/TodoType";

export function handleMouseDown(
  e: React.MouseEvent,
  todo: HTMLDivElement | null,
  setDragging: (value: DragginType) => void,
  setIsDruggin: (value: boolean) => void
) {
  e.preventDefault();

  if (e.button === 2) {
    return;
  }

  const target = e.target as HTMLElement;
  if (target.closest("button")) return;

  setIsDruggin(true);

  if (todo) {
    const rect = todo.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    const columnEl = target.closest("[data-column]") as HTMLElement | null;
    const status = columnEl?.getAttribute("data-column") as TodoStatusType;

    setDragging({
      width: rect.width,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      x: rect.left + scrollX,
      y: rect.top + scrollY,
      status,
    });

    if (todo) todo.style.pointerEvents = "none";
  }

  document.body.style.setProperty("cursor", "grabbing", "important");
}
