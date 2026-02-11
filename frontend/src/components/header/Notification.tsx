import { useEffect, useRef } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useNotificationStore } from "../../storage/notificationStore";
import type { NotificationType } from "../../types/NotificationType";

export const clearNotificationTimeout = 3000;

export const Notification = () => {
  const notification = useNotificationStore((state) => state.notification);
  const hideNotification = useNotificationStore(
    (state) => state.hideNotification,
  );

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!notification) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      hideNotification();
      timeoutRef.current = null;
    }, clearNotificationTimeout);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [notification, hideNotification]);

  if (!notification) return null;

  const severityMap: Record<
    NotificationType["type"],
    "success" | "error" | "warning"
  > = {
    success: "success",
    error: "error",
    warning: "warning",
  };

  return (
    <Snackbar
      open={!!notification}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      onClose={hideNotification}
    >
      <Alert
        onClose={hideNotification}
        severity={severityMap[notification.type]}
        variant="filled"
        sx={{ minWidth: 250, maxWidth: 400, fontSize: "1rem" }}
      >
        {notification.title && <strong>{notification.title}</strong>}
        {notification.text && <div>{notification.text}</div>}
      </Alert>
    </Snackbar>
  );
};
