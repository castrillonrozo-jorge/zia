import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../components/Icons';
import { useVibration } from '../hooks/useVibration';

interface WalletProps {
  balance: number;
  onOpenRecharge: () => void;
  onOpenTransfer: () => void;
  onOpenQR: () => void;
}

export const Wallet: React.FC<WalletProps> = ({ balance, onOpenRecharge, onOpenTransfer, onOpenQR }) => {
  const { vibrate } = useVibration();
  const transactions = [
    { id: 1, title: 'Recarga Monedero Patria', amount: '+500,00', date: 'Hoy, 02:30 PM', type: 'in' },
    { id: 2, title: 'Pago Servicio Corpoelec', amount: '-150,50', date: 'Ayer', type: 'out' },
    { id: 3, title: 'Transferencia Binance P2P', amount: '+2.400,00', date: '12 Nov', type: 'in' },
  ];

  return (
    <div className="view-transition p-4 flex flex-col gap-8 pb-32 pt-8">
      <div className="px-4 space-y-1">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Billetera</h2>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.3em]">Finanzas Avanzadas</p>
      </div>

      <div className="px-4">
        <div style={{
          background: 'linear-gradient(135deg, #3A69A3 0%, #4F84C4 100%)',
          boxShadow: 'none',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }} className="rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)', pointerEvents: 'none' }} />
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[3rem]"></div>
          
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 opacity-80">
                <Icons.ShieldCheck size={16} />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Billetera Segura</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Icons.Eye size={14} className="text-white" />
              </div>
            </div>
            
            <div>
              <p className="text-[10px] font-bold text-white/50 tracking-[0.2em] uppercase mb-2">Saldo Disponible (VED)</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tighter">{balance.toLocaleString('es-VE')}</span>
                <span className="text-sm font-black opacity-60">BS</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={onOpenTransfer} className="flex-1 bg-white text-slate-900 h-14 rounded-2xl flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-transform">
                <Icons.Send size={16} /> Enviar
              </button>
              <button onClick={onOpenRecharge} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }} className="flex-1 text-white h-14 rounded-2xl flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-transform">
                <Icons.Download size={16} /> Recibir
              </button>
              <motion.button 
                whileTap={{ scale: 0.9, y: 1 }}
                onClick={() => {
                  vibrate('success');
                  onOpenQR();
                }} 
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }} className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-white transition-transform">
                <Icons.QrCode size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-500 mb-6">Herramientas</h3>
        <div className="grid grid-cols-2 gap-4">
          <div style={{
            background: 'linear-gradient(135deg, #3A69A3 0%, #4F84C4 100%)',
            boxShadow: 'none',
            border: '1px solid rgba(255,255,255,0.12)'
          }} className="p-5 rounded-[2rem] flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Icons.Bitcoin size={24} />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-white">Cripto / P2P</p>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #3A69A3 0%, #4F84C4 100%)',
            boxShadow: 'none',
            border: '1px solid rgba(255,255,255,0.12)'
          }} className="p-5 rounded-[2rem] flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Icons.LineChart size={24} />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-white">Mercados BCV</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-2">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-500">Últimos Movimientos</h3>
          <button className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Ver Todos</button>
        </div>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'in' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                   {tx.type === 'in' ? <Icons.ArrowDown size={18} /> : <Icons.ArrowUp size={18} />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{tx.title}</h4>
                  <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-1">{tx.date}</p>
                </div>
              </div>
              <p className={`text-sm font-black tracking-tight ${tx.type === 'in' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                {tx.amount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
