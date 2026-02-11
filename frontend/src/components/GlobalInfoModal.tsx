import { Modal, Box, Typography, Button, Stack } from "@mui/material";
import { useTodoStore } from "../storage/todoStore";
import { useModalStore } from "../storage/modalStore";
import { useState } from "react";

export const GlobalInfoModal = () => {
  const { data, closeModal } = useModalStore();
  const [copyButtonText, setCopyButtonText] = useState("Copy ID");
  const fetchTodoList = useTodoStore((state) => state.fetchTodoList);

  if (!data) return null;

  const handleLoadList = (id: string | null) => {
    if (id) {
      fetchTodoList(id);
    }

    closeModal();
  };

  return (
    <Modal open={!!data} onClose={closeModal}>
      <Box
        sx={{
          position: "absolute" as const,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          maxWidth: "90%",
          bgcolor: "#e0f2e9",
          borderRadius: 3,
          p: 5,
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3} color="#2e7d32">
          {data.title}
        </Typography>

        {data.type === "single" && (
          <>
            <Typography variant="body1" mb={3} sx={{ whiteSpace: "pre-line" }}>
              {data.description}
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={closeModal}>
                Close
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: "#43a047", "&:hover": { bgcolor: "#2e7d32" } }}
                onClick={() => {
                  navigator.clipboard.writeText(data.id);
                  setCopyButtonText("Copied");
                }}
              >
                {copyButtonText}
              </Button>
            </Stack>
          </>
        )}

        {data.type === "allLists" && (
          <>
            <Stack spacing={2} mb={3}>
              {data.allLists.length === 0 ? (
                <Typography>No saved lists yet.</Typography>
              ) : (
                <div className="flex flex-col gap-2">
                  {data.allLists.map((list) => (
                    <Box
                      key={list.id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography fontWeight="500">{list.title}</Typography>

                      <Typography variant="body2" color="text.secondary">
                        {list.id}
                      </Typography>

                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: "#43a047",
                          color: "#43a047",
                        }}
                        onClick={() => handleLoadList(list.id)}
                      >
                        Load
                      </Button>
                    </Box>
                  ))}
                </div>
              )}
            </Stack>

            <Stack direction="row" justifyContent="flex-end">
              <Button
                variant="contained"
                sx={{ bgcolor: "#43a047", "&:hover": { bgcolor: "#2e7d32" } }}
                onClick={closeModal}
              >
                Close
              </Button>
            </Stack>
          </>
        )}
      </Box>
    </Modal>
  );
};
