import { useState } from "react";
import { useTodoStore } from "../../storage/todoStore";
import { useNotificationStore } from "../../storage/notificationStore";
import { isValidObjectId } from "../../utils/isValidObjectId";
import { FetchTodoListForm } from "../todo-table/FetchTodoListForm";
import { CreateTodoListForm } from "../todo-table/CreateTodoListForm";
import { ShowAllListsButton } from "./showAllListsButton";

export const Topbar = () => {
  const todosList = useTodoStore((state) => state.listInfo);
  const fetchTodoList = useTodoStore((state) => state.fetchTodoList);
  const createTodoList = useTodoStore((state) => state.createTodoList);

  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  const [listID, setListID] = useState("");
  const [listTitle, setListTitle] = useState("");

  const handleFetchList = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (listID === todosList?.id) {
      showNotification({
        title: "List already opened",
        text: "You are already viewing this list.",
        type: "warning",
      });

      setListID("");

      return;
    }

    if (!isValidObjectId(listID)) {
      showNotification({
        title: "Invalid listID",
        text: "Example: 69ad0aab277e57185e486c75",
        type: "error",
      });

      return;
    }

    try {
      await fetchTodoList(listID);
      setListID("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (listTitle.trim().length < 3) {
      showNotification({
        title: "Min length is 3 chars",
        type: "warning",
      });

      return;
    }

    if (listTitle.length > 50) {
      showNotification({
        title: "Max length is 50 chars",
        type: "warning",
      });

      return;
    }

    try {
      await createTodoList(listTitle);
      setListTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative p-4 flex justify-between bg-green-500">
      <div className="flex gap-2 z-10">
        <FetchTodoListForm
          handleFetchList={handleFetchList}
          listID={listID}
          setListID={setListID}
        />
        <ShowAllListsButton />
      </div>
      <h3 className="absolute left-50 right-50 text-center text-4xl font-bold">
        {todosList?.title}
      </h3>
      <div className="z-10">
        <CreateTodoListForm
          handleCreate={handleCreate}
          listTitle={listTitle}
          setListTitle={setListTitle}
        />
      </div>
    </div>
  );
};
