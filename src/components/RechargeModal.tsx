
import React, { useState } from 'react';
import { Icons } from './Icons';
import { motion, AnimatePresence } from 'framer-motion';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

export const RechargeModal: React.FC<RechargeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'amount' | 'bank' | 'processing' | 'success'>('amount');
  const [amount, setAmount] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState('0102 - Banco de Venezuela');

  const handleNext = () => {
    if (step === 'amount') setStep('bank');
    else if (step === 'bank') {
      setStep('processing');
      setTimeout(() => {
        setStep('success');
        onSuccess(parseFloat(amount));
      }, 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[120] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md" 
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white dark:bg-[#121212] w-full max-w-sm rounded-[3rem] overflow-hidden shadow-none border border-white/10"
        >
          <div className="absolute inset-0 noise-bg opacity-[0.03] dark:opacity-[0.02] pointer-events-none"></div>
          <div className="p-8 relative z-10">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-none">
                  <Icons.Zap size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight">Recarga Segura</h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cifrado de Grado Militar</p>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-black dark:hover:text-white transition-colors">
                <Icons.X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {step === 'amount' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Monto a Recargar (Bs)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full h-16 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl px-12 text-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">Bs</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['100', '500', '1000'].map(val => (
                    <button 
                      key={val}
                      onClick={() => setAmount(val)}
                      className="py-3 rounded-xl bg-slate-50 dark:bg-white/5 text-[10px] font-bold uppercase border border-slate-100 dark:border-white/5 hover:bg-blue-500 hover:text-white transition-all"
                    >
                      {val} Bs
                    </button>
                  ))}
                </div>
                <button 
                  disabled={!amount || parseFloat(amount) <= 0}
                  onClick={handleNext}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold text-sm shadow-none disabled:opacity-50 disabled:grayscale transition-all"
                >
                  Continuar
                </button>
              </div>
            )}

            {step === 'bank' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-500 flex items-center justify-center text-white font-bold text-xs">BDV</div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Banco Emisor</p>
                      <p className="text-sm font-bold">{selectedBank}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Monto</span>
                      <span className="font-bold">{parseFloat(amount).toLocaleString('es-VE')} Bs</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Comisión</span>
                      <span className="font-bold text-emerald-500">0.00 Bs</span>
                    </div>
                    <div className="h-px bg-slate-200 dark:bg-white/10 my-2"></div>
                    <div className="flex justify-between text-sm">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-blue-500">{parseFloat(amount).toLocaleString('es-VE')} Bs</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleNext}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold text-sm shadow-none"
                >
                  Confirmar Recarga
                </button>
                <button 
                  onClick={() => setStep('amount')}
                  className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                >
                  Atrás
                </button>
              </div>
            )}

            {step === 'processing' && (
              <div className="py-12 flex flex-col items-center gap-6 text-center animate-in fade-in duration-500">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-slate-100 dark:border-white/5 border-t-blue-500 animate-spin"></div>
                  <Icons.ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">Procesando Pago</h3>
                  <p className="text-xs text-slate-400 font-medium">Validando con Banco de Venezuela...</p>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="py-8 flex flex-col items-center gap-6 text-center animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Icons.CheckCircle2 size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">¡Recarga Exitosa!</h3>
                  <p className="text-xs text-slate-400 font-medium">Su saldo ha sido actualizado instantáneamente.</p>
                </div>
                <div className="w-full bg-slate-50 dark:bg-white/5 p-4 rounded-2xl text-xs font-mono">
                  Ref: BDV-{Math.random().toString(36).substring(2, 10).toUpperCase()}
                </div>
                <button 
                  onClick={onClose}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold text-sm shadow-none"
                >
                  Entendido
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
