import { Box, Stack, Typography, Button } from "@mui/material";
import { useTodoStore } from "../../storage/todoStore";
import { useSavedListsStore } from "../../storage/savedListsStore";
import { useLoadingStore } from "../../storage/loadingStore";

export type SavedListsProps = {
  onClose: () => void;
};

export const SavedListsModal = ({ onClose }: SavedListsProps) => {
  const fetchTodoList = useTodoStore((state) => state.fetchTodoList);
  const deleteTodolist = useTodoStore((state) => state.deleteTodolist);
  const listInfo = useTodoStore((state) => state.listInfo);
  const savedLists = useSavedListsStore((state) => state.savedLists);
  const loadingIDs = useLoadingStore((state) => state.loadingIDs);

  const handleLoad = (id: string | null) => {
    if (id && id !== listInfo?.id) {
      fetchTodoList(id);
    }

    onClose();
  };

  const handleDelete = async (id: string | null) => {
    if (id) {
      await deleteTodolist(id);
    }
  };

  return savedLists.length === 0 ? (
    <Typography textAlign="center">No saved lists yet.</Typography>
  ) : (
    <Stack
      spacing={2}
      sx={{
        maxHeight: 400,
        overflowY: "auto",
        pr: 1,
      }}
    >
      {savedLists.map((list) => (
        <Box
          key={list.id}
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div>
            <Typography fontWeight={500}>{list.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {list.id}
            </Typography>
          </div>
          <Stack direction="row" spacing={1}>
            <Button
              key="load"
              size="small"
              variant="outlined"
              onClick={() => handleLoad(list.id)}
              sx={{
                borderColor: "#388e3c",
                color: "#388e3c",
              }}
            >
              Load
            </Button>
            <Button
              key="delete"
              size="small"
              variant="outlined"
              color="error"
              loading={loadingIDs.includes(String(list.id))}
              onClick={() => handleDelete(list.id)}
            >
              Delete
            </Button>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};
