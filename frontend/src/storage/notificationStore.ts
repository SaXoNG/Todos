import { create } from "zustand";
import { clearNotifinicationTimeout } from "../components/Notification";
import type { NotificationType } from "../types/NotificationType";

interface NotificationStoreType {
  notification: NotificationType | null;
  showAndHideNotification: (value: NotificationType | null) => void;
  showNotification: (value: NotificationType | null) => void;
  hideNotification: () => void;
}

export const useNotificationStore = create<NotificationStoreType>((set) => ({
  notification: null,
  showAndHideNotification: (notification) => {
    set({ notification });
    setTimeout(() => set({ notification: null }), clearNotifinicationTimeout);
  },
  showNotification: (notification) => {
    set({ notification });
  },
  hideNotification: () => set({ notification: null }),
}));
