"use client";

import { useState, type JSX } from "react";
import { useTodoStore } from "../storage/todoStore";
import { Button, TextField } from "@mui/material";
import { useNotificationStore } from "../storage/notificationStore";
import isValidUUID from "../utils/validationListID";

export const Topbar = (): JSX.Element => {
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

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTodoList(listTitle);
    setListTitle("");
  };

  return (
    <div className="flex-shrink-0 p-4 flex items-center bg-green-500">
      <form
        noValidate
        onSubmit={handleFetchList}
        className="flex-1 flex h-full gap-2"
      >
        <TextField
          label="List ID"
          variant="outlined"
          value={listID}
          onChange={(e) => setListID(e.target.value)}
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "black",
                borderWidth: 2,
              },
              "&:hover fieldset": {
                borderColor: "#134e4a",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#134e4a",
                borderWidth: 2,
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#134e4a",
            },
          }}
        />
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          disabled={listID.length === 0}
          sx={{
            width: "auto",
            border: "2px solid black",
            borderColor: "black",
            color: "black",
            fontWeight: "bold",
          }}
        >
          Find list
        </Button>
      </form>
      <div className="flex-1 w-full flex jutify-center items-center">
        <h3 className="w-full text-center text-4xl font-bold">
          {todosList?.title}
        </h3>
      </div>
      <form
        onSubmit={handleCreate}
        className="flex-1 flex justify-end gap-2 h-full"
      >
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          disabled={listTitle.length === 0}
          sx={{
            width: "auto",
            border: "2px solid black",
            borderColor: "black",
            color: "black",
            fontWeight: "bold",
          }}
        >
          Create list
        </Button>
        <TextField
          label="Title"
          variant="outlined"
          value={listTitle}
          onChange={(e) => setListTitle(e.target.value)}
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "black",
                borderWidth: 2,
              },
              "&:hover fieldset": {
                borderColor: "#134e4a",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#134e4a",
                borderWidth: 2,
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#134e4a",
            },
          }}
        />
      </form>
    </div>
  );
};
