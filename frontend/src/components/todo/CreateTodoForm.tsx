import { Button, TextField } from "@mui/material";
import { Loader } from "../Loader";
import { useUIStore } from "../../storage/UIStore";

type Props = {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  handleCancel: () => void;
};

export const CreateTodoForm = ({
  handleSubmit,
  inputRef,
  setTitle,
  title,
  setDescription,
  description,
  handleCancel,
}: Props) => {
  const creatingTodo = useUIStore((state) => state.creatingTodo);

  return (
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
          disabled={title.length === 0 || creatingTodo}
          sx={{
            width: "100%",
            border: "2px solid black",
            borderColor: "black",
            color: "black",
            fontWeight: "bold",
          }}
        >
          {creatingTodo ? <Loader /> : "Add todo"}
        </Button>
      </div>
    </form>
  );
};
