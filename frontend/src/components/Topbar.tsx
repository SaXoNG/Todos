import { useState } from "react";
import { useTodoStore } from "../storage/todoStore";
import { useNotificationStore } from "../storage/notificationStore";
import isValidUUID from "../utils/validationListID";
import { FetchTodoListForm } from "./todoList/FetchTodoListForm";
import { CreateTodoListForm } from "./todoList/CreateTodoListForm";

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

    if (!isValidUUID(listID)) {
      showNotification({
        title: "Invalid listID",
        text: "Example: 9cbe7d38-4eab-46c3-bd95-53624e5b6d51",
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
    <div className="flex-shrink-0 p-4 flex items-center bg-green-500">
      <FetchTodoListForm
        handleFetchList={handleFetchList}
        listID={listID}
        setListID={setListID}
      />
      <div className="flex-1 w-full flex jutify-center items-center">
        <h3 className="w-full text-center text-4xl font-bold">
          {todosList?.title}
        </h3>
      </div>
      <CreateTodoListForm
        handleCreate={handleCreate}
        listTitle={listTitle}
        setListTitle={setListTitle}
      />
    </div>
  );
};
