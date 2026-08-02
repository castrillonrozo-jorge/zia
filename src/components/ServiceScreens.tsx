import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CreditCard, Send, Plus, Search, Activity, CalendarDays, ReceiptText, ShieldCheck, PiggyBank, TrendingUp, X, Check, Target, BellRing, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';
import { useUserProfileStore } from '../store/userProfileStore';
import { useAgentAutonomyStore } from '../store/agentAutonomyStore';
import { useNotificationsStore } from '../store/notificationsStore';
import { useRemindersStore } from '../store/remindersStore';
import { getSavingsRate, setSavingsRate } from '../services/rulesEngine';
import { AutonomySelector } from './AutonomySelector';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';

export function MonitoreoScreen({ onBack }: { onBack: () => void }) {
  const { profile } = useUserProfileStore();
  const [showAll, setShowAll] = useState(false);

  const expByCat = profile.transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.keys(expByCat).map(key => ({
    name: key,
    value: expByCat[key]
  }));

  const COLORS = ['#DEA935', '#9C7A1E', '#6B5414', '#F3D98B'];

  const income = profile.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = profile.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const barData = [
    { name: 'Ingresos', value: income, fill: '#10B981' },
    { name: 'Gastos', value: expense, fill: '#EF4444' }
  ];

  // Fatiga de presupuesto real: % del ingreso ya comprometido en gastos
  // (el inverso de tu tasa de ahorro). Sin ingresos no hay dato que mostrar.
  const totalIncome = profile.computed?.totalIncome || 0;
  const savingsRatePct = profile.computed?.savingsRate ?? 0;
  const fatigue = totalIncome > 0 ? Math.min(100, Math.max(0, 100 - savingsRatePct)) : null;
  const health = profile.computed?.financialHealth || 'healthy';
  const fatigueColor = health === 'healthy' ? 'text-green-500' : health === 'at-risk' ? 'text-orange-400' : 'text-red-500';
  const fatigueLabel = health === 'healthy' ? 'Óptimo' : health === 'at-risk' ? 'Vigilar' : 'Crítico';

  // Fuga real: suscripciones detectadas en movimientos + las declaradas
  // en gastos fijos. Nada de "$14/w" inventados.
  const detectedSubs = detectSubscriptions(profile.transactions || []);
  const monthlyLeak = detectedSubs.reduce((s, sub) => s + sub.amount, 0) + (Number(profile.fixedExpenses?.subscriptions) || 0);

  const visibleTx = profile.transactions.slice().reverse();
  const shownTx = showAll ? visibleTx : visibleTx.slice(0, 5);

  return (
    <div className="absolute inset-0 bg-bg-main z-50 flex flex-col overflow-y-auto">
      <div className="p-4 flex items-center justify-between sticky top-0 bg-bg-main/90 backdrop-blur-md z-10 border-b border-border-subtle">
        <button onClick={onBack} className="p-2 hover:bg-bg-chat rounded-full text-gold-deep transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-bold tracking-widest uppercase text-text-primary text-sm flex items-center gap-2">
            <Activity size={18} className="text-gold-primary" />
            Vigilante de Flujo
          </span>
          <span className="text-[9px] text-text-secondary uppercase tracking-widest font-mono">IA Predictiva Bayesiana</span>
        </div>
        <div className="w-10"></div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="flex gap-4">
           <div className="flex-1 bg-bg-chat p-4 rounded-3xl premium-shadow border border-border-subtle flex flex-col justify-between">
              <span className="text-[10px] text-text-secondary uppercase font-bold mb-1"><Activity className="inline w-3 h-3 mr-1 text-gold-primary" />Fatiga de Presupuesto</span>
              {fatigue !== null ? (
                <>
                  <span className="text-2xl font-black text-text-primary">{fatigue.toFixed(1)}%</span>
                  <span className={`text-[10px] mt-1 ${fatigueColor}`}>{fatigueLabel} · % del ingreso ya gastado</span>
                </>
              ) : (
                <>
                  <span className="text-2xl font-black text-text-secondary">—</span>
                  <span className="text-[10px] text-text-secondary mt-1">Registra ingresos para calcularla</span>
                </>
              )}
           </div>
           <div className="flex-1 bg-bg-chat p-4 rounded-3xl premium-shadow border border-border-subtle flex flex-col justify-between">
              <span className="text-[10px] text-text-secondary uppercase font-bold mb-1"><TrendingUp className="inline w-3 h-3 mr-1 text-red-400" />Fuga Detectada</span>
              {monthlyLeak > 0 ? (
                <>
                  <span className="text-xl font-bold text-text-primary">${monthlyLeak.toFixed(2)}<span className="text-sm">/mes</span></span>
                  <span className="text-[10px] text-red-400 mt-1">Suscripciones</span>
                </>
              ) : (
                <>
                  <span className="text-xl font-bold text-green-500">$0</span>
                  <span className="text-[10px] text-text-secondary mt-1">Sin fugas detectadas</span>
                </>
              )}
           </div>
        </div>

        <div className="bg-bg-chat p-5 rounded-3xl premium-shadow border border-border-subtle">
           <h3 className="text-xs uppercase font-bold text-text-secondary mb-4 tracking-widest text-center">Flujo de Caja Histórico</h3>
           <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '12px', color: 'var(--text-primary)' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
           </div>
        </div>

        {pieData.length > 0 && (
          <div className="bg-bg-chat p-5 rounded-3xl premium-shadow border border-border-subtle flex flex-col items-center">
             <h3 className="text-xs uppercase font-bold text-text-secondary mb-4 tracking-widest text-center">Distribución de Gastos</h3>
             <div className="h-48 w-full max-w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '12px', color: 'var(--text-primary)' }} />
                </PieChart>
              </ResponsiveContainer>
             </div>
             <div className="mt-4 flex flex-wrap justify-center gap-2">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5 bg-bg-main px-3 py-1 rounded-full text-xs text-text-primary border border-border-subtle">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    {d.name}: ${d.value}
                  </div>
                ))}
             </div>
          </div>
        )}

        <div>
           <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-text-primary">Movimientos Recientes</h3>
              {visibleTx.length > 5 && (
                <button
                  onClick={() => setShowAll(v => !v)}
                  className="text-[10px] uppercase font-bold tracking-wider text-gold-deep border border-gold-primary/30 px-3 py-1 rounded-full hover:bg-gold-primary/10 transition-colors"
                >
                  {showAll ? 'Ver Menos' : 'Ver Todos'}
                </button>
              )}
           </div>
           <div className="space-y-3">
              {shownTx.map(tx => (
                <div key={tx.id} className="bg-bg-chat border border-border-subtle rounded-2xl p-4 flex justify-between items-center premium-shadow group hover:border-gold-primary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-bg-main flex items-center justify-center text-text-secondary border border-border-subtle">
                        <Activity size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text-primary">{tx.category}</div>
                      <div className="text-[10px] text-text-secondary mt-0.5">{new Date(tx.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className={`font-bold ${tx.type === 'income' ? 'text-green-500' : 'text-text-primary'}`}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </div>
                </div>
              ))}
              {profile.transactions.length === 0 && (
                <div className="text-center text-text-secondary text-sm py-4">No hay movimientos registrados.</div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}

export function PagadorScreen({ onBack }: { onBack: () => void }) {
  const { profile, addTransaction } = useUserProfileStore();
  const notify = useNotificationsStore((s) => s.add);
  const level = useAgentAutonomyStore((s) => s.levels['pagador'] ?? 'aprobar');
  const limit = useAgentAutonomyStore((s) => s.limits['pagador'] ?? 100);
  const [amount, setAmount] = useState('');
  const [service, setService] = useState('');
  // Destinatario manual separado del servicio: el destino va a la descripción
  // del movimiento; el servicio, a la categoría.
  const [destination, setDestination] = useState('');
  const [success, setSuccess] = useState(false);
  const [lastPayment, setLastPayment] = useState<{ amount: number; category: string } | null>(null);
  const [warning, setWarning] = useState('');

  const available = profile.computed?.availableToSave ?? 0;

  const predefinedServices = [
    { id: '1', name: 'Electricidad', icon: <Activity className="text-gold-primary" size={18} />, tag: 'Smart Routing' },
    { id: '2', name: 'Internet / Telefonía', icon: <CalendarDays className="text-gold-primary" size={18} />, tag: 'Agendado' },
    { id: '3', name: 'Tarjeta de Crédito', icon: <CreditCard className="text-gold-primary" size={18} />, tag: 'High Prio' },
    { id: '4', name: 'Alquiler', icon: <ReceiptText className="text-gold-primary" size={18} />, tag: 'Wire Transfer' }
  ];

  const handlePay = () => {
    const value = parseFloat(amount);
    if (!service || !Number.isFinite(value) || value <= 0) return;

    // El agente en modo Sugerir nunca ejecuta (el botón ya está deshabilitado,
    // pero lo reforzamos aquí por si acaso).
    if (level === 'sugerir') return;

    // Protección de Balance real: no ejecutamos pagos que superen tu disponible.
    if (value > available) {
      setWarning(`Este pago ($${value.toFixed(2)}) supera tu disponible ($${Math.max(0, available).toFixed(2)}). Protección de Balance activada: no se ejecutó.`);
      return;
    }

    // En modo Autónomo, un pago por encima del límite pide confirmación extra.
    if (level === 'autonomo' && value > limit) {
      const ok = window.confirm(`Este pago ($${value.toFixed(2)}) supera tu límite autónomo del Pagador ($${limit}). ¿Confirmas la ejecución?`);
      if (!ok) return;
    }

    setWarning('');
    addTransaction({
      type: 'expense',
      amount: value,
      category: service,
      description: destination ? `Pago a ${destination}` : 'Pago de servicio'
    });
    notify('Agente Pagador', `Pago de $${value.toFixed(2)} a ${destination || service} ejecutado.`);
    setLastPayment({ amount: value, category: service });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setAmount('');
      setService('');
      setDestination('');
    }, 4500);
  };

  return (
    <div className="absolute inset-0 bg-bg-main z-50 flex flex-col overflow-y-auto">
      <div className="p-4 flex items-center justify-between sticky top-0 bg-bg-main/90 backdrop-blur-md z-10 border-b border-border-subtle">
        <button onClick={onBack} className="p-2 hover:bg-bg-chat rounded-full text-gold-deep transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
           <span className="font-bold tracking-widest uppercase text-text-primary text-sm flex items-center gap-2">
             <CreditCard size={18} className="text-gold-primary" />
             Enrutador de Pagos
           </span>
           <span className="text-[9px] text-text-secondary uppercase tracking-widest font-mono">Motor de Liquidación</span>
        </div>
        <div className="w-10"></div>
      </div>
      
      <div className="p-6 space-y-6 flex-1 flex flex-col">
        {!success ? (
          <>
            <div className="bg-bg-chat/50 border border-gold-primary/20 p-4 rounded-3xl flex items-center gap-4">
               <div className="w-12 h-12 bg-bg-bubble-jarvis rounded-full flex items-center justify-center border border-gold-primary/30 text-gold-deep">
                  <ShieldCheck size={20} />
               </div>
               <div>
                  <div className="text-sm font-bold text-text-primary">Protección de Balance</div>
                  <div className="text-[10px] text-text-secondary mt-1">Los fondos se enrutarán asegurando cero cobros de sobregiro.</div>
               </div>
            </div>

            <div>
              <label className="text-xs uppercase font-bold text-text-secondary tracking-widest pl-1 mb-3 block">Rutas de Liquidación Frecuentes</label>
              <div className="grid grid-cols-2 gap-3">
                {predefinedServices.map(s => (
                  <button 
                    key={s.id} 
                    onClick={() => setService(s.name)}
                    className={`flex flex-col items-start gap-2 p-4 rounded-2xl border transition-all ${service === s.name ? 'border-gold-primary bg-gold-primary/10 text-text-primary premium-shadow' : 'border-border-subtle bg-bg-chat text-text-secondary hover:border-gold-pale'} relative overflow-hidden`}
                  >
                    {service === s.name && <div className="absolute top-0 right-0 w-16 h-16 bg-gold-primary/10 blur-xl rounded-full"></div>}
                    <div className="flex w-full justify-between items-start">
                      {s.icon}
                      <span className="text-[8px] bg-bg-main px-2 py-0.5 rounded-full border border-border-subtle uppercase tracking-widest text-text-secondary">{s.tag}</span>
                    </div>
                    <span className="text-xs font-bold text-left mt-1">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
               <label className="text-xs uppercase font-bold text-text-secondary tracking-widest pl-1 mb-2 block">Destinatario Manual o API</label>
               <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Ej. Routing Number, Cuenta..."
                  className="w-full bg-bg-chat border border-border-subtle rounded-xl p-4 text-sm text-text-primary outline-none focus:border-gold-primary transition-colors font-mono"
               />
            </div>

            <div className="bg-bg-chat p-5 rounded-3xl border border-border-subtle mt-2">
              <label className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-2 block text-center">Capital a Dispersar (USD)</label>
              <div className="relative text-center mt-2">
                <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent p-0 text-center text-5xl font-black text-text-primary outline-none transition-colors"
                 />
                 {amount && <span className="absolute left-[calc(50%-max(4rem,2rem))] top-0 bottom-0 flex items-center justify-center text-text-secondary text-2xl">$</span>}
              </div>
            </div>

            <div className="flex-1"></div>

            {warning && (
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-500 text-xs font-bold leading-relaxed">
                <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                <span>{warning}</span>
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={!amount || !service || isNaN(parseFloat(amount)) || level === 'sugerir'}
              className="w-full h-14 gold-gradient font-black uppercase tracking-wide rounded-2xl disabled:opacity-50 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] premium-shadow border border-gold-primary/50"
            >
              <Send size={18} /> Ejecutar Liquidación
            </button>
            {level === 'sugerir' && (
              <p className="text-[10px] text-text-secondary text-center -mt-2">
                El Pagador está en modo Sugerir: cámbialo en el HUB para ejecutar.
              </p>
            )}
          </>
        ) : (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center">
            <motion.div 
               initial={{ scale: 0 }} 
               animate={{ scale: 1 }} 
               transition={{ type: "spring", damping: 15, stiffness: 200 }}
               className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6 border border-green-500/50"
            >
              <Check className="w-12 h-12" />
            </motion.div>
            <h2 className="text-3xl font-black text-text-primary mb-2">Completado</h2>
            <div className="text-text-secondary mb-8 bg-bg-chat p-4 rounded-2xl border border-border-subtle inline-block text-sm max-w-xs">
               <span className="block mb-2 font-mono text-[10px] uppercase text-text-secondary border-b border-border-subtle pb-2">Orden registrada en tu historial</span>
               Se han dispersado <strong className="text-text-primary font-mono">${(lastPayment?.amount ?? 0).toFixed(2)}</strong> en <br/><strong className="text-text-primary mt-1 block px-3 py-1 bg-bg-main rounded border border-border-subtle">{lastPayment?.category}</strong>.
            </div>
            <button
              onClick={() => { setSuccess(false); setAmount(''); setService(''); setDestination(''); }}
              className="px-8 h-12 bg-bg-chat border border-border-subtle text-text-primary hover:border-gold-primary transition-colors rounded-full font-bold uppercase text-xs tracking-wider"
            >
              Nueva Orden
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function AhorradorScreen({ onBack }: { onBack: () => void }) {
  const { profile, transferToVault } = useUserProfileStore();
  const notify = useNotificationsStore((s) => s.add);
  const [amountVal, setAmountVal] = useState('25');
  const [warning, setWarning] = useState('');
  // % real de la regla Págate Primero (persiste en el dispositivo).
  const [rate, setRate] = useState(() => getSavingsRate());
  const [editingRate, setEditingRate] = useState(false);
  const [rateDraft, setRateDraft] = useState(() => String(Math.round(getSavingsRate() * 100)));
  const available = profile.computed?.availableToSave ?? 0;

  // Chips derivados del disponible real (10/25/50/100%); si no hay
  // disponible, caemos a montos fijos de referencia.
  const chipValues = available > 0
    ? Array.from(new Set([0.1, 0.25, 0.5, 1].map(p => Math.max(1, Math.round(available * p)))))
    : [10, 25, 100, 500];

  const handleSaveRate = () => {
    const n = Number(rateDraft);
    if (!Number.isFinite(n) || n < 1 || n > 90) return;
    setSavingsRate(n / 100);
    setRate(getSavingsRate());
    setEditingRate(false);
  };

  const handleSave = () => {
    const value = parseFloat(amountVal);
    if (!Number.isFinite(value) || value <= 0) return;
    // No apartamos más de lo que realmente tienes disponible.
    if (value > available) {
      setWarning(`Ese aporte ($${value.toFixed(2)}) supera tu disponible ($${Math.max(0, available).toFixed(2)}).`);
      return;
    }
    setWarning('');
    // Pasa por transferToVault para que quede registrado como movimiento y
    // el saldo disponible se recalcule (antes solo inflaba la Bóveda).
    const result = transferToVault(value, 'Aporte manual desde el Optimizador');
    notify('Agente Ahorrador', `$${value.toFixed(2)} enviados a la Bóveda. Nuevo total: $${result.newVaultTotal.toLocaleString()}.`);
  };

  return (
    <div className="absolute inset-0 bg-bg-main z-50 flex flex-col overflow-y-auto">
      <div className="p-4 flex items-center justify-between sticky top-0 bg-bg-main/90 backdrop-blur-md z-10 border-b border-border-subtle">
        <button onClick={onBack} className="p-2 hover:bg-bg-chat rounded-full text-gold-deep transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
           <span className="font-bold tracking-widest uppercase text-text-primary text-sm flex items-center gap-2">
             <PiggyBank size={18} className="text-gold-primary" />
             Optimizador de Flujo
           </span>
           <span className="text-[9px] text-text-secondary uppercase tracking-widest font-mono">Algoritmo de Retención</span>
        </div>
        <div className="w-10"></div>
      </div>
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-br from-gold-primary/20 via-bg-chat to-bg-chat p-6 rounded-3xl premium-shadow border border-gold-primary/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-primary/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 flex items-center gap-2">
             <ShieldCheck size={14} className="text-gold-primary" />
             Bóveda de Deep-Store
          </div>
          <div className="text-5xl font-black text-text-primary font-mono tracking-tight">${(profile.savings.currentTotal || 0).toLocaleString()}</div>
          <div className="text-[10px] text-text-secondary font-bold mt-2 font-mono">Tu Bóveda crece solo con aportes reales.</div>
        </div>

        <div className="bg-bg-chat p-4 rounded-3xl premium-shadow border border-border-subtle">
           <div className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-1">Págate Primero</div>
           <div className="text-sm font-bold text-gold-deep">{Math.round(rate * 100)}% de tus Ingresos</div>
           {!editingRate ? (
             <button
               onClick={() => { setRateDraft(String(Math.round(rate * 100))); setEditingRate(true); }}
               className="text-[10px] text-text-primary mt-4 font-bold border border-border-subtle bg-bg-main rounded-full px-2 py-1 inline-block cursor-pointer hover:border-gold-primary transition-colors"
             >
               Modificar Regla
             </button>
           ) : (
             <div className="mt-3 flex items-center gap-2">
               <div className="flex items-center gap-1 bg-bg-main border border-border-subtle rounded-full px-3 py-1.5">
                 <input
                   type="number"
                   inputMode="numeric"
                   min={1}
                   max={90}
                   value={rateDraft}
                   onChange={(e) => setRateDraft(e.target.value)}
                   className="w-12 bg-transparent border-none outline-none text-xs font-bold text-text-primary text-center"
                 />
                 <span className="text-xs font-bold text-text-secondary">%</span>
               </div>
               <button
                 onClick={handleSaveRate}
                 disabled={!Number.isFinite(Number(rateDraft)) || Number(rateDraft) < 1 || Number(rateDraft) > 90}
                 className="text-[10px] font-black uppercase tracking-wider gold-gradient rounded-full px-3 py-1.5 disabled:opacity-50"
               >
                 Guardar
               </button>
               <button
                 onClick={() => setEditingRate(false)}
                 className="text-[10px] font-bold text-text-secondary hover:text-text-primary transition-colors"
               >
                 Cancelar
               </button>
             </div>
           )}
           <div className="text-[9px] text-text-secondary mt-2 leading-tight">Entre 1% y 90%. Se aplica cuando registras un ingreso.</div>
        </div>

        <div className="bg-bg-chat p-5 rounded-3xl premium-shadow border border-border-subtle">
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-sm tracking-wide">Aporte Manual / Sweep</h3>
             <span className="text-[10px] font-mono text-text-secondary">Liquid. disp: <span className="text-text-primary font-bold">${Math.max(0, available).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></span>
          </div>
          <div className="flex gap-2 mb-4">
            {chipValues.map(val => (
                <button
                  key={val}
                  onClick={() => setAmountVal(val.toString())}
                  className={`flex-1 py-3 rounded-2xl text-xs font-bold border transition-all ${amountVal === val.toString() ? 'bg-gold-primary text-black border-gold-primary premium-shadow scale-105' : 'bg-bg-main text-text-primary border-border-subtle hover:border-gold-pale hover:bg-bg-chat'}`}
                >
                  ${val}
                </button>
            ))}
          </div>
          <div className="relative mb-4">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">$</span>
             <input type="number" className="w-full bg-bg-main border border-border-subtle rounded-2xl py-4 pl-8 pr-4 text-lg font-black outline-none font-mono focus:border-gold-primary transition-colors text-center" value={amountVal} onChange={e => setAmountVal(e.target.value)} />
          </div>
          {warning && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-2xl p-3 mb-4 text-red-500 text-[11px] font-bold leading-relaxed">
              <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
              <span>{warning}</span>
            </div>
          )}
          <button onClick={handleSave} className="w-full gold-gradient transition-all font-black py-4 rounded-2xl border border-transparent uppercase tracking-wider text-xs flex items-center justify-center gap-2">
            <PiggyBank size={16} /> Enviar a Bóveda
          </button>
        </div>
      </div>
    </div>
  );
}

export function InversorScreen({ onBack }: { onBack: () => void }) {
  const { profile, addInvestment } = useUserProfileStore();
  const notify = useNotificationsStore((s) => s.add);
  const level = useAgentAutonomyStore((s) => s.levels['inversor'] ?? 'aprobar');

  // Posiciones reales del perfil. Perfiles viejos pueden traer strings en el
  // array: filtramos a objetos siempre.
  const positions = (profile.savings.currentInvestments || [])
    .filter((p: any) => p && typeof p === 'object') as { id: string; name: string; amount: number; date: string }[];
  const totalValue = positions.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const available = profile.computed?.availableToSave ?? 0;

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [warning, setWarning] = useState('');

  const levelLabel = level === 'sugerir' ? 'Sugerir' : level === 'autonomo' ? 'Autónomo' : 'Aprobar';

  // Serie acumulada real: cada aporte suma sobre el anterior, ordenado por fecha.
  const chartData = positions
    .slice()
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
    .reduce((acc, p) => {
      const prev = acc.length > 0 ? acc[acc.length - 1].val : 0;
      acc.push({
        name: p.date ? new Date(p.date).toLocaleDateString('es', { day: 'numeric', month: 'short' }) : '—',
        val: prev + (Number(p.amount) || 0),
      });
      return acc;
    }, [] as { name: string; val: number }[]);

  const handleAdd = () => {
    const value = parseFloat(amount);
    if (!name.trim() || !Number.isFinite(value) || value <= 0) return;
    if (value > available) {
      setWarning(`Esa inversión ($${value.toFixed(2)}) supera tu disponible ($${Math.max(0, available).toFixed(2)}).`);
      return;
    }
    setWarning('');
    const result = addInvestment(name.trim(), value);
    notify('Agente Inversor', `Inversión de $${value.toFixed(2)} en ${name.trim()} registrada. Total invertido: $${result.totalInvested.toLocaleString()}.`);
    setName('');
    setAmount('');
    setShowForm(false);
  };

  return (
    <div className="absolute inset-0 bg-bg-main z-50 flex flex-col overflow-y-auto">
      <div className="p-4 flex items-center justify-between sticky top-0 bg-bg-main/90 backdrop-blur-md z-10 border-b border-border-subtle">
        <button onClick={onBack} className="p-2 hover:bg-bg-chat rounded-full text-gold-deep transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
           <span className="font-bold tracking-widest uppercase text-text-primary text-sm flex items-center gap-2">
             <TrendingUp size={18} className="text-gold-primary" />
             Motor de Crecimiento
           </span>
           <span className="text-[9px] text-text-secondary uppercase tracking-widest font-mono">Registro de Portafolio</span>
        </div>
        <div className="w-10"></div>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
             <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Valor de Portafolio</div>
             <div className="text-[10px] bg-gold-pale text-gold-deep border border-gold-primary/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-gold-primary rounded-full"></span>{levelLabel}
             </div>
          </div>
          <div className="text-5xl font-black text-text-primary font-mono tracking-tight">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div className="text-[10px] text-text-secondary mt-2 font-mono">Suma de tus aportes registrados (no cotiza en tiempo real).</div>
        </div>

        {chartData.length > 0 && (
          <div className="bg-bg-chat p-5 rounded-3xl premium-shadow border border-border-subtle h-56 w-full relative overflow-hidden">
             <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] font-bold text-text-primary bg-bg-main border border-border-subtle px-2 py-1 rounded-full uppercase tracking-wider">Aportes Acumulados</span>
             </div>
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData} margin={{ top: 30, right: 0, left: 0, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                     <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <Tooltip cursor={{ stroke: 'var(--border-subtle)', strokeWidth: 1 }} contentStyle={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', borderRadius: '12px', color: 'var(--text-primary)' }} />
                 <Area type="monotone" dataKey="val" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        )}

        <div className="space-y-3">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm tracking-wide">Posiciones Registradas</h3>
              <button
                onClick={() => { setShowForm(v => !v); setWarning(''); }}
                className="text-[10px] text-text-primary border border-border-subtle bg-bg-chat hover:border-gold-primary rounded-full px-3 py-1 uppercase tracking-widest font-bold transition-colors"
              >
                {showForm ? 'Cerrar' : 'Añadir Activo'}
              </button>
           </div>

           {showForm && (
             <div className="bg-bg-chat p-5 rounded-3xl border border-gold-primary/30 premium-shadow space-y-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-1.5 block">Nombre del activo</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Fondo indexado, CETES..."
                    className="w-full bg-bg-main border border-border-subtle rounded-xl p-3 text-sm text-text-primary outline-none focus:border-gold-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-1.5 block">Monto (disp: ${Math.max(0, available).toLocaleString('en-US', { minimumFractionDigits: 2 })})</label>
                  <div className="flex items-center gap-2 bg-bg-main border border-border-subtle rounded-xl px-3">
                    <span className="text-sm font-bold text-text-secondary">$</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 bg-transparent border-none outline-none p-3 pl-0 text-sm font-bold text-text-primary"
                    />
                  </div>
                </div>
                {warning && (
                  <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-500 text-[11px] font-bold leading-relaxed">
                    <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                    <span>{warning}</span>
                  </div>
                )}
                <button
                  onClick={handleAdd}
                  disabled={!name.trim() || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
                  className="w-full gold-gradient font-black py-3.5 rounded-xl uppercase tracking-wider text-xs disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Registrar Inversión
                </button>
             </div>
           )}

           {positions.length === 0 && !showForm && (
             <div className="text-center bg-bg-chat border border-border-subtle rounded-3xl py-10 px-6 premium-shadow">
                <TrendingUp size={32} className="mx-auto mb-3 text-text-secondary opacity-50" />
                <div className="font-bold text-sm text-text-primary mb-1">Aún no tienes inversiones registradas</div>
                <div className="text-[11px] text-text-secondary mb-5 leading-relaxed">Registra tu primer aporte y aquí verás tu portafolio crecer con datos reales.</div>
                <button
                  onClick={() => setShowForm(true)}
                  className="gold-gradient font-black px-6 py-3 rounded-xl uppercase tracking-wider text-xs"
                >
                  Registrar mi primera inversión
                </button>
             </div>
           )}

           {positions.slice().reverse().map(pos => (
             <div key={pos.id} className="bg-bg-chat p-4 rounded-2xl border border-border-subtle premium-shadow group hover:border-gold-primary/30 transition-colors">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-bg-bubble-jarvis border border-border-subtle rounded-full flex items-center justify-center font-bold text-gold-deep uppercase">
                        {pos.name.slice(0, 3)}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{pos.name}</div>
                        <div className="text-[10px] text-text-secondary uppercase tracking-widest font-mono">
                          {pos.date ? new Date(pos.date).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Sin fecha'}
                        </div>
                      </div>
                   </div>
                   <div className="font-bold font-mono">${(Number(pos.amount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

// Palabras que delatan una suscripción en la categoría o descripción.
const SUBSCRIPTION_KEYWORDS = [
  'netflix', 'spotify', 'disney', 'hbo', 'max', 'prime', 'youtube', 'apple',
  'icloud', 'google one', 'dropbox', 'cloud', 'adobe', 'canva', 'office',
  'microsoft', 'chatgpt', 'openai', 'claude', 'gym', 'gimnasio', 'club',
  'suscri', 'subscri', 'membres', 'mensualidad', 'plan ',
];

type DetectedSub = {
  key: string;
  name: string;
  amount: number;
  count: number;
  lastDate: string;
  isDemo?: boolean;
};

// Motor real del Agente Negociador: agrupa los gastos del store por concepto
// y marca como suscripción lo que (a) suena a suscripción por su nombre, o
// (b) se repite con el mismo monto (cargo recurrente).
function detectSubscriptions(transactions: { type: string; amount: number; category: string; description: string; date: string }[]): DetectedSub[] {
  const groups = new Map<string, { amounts: number[]; dates: string[]; label: string; textBlob: string }>();

  for (const tx of transactions) {
    if (tx.type !== 'expense' || tx.category === 'Ahorro Bóveda') continue;
    const key = tx.category.trim().toLowerCase();
    if (!key) continue;
    const g = groups.get(key) || { amounts: [], dates: [], label: tx.category.trim(), textBlob: '' };
    g.amounts.push(tx.amount);
    g.dates.push(tx.date);
    g.textBlob += ' ' + (tx.category + ' ' + (tx.description || '')).toLowerCase();
    groups.set(key, g);
  }

  const result: DetectedSub[] = [];
  for (const [key, g] of groups) {
    const soundsLikeSub = SUBSCRIPTION_KEYWORDS.some(k => g.textBlob.includes(k));
    const sameAmountTwice = g.amounts.length >= 2 && new Set(g.amounts.map(a => a.toFixed(2))).size < g.amounts.length;
    if (!soundsLikeSub && !sameAmountTwice) continue;
    result.push({
      key,
      name: g.label,
      amount: g.amounts[g.amounts.length - 1],
      count: g.amounts.length,
      lastDate: g.dates[g.dates.length - 1],
    });
  }
  return result.sort((a, b) => b.amount - a.amount);
}

const DEMO_SUBS: DetectedSub[] = [
  { key: 'demo-1', name: 'Netflix Premium', amount: 19.99, count: 3, lastDate: '', isDemo: true },
  { key: 'demo-2', name: 'Spotify Duo', amount: 14.99, count: 4, lastDate: '', isDemo: true },
  { key: 'demo-3', name: 'Gimnasio Fit', amount: 45.00, count: 2, lastDate: '', isDemo: true },
];

// Clave de almacenamiento de suscripciones descartadas por el usuario.
const DISMISSED_SUBS_KEY = 'midas_dismissed_subs';

function loadDismissedSubs(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(DISMISSED_SUBS_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter((k) => typeof k === 'string') : [];
  } catch {
    return [];
  }
}

export function NegociadorScreen({ onBack }: { onBack: () => void }) {
  const { profile, updateField } = useUserProfileStore();
  const notify = useNotificationsStore((s) => s.add);
  // Los descartes persisten en el dispositivo: descartar hoy sigue
  // descartado mañana.
  const [dismissed, setDismissed] = useState<string[]>(() => loadDismissedSubs());

  const dismissSub = (key: string) => {
    setDismissed(prev => {
      const next = prev.includes(key) ? prev : [...prev, key];
      try { localStorage.setItem(DISMISSED_SUBS_KEY, JSON.stringify(next)); } catch { /* sin storage, solo sesión */ }
      return next;
    });
  };

  // "Ya la cancelé": descuenta el monto mensual de tus gastos fijos en
  // suscripciones (sin bajar de 0) y la saca de la lista.
  const markCancelled = (sub: DetectedSub) => {
    const current = Number(profile.fixedExpenses?.subscriptions) || 0;
    updateField('fixedExpenses.subscriptions', Math.max(0, current - sub.amount));
    notify('Agente Negociador', `${sub.name} marcada como cancelada: liberas $${sub.amount.toFixed(2)}/mes.`);
    dismissSub(sub.key);
  };

  const detected = detectSubscriptions(profile.transactions || []);
  const usingDemo = detected.length === 0;
  // El ahorro posible es la suma de lo que sigue sobre la mesa: las
  // suscripciones NO descartadas. Descartar una lo baja.
  const subs = (usingDemo ? DEMO_SUBS : detected).filter(s => !dismissed.includes(s.key));
  const monthlySaving = subs.reduce((sum, s) => sum + s.amount, 0);
  const annualSaving = monthlySaving * 12;

  return (
    <div className="absolute inset-0 bg-bg-main z-50 flex flex-col overflow-y-auto">
      <div className="p-4 flex items-center justify-between sticky top-0 bg-bg-main/90 backdrop-blur-md z-10 border-b border-border-subtle">
        <button onClick={onBack} className="p-2 hover:bg-bg-chat rounded-full text-gold-deep transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
           <span className="font-bold tracking-widest uppercase text-text-primary text-sm flex items-center gap-2">
             <Activity size={18} className="text-gold-primary" />
             Optimizador de Contratos
           </span>
           <span className="text-[9px] text-text-secondary uppercase tracking-widest font-mono">Renegociación Automática</span>
        </div>
        <div className="w-10"></div>
      </div>
      <div className="p-6 space-y-6">
        <div className="bg-bg-chat p-5 rounded-3xl premium-shadow border border-border-subtle">
           <div className="flex items-center justify-between">
              <div>
                 <div className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mb-1">
                   Ahorro Mensual Posible{usingDemo && <span className="ml-1.5 bg-border-subtle text-text-secondary px-1.5 py-0.5 rounded-full normal-case">Ejemplo</span>}
                 </div>
                 <div className={`text-3xl font-black font-mono ${usingDemo ? 'text-text-secondary' : 'text-gold-deep'}`}>${monthlySaving.toFixed(2)}</div>
              </div>
              <div className="text-right">
                 <div className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mb-1">Al año{usingDemo ? ' (ejemplo)' : ''}</div>
                 <div className={`text-lg font-black font-mono ${usingDemo ? 'text-text-secondary' : 'text-text-primary'}`}>${annualSaving.toFixed(2)}</div>
              </div>
           </div>
           <p className="text-[10px] text-text-secondary mt-3 leading-relaxed">
             {usingDemo
               ? 'Aún no detecto suscripciones en tus movimientos reales; estos son ejemplos. Registra tus gastos en el chat y las encontraré.'
               : 'Detectadas en tus movimientos reales. El Negociador propone; tú decides qué cancelar.'}
           </p>
        </div>

        <div className="space-y-4">
           <h3 className="font-bold text-sm tracking-wide mb-2 flex items-center gap-2">
             Suscripciones Detectadas
             {usingDemo ? (
               <span className="bg-border-subtle text-text-secondary px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest">Ejemplo</span>
             ) : (
               <span className="bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest">Alerta</span>
             )}
           </h3>
           {subs.map(sub => (
              <div key={sub.key} className="bg-bg-chat p-4 rounded-2xl border border-border-subtle premium-shadow group hover:border-red-500/30 transition-colors">
                 <div className="flex justify-between items-center">
                    <div>
                       <div className="font-bold text-sm text-text-primary">{sub.name}</div>
                       <div className="text-[10px] text-text-secondary mt-1 font-mono">
                         {sub.count > 1 ? `${sub.count} cargos detectados` : 'Cargo recurrente probable'} · <span className="text-gold-deep font-bold">${(sub.amount * 12).toFixed(2)}/año</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="text-right">
                          <div className="text-sm font-bold font-mono text-text-primary">${sub.amount.toFixed(2)}</div>
                          <div className="text-[9px] text-text-secondary uppercase">{sub.lastDate ? new Date(sub.lastDate).toLocaleDateString() : 'mensual'}</div>
                       </div>
                       <button
                        onClick={() => dismissSub(sub.key)}
                        aria-label={`Descartar ${sub.name}`}
                        className="w-8 h-8 rounded-full bg-bg-main text-text-secondary flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors border border-border-subtle">
                          <X size={16} />
                       </button>
                    </div>
                 </div>
                 {!sub.isDemo && (
                   <button
                     onClick={() => markCancelled(sub)}
                     className="mt-3 w-full py-2 rounded-xl border border-border-subtle bg-bg-main text-[10px] font-black uppercase tracking-widest text-text-primary hover:border-gold-primary hover:text-gold-deep transition-colors flex items-center justify-center gap-1.5"
                   >
                     <Check size={12} /> Ya la cancelé
                   </button>
                 )}
              </div>
           ))}
           {subs.length === 0 && (
              <div className="text-center bg-green-500/10 border border-green-500/30 rounded-2xl text-green-500 font-bold py-8 text-sm">
                 <ShieldCheck size={32} className="mx-auto mb-2 opacity-50" />
                 Portafolio de contratos limpio y optimizado.
              </div>
           )}
        </div>
      </div>
    </div>
  );
}

export function AntiInflacionScreen({ onBack }: { onBack: () => void }) {
  const [exchanged, setExchanged] = useState(false);

  return (
    <div className="absolute inset-0 bg-bg-main z-50 flex flex-col overflow-y-auto">
      <div className="p-4 flex items-center justify-between sticky top-0 bg-bg-main/90 backdrop-blur-md z-10 border-b border-border-subtle">
        <button onClick={onBack} className="p-2 hover:bg-bg-chat rounded-full text-gold-deep transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
           <span className="font-bold tracking-widest uppercase text-text-primary text-sm flex items-center gap-2">
             <RefreshCw size={18} className="text-gold-primary" />
             Escudo Monetario Soberano
           </span>
           <span className="text-[9px] text-text-secondary uppercase tracking-widest font-mono">Forex Shield Activado</span>
        </div>
        <div className="w-10"></div>
      </div>
      <div className="p-6 space-y-6">
         <div className="bg-gradient-to-br from-red-500/10 via-bg-chat to-bg-chat border border-red-500/30 p-6 rounded-3xl premium-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full"></div>
            <div className="flex items-center gap-2 text-[10px] text-red-400 uppercase font-bold tracking-widest mb-4">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Alerta de Devaluación
            </div>
            <div className="font-mono text-xs text-text-secondary mb-1">Tasa de Cambio Implícita (Paralelo)</div>
            <div className="text-4xl font-black text-text-primary tracking-tight">1 USD = 54.30 Ars/Bs</div>
            <div className="text-[10px] text-red-400 font-bold mt-2 font-mono flex items-center gap-1">
               <TrendingUp size={12} className="rotate-180" /> -4.2% frente al USD en 24h
            </div>
         </div>

         <div className="bg-bg-chat p-5 rounded-3xl border border-border-subtle premium-shadow">
            <div className="flex justify-between items-center mb-4">
               <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Liquidez a Proteger</div>
               <div className="text-[10px] text-gold-deep font-mono">Saldo: 450,000 Ars/Bs</div>
            </div>
            <div className="text-3xl font-black text-text-primary text-center my-4 font-mono">
               ~$8,287.00 <span className="text-sm text-text-secondary">USD</span>
            </div>
            
            {!exchanged ? (
               <button onClick={() => setExchanged(true)} className="w-full bg-gold-primary/10 text-gold-primary border border-gold-primary/30 hover:bg-gold-primary hover:text-black py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all mt-4 premium-shadow">
                  Ejecutar Swap a USDT
               </button>
            ) : (
               <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-500 font-bold uppercase tracking-widest text-[10px] mt-4 flex justify-center items-center gap-2">
                  <Check size={16} /> Cobertura Ejecutada en 45ms.
               </div>
            )}
         </div>

         <div className="bg-bg-chat p-4 rounded-2xl border border-border-subtle text-xs text-text-secondary leading-relaxed">
            El <strong>Escudo Monetario</strong> monitorea la brecha cambiaria en tiempo real. Si la moneda local se devalúa agresivamente, liquidaremos tu liquidez sobrante a Stablecoins automáticamente. (Configuración manual activada).
         </div>
      </div>
    </div>
  );
}

export function MetasScreen({ onBack }: { onBack: () => void }) {
  const { profile, updateField, transferToVault } = useUserProfileStore();
  const notify = useNotificationsStore((s) => s.add);

  const current = profile.savings.currentTotal || 0;
  const target = Number(profile.goals.shortTermAmount) || 0;
  const hasGoal = target > 0;
  const progress = hasGoal ? Math.min(100, Math.max(0, (current / target) * 100)) : 0;

  // Formulario de crear/editar meta.
  const [editing, setEditing] = useState(false);
  const [goalName, setGoalName] = useState(profile.goals.shortTerm || '');
  const [goalAmount, setGoalAmount] = useState(hasGoal ? String(target) : '');

  // Aporte manual a la meta.
  const [contribution, setContribution] = useState('');
  const [warning, setWarning] = useState('');

  // Aporte sugerido: % real de la regla Págate Primero (configurable en el
  // Ahorrador), acotado por el disponible. Con eso proyectamos el logro.
  const rate = getSavingsRate();
  const income = profile.computed?.totalIncome || 0;
  const available = profile.computed?.availableToSave || 0;
  const suggested = Math.max(0, Math.round(Math.min(income * rate, Math.max(available, 0))));
  const remaining = Math.max(0, target - current);
  const monthsToGoal = suggested > 0 ? Math.ceil(remaining / suggested) : null;
  const etaLabel = remaining === 0
    ? '¡Meta cumplida!'
    : monthsToGoal !== null && monthsToGoal <= 120
      ? new Date(new Date().setMonth(new Date().getMonth() + monthsToGoal)).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'Registra ingresos para proyectar';

  // Ritmo derivado, sin números mágicos: qué fracción de lo que falta cubre
  // un año de aportes sugeridos. 100% = la cubres en 12 meses o menos.
  const coverage = remaining === 0
    ? 1
    : suggested > 0
      ? Math.min(1, (suggested * 12) / remaining)
      : 0;
  const successProb = Math.round(coverage * 100);

  const saveGoal = () => {
    const value = parseFloat(goalAmount);
    if (!goalName.trim() || !Number.isFinite(value) || value <= 0) return;
    updateField('goals.shortTerm', goalName.trim());
    updateField('goals.shortTermAmount', value);
    setEditing(false);
  };

  const contribute = () => {
    const value = parseFloat(contribution);
    if (!Number.isFinite(value) || value <= 0) return;
    if (value > available) {
      setWarning(`Ese aporte ($${value.toFixed(2)}) supera tu disponible ($${Math.max(0, available).toFixed(2)}).`);
      return;
    }
    setWarning('');
    const result = transferToVault(value, `Aporte a meta: ${profile.goals.shortTerm || 'Meta Principal'}`);
    notify('Agente de Metas', `Aporte de $${value.toFixed(2)} a "${profile.goals.shortTerm || 'Meta Principal'}". Bóveda: $${result.newVaultTotal.toLocaleString()}.`);
    setContribution('');
  };

  const goalForm = (
    <div className="bg-bg-chat p-5 rounded-3xl border border-gold-primary/30 premium-shadow space-y-3">
      <div>
        <label className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-1.5 block">Nombre de la meta</label>
        <input
          type="text"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
          placeholder="Ej. Fondo de emergencia, Viaje..."
          className="w-full bg-bg-main border border-border-subtle rounded-xl p-3 text-sm text-text-primary outline-none focus:border-gold-primary transition-colors"
        />
      </div>
      <div>
        <label className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-1.5 block">Monto objetivo</label>
        <div className="flex items-center gap-2 bg-bg-main border border-border-subtle rounded-xl px-3">
          <span className="text-sm font-bold text-text-secondary">$</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            placeholder="0.00"
            className="flex-1 bg-transparent border-none outline-none p-3 pl-0 text-sm font-bold text-text-primary"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={saveGoal}
          disabled={!goalName.trim() || !goalAmount || isNaN(parseFloat(goalAmount)) || parseFloat(goalAmount) <= 0}
          className="flex-1 gold-gradient font-black py-3.5 rounded-xl uppercase tracking-wider text-xs disabled:opacity-50"
        >
          {hasGoal ? 'Guardar cambios' : 'Crear meta'}
        </button>
        {hasGoal && (
          <button
            onClick={() => setEditing(false)}
            className="px-4 py-3.5 rounded-xl border border-border-subtle bg-bg-main text-xs font-bold text-text-secondary hover:text-text-primary transition-colors uppercase tracking-wider"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 bg-bg-main z-50 flex flex-col overflow-y-auto">
      <div className="p-4 flex items-center justify-between sticky top-0 bg-bg-main/90 backdrop-blur-md z-10 border-b border-border-subtle">
        <button onClick={onBack} className="p-2 hover:bg-bg-chat rounded-full text-gold-deep transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
           <span className="font-bold tracking-widest uppercase text-text-primary text-sm flex items-center gap-2">
             <Target size={18} className="text-gold-primary" />
             Trazador de Trayectorias
           </span>
           <span className="text-[9px] text-text-secondary uppercase tracking-widest font-mono">Proyección según tu ritmo actual</span>
        </div>
        <div className="w-10"></div>
      </div>
      <div className="p-6 space-y-6">
         {!hasGoal ? (
           <>
             <div className="text-center bg-bg-chat border border-border-subtle rounded-3xl py-10 px-6 premium-shadow">
                <Target size={32} className="mx-auto mb-3 text-text-secondary opacity-50" />
                <div className="font-bold text-sm text-text-primary mb-1">Aún no has definido una meta</div>
                <div className="text-[11px] text-text-secondary leading-relaxed">Define cuánto quieres reunir y proyectaremos tu trayectoria con tus datos reales.</div>
             </div>
             {goalForm}
           </>
         ) : editing ? (
           goalForm
         ) : (
           <>
             <div className="bg-bg-chat p-6 rounded-3xl border border-gold-primary/30 premium-shadow text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-text-secondary mb-2">{profile.goals.shortTerm || 'Meta Principal'}</h3>
                <div className="text-5xl font-black text-text-primary font-mono">${current.toLocaleString()}</div>
                <div className="text-[10px] text-text-secondary mt-1 font-mono">Target: ${target.toLocaleString()}</div>

                <div className="w-full h-2 bg-bg-main rounded-full overflow-hidden border border-border-subtle mt-6">
                   <motion.div
                     initial={{ width: 0 }}
                     animate={{ width: `${progress}%` }}
                     transition={{ duration: 1, ease: 'easeOut' }}
                     className="h-full bg-gold-primary"
                   />
                </div>
                <div className="flex justify-between items-center mt-2 text-[10px] font-bold font-mono">
                   <span className="text-gold-deep">{progress.toFixed(1)}%</span>
                   <span className="text-text-secondary">Est. Logro: {etaLabel}</span>
                </div>
                <button
                  onClick={() => { setGoalName(profile.goals.shortTerm || ''); setGoalAmount(String(target)); setEditing(true); }}
                  className="mt-4 text-[10px] text-text-primary font-bold border border-border-subtle bg-bg-main rounded-full px-3 py-1.5 hover:border-gold-primary transition-colors uppercase tracking-wider"
                >
                  Editar meta
                </button>
             </div>

             <div className="bg-bg-chat p-5 rounded-3xl border border-border-subtle premium-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm tracking-wide">Aportar a la meta</h3>
                  <span className="text-[10px] font-mono text-text-secondary">Disp: <span className="text-text-primary font-bold">${Math.max(0, available).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></span>
                </div>
                <div className="flex items-center gap-2 bg-bg-main border border-border-subtle rounded-xl px-3 mb-3">
                  <span className="text-sm font-bold text-text-secondary">$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    value={contribution}
                    onChange={(e) => setContribution(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 bg-transparent border-none outline-none p-3 pl-0 text-sm font-bold text-text-primary"
                  />
                </div>
                {warning && (
                  <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-3 text-red-500 text-[11px] font-bold leading-relaxed">
                    <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                    <span>{warning}</span>
                  </div>
                )}
                <button
                  onClick={contribute}
                  disabled={!contribution || isNaN(parseFloat(contribution)) || parseFloat(contribution) <= 0}
                  className="w-full gold-gradient font-black py-3.5 rounded-xl uppercase tracking-wider text-xs disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <PiggyBank size={14} /> Aportar a la meta
                </button>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="bg-bg-chat p-4 rounded-3xl border border-border-subtle premium-shadow">
                   <div className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-1">Aporte Sugerido</div>
                   <div className="text-lg font-black text-text-primary font-mono">${suggested}<span className="text-xs text-text-secondary">/mes</span></div>
                   <div className="text-[9px] text-text-secondary mt-3 leading-tight">{Math.round(rate * 100)}% de tu ingreso (Págate Primero), sin exceder tu disponible.</div>
                </div>
                <div className="bg-bg-chat p-4 rounded-3xl border border-border-subtle premium-shadow">
                   <div className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-1">Ritmo hacia la meta</div>
                   <div className={`text-lg font-black font-mono ${successProb >= 80 ? 'text-green-500' : successProb >= 60 ? 'text-orange-400' : 'text-red-500'}`}>{successProb}%</div>
                   <div className="text-[9px] text-text-secondary mt-4 leading-tight">Parte de lo que falta que cubrirías en 12 meses con tu aporte sugerido.</div>
                </div>
             </div>
           </>
         )}
      </div>
    </div>
  );
}

export function RecordatorioScreen({ onBack }: { onBack: () => void }) {
  const { items, add, toggleDone, remove } = useRemindersStore();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Ordenados por fecha ascendente (el store ya lo hace al añadir, pero
  // ordenamos también aquí por si el storage trae otro orden).
  const sorted = items.slice().sort((a, b) => a.date.localeCompare(b.date));
  const pending = sorted.filter(r => !r.done).length;

  const handleAdd = () => {
    if (!title.trim() || !date) return;
    const value = parseFloat(amount);
    // Guardamos mediodía local para que la fecha no se corra por zona horaria.
    add(title.trim(), `${date}T12:00:00`, Number.isFinite(value) && value > 0 ? value : undefined);
    setTitle('');
    setDate('');
    setAmount('');
    setShowForm(false);
  };

  const monthAbbr = (iso: string) => new Date(iso).toLocaleDateString('es', { month: 'short' }).replace('.', '').toUpperCase();

  return (
    <div className="absolute inset-0 bg-bg-main z-50 flex flex-col overflow-y-auto">
      <div className="p-4 flex items-center justify-between sticky top-0 bg-bg-main/90 backdrop-blur-md z-10 border-b border-border-subtle">
        <button onClick={onBack} className="p-2 hover:bg-bg-chat rounded-full text-gold-deep transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
           <span className="font-bold tracking-widest uppercase text-text-primary text-sm flex items-center gap-2">
             <BellRing size={18} className="text-gold-primary" />
             Crono-Gestor
           </span>
           <span className="text-[9px] text-text-secondary uppercase tracking-widest font-mono">Tu Calendario Financiero</span>
        </div>
        <div className="w-10"></div>
      </div>
      <div className="p-6 space-y-4">
         <div className="bg-bg-chat p-5 rounded-3xl border border-border-subtle premium-shadow text-center mb-2">
            <CalendarDays size={32} className="text-gold-primary mx-auto mb-3" />
            <div className="text-sm font-bold text-text-primary">
              {pending === 0 ? 'Sin eventos en cola' : pending === 1 ? '1 evento en cola' : `${pending} eventos en cola`}
            </div>
            <div className="text-[10px] text-text-secondary mt-1">Te lo recordaré aquí y contará en tu calendario financiero.</div>
         </div>

         <button
           onClick={() => setShowForm(v => !v)}
           className="w-full gold-gradient font-black py-3.5 rounded-2xl uppercase tracking-wider text-xs flex items-center justify-center gap-2"
         >
           <Plus size={14} /> {showForm ? 'Cerrar formulario' : 'Añadir recordatorio'}
         </button>

         {showForm && (
           <div className="bg-bg-chat p-5 rounded-3xl border border-gold-primary/30 premium-shadow space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-1.5 block">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Pago de tarjeta, Renta..."
                  className="w-full bg-bg-main border border-border-subtle rounded-xl p-3 text-sm text-text-primary outline-none focus:border-gold-primary transition-colors"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-1.5 block">Fecha</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-bg-main border border-border-subtle rounded-xl p-3 text-sm text-text-primary outline-none focus:border-gold-primary transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-1.5 block">Monto (opcional)</label>
                  <div className="flex items-center gap-2 bg-bg-main border border-border-subtle rounded-xl px-3">
                    <span className="text-sm font-bold text-text-secondary">$</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 w-full bg-transparent border-none outline-none p-3 pl-0 text-sm font-bold text-text-primary"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handleAdd}
                disabled={!title.trim() || !date}
                className="w-full gold-gradient font-black py-3.5 rounded-xl uppercase tracking-wider text-xs disabled:opacity-50"
              >
                Guardar recordatorio
              </button>
           </div>
         )}

         {sorted.length === 0 && !showForm && (
           <div className="text-center bg-bg-chat border border-border-subtle rounded-3xl py-10 px-6 premium-shadow">
              <BellRing size={32} className="mx-auto mb-3 text-text-secondary opacity-50" />
              <div className="font-bold text-sm text-text-primary mb-1">Aún no tienes recordatorios</div>
              <div className="text-[11px] text-text-secondary leading-relaxed">Crea el primero y no volverás a olvidar una fecha de pago.</div>
           </div>
         )}

         {sorted.map(r => (
           <div key={r.id} className={`bg-bg-chat p-5 rounded-2xl border flex items-start gap-4 premium-shadow transition-colors ${r.done ? 'border-border-subtle opacity-60' : 'border-gold-primary/30 hover:border-gold-primary'}`}>
              <div className={`w-14 h-14 rounded-2xl flex flex-col justify-center items-center flex-shrink-0 border ${r.done ? 'bg-bg-main text-text-secondary border-border-subtle' : 'bg-gold-primary/10 text-gold-primary border-gold-primary/20'}`}>
                 <span className="text-[9px] font-bold uppercase tracking-widest">{monthAbbr(r.date)}</span>
                 <span className="text-xl font-black">{new Date(r.date).getDate()}</span>
              </div>
              <div className="flex-1 min-w-0">
                 <div className={`font-bold text-sm text-text-primary ${r.done ? 'line-through' : ''}`}>{r.title}</div>
                 <div className="text-[10px] text-text-secondary mt-1.5 leading-relaxed">
                   {new Date(r.date).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}
                   {typeof r.amount === 'number' && <> · <span className="text-gold-deep font-bold">${r.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></>}
                 </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                 <button
                   onClick={() => toggleDone(r.id)}
                   aria-label={r.done ? `Reabrir ${r.title}` : `Marcar ${r.title} como hecho`}
                   className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${r.done ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-bg-main text-text-secondary border-border-subtle hover:text-green-500 hover:border-green-500/50'}`}
                 >
                   <Check size={15} />
                 </button>
                 <button
                   onClick={() => remove(r.id)}
                   aria-label={`Eliminar ${r.title}`}
                   className="w-8 h-8 rounded-full bg-bg-main text-text-secondary flex items-center justify-center border border-border-subtle hover:bg-red-500 hover:text-white transition-colors"
                 >
                   <Trash2 size={14} />
                 </button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}

export function AgentHubScreen({ onBack, onOpenAgent }: { onBack: () => void, onOpenAgent: (type: string) => void }) {
  const agents = [
    { name: 'Pagador Facturas', type: 'pagador', icon: <CreditCard size={20} /> },
    { name: 'Ahorrador', type: 'ahorrador', icon: <PiggyBank size={20} /> },
    { name: 'Inversor', type: 'inversor', icon: <TrendingUp size={20} /> },
    { name: 'Vigilante Gastos', type: 'monitoreo', icon: <Activity size={20} /> },
    { name: 'Negociador', type: 'negociador', icon: <X size={20} /> },
    { name: 'Anti-Inflación', type: 'anti_inflacion', icon: <RefreshCw size={20} /> },
    { name: 'Meta y Bóveda', type: 'metas', icon: <Target size={20} /> },
    { name: 'Recordatorios', type: 'recordatorio', icon: <BellRing size={20} /> },
  ];

  return (
    <div className="absolute inset-0 bg-bg-main z-50 flex flex-col overflow-y-auto">
      <div className="p-4 flex items-center justify-between sticky top-0 bg-bg-main/90 backdrop-blur-md z-10 border-b border-border-subtle">
        <button onClick={onBack} className="p-2 hover:bg-bg-chat rounded-full text-gold-deep transition-colors">
          <ArrowLeft size={24} />
        </button>
        <span className="font-bold tracking-widest uppercase text-text-primary text-sm">
          Suite de Agentes
        </span>
        <div className="w-10"></div>
      </div>
      <div className="p-6">
        <p className="text-sm text-text-secondary mb-6 text-center">Un ejército de inteligencias artificiales trabajando por tu libertad financiera.</p>
        <div className="grid grid-cols-2 gap-4">
          {agents.map(a => (
            <div
              key={a.type}
              className="bg-bg-chat border border-border-subtle p-4 rounded-2xl hover:border-gold-primary transition-all flex flex-col items-center gap-3 text-center premium-shadow group"
            >
              <button
                onClick={() => onOpenAgent(a.type)}
                className="flex flex-col items-center gap-2 w-full"
              >
                <div className="w-12 h-12 bg-bg-bubble-jarvis rounded-full flex items-center justify-center text-gold-primary group-hover:bg-gold-primary group-hover:text-black transition-colors">
                   {a.icon}
                </div>
                <span className="text-xs font-bold text-text-primary">{a.name}</span>
              </button>
              <AutonomySelector agentType={a.type} compact />
            </div>
          ))}
        </div>
        <p className="text-[11px] text-text-secondary mt-6 text-center leading-relaxed">
          Nivel de autonomía por agente: <span className="text-gold-primary font-bold">Sugerir</span> solo recomienda · <span className="text-gold-primary font-bold">Aprobar</span> pide tu autorización · <span className="text-gold-primary font-bold">Autónomo</span> ejecuta dentro de tu límite.
        </p>
      </div>
    </div>
  );
}
