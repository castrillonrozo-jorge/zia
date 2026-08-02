import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Notificaciones reales: cada entrada nace de un evento verdadero de la app
// (regla de ahorro ejecutada, transferencia a Bóveda, agente activado, banco
// vinculado). Nada de datos de utilería.

export interface AppNotification {
  id: string;
  title: string;
  text: string;
  date: string; // ISO
  read: boolean;
}

interface NotificationsStore {
  items: AppNotification[];
  add: (title: string, text: string) => void;
  markAllRead: () => void;
  clear: () => void;
}

const newId = () =>
  Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);

export const useNotificationsStore = create<NotificationsStore>()(
  persist(
    (set) => ({
      items: [],
      add: (title, text) =>
        set((s) => ({
          items: [
            { id: newId(), title, text, date: new Date().toISOString(), read: false },
            ...s.items,
          ].slice(0, 30), // conservamos las 30 más recientes
        })),
      markAllRead: () =>
        set((s) => ({ items: s.items.map((n) => ({ ...n, read: true })) })),
      clear: () => set({ items: [] }),
    }),
    { name: 'midas_notifications' }
  )
);
