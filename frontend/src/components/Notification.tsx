import { useEffect, useRef } from "react";
import { useNotificationStore } from "../storage/notificationStore";
import type { NotificationType } from "../types/NotificationType";
import { Button } from "@mui/material";
import { useModalStore } from "../storage/modalStore";
import type { ListInfoType } from "../types/TodoListType";

export const clearNotifinicationTimeout = 3000;

export const Notification = () => {
  const notification = useNotificationStore((state) => state.notification);
  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );
  const hideNotification = useNotificationStore(
    (state) => state.hideNotification,
  );
  const openModal = useModalStore((state) => state.openModal);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (notification?.type !== "success") {
      const savedLists = localStorage.getItem("savedLists");

      if (savedLists) {
        const savedListsArray: ListInfoType[] = JSON.parse(savedLists);

        timeoutRef.current = setTimeout(() => {
          showNotification({
            type: "success",
            allLists: savedListsArray,
          });
        }, clearNotifinicationTimeout);

        return;
      } else {
        hideNotification();
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [notification, showNotification, hideNotification]);

  if (!notification) {
    return null;
  }

  const notificationColor: Record<NotificationType["type"], string> = {
    error: "#B91C1C",
    success: "#16A34A",
    warning: "#FF8C00",
  };

  const backgroundColor = notificationColor[notification.type];

  return (
    <div
      className="absolute  max-w-[30%] top-2 left-2 p-2 rounded"
      style={{ backgroundColor }}
    >
      {notification.title && (
        <p className="text-lg text-center mb-1">{notification.title}</p>
      )}
      {notification.text && <p className="text-lg">{notification.text}</p>}
      {notification.allLists && (
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: "#43a047",
            color: "#000",
            "&:hover": { bgcolor: "#2e7d32" },
          }}
          onClick={() => {
            openModal({
              type: "allLists",
              title: "Your saved lists",
              allLists: notification.allLists ?? [],
            });
          }}
        >
          Show all lists
        </Button>
      )}
    </div>
  );
};
