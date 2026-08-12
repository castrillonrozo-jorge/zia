
import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { motion, AnimatePresence } from 'framer-motion';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'scanning' | 'details' | 'processing' | 'success'>('scanning');
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState({ name: 'Comercio Digital C.A.', rif: 'J-12345678-9' });

  useEffect(() => {
    if (step === 'scanning' && isOpen) {
      const timer = setTimeout(() => {
        setStep('details');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, isOpen]);

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      onSuccess(parseFloat(amount));
    }, 2500);
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
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <Icons.QrCode size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-tight">Escáner QR</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Pago Instantáneo</p>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                <Icons.X size={18} />
              </button>
            </div>

            {step === 'scanning' && (
              <div className="flex flex-col items-center gap-8 py-4">
                <div className="relative w-64 h-64 rounded-[2.5rem] overflow-hidden border-2 border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/20 flex items-center justify-center group">
                  {/* Camera Simulation */}
                  <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/store/400/400')] bg-cover bg-center opacity-40 grayscale"></div>
                  
                  {/* Scanner Overlay */}
                  <div className="relative z-10 w-48 h-48 border-2 border-white/50 rounded-3xl">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-xl"></div>
                    
                    {/* Scanning Line */}
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-1 bg-indigo-500 shadow-none z-20"
                    />
                  </div>
                  
                  <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest drop-shadow-none">Buscando código...</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 text-center font-medium px-4">
                  Apunta la cámara al código QR del comercio para realizar el pago.
                </p>
              </div>
            )}

            {step === 'details' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white">
                      <Icons.Building2 size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Comercio Detectado</p>
                      <p className="text-sm font-bold">{recipient.name}</p>
                      <p className="text-[10px] font-medium text-slate-500">{recipient.rif}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Monto a Pagar (Bs)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full h-16 bg-white dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-2xl px-12 text-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">Bs</span>
                    </div>
                  </div>
                </div>

                <button 
                  disabled={!amount || parseFloat(amount) <= 0}
                  onClick={handlePay}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold text-sm shadow-none disabled:opacity-50 disabled:grayscale transition-all"
                >
                  Pagar Ahora
                </button>
                <button 
                  onClick={() => setStep('scanning')}
                  className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                >
                  Re-escanear
                </button>
              </div>
            )}

            {step === 'processing' && (
              <div className="py-12 flex flex-col items-center gap-6 text-center animate-in fade-in duration-500">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-slate-100 dark:border-white/5 border-t-indigo-500 animate-spin"></div>
                  <Icons.ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500" size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">Procesando Pago</h3>
                  <p className="text-xs text-slate-400 font-medium">Cifrando transacción de grado militar...</p>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="py-8 flex flex-col items-center gap-6 text-center animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Icons.CheckCircle2 size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">¡Pago Exitoso!</h3>
                  <p className="text-xs text-slate-400 font-medium">El comercio ha recibido su pago correctamente.</p>
                </div>
                <div className="w-full bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Comercio</span>
                    <span className="font-bold">{recipient.name}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Monto</span>
                    <span className="font-bold">{parseFloat(amount).toLocaleString('es-VE')} Bs</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Referencia</span>
                    <span className="font-bold font-mono">QR-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
                  </div>
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
