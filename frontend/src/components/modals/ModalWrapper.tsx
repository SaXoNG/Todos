import { Modal, Box, Typography, Stack } from "@mui/material";
import type { ReactNode } from "react";

type ModalWrapperProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
  actions?: ReactNode;
  width?: number;
};

export const ModalWrapper = ({
  open,
  title,
  onClose,
  children,
  actions,
  width = 520,
}: ModalWrapperProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute" as const,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width,
          maxWidth: "90%",
          bgcolor: "#e0f2e9",
          borderRadius: 3,
          p: 4,
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        {title && (
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={3}
            color="#2e7d32"
            textAlign="center"
          >
            {title}
          </Typography>
        )}

        <Box mb={actions ? 3 : 0}>{children}</Box>

        {actions && (
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            {actions}
          </Stack>
        )}
      </Box>
    </Modal>
  );
};
