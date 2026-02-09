import { Router } from "express";
import {
  createTodo,
  updateTodoText,
  deleteTodo,
  moveTodo,
} from "../controllers/todos";
import createTodoValidation from "../middleware/todo/createTodoValidation";
import updateTodoValidation from "../middleware/todo/updateTodoValidation";
import moveTodoValidation from "../middleware/todo/moveTodoValidation";

const router = Router();

router.route("/:listId").post(createTodoValidation, createTodo);
router
  .route("/:todoId")
  .patch(updateTodoValidation, updateTodoText)
  .delete(deleteTodo);
router.route("/:todoId/move").patch(moveTodoValidation, moveTodo);

export default router;
