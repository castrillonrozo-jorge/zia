import { useUserProfileStore } from '../store/userProfileStore';
import { useAgentAutonomyStore } from '../store/agentAutonomyStore';

// Regla "Págate Primero" del Agente Ahorrador.
// Se dispara cuando el usuario registra un ingreso, y actúa según el
// nivel de autonomía configurado para 'ahorrador':
//   sugerir  → solo devuelve la recomendación (Jarvis la propone).
//   aprobar  → prepara la transferencia y pide autorización (default).
//   autonomo → ejecuta de inmediato si el monto ≤ límite; si lo supera,
//              cae a modo 'aprobar' automáticamente.

export const SAVINGS_RATE = 0.15;

export type SavingsRuleOutcome =
  | { action: 'none' }
  | { action: 'suggest'; amount: number; rate: number }
  | { action: 'propose'; amount: number; rate: number; reason?: string }
  | { action: 'executed'; amount: number; rate: number; newVaultTotal: number; available: number };

export function applySavingsRule(incomeAmount: number): SavingsRuleOutcome {
  const income = Number(incomeAmount) || 0;
  if (income <= 0) return { action: 'none' };

  const amount = Math.round(income * SAVINGS_RATE * 100) / 100;
  if (amount <= 0) return { action: 'none' };

  const autonomy = useAgentAutonomyStore.getState();
  const level = autonomy.levels['ahorrador'] ?? 'aprobar';
  const limit = autonomy.limits['ahorrador'] ?? 100;

  if (level === 'sugerir') {
    return { action: 'suggest', amount, rate: SAVINGS_RATE };
  }

  if (level === 'autonomo') {
    if (amount <= limit) {
      const result = useUserProfileStore
        .getState()
        .transferToVault(amount, `Regla Págate Primero (${SAVINGS_RATE * 100}% del ingreso)`);
      return { action: 'executed', amount, rate: SAVINGS_RATE, ...result };
    }
    return {
      action: 'propose',
      amount,
      rate: SAVINGS_RATE,
      reason: `El apartado ($${amount}) supera tu límite autónomo ($${limit}); requiere tu aprobación.`,
    };
  }

  return { action: 'propose', amount, rate: SAVINGS_RATE };
}
