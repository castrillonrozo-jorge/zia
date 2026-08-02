import { Lightbulb, UserCheck, Zap } from 'lucide-react';
import { AutonomyLevel } from '../types';
import { useAgentAutonomyStore } from '../store/agentAutonomyStore';

const LEVELS: { value: AutonomyLevel; label: string; icon: React.ReactNode; hint: string }[] = [
  { value: 'sugerir', label: 'Sugerir', icon: <Lightbulb size={13} />, hint: 'Solo recomienda, nunca ejecuta' },
  { value: 'aprobar', label: 'Aprobar', icon: <UserCheck size={13} />, hint: 'Prepara la acción y pide tu autorización' },
  { value: 'autonomo', label: 'Autónomo', icon: <Zap size={13} />, hint: 'Ejecuta solo dentro de tu límite' },
];

export function AutonomySelector({ agentType, compact = false }: { agentType: string; compact?: boolean }) {
  const level = useAgentAutonomyStore((s) => s.levels[agentType] ?? 'aprobar');
  const limit = useAgentAutonomyStore((s) => s.limits[agentType] ?? 100);
  const setLevel = useAgentAutonomyStore((s) => s.setLevel);
  const setLimit = useAgentAutonomyStore((s) => s.setLimit);

  const active = LEVELS.find((l) => l.value === level)!;

  return (
    <div className="w-full" onClick={(e) => e.stopPropagation()}>
      <div className="flex rounded-full bg-bg-bubble-jarvis border border-border-subtle p-0.5 gap-0.5">
        {LEVELS.map((l) => {
          const isActive = l.value === level;
          return (
            <button
              key={l.value}
              onClick={() => setLevel(agentType, l.value)}
              title={l.hint}
              aria-pressed={isActive}
              className={`flex-1 flex items-center justify-center gap-1 rounded-full py-1 px-1 transition-all text-[10px] font-bold tracking-wide ${
                isActive
                  ? 'bg-gold-primary text-black shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {l.icon}
              {!compact && <span>{l.label}</span>}
            </button>
          );
        })}
      </div>
      {!compact && (
        <p className="text-[10px] text-text-secondary mt-1.5 text-center leading-tight">
          {level === 'autonomo' ? `${active.hint} · máx $${limit} por operación` : active.hint}
        </p>
      )}
      {!compact && level === 'autonomo' && (
        <div className="mt-2 flex items-center justify-center gap-2">
          <label htmlFor={`limite-${agentType}`} className="text-[10px] text-text-secondary font-bold uppercase tracking-wide">
            Límite autónomo por operación
          </label>
          <div className="flex items-center gap-1 bg-bg-bubble-jarvis border border-border-subtle rounded-full px-2.5 py-1">
            <span className="text-[11px] font-bold text-text-secondary">$</span>
            <input
              id={`limite-${agentType}`}
              type="number"
              inputMode="decimal"
              min={0}
              value={limit}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (Number.isFinite(n)) setLimit(agentType, n);
              }}
              className="w-16 bg-transparent border-none outline-none text-[11px] font-bold text-text-primary"
            />
          </div>
        </div>
      )}
    </div>
  );
}
