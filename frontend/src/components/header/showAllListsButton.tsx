import { Button } from "@mui/material";
import { useModalStore } from "../../storage/modalStore";

export const ShowAllListsButton = () => {
  const openModal = useModalStore((state) => state.openModal);

  const handleClick = () => {
    openModal({
      type: "savedLists",
      title: "Saved Lists",
    });
  };

  return (
    <Button
      variant="outlined"
      color="primary"
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
      onClick={() => {
        handleClick();
      }}
    >
      Saved lists
    </Button>
  );
};
