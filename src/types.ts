export interface Message {
  id: string;
  role: 'user' | 'jarvis';
  content: string;
  timestamp: Date;
  embedded?: {
    type: EmbeddedComponentType;
    data: any;
  };
  functionCall?: any;
  functionResponse?: any;
}

export type EmbeddedComponentType = 
  | 'BalanceCard' 
  | 'VaultCard' 
  | 'AgentCard' 
  | 'AgentActionLog' 
  | 'RuleCard' 
  | 'TransactionConfirmCard' 
  | 'InsightCard' 
  | 'ScenarioCard' 
  | 'InlineChart' 
  | 'InvestmentCard' 
  | 'QuickReplyChips' 
  | 'DepositOptionsCard' 
  | 'EducationCard' 
  | 'BillPaymentCard'
  | 'MoneyInput'
  | 'ChipSelector'
  | 'GoalInput'
  | 'DebtInput'
  | 'FinancialProfileCard'
  | 'ActionPlanCard'
  | 'BigActionButtons';

export type AutonomyLevel = 'sugerir' | 'aprobar' | 'autonomo';

// Posición de inversión real registrada por el usuario (o por el Escudo
// Anti-Inflación al ejecutar una cobertura).
export interface InvestmentPosition {
  id: string;
  name: string;
  amount: number;
  date: string; // ISO
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused';
  type: string;
  nextRun?: string;
  autonomy?: AutonomyLevel;
}

export interface UserProfile {
  name: string;
  age?: number;
  onboardingComplete: boolean;

  income: {
    monthly: number;
    type: 'fixed' | 'variable' | 'mixed';
    frequency: 'biweekly' | 'monthly' | 'project';
    otherIncome: number;
  };

  fixedExpenses: {
    housing: number;
    utilities: number;
    transport: number;
    subscriptions: number;
    other: number;
  };

  variableExpenses: {
    food: number;
    entertainment: number;
    delivery: number;
    vices: number;
  };

  debts: {
    hasDebts: boolean;
    totalAmount: number;
    monthlyPayment: number;
  };

  savings: {
    currentTotal: number;
    currentInvestments: InvestmentPosition[];
  };

  transactions: {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: string;
  }[];

  goals: {
    shortTerm: string;
    longTerm: string;
    shortTermAmount: number;
    longTermAmount: number;
  };

  computed: {
    totalIncome: number;
    totalFixedExpenses: number;
    totalVariableExpenses: number;
    monthlyDebtPayment: number;
    availableToSave: number;
    savingsRate: number;
    financialHealth: 'healthy' | 'at-risk' | 'critical';
  };
}
