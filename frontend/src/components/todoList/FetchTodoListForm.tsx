import { Button, TextField } from "@mui/material";

type Props = {
  handleFetchList: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  listID: string;
  setListID: React.Dispatch<React.SetStateAction<string>>;
};

export const FetchTodoListForm = ({
  handleFetchList,
  listID,
  setListID,
}: Props) => {
  return (
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
  );
};
