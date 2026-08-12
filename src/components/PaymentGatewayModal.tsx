
import React, { useState } from 'react';
import { Icons } from './Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useVibration } from '../hooks/useVibration';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  amount: number;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({ isOpen, onClose, serviceName, amount }) => {
  const { vibrate } = useVibration();
  const [step, setStep] = useState<'method' | 'details' | 'processing' | 'success'>('method');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentMethods = [
    { id: 'pago-movil', name: 'Pago Móvil', icon: Icons.Smartphone, color: 'bg-blue-500/10 text-blue-500', desc: 'Liquidación instantánea' },
    { id: 'bdv-en-linea', name: 'BDV en Línea', icon: Icons.Landmark, color: 'bg-rose-500/10 text-rose-500', desc: 'Débito directo cuenta BDV' },
    { id: 'biopago', name: 'Biopago', icon: Icons.Fingerprint, color: 'bg-emerald-500/10 text-emerald-500', desc: 'Validación biométrica' },
    { id: 'tarjeta', name: 'Tarjeta de Crédito', icon: Icons.CreditCard, color: 'bg-amber-500/10 text-amber-500', desc: 'Visa / Mastercard / Maestro' },
  ];

  const handleMethodSelect = (id: string) => {
    setSelectedMethod(id);
    setStep('details');
  };

  const handleConfirm = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
    }, 3000);
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
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Icons.CreditCard size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-tight">Pasarela de Pago</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{serviceName}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                <Icons.X size={18} />
              </button>
            </div>

            {step === 'method' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl text-center mb-6">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total a Pagar</p>
                  <p className="text-2xl font-bold text-black dark:text-white">{amount.toLocaleString('es-VE')} Bs</p>
                </div>
                
                <p className="text-[10px] font-bold text-slate-400 uppercase px-1 mb-2">Seleccione método de pago</p>
                <div className="grid grid-cols-1 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handleMethodSelect(method.id)}
                      className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-blue-500 transition-all text-left group"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${method.color}`}>
                        <method.icon size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-black dark:text-white">{method.name}</h4>
                        <p className="text-[9px] text-slate-400 font-medium">{method.desc}</p>
                      </div>
                      <Icons.ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'details' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-4">Confirmación de Pago</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Servicio</span>
                      <span className="font-bold">{serviceName}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Método</span>
                      <span className="font-bold">{paymentMethods.find(m => m.id === selectedMethod)?.name}</span>
                    </div>
                    <div className="h-px bg-slate-200 dark:bg-white/10 my-2"></div>
                    <div className="flex justify-between text-sm">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-emerald-500">{amount.toLocaleString('es-VE')} Bs</span>
                    </div>
                  </div>
                </div>

                {selectedMethod === 'pago-movil' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-400 uppercase">Teléfono</label>
                        <input type="text" placeholder="0412..." className="w-full h-10 bg-slate-50 dark:bg-white/5 rounded-xl px-3 text-xs font-bold outline-none border border-slate-100 dark:border-white/5" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-400 uppercase">Cédula</label>
                        <input type="text" placeholder="V-..." className="w-full h-10 bg-slate-50 dark:bg-white/5 rounded-xl px-3 text-xs font-bold outline-none border border-slate-100 dark:border-white/5" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Clave de Pago (C2P)</label>
                      <input type="password" placeholder="••••••" className="w-full h-10 bg-slate-50 dark:bg-white/5 rounded-xl px-3 text-xs font-bold outline-none border border-slate-100 dark:border-white/5" />
                    </div>
                  </div>
                )}

                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    vibrate('success');
                    handleConfirm();
                  }}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold text-sm shadow-none"
                >
                  Confirmar Pago
                </motion.button>
                <button 
                  onClick={() => setStep('method')}
                  className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                >
                  Cambiar Método
                </button>
              </div>
            )}

            {step === 'processing' && (
              <div className="py-12 flex flex-col items-center gap-6 text-center animate-in fade-in duration-500">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-slate-100 dark:border-white/5 border-t-emerald-500 animate-spin"></div>
                  <Icons.ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500" size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">Procesando Transacción</h3>
                  <p className="text-xs text-slate-400 font-medium">Conectando con la pasarela bancaria...</p>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="py-8 flex flex-col items-center gap-6 text-center animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Icons.CheckCircle2 size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">¡Pago Confirmado!</h3>
                  <p className="text-xs text-slate-400 font-medium">Su recibo digital ha sido generado con éxito.</p>
                </div>
                <div className="w-full bg-slate-50 dark:bg-white/5 p-4 rounded-2xl text-xs font-mono">
                  Recibo: VEN-{Math.random().toString(36).substring(2, 10).toUpperCase()}
                </div>
                <button 
                  onClick={onClose}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold text-sm shadow-none"
                >
                  Finalizar
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
