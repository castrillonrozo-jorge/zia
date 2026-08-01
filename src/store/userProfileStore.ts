import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '../types';

interface UserProfileStore {
  profile: UserProfile;
  updateField: (path: string, value: any) => void;
  addTransaction: (tx: Omit<UserProfile['transactions'][0], 'id' | 'date'>) => void;
  transferToVault: (amount: number, note?: string) => { newVaultTotal: number; available: number };
  getProfile: () => UserProfile;
  calculateComputed: () => void;
  resetProfile: () => void;
}

const defaultProfile: UserProfile = {
  name: '',
  onboardingComplete: false,
  income: {
    monthly: 0,
    type: 'fixed',
    frequency: 'monthly',
    otherIncome: 0,
  },
  fixedExpenses: {
    housing: 0,
    utilities: 0,
    transport: 0,
    subscriptions: 0,
    other: 0,
  },
  variableExpenses: {
    food: 0,
    entertainment: 0,
    delivery: 0,
    vices: 0,
  },
  debts: {
    hasDebts: false,
    totalAmount: 0,
    monthlyPayment: 0,
  },
  savings: {
    currentTotal: 0,
    currentInvestments: [],
  },
  transactions: [],
  goals: {
    shortTerm: '',
    longTerm: '',
    shortTermAmount: 0,
    longTermAmount: 0,
  },
  computed: {
    totalIncome: 0,
    totalFixedExpenses: 0,
    totalVariableExpenses: 0,
    monthlyDebtPayment: 0,
    availableToSave: 0,
    savingsRate: 0,
    financialHealth: 'healthy',
  },
};

// IDs únicos para transacciones: Date.now() solo colisiona cuando el Agente
// Ahorrador autónomo registra el apartado en el mismo milisegundo que el
// ingreso; el sufijo aleatorio lo evita.
const newTxId = () =>
  Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);

// Helper function to safely update nested objects
const setNestedProperty = (obj: any, path: string, value: any) => {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const lastObj = keys.reduce((current, key) => current[key] = current[key] || {}, obj);
  lastObj[lastKey] = value;
};

export const useUserProfileStore = create<UserProfileStore>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      
      updateField: (path, value) => {
        set((state) => {
          const newProfile = JSON.parse(JSON.stringify(state.profile));
          setNestedProperty(newProfile, path, value);
          return { profile: newProfile };
        });
        get().calculateComputed();
      },

      addTransaction: (tx) => {
        set((state) => ({
          profile: {
            ...state.profile,
            transactions: [
              ...(state.profile.transactions || []),
              {
                ...tx,
                amount: Math.max(0, Number(tx.amount) || 0),
                id: newTxId(),
                date: new Date().toISOString()
              }
            ]
          }
        }));
        get().calculateComputed();
      },

      getProfile: () => get().profile,

      transferToVault: (amount, note) => {
        const clean = Math.max(0, Number(amount) || 0);
        set((state) => ({
          profile: {
            ...state.profile,
            savings: {
              ...state.profile.savings,
              currentTotal: (Number(state.profile.savings.currentTotal) || 0) + clean,
            },
            transactions: [
              ...(state.profile.transactions || []),
              {
                id: newTxId(),
                type: 'expense' as const,
                amount: clean,
                category: 'Ahorro Bóveda',
                description: note || 'Transferencia a Bóveda',
                date: new Date().toISOString(),
              },
            ],
          },
        }));
        get().calculateComputed();
        const p = get().profile;
        return { newVaultTotal: p.savings.currentTotal, available: p.computed.availableToSave };
      },

      calculateComputed: () => {
        set((state) => {
          const p = state.profile;
          
          const dynamicIncome = p.transactions?.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) || 0;
          const dynamicExpense = p.transactions?.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) || 0;

          const totalIncome = (Number(p.income.monthly) || 0) + (Number(p.income.otherIncome) || 0) + dynamicIncome;
          
          const totalFixedExpenses = 
            (Number(p.fixedExpenses.housing) || 0) + 
            (Number(p.fixedExpenses.utilities) || 0) + 
            (Number(p.fixedExpenses.transport) || 0) + 
            (Number(p.fixedExpenses.subscriptions) || 0) + 
            (Number(p.fixedExpenses.other) || 0);
            
          const totalVariableExpenses = 
            (Number(p.variableExpenses.food) || 0) + 
            (Number(p.variableExpenses.entertainment) || 0) + 
            (Number(p.variableExpenses.delivery) || 0) + 
            (Number(p.variableExpenses.vices) || 0) + dynamicExpense;
            
          const monthlyDebtPayment = p.debts.hasDebts ? (Number(p.debts.monthlyPayment) || 0) : 0;
          
          const totalExpenses = totalFixedExpenses + totalVariableExpenses + monthlyDebtPayment;
          const availableToSave = totalIncome - totalExpenses;
          
          const savingsRate = totalIncome > 0 ? (availableToSave / totalIncome) * 100 : 0;
          
          let financialHealth: UserProfile['computed']['financialHealth'] = 'healthy';
          if (savingsRate < 5 || availableToSave < 0) {
            financialHealth = 'critical';
          } else if (savingsRate >= 5 && savingsRate <= 20) {
            financialHealth = 'at-risk';
          } else {
            financialHealth = 'healthy';
          }

          const newProfile = {
            ...p,
            computed: {
              totalIncome,
              totalFixedExpenses,
              totalVariableExpenses,
              monthlyDebtPayment,
              availableToSave,
              savingsRate,
              financialHealth,
            }
          };

          return { profile: newProfile };
        });
      },

      resetProfile: () => set({ profile: defaultProfile }),
    }),
    {
      name: 'midas_profile',
    }
  )
);
