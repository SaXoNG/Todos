import { Button } from "@mui/material";
import { useModalStore } from "../../storage/modalStore";
import { useSavedListsStore } from "../../storage/savedListsStore";

export const ShowAllListsButton = () => {
  const openModal = useModalStore((state) => state.openModal);
  const savedLists = useSavedListsStore((state) => state.savedLists);

  const handleClick = () => {
    openModal({
      type: "allLists",
      title: "Saved Lists",
      allLists: savedLists,
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
