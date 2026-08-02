import { useUserProfileStore } from '../store/userProfileStore';
import { useAgentAutonomyStore } from '../store/agentAutonomyStore';

// Regla "Págate Primero" del Agente Ahorrador.
// Se dispara cuando el usuario registra un ingreso, y actúa según el
// nivel de autonomía configurado para 'ahorrador':
//   sugerir  → solo devuelve la recomendación (Jarvis la propone).
//   aprobar  → prepara la transferencia y pide autorización (default).
//   autonomo → ejecuta de inmediato si el monto ≤ límite; si lo supera,
//              cae a modo 'aprobar' automáticamente.

export const DEFAULT_SAVINGS_RATE = 0.15;

// El % de "Págate Primero" es configurable desde la pantalla del Ahorrador
// y persiste en el dispositivo. Acotado a [1%, 90%] para evitar absurdos.
export function getSavingsRate(): number {
  const raw = parseFloat(localStorage.getItem('midas_savings_rate') || '');
  if (Number.isFinite(raw) && raw >= 0.01 && raw <= 0.9) return raw;
  return DEFAULT_SAVINGS_RATE;
}

export function setSavingsRate(rate: number) {
  const clean = Math.min(0.9, Math.max(0.01, Number(rate) || DEFAULT_SAVINGS_RATE));
  localStorage.setItem('midas_savings_rate', String(clean));
}

export type SavingsRuleOutcome =
  | { action: 'none' }
  | { action: 'suggest'; amount: number; rate: number }
  | { action: 'propose'; amount: number; rate: number; reason?: string }
  | { action: 'executed'; amount: number; rate: number; newVaultTotal: number; available: number };

export function applySavingsRule(incomeAmount: number): SavingsRuleOutcome {
  const income = Number(incomeAmount) || 0;
  if (income <= 0) return { action: 'none' };

  const rate = getSavingsRate();
  const amount = Math.round(income * rate * 100) / 100;
  if (amount <= 0) return { action: 'none' };

  const autonomy = useAgentAutonomyStore.getState();
  const level = autonomy.levels['ahorrador'] ?? 'aprobar';
  const limit = autonomy.limits['ahorrador'] ?? 100;

  if (level === 'sugerir') {
    return { action: 'suggest', amount, rate };
  }

  if (level === 'autonomo') {
    if (amount <= limit) {
      const result = useUserProfileStore
        .getState()
        .transferToVault(amount, `Regla Págate Primero (${Math.round(rate * 100)}% del ingreso)`);
      return { action: 'executed', amount, rate, ...result };
    }
    return {
      action: 'propose',
      amount,
      rate,
      reason: `El apartado ($${amount}) supera tu límite autónomo ($${limit}); requiere tu aprobación.`,
    };
  }

  return { action: 'propose', amount, rate };
}
