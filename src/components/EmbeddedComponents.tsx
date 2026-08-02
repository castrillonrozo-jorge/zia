import { useState } from 'react';
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, ShieldCheck, Cpu, Lightbulb, TrendingDown, Target, GraduationCap, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const ActionPlanCard = ({ title, steps = [], onAccept }: any) => (
  <div className="bg-bg-chat border-2 border-gold-primary rounded-[20px] p-6 my-3 premium-shadow relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
    <div className="flex items-center gap-3 mb-5">
      <div className="bg-gold-pale p-3 rounded-xl text-gold-deep border border-gold-primary/20">
        <Target size={24} />
      </div>
      <div>
        <div className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Plan de Acción</div>
        <div className="font-black text-text-primary text-base leading-tight">{title}</div>
      </div>
    </div>
    
    <div className="space-y-3 relative z-10">
      {steps.map((step: string, idx: number) => (
        <motion.div 
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
          key={idx} 
          className="flex items-start gap-3 bg-bg-bubble-jarvis p-3.5 rounded-2xl border border-border-subtle"
        >
          <div className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-gold-primary flex items-center justify-center text-black font-black text-xs">
            {idx + 1}
          </div>
          <div className="text-sm font-medium text-text-primary leading-tight">
            {step}
          </div>
        </motion.div>
      ))}
    </div>
    
    <button 
      onClick={onAccept}
      className="w-full mt-5 py-3.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all text-center uppercase tracking-widest text-[13px]"
    >
      Aceptar el Reto
    </button>
  </div>
);

