"use client";

import { useNotificationStore } from "../storage/notificationStore";

export const clearNotifinicationTimeout = 3000;

export const Notification = () => {
  const notification = useNotificationStore((state) => state.notification);

  if (!notification) {
    return null;
  }

  return (
    <div
      className="absolute  max-w-[30%] top-2 left-2 p-3 rounded"
      style={{
        backgroundColor: notification.type === "error" ? "#B91C1C" : "#16A34A",
      }}
    >
      <p className="text-lg text-center mb-1">{notification.title}</p>
      <p className="text-lg">{notification.text}</p>
    </div>
  );
};
