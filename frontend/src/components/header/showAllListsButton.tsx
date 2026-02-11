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
    <div className="absolute max-w-[30%] top-2 left-2 rounded">
      <Button
        variant="contained"
        size="small"
        sx={{
          bgcolor: "#43a047",
          color: "#fff",
          "&:hover": { bgcolor: "#2e7d32" },
          py: 1.5,
          px: 3,
          fontSize: 14,
        }}
        onClick={() => {
          handleClick();
        }}
      >
        View all saved lists on this device
      </Button>
    </div>
  );
};
