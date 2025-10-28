"use client";

import { JSX, useState } from "react";
import { useTodoStore } from "../storage/todoStore";
import { clearNotifinicationTimeout } from "./Notification";
import { Button, TextField } from "@mui/material";

export const Topbar = (): JSX.Element => {
  const {
    todosList,
    fetchTodoList,
    createTodoList,
    showNotification,
    hideNotification,
  } = useTodoStore();
  const [listID, setListID] = useState("");
  const [createdListTitle, setCreatedListTitle] = useState("");

  const handleFetchList = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

    const isValidUUID = (value: string) => uuidRegex.test(value);

    if (!isValidUUID(listID)) {
      showNotification({
        title: "Invalid listID",
        text: "Example: 9cbe7d38-4eab-46c3-bd95-53624e5b6d51",
        type: "error",
      });

      setTimeout(() => {
        hideNotification();
      }, clearNotifinicationTimeout);

      return;
    }

    fetchTodoList(listID);
    setListID("");
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTodoList(createdListTitle);
    setCreatedListTitle("");
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
          disabled={createdListTitle.length === 0}
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
          value={createdListTitle}
          onChange={(e) => setCreatedListTitle(e.target.value)}
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
