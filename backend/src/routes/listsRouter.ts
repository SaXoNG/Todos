import { Router } from "express";

import {
  getLists,
  createList,
  getList,
  deleteList,
} from "../controllers/lists";
import { validateListId } from "../middleware/list/validateListId";
import createListValidation from "../middleware/list/createListValidation";

const listsRouter = Router();

listsRouter.route("/").get(getLists).post(createListValidation, createList);
listsRouter
  .route("/:listId")
  .get(validateListId, getList)
  .delete(validateListId, deleteList);

export default listsRouter;
