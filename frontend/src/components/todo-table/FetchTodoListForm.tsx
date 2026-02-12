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
        className="autofill-fix"
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

      <Button
        type="submit"
        variant="outlined"
        color="primary"
        disabled={listID.length === 0}
        disableRipple
        disableFocusRipple
        sx={{
          width: "auto",
          border: "2px solid black",
          borderColor: "black",
          color: "black",
          fontWeight: "bold",
          "&:hover": { bgcolor: "#15803d" },
          "&:active": { bgcolor: "#166534" },
          "&:focus-visible": { bgcolor: "#166534" },
        }}
      >
        Find list
      </Button>
    </form>
  );
};
