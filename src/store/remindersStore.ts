import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Recordatorios financieros reales: los crea el usuario (o Jarvis en su
// nombre), persisten en el dispositivo y se pueden completar o eliminar.

export interface Reminder {
  id: string;
  title: string;
  date: string;   // ISO (solo fecha relevante)
  amount?: number; // monto asociado opcional (ej. pago de tarjeta)
  done: boolean;
}

interface RemindersStore {
  items: Reminder[];
  add: (title: string, date: string, amount?: number) => void;
  toggleDone: (id: string) => void;
  remove: (id: string) => void;
}

const newId = () =>
  Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);

export const useRemindersStore = create<RemindersStore>()(
  persist(
    (set) => ({
      items: [],
      add: (title, date, amount) =>
        set((s) => ({
          items: [...s.items, { id: newId(), title, date, amount, done: false }]
            .sort((a, b) => a.date.localeCompare(b.date)),
        })),
      toggleDone: (id) =>
        set((s) => ({ items: s.items.map((r) => (r.id === id ? { ...r, done: !r.done } : r)) })),
      remove: (id) =>
        set((s) => ({ items: s.items.filter((r) => r.id !== id) })),
    }),
    { name: 'midas_reminders' }
  )
);
