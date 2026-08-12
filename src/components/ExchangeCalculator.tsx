
import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { motion, AnimatePresence } from 'framer-motion';

interface ExchangeCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TasaBCV {
  disponible: boolean;
  usd?: number;
  eur?: number;
  fechaValor?: string;
  fuente?: string;
  motivo?: string;
}

export const ExchangeCalculator: React.FC<ExchangeCalculatorProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState<string>('');
  const [rateType, setRateType] = useState<'BCV' | 'EUR'>('BCV');
  const [isRefreshing, setIsRefreshing] = useState(false);
  // La tasa nunca se escribe a mano: se consulta al BCV vía /api/rate.
  const [tasa, setTasa] = useState<TasaBCV | null>(null);

  const refreshRates = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/rate');
      setTasa(await res.json());
    } catch {
      setTasa({ disponible: false, motivo: 'Sin conexión con el servidor de tasas.' });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshRates();
    }
  }, [isOpen]);

  const currentRate = tasa?.disponible ? (rateType === 'BCV' ? tasa.usd : tasa.eur) : undefined;
  const bsResult = amount && currentRate ? (parseFloat(amount.replace(',', '.')) * currentRate).toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '—';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[110] bg-black/40 backdrop-blur-md flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0" 
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-sm bg-white dark:bg-[#121212] rounded-[3rem] shadow-none overflow-hidden border border-slate-100 dark:border-white/10"
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Icons.Calculator size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Calculadora Dual</h3>
                  <p className="text-[9px] font-bold text-slate-400 tracking-widest">Conversión Instantánea</p>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                <Icons.X size={18} />
              </button>
            </div>

            <div className="flex p-1 bg-slate-50 dark:bg-white/5 rounded-2xl mb-8 border border-slate-100 dark:border-white/5">
              {(['BCV', 'EUR'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setRateType(type)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-bold transition-all ${
                    rateType === type 
                    ? 'bg-white dark:bg-black text-blue-500 shadow-none border border-slate-100 dark:border-white/10' 
                    : 'text-slate-400'
                  }`}
                >
                  {type === 'BCV' ? 'Dólar (USD)' : 'Euro (EUR)'}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between px-1">
                  <label className="text-[10px] font-bold text-slate-400">Monto a Convertir ({rateType === 'BCV' ? 'USD' : 'EUR'})</label>
                  <button 
                    onClick={() => {
                      setRateType(rateType === 'BCV' ? 'EUR' : 'BCV');
                      refreshRates();
                    }}
                    className={`flex items-center gap-1 text-[10px] font-bold text-blue-500 ${isRefreshing ? 'animate-pulse' : ''}`}
                  >
                    <Icons.RefreshCw size={10} className={isRefreshing ? 'animate-spin' : ''} />
                    Tasa {rateType}: {isRefreshing ? 'consultando…' : currentRate ? currentRate.toFixed(2) : 'no disponible'}
                  </button>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-16 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl px-12 text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">{rateType === 'BCV' ? '$' : '€'}</span>
                </div>
              </div>

              <div className="bg-[#0A0A0A] dark:bg-white p-6 rounded-[2rem] text-white dark:text-black relative overflow-hidden shadow-none">
                <div className="relative z-10">
                  <p className="text-[9px] font-bold text-slate-500 tracking-widest mb-1">Monto en Bolívares (Bs)</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tighter">{bsResult}</span>
                    <span className="text-xs font-bold text-blue-500">Bs</span>
                  </div>
                  <p className="text-[9px] font-bold text-slate-500 tracking-widest mt-2">
                    {tasa?.disponible
                      ? `Tasa oficial BCV${tasa.fechaValor ? ` · Fecha valor: ${tasa.fechaValor}` : ''}`
                      : isRefreshing
                        ? 'Consultando la tasa oficial del BCV…'
                        : 'La tasa oficial del BCV no está disponible en este momento.'}
                  </p>
                </div>
                <Icons.Zap size={80} className="absolute -right-4 -bottom-4 text-white/5 dark:text-black/5 rotate-12" />
              </div>
            </div>

            <button 
              onClick={() => {
                setAmount('');
                onClose();
              }}
              className="w-full mt-8 bg-slate-50 dark:bg-white/5 text-slate-400 py-4 rounded-2xl font-bold text-[10px] tracking-[0.2em] active:scale-95 transition-all"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
