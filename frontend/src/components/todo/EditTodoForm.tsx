import { TextField } from "@mui/material";
import { IconBtn } from "../IconBtn";

type Props = {
  handleUpdateTodoText: (e: React.FormEvent<HTMLFormElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  newTitle: string;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  handleCancel: () => void;
  newDescription: string;
  setNewDescription: React.Dispatch<React.SetStateAction<string>>;
};

export const EditTodoForm = ({
  handleUpdateTodoText,
  inputRef,
  newTitle,
  setNewTitle,
  handleCancel,
  newDescription,
  setNewDescription,
}: Props) => {
  return (
    <form
      noValidate
      onSubmit={handleUpdateTodoText}
      className="flex flex-col gap-2 bg-gray-400 p-2 rounded"
    >
      <div className="flex w-full justify-between items-center">
        <div>
          <TextField
            className="autofill-fix"
            ref={inputRef}
            label="Title"
            variant="outlined"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
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
                fontWeight: 400,
                fontSize: "14px",
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
        </div>
        <div className="flex gap-2">
          <IconBtn icon="cancel" onClick={handleCancel} />
          <IconBtn type="submit" icon="done" />
        </div>
      </div>

      <div>
        <TextField
          className="autofill-fix"
          label="Description"
          variant="outlined"
          multiline
          minRows={1}
          maxRows={8}
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          fullWidth
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
      </div>
    </form>
  );
};
