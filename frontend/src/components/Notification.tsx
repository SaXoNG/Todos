"use client";

import { useEffect, useRef } from "react";
import { useNotificationStore } from "../storage/notificationStore";
import type { NotificationType } from "../types/NotificationType";

export const clearNotifinicationTimeout = 3000;

export const Notification = () => {
  const notification = useNotificationStore((state) => state.notification);
  const hideNotification = useNotificationStore(
    (state) => state.hideNotification,
  );

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (notification?.type !== "success") {
      timeoutRef.current = setTimeout(() => {
        hideNotification();
      }, clearNotifinicationTimeout);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [notification, hideNotification]);

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
      className="absolute  max-w-[30%] top-2 left-2 p-3 rounded"
      style={{ backgroundColor }}
    >
      <p className="text-lg text-center mb-1">{notification.title}</p>
      <p className="text-lg">{notification.text}</p>
    </div>
  );
};
