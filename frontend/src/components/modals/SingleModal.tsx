import { Typography, Button, Stack } from "@mui/material";
import { useState } from "react";
import { useSavedListsStore } from "../../storage/savedListsStore";

export type SingleModalProps = {
  id: string;
  description?: string;
  onClose: () => void;
};

export const SingleTodoContent = ({
  id,
  description,
  onClose,
}: SingleModalProps) => {
  const savedLists = useSavedListsStore((state) => state.savedLists);
  const [copyText, setCopyText] = useState("Copy ID");

  return (
    <>
      <Typography
        variant="body1"
        sx={{ whiteSpace: "pre-line" }}
        textAlign="center"
      >
        {description}
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="space-around" mt={3}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: "#388e3c",
            color: "#388e3c",
          }}
        >
          Close
        </Button>
        {savedLists.find((t) => t.id === id) && (
          <Button
            variant="contained"
            onClick={() => {
              navigator.clipboard.writeText(id);
              setCopyText("Copied");
            }}
            sx={{
              backgroundColor: "#388e3c",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#2e7d32",
              },
            }}
          >
            {copyText}
          </Button>
        )}
      </Stack>
    </>
  );
};
