"use client";

import { Button, TextField } from "@mui/material";
import { useTodoStore } from "../storage/todoStore";
import { Loader } from "./Loader";
import { useRef, useState, type JSX } from "react";
import type { TodoType } from "../types/TodoType";

export const CreateTodo = (): JSX.Element => {
  const { loading, addTodo } = useTodoStore();
  const [creatingTodo, setCreatingTodo] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTodo: TodoType = {
      id: crypto.randomUUID(),
      position: 0,
      title,
      description,
      status: "todo",
    };

    try {
      await addTodo(newTodo);

      setCreatingTodo(false);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const handleCancel = () => {
    setCreatingTodo(false);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="pt-5" data-position={-1}>
      {creatingTodo ? (
        <form
          className="flex flex-col bg-gray-400 p-3 gap-2 rounded"
          onSubmit={handleSubmit}
        >
          <h1 className="text-center text-xl">New Todo</h1>
          <TextField
            label="Title"
            inputRef={inputRef}
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
          <TextField
            label="Description"
            variant="outlined"
            multiline
            minRows={1}
            maxRows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
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
                },
              },
              "& .MuiInputBase-input": {
                fontWeight: 400,
                fontSize: "14px",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#134e4a",
              },
            }}
          />
          <div className="flex w-ful gap-2">
            <Button
              type="button"
              variant="outlined"
              color="primary"
              sx={{
                width: "100%",
                border: "2px solid black",
                borderColor: "black",
                color: "black",
                fontWeight: "bold",
              }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              disabled={title.length === 0 || !!loading}
              sx={{
                width: "100%",
                border: "2px solid black",
                borderColor: "black",
                color: "black",
                fontWeight: "bold",
              }}
            >
              {loading === "createTodo" && <Loader />}
              Add todo
            </Button>
          </div>
        </form>
      ) : (
        <div
          className="flex h-full border-2 justify-center items-center p-2 max-h-20 rounded"
          onClick={() => (
            setCreatingTodo(true),
            setTimeout(() => inputRef.current?.focus(), 0)
          )}
        >
          +
        </div>
      )}
    </div>
  );
};
