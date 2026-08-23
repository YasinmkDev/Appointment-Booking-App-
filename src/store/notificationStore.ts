import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number; // ms, default 3500
}

interface NotificationState {
  notifications: AppNotification[];
  show: (message: string, type?: NotificationType, duration?: number) => void;
  dismiss: (id: string) => void;
  clear: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],

  show: (message, type = 'info', duration = 3500) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    set((s) => ({ notifications: [...s.notifications, { id, type, message, duration }] }));
    setTimeout(() => get().dismiss(id), duration);
  },

  dismiss: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

  clear: () => set({ notifications: [] }),
}));
