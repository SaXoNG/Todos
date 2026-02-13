import { Typography, Button, Stack } from "@mui/material";
import { useNotificationStore } from "../../storage/notificationStore";

export type SingleModalProps = {
  id: string;
  description?: string;
  onClose: () => void;
};

export const CreateListModal = ({
  id,
  description,
  onClose,
}: SingleModalProps) => {
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
        <Button
          variant="contained"
          onClick={() => {
            navigator.clipboard.writeText(id);
            useNotificationStore
              .getState()
              .showNotification({ type: "success", title: "ID was copied" });
          }}
          sx={{
            backgroundColor: "#388e3c",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#2e7d32",
            },
          }}
        >
          Copy
        </Button>
      </Stack>
    </>
  );
};
