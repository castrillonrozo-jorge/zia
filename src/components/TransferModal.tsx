
import React, { useState } from 'react';
import { Icons } from './Icons';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
  balance: number;
}

export const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose, onSuccess, balance }) => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [bank, setBank] = useState('');
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const handleTransfer = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0 && numAmount <= balance) {
      onSuccess(numAmount);
      setStep(3);
    } else {
      alert('Monto inválido o saldo insuficiente');
    }
  };

  const reset = () => {
    setAmount('');
    setRecipient('');
    setBank('');
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[150] bg-black/40 backdrop-blur-sm flex items-end justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white dark:bg-[#111111] rounded-[2.5rem] p-8 shadow-none animate-in slide-in-from-bottom-full duration-500 border border-white/10">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-tight">Transferencia</h3>
          <button 
            onClick={reset}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors chip-aurora"
          >
            <Icons.X size={20} />
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Destinatario (V-00000000)</label>
              <input 
                type="text" 
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Cédula del beneficiario"
                className="w-full h-16 bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Banco Destino</label>
              <select 
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full h-16 bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 text-sm font-bold outline-none appearance-none"
              >
                <option value="">Selecciona un banco</option>
                <option value="0102">Banco de Venezuela</option>
                <option value="0105">Mercantil</option>
                <option value="0108">Provincial</option>
                <option value="0134">Banesco</option>
              </select>
            </div>
            <button 
              disabled={!recipient || !bank}
              onClick={() => setStep(2)}
              className="w-full h-16 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-none active:scale-95 transition-all disabled:opacity-50"
            >
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-black/5 dark:border-white/5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Saldo Disponible</p>
              <p className="text-2xl font-black text-black dark:text-white">{balance.toLocaleString('es-VE')} Bs</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Monto a Transferir</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-20 bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 text-3xl font-black outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">Bs</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 h-16 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-2xl font-bold uppercase tracking-widest text-xs"
              >
                Atrás
              </button>
              <button 
                disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
                onClick={handleTransfer}
                className="flex-[2] h-16 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-none active:scale-95 transition-all disabled:opacity-50"
              >
                Confirmar
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-in zoom-in duration-500">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 chip-aurora">
              <Icons.CheckCircle2 size={48} />
            </div>
            <div className="text-center space-y-2">
              <h4 className="text-xl font-black text-black dark:text-white uppercase tracking-tight">Transferencia Exitosa</h4>
              <p className="text-sm text-slate-500 font-medium">Se han transferido {parseFloat(amount).toLocaleString('es-VE')} Bs a {recipient}</p>
            </div>
            <button 
              onClick={reset}
              className="w-full h-16 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-none active:scale-95 transition-all"
            >
              Finalizar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
