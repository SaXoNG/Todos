export enum TODO_STATUS {
  TODO = "todo",
  IN_PROCESS = "in_process",
  COMPLETED = "completed",
}

export interface TodoType {
  id: string;
  listID?: string;
  position: number;
  title: string;
  status: TODO_STATUS;
  description: string;
}
