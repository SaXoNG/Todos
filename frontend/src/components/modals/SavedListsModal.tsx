import { Box, Stack, Typography, Button } from "@mui/material";
import { useTodoStore } from "../../storage/todoStore";
import { useSavedListsStore } from "../../storage/savedListsStore";
import type { ListInfoType } from "../../types/TodoListType";

export type SavedListsProps = {
  allLists: ListInfoType[];
  onClose: () => void;
};

export const SavedListsModal = ({ allLists, onClose }: SavedListsProps) => {
  const fetchTodoList = useTodoStore((state) => state.fetchTodoList);
  const deleteTodolist = useTodoStore((state) => state.deleteTodolist);
  const listInfo = useTodoStore((state) => state.listInfo);

  const handleLoad = (id: string | null) => {
    if (id && id !== listInfo?.id) {
      fetchTodoList(id);
    }

    onClose();
  };

  const handleDelete = async (id: string | null) => {
    if (id) {
      onClose();
      await deleteTodolist(id);
      useSavedListsStore.getState().removeList(id);
    }
  };

  return allLists.length === 0 ? (
    <Typography textAlign="center">No saved lists yet.</Typography>
  ) : (
    <Stack spacing={2}>
      {allLists.map((list) => (
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
              size="small"
              variant="outlined"
              onClick={() => handleLoad(list.id)}
            >
              Load
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
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
