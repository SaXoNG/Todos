export type TodoStatusType = "todo" | "in_process" | "completed";

export interface TodoType {
  id: string;
  listID?: string;
  position: number;
  title: string;
  status: TodoStatusType;
  description: string;
}
