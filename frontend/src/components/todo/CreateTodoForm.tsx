import { Button, TextField } from "@mui/material";
import { Loader } from "../Loader";
import { useLoadingStore } from "../../storage/loadingStore";

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
  const creatingTodoLoading = useLoadingStore((state) => state.creatingTodoLoading);

  return (
    <form
      className="flex flex-col bg-gray-400 p-3 gap-2 rounded"
      onSubmit={handleSubmit}
    >
      <h1 className="text-center text-xl">New Todo</h1>
      <TextField
        className="autofill-fix"
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
              borderColor: "black",
            },
            "&.Mui-focused fieldset": {
              borderColor: "black",
            },
          },
          "& .MuiInputBase-input": {
            color: "black",
            "&::placeholder": {
              color: "#555555 !important",
              opacity: 1,
            },
          },
          "& .MuiInputLabel-root": {
            color: "#000 !important",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "black",
          },
          "& .MuiInputLabel-root.MuiInputLabel-shrink": {
            color: "black",
          },
        }}
        placeholder="Enter title"
      />

      <TextField
        className="autofill-fix"
        label="Description"
        variant="outlined"
        multiline
        minRows={1}
        maxRows={8}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        placeholder="Enter description"
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "black",
              borderWidth: 2,
            },
            "&:hover fieldset": {
              borderColor: "black",
            },
            "&.Mui-focused fieldset": {
              borderColor: "black",
            },
          },
          "& .MuiInputBase-input": {
            fontWeight: 400,
            fontSize: "16px",
            color: "black",
            "&::placeholder": {
              color: "#555555 !important",
              opacity: 1,
            },
          },
          "& .MuiInputLabel-root": {
            color: "#000 !important",
            opacity: 1,
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "black",
            "&::placeholder": {
              color: "#555555 !important",
              opacity: 1,
            },
          },
          "& .MuiInputLabel-root.MuiInputLabel-shrink": {
            color: "black",
          },
        }}
      />

      <div className="flex w-ful gap-2">
        <Button
          type="button"
          variant="outlined"
          color="primary"
          disableRipple
          disableFocusRipple
          sx={{
            width: "100%",
            border: "2px solid black",
            borderColor: "black",
            color: "black",
            fontWeight: "bold",
            bgcolor: "#9CA3AF",
            "&:hover": { bgcolor: "#6B7280" },
            "&:active": { bgcolor: "#4B5563" },
            "&:focus-visible": { bgcolor: "#4B5563" },
            transition: "background-color 0.2s ease-in-out",
          }}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          disabled={title.length === 0 || creatingTodoLoading}
          disableRipple
          disableFocusRipple
          sx={{
            width: "100%",
            border: "2px solid black",
            borderColor: "black",
            color: "black",
            fontWeight: "bold",
            bgcolor: "#9CA3AF",
            "&:hover": { bgcolor: "#6B7280" },
            "&:active": { bgcolor: "#4B5563" },
            "&:focus-visible": { bgcolor: "#4B5563" },
            transition: "background-color 0.2s ease-in-out",
          }}
        >
          {creatingTodoLoading ? <Loader /> : "Add todo"}
        </Button>
      </div>
    </form>
  );
};
