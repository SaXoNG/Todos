import { create } from "zustand";
import { clearNotifinicationTimeout } from "../components/Notification";
import type { NotificationType } from "../types/NotificationType";

interface NotificationStoreType {
  notification: NotificationType | null;
  showNotification: (value: NotificationType | null) => void;
  hideNotification: () => void;
}

export const useNotificationStore = create<NotificationStoreType>((set) => ({
  notification: null,
  showNotification: (notification) => {
    set({ notification });
    setTimeout(() => set({ notification: null }), clearNotifinicationTimeout);
  },
  hideNotification: () => set({ notification: null }),
}));
