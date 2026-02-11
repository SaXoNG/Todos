import { Button, TextField } from "@mui/material";

type Props = {
  handleCreate: (e: React.FormEvent<HTMLFormElement>) => void;
  listTitle: string;
  setListTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const CreateTodoListForm = ({
  handleCreate,
  listTitle,
  setListTitle,
}: Props) => {
  return (
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
        className="autofill-fix"
        label="New List Title"
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
            opacity: 1,
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "black",
          },
          "& .MuiInputLabel-root.MuiInputLabel-shrink": {
            color: "black",
          },
        }}
      />
    </form>
  );
};