// Defaults en 0: nunca inventamos saldos si el llamador no los pasa.
export const BalanceCard = ({ balance = 0, available = 0, vaults = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    className="bg-bg-chat border-2 border-gold-primary rounded-[20px] p-5 my-3 premium-shadow"
  >
    <div className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mb-1">Saldo Total</div>
    <div className="text-4xl font-bold text-gold-deep tracking-tight mb-5">
      ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
    </div>
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div className="bg-bg-bubble-jarvis p-3.5 rounded-2xl border border-border-subtle">
        <div className="text-text-secondary text-[10px] uppercase font-bold tracking-wider mb-0.5">Disponible</div>
        <div className="font-semibold text-text-primary">${available.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
      </div>
      <div className="bg-bg-bubble-jarvis p-3.5 rounded-2xl border border-border-subtle">
        <div className="text-text-secondary text-[10px] uppercase font-bold tracking-wider mb-0.5">En Bóvedas</div>
        <div className="font-semibold text-text-primary">${vaults.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
      </div>
    </div>
  </motion.div>
);

export const AgentCard = ({ name, type, status = 'active', nextRun = 'Mañana' }: any) => {
  // Estado real del agente: reflejamos la prop en vez de un literal fijo.
  const isActive = status === 'active' || status === 'Activo' || status === 'activo';
  return (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
    className="bg-bg-chat border-2 border-gold-primary rounded-[20px] p-4 my-3 flex items-start gap-4 relative overflow-hidden premium-shadow"
  >
    <div className={`absolute top-0 right-0 text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest ${isActive ? 'bg-gold-primary text-black' : 'bg-border-subtle text-text-secondary'}`}>
      {isActive ? 'Activo' : 'Pausado'}
    </div>
    <div className="bg-gold-pale p-3 text-gold-deep rounded-full mt-1 border border-gold-primary/20">
      <Cpu size={20} className="text-gold-deep" />
    </div>
    <div className="flex-1">
      <div className="font-bold text-text-primary text-sm pr-12">{name}</div>
      <div className="text-xs text-text-secondary mt-1 line-clamp-1">Optimizando tu capital en tiempo real.</div>
      <div className="flex items-center justify-between mt-4">
        <div className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Próxima: <span className="text-gold-deep">{nextRun}</span></div>
      </div>
    </div>
  </motion.div>
  );
};

export const ScenarioCard = ({ income = 500, goal = 5000, onSelect }: { income?: number; goal?: number; onSelect?: (label: string, monthly: number) => void }) => {
  // Si el disponible es 0 o negativo, no hay escenario que calcular:
  // usamos una base mínima para no mostrar "Infinity meses".
  const base = Math.max(Number(income) || 0, 1);
  const conservative = base * 0.3;
  const moderate = base * 0.5;
  const aggressive = base * 0.8;

  // Guardamos cuál eligió el usuario para marcarlo visualmente.
  const [chosen, setChosen] = useState<string | null>(null);

  const scenarios = [
    { name: 'Conservador', monthly: conservative, apy: 6, time: Math.ceil(goal / conservative) },
    { name: 'Moderado', monthly: moderate, apy: 10, time: Math.ceil(goal / moderate) },
    { name: 'Agresivo', monthly: aggressive, apy: 15, time: Math.ceil(goal / aggressive) },
  ];

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1 mt-3 snap-x scrollbar-hide w-[100%] max-w-[400px]">
      {scenarios.map((s) => {
        const isChosen = chosen === s.name;
        return (
        <div key={s.name} className={`min-w-[220px] bg-bg-chat rounded-[20px] p-5 snap-start premium-shadow border-b-[6px] border-b-gold-primary transition-colors flex-shrink-0 ${isChosen ? 'border-2 border-gold-primary gold-glow' : 'border border-border-subtle hover:border-gold-primary'}`}>
          <div className="text-[10px] text-text-secondary uppercase font-bold tracking-wider mb-3">{s.name}</div>
          <div className="text-2xl font-bold text-text-primary tracking-tight mb-2">${s.monthly.toFixed(2)} / mes</div>
          <div className="text-[11px] text-green-600 dark:text-green-400 font-bold flex items-center gap-1.5 mb-1">
            <TrendingUp size={14} /> +{s.apy}% APY (supuesto)
          </div>
          <div className="text-[11px] text-text-secondary font-medium mb-5">
            Meta en aproximado {s.time} meses
          </div>
          <button
            onClick={() => {
              if (chosen) return; // un solo plan elegido por tarjeta
              setChosen(s.name);
              onSelect?.(s.name, s.monthly);
            }}
            disabled={chosen !== null}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${isChosen ? 'gold-gradient' : 'bg-bg-bubble-jarvis border border-border-subtle text-text-primary hover:bg-gold-primary hover:border-gold-primary hover:text-black disabled:opacity-50 disabled:pointer-events-none'}`}
          >
            {isChosen ? 'Plan elegido ✓' : `Elegir ${s.name}`}
          </button>
        </div>
        );
      })}
    </div>
  );
};

export const BigActionButtons = ({ buttons, onSelect }: any) => (
  <div className="flex flex-col items-center justify-center gap-3 mt-4 mb-2 w-full">
    {buttons.map((btn: string, i: number) => (
      <button 
        key={btn}
        onClick={() => onSelect(btn)}
        className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-3.5 px-4 rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all text-center text-sm border border-gold-primary/30"
      >
        {btn}
      </button>
    ))}
  </div>
);

export const QuickReplyChips = ({ chips, onSelect }: any) => (
  <div className="flex gap-2 overflow-x-auto pb-3 pt-2 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
    {chips.map((chip: string) => (
      <button
        key={chip}
        onClick={() => onSelect(chip)}
        className="snap-start whitespace-nowrap px-4 py-2 bg-bg-chat border border-border-subtle rounded-full text-[13px] font-semibold text-text-primary shadow-sm hover:border-gold-primary hover:bg-gold-pale transition-all flex-shrink-0"
      >
        {chip}
      </button>
    ))}
  </div>
);

export const TransactionConfirmCard = ({ amount = 50, to = "Bóveda de Ahorro", onConfirm }: any) => {
  // Una sola confirmación: si el usuario toca dos veces, se enviarían dos
  // transferencias idénticas a la Bóveda.
  const [confirmed, setConfirmed] = useState(false);
  return (
    <div className="bg-bg-chat border-2 border-gold-primary rounded-[20px] p-6 my-3 premium-shadow">
      <div className="text-center mb-6">
        <div className="text-[10px] text-text-secondary uppercase font-bold tracking-wider mb-2">Confirmar envío</div>
        <div className="text-4xl font-bold text-gold-deep tracking-tight">${amount.toFixed(2)}</div>
      </div>
      <div className="flex items-center justify-between bg-bg-bubble-jarvis p-4 rounded-xl mb-6 border border-border-subtle">
        <div className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Destino</div>
        <div className="text-sm font-semibold text-text-primary">{to}</div>
      </div>
      <button
        onClick={() => {
          if (confirmed) return;
          // La ejecución es síncrona y real: primero se ejecuta, y solo
          // entonces mostramos "Enviado". Si onConfirm lanza, no mentimos.
          onConfirm?.();
          setConfirmed(true);
        }}
        disabled={confirmed}
        className="w-full py-4 gold-gradient font-bold rounded-xl shadow-lg active:scale-95 transition-all text-center uppercase tracking-widest text-[13px] disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2"
      >
        {confirmed ? (<><CheckCircle2 size={16} /> Enviado</>) : 'Confirmar'}
      </button>
    </div>
  );
};

export const InsightCard = ({ title, text }: any) => (
  <div className="bg-bg-bubble-jarvis border border-border-subtle border-l-[3px] border-l-gold-primary rounded-xl p-4 my-2">
    <div className="flex items-center gap-2 mb-2 text-gold-deep">
      <Lightbulb size={16} />
      <span className="font-bold text-[11px] uppercase tracking-widest">{title}</span>
    </div>
    <p className="text-[13px] text-text-primary leading-relaxed font-medium">{text}</p>
  </div>
);

export const InvestmentCard = ({ product = "S&P 500 ETF", apy = "8.5%", amount = 100, onInvest }: { product?: string; apy?: string; amount?: number; onInvest?: () => void }) => {
  // Evitamos doble ejecución: tras registrar la inversión, el botón queda
  // deshabilitado. Si nadie pasó onInvest, no hay acción real que ofrecer.
  const [done, setDone] = useState(false);
  return (
  <div className="bg-bg-chat border-2 border-gold-primary rounded-[20px] p-6 my-3 premium-shadow">
    <div className="flex items-center gap-4 mb-5">
      <div className="bg-gold-pale p-3 rounded-full text-gold-deep border border-gold-primary/20">
        <TrendingUp size={20} />
      </div>
      <div>
        <div className="font-bold text-text-primary text-base">{product}</div>
        <div className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Oportunidad</div>
      </div>
    </div>
    <div className="text-center bg-bg-bubble-jarvis p-5 rounded-2xl border border-border-subtle mb-5">
       <div className="text-[11px] font-bold text-text-secondary mb-1 tracking-wider uppercase">Rendimiento (APY)</div>
       <div className="text-4xl font-bold text-gold-deep tracking-tight">{apy}</div>
    </div>
    <div className="flex justify-between items-center mb-5 px-1">
      <span className="text-[13px] font-bold text-text-secondary">Sugerido:</span>
      <span className="text-lg font-bold text-text-primary">${amount}</span>
    </div>
    {onInvest && (
      <button
        onClick={() => {
          if (done) return;
          onInvest();
          setDone(true);
        }}
        disabled={done}
        className="w-full py-4 gold-gradient font-bold rounded-xl shadow-lg active:scale-95 transition-all text-center uppercase tracking-widest text-[13px] disabled:opacity-60 disabled:pointer-events-none"
      >
        {done ? 'Inversión registrada ✓' : 'Ejecutar'}
      </button>
    )}
  </div>
  );
};


export const MoneyInput = ({ onConfirm, placeholder = "0.00" }: any) => {
  const [value, setValue] = useState('');
  // Aceptamos 0 (hay pasos donde "$0" es una respuesta válida) pero nunca
  // negativos ni texto no numérico.
  const parsed = Number(value);
  const isValid = value.trim() !== '' && Number.isFinite(parsed) && parsed >= 0;
  return (
    <div className="bg-bg-chat border-2 border-gold-pale rounded-[20px] p-6 my-3 premium-shadow">
      <div className="flex items-center gap-2 mb-4 bg-bg-bubble-jarvis border border-border-subtle rounded-xl px-4 py-3">
        <span className="text-2xl font-black text-text-secondary">$</span>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none text-2xl font-black text-text-primary w-full"
          autoFocus
        />
      </div>
      <button
        onClick={() => {
          if (isValid) onConfirm(parsed);
        }}
        disabled={!isValid}
        className="w-full py-4 bg-gold-primary text-black font-bold rounded-xl shadow-lg hover:bg-gold-bright disabled:opacity-50 transition-all text-center uppercase tracking-widest text-[13px]"
      >
        Continuar
      </button>
    </div>
  );
};

export const ChipSelector = ({ options, onSelect }: any) => (
  <div className="flex flex-col gap-2 my-3">
    {options.map((opt: string) => (
      <button 
        key={opt}
        onClick={() => onSelect(opt)}
        className="w-full text-left px-5 py-4 bg-bg-chat border-2 border-gold-pale rounded-2xl font-bold text-text-primary hover:border-gold-primary transition-all shadow-sm"
      >
        {opt}
      </button>
    ))}
  </div>
);

export const DebtInput = ({ onConfirm }: any) => {
  const [total, setTotal] = useState('');
  const [monthly, setMonthly] = useState('');
  const totalNum = Number(total);
  const monthlyNum = Number(monthly);
  const isValid =
    total.trim() !== '' && monthly.trim() !== '' &&
    Number.isFinite(totalNum) && Number.isFinite(monthlyNum) &&
    totalNum >= 0 && monthlyNum >= 0;
  return (
    <div className="bg-bg-chat border-2 border-gold-pale rounded-[20px] p-6 my-3 premium-shadow">
      <div className="space-y-4 mb-6">
        <div>
          <div className="text-[10px] text-text-secondary uppercase font-bold tracking-wider mb-2">Total de la deuda</div>
          <div className="flex items-center gap-2 bg-bg-bubble-jarvis border border-border-subtle rounded-xl px-4 py-3">
            <span className="text-xl font-bold text-text-secondary">$</span>
            <input type="number" inputMode="decimal" min="0" value={total} onChange={(e) => setTotal(e.target.value)} placeholder="0.00" className="flex-1 bg-transparent border-none outline-none text-xl font-bold text-text-primary" />
          </div>
        </div>
        <div>
          <div className="text-[10px] text-text-secondary uppercase font-bold tracking-wider mb-2">Pago mensual</div>
          <div className="flex items-center gap-2 bg-bg-bubble-jarvis border border-border-subtle rounded-xl px-4 py-3">
            <span className="text-xl font-bold text-text-secondary">$</span>
            <input type="number" inputMode="decimal" min="0" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="0.00" className="flex-1 bg-transparent border-none outline-none text-xl font-bold text-text-primary" />
          </div>
        </div>
      </div>
      <button onClick={() => { if (isValid) onConfirm({ total: totalNum, monthly: monthlyNum }); }} disabled={!isValid} className="w-full py-4 bg-gold-primary text-black font-bold rounded-xl shadow-lg disabled:opacity-50 text-center uppercase tracking-widest text-[13px]">
        Continuar
      </button>
    </div>
  );
};

export const GoalInput = ({ onConfirm }: any) => {
  const [goal, setGoal] = useState('');
  const [amount, setAmount] = useState('');
  const amountNum = Number(amount);
  const isValid = goal.trim() !== '' && amount.trim() !== '' && Number.isFinite(amountNum) && amountNum > 0;
  return (
    <div className="bg-bg-chat border-2 border-gold-pale rounded-[20px] p-6 my-3 premium-shadow">
      <div className="space-y-4 mb-6">
        <div>
          <div className="text-[10px] text-text-secondary uppercase font-bold tracking-wider mb-2">Meta (ej. Vacaciones, Carro)</div>
          <div className="bg-bg-bubble-jarvis border border-border-subtle rounded-xl px-4 py-3">
            <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Comprar un carro" className="w-full bg-transparent border-none outline-none text-sm font-bold text-text-primary" />
          </div>
        </div>
        <div>
          <div className="text-[10px] text-text-secondary uppercase font-bold tracking-wider mb-2">¿Cuánto necesitas?</div>
          <div className="flex items-center gap-2 bg-bg-bubble-jarvis border border-border-subtle rounded-xl px-4 py-3">
            <span className="text-xl font-bold text-text-secondary">$</span>
            <input type="number" inputMode="decimal" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="flex-1 bg-transparent border-none outline-none text-xl font-bold text-text-primary" />
          </div>
        </div>
      </div>
      <button onClick={() => { if (isValid) onConfirm({ goal: goal.trim(), amount: amountNum }); }} disabled={!isValid} className="w-full py-4 bg-gold-primary text-black font-bold rounded-xl shadow-lg disabled:opacity-50 text-center uppercase tracking-widest text-[13px]">
        Continuar
      </button>
    </div>
  );
};

export const FinancialProfileCard = ({ profile }: any) => {
  const healthColors: Record<string, string> = {
    'healthy': 'bg-green-500',
    'at-risk': 'bg-yellow-500',
    'critical': 'bg-red-500'
  };
  const healthLabel: Record<string, string> = {
    'healthy': 'Saludable',
    'at-risk': 'En Riesgo',
    'critical': 'Crítica'
  };
  
  const hColor = healthColors[profile.computed.financialHealth] || 'bg-green-500';
  const hLabel = healthLabel[profile.computed.financialHealth] || 'Saludable';

  const totalExp = profile.computed.totalFixedExpenses + profile.computed.totalVariableExpenses;
  const fPct = totalExp > 0 ? (profile.computed.totalFixedExpenses / totalExp) * 100 : 0;
  
  return (
    <div className="bg-bg-chat border-2 border-gold-primary rounded-[20px] p-6 my-3 premium-shadow overflow-hidden relative">
      <div className="text-sm font-black text-text-primary mb-6">Tu radiografía financiera, {profile.name}</div>
      
      <div className="space-y-5">
        <div>
          <div className="text-[10px] text-text-secondary uppercase font-bold tracking-wider mb-1">Ingresos Mensuales</div>
          <div className="text-xl font-black text-text-primary">${profile.computed.totalIncome.toLocaleString()}</div>
        </div>

        <div>
          <div className="text-[10px] text-text-secondary uppercase font-bold tracking-wider mb-1">Gastos Mensuales</div>
          <div className="text-xl font-black text-text-primary mb-2">${totalExp.toLocaleString()}</div>
          <div className="h-2 w-full bg-border-subtle rounded-full overflow-hidden flex">
            <div className="h-full bg-blue-500" style={{ width: `${fPct}%` }}></div>
            <div className="h-full bg-purple-500" style={{ width: `${100 - fPct}%` }}></div>
          </div>
          <div className="flex gap-4 mt-2 text-[10px] uppercase font-bold text-text-secondary">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Fijos</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div>Variables</div>
          </div>
        </div>

        {profile.debts.hasDebts && (
          <div>
            <div className="text-[10px] text-text-secondary uppercase font-bold tracking-wider mb-1">Deudas (Pago Mensual)</div>
            <div className="text-xl font-black text-red-500">${profile.computed.monthlyDebtPayment.toLocaleString()}</div>
          </div>
        )}

        <div className="pt-4 border-t border-border-subtle">
          <div className="text-[10px] text-text-secondary uppercase font-bold tracking-wider mb-1">Disponible</div>
          <div className={`text-3xl font-black tracking-tight ${profile.computed.availableToSave >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${profile.computed.availableToSave.toLocaleString()}
          </div>
          <div className="text-xs text-text-secondary mt-1 font-medium">Esto es lo que puedes destinar a ahorro e inversión</div>
        </div>
      </div>

      <div className={`mt-6 py-3 px-4 rounded-xl flex items-center justify-between ${hColor} text-white`}>
        <div className="font-bold text-sm uppercase tracking-wider">Salud Financiera</div>
        <div className="font-black text-lg">{hLabel}</div>
      </div>
    </div>
  );
};


