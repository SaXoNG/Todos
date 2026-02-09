import { TODO_STATUS } from "../types/TODO_STATUS";

export default function isValidStatus(status: string): status is TODO_STATUS {
  return Object.values(TODO_STATUS).includes(status as TODO_STATUS);
}
