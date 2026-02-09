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
  );
};
