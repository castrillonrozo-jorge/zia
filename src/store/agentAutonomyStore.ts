import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AutonomyLevel } from '../types';

// Nivel de autonomía por agente (clave = type del agente usado en las pantallas)
// - 'sugerir':  el agente solo recomienda; nunca ejecuta.
// - 'aprobar':  el agente prepara la acción y pide autorización explícita (default).
// - 'autonomo': el agente ejecuta solo, dentro de un límite máximo por operación.

interface AgentAutonomyStore {
  levels: Record<string, AutonomyLevel>;
  limits: Record<string, number>; // límite máximo por operación en modo autónomo
  setLevel: (agentType: string, level: AutonomyLevel) => void;
  setLimit: (agentType: string, limit: number) => void;
  getSummary: () => { agent: string; nivel: AutonomyLevel; limiteAutonomo: number }[];
}

const AGENT_TYPES = [
  'pagador',
  'ahorrador',
  'inversor',
  'monitoreo',
  'negociador',
  'anti_inflacion',
  'metas',
  'recordatorio',
];

const defaultLevels: Record<string, AutonomyLevel> = Object.fromEntries(
  AGENT_TYPES.map((t) => [t, 'aprobar' as AutonomyLevel])
);

const defaultLimits: Record<string, number> = Object.fromEntries(
  AGENT_TYPES.map((t) => [t, 100])
);

export const useAgentAutonomyStore = create<AgentAutonomyStore>()(
  persist(
    (set, get) => ({
      levels: defaultLevels,
      limits: defaultLimits,

      setLevel: (agentType, level) =>
        set((state) => ({
          levels: { ...state.levels, [agentType]: level },
        })),

      setLimit: (agentType, limit) =>
        set((state) => ({
          limits: { ...state.limits, [agentType]: Math.max(0, limit) },
        })),

      getSummary: () =>
        AGENT_TYPES.map((t) => ({
          agent: t,
          nivel: get().levels[t] ?? 'aprobar',
          limiteAutonomo: get().limits[t] ?? 100,
        })),
    }),
    { name: 'midas_agent_autonomy' }
  )
);
