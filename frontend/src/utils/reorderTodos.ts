import type { TodoType } from "../types/TodoType";

export function reorderTodos(
  todoId: string,
  todos: TodoType[],
  selectedPosition: number,
  targetPosition: number | null
) {
  if (targetPosition === null) {
    const maxPosition = Math.max(...todos.map((t) => t.position));
    todos.forEach((t) => {
      if (t.id === todoId) t.position = maxPosition + 1;
    });
  } else if (targetPosition === -1) {
    todos.forEach((t) => {
      if (t.id === todoId) {
        t.position = 0;
      } else {
        t.position += 1;
      }
    });
  } else {
    todos.forEach((t) => {
      if (t.id === todoId) {
        t.position = targetPosition + 1;
      } else if (selectedPosition < targetPosition) {
        if (t.position > selectedPosition && t.position <= targetPosition)
          t.position -= 1;
      } else if (selectedPosition > targetPosition) {
        if (t.position >= targetPosition + 1 && t.position < selectedPosition)
          t.position += 1;
      }
    });
  }

  return todos;
}
