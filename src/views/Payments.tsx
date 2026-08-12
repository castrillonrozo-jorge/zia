
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../components/Icons';
import { PaymentGatewayModal } from '../components/PaymentGatewayModal';
import { AppView } from '../types';
import { useVibration } from '../hooks/useVibration';

interface PaymentsProps {
  onNavigate?: (view: AppView) => void;
}

export const Payments: React.FC<PaymentsProps> = ({ onNavigate }) => {
  const { vibrate } = useVibration();
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [activeService, setActiveService] = useState<{name: string, amount: number} | null>(null);

  const handlePayClick = (name: string, amount: number) => {
    setActiveService({ name, amount });
    setIsPaymentOpen(true);
  };

  const services = [
    { id: 1, name: 'Corpoelec', category: 'servicios', amount: 150.50, due: 'Hoy', icon: Icons.Zap, color: 'bg-amber-500/10 text-amber-500' },
    { id: 2, name: 'Hidrocapital', category: 'servicios', amount: 45.00, due: 'Mañana', icon: Icons.Droplets, color: 'bg-blue-500/10 text-blue-500' },
    { id: 3, name: 'CANTV / ABA', category: 'servicios', amount: 320.00, due: '15 Nov', icon: Icons.Smartphone, color: 'bg-indigo-500/10 text-indigo-500' },
    { id: 4, name: 'Alcaldía (ASEO)', category: 'impuestos', amount: 850.00, due: '20 Nov', icon: Icons.Landmark, color: 'bg-emerald-500/10 text-emerald-500' },
    { id: 5, name: 'INTT (Trámites)', category: 'impuestos', amount: 450.00, due: '25 Nov', icon: Icons.Building2, color: 'bg-slate-500/10 text-slate-500' },
    { id: 6, name: 'Seniat (ISLR)', category: 'impuestos', amount: 1200.00, due: '30 Nov', icon: Icons.Calculator, color: 'bg-rose-500/10 text-rose-500' },
    { id: 7, name: 'Saren (Aranceles)', category: 'impuestos', amount: 540.00, due: '28 Nov', icon: Icons.FileText, color: 'bg-amber-500/10 text-amber-500' },
  ];

  return (
    <div className="view-transition p-4 flex flex-col gap-10 pb-32 pt-8">
      {/* Header Section Group */}
      <div className="flex flex-col gap-4">
        <div className="px-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Pagos</h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.3em]">Servicios e Impuestos</p>
          </div>
        </div>

        {/* Edge-to-Edge Ticker */}
        <div className="w-[100vw] -ml-4 overflow-hidden relative my-2">
          <div className="animate-marquee w-max">
            <span className="text-[12px] font-black tracking-[0.1em] uppercase text-black dark:text-white pr-2">
              tasa euro 687,69 • tasa bcv 592,51 — tasa euro 687,69 • tasa bcv 592,51 — tasa euro 687,69 • tasa bcv 592,51 —
            </span>
            <span className="text-[12px] font-black tracking-[0.1em] uppercase text-black dark:text-white pr-2">
              tasa euro 687,69 • tasa bcv 592,51 — tasa euro 687,69 • tasa bcv 592,51 — tasa euro 687,69 • tasa bcv 592,51 —
            </span>
          </div>
        </div>

        {/* Symmetric Buttons */}
        <div className="px-4 flex gap-3 mb-2">
        <div 
          onClick={() => setIsCalculatorOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #3A69A3 0%, #4F84C4 100%)',
            boxShadow: 'none',
            border: '1px solid rgba(255,255,255,0.12)',
            cursor: 'pointer'
          }}
          className="h-12 flex-1 rounded-2xl flex items-center justify-center gap-2.5 text-white active:scale-95 transition-all"
        >
          <Icons.Calculator size={18} />
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] leading-none mt-0.5">Calculadora</span>
        </div>
        <div 
          onClick={() => onNavigate && onNavigate('wallet' as AppView)}
          style={{
            background: 'linear-gradient(135deg, #3A69A3 0%, #4F84C4 100%)',
            boxShadow: 'none',
            border: '1px solid rgba(255,255,255,0.12)',
            cursor: 'pointer'
          }}
          className="h-12 flex-1 rounded-2xl flex items-center justify-center gap-2.5 text-white active:scale-95 transition-all"
        >
          <Icons.Wallet size={18} />
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] leading-none mt-0.5">Billetera</span>
        </div>
      </div>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar px-4">
        {['Todos', 'Servicios', 'Impuestos', 'Recargas'].map((label) => (
          <button
            key={label}
            onClick={() => setSelectedCategory(label.toLowerCase())}
            style={selectedCategory === label.toLowerCase() ? {
              background: 'linear-gradient(135deg, #3A69A3 0%, #4F84C4 100%)',
              boxShadow: 'none',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            } : {
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: 'none',
            }}
            className={`transition-all whitespace-nowrap active:scale-95 px-5 py-2.5 text-sm rounded-2xl ${
              selectedCategory === label.toLowerCase()
              ? 'text-white font-semibold' 
              : 'text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-5 px-2">
        {services
          .filter(s => selectedCategory === 'todos' || s.category === selectedCategory)
          .map((service) => (
          <div 
            key={service.id} 
            style={{
              background: 'linear-gradient(135deg, #3A69A3 0%, #4F84C4 100%)',
              boxShadow: 'none',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}
            className="p-6 rounded-[2rem] flex items-center justify-between group active:scale-[0.98] transition-all"
          >
            {/* Specular highlights for that metallic card feel */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)', pointerEvents: 'none' }} />
            
            <div className="flex items-center gap-4 relative z-10 flex-1 min-w-0 pr-4">
              <div 
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)',
                  boxShadow: 'none',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-none`}
              >
                <service.icon size={22} className="text-white brightness-125" strokeWidth={1.5} />
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="font-semibold text-sm text-white tracking-tight truncate">{service.name}</h3>
                <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest line-clamp-1">Vence: {service.due}</p>
              </div>
            </div>
            <div className="text-right space-y-2 relative z-10 shrink-0">
              <p className="text-sm font-bold text-white tracking-tight">Bs. {service.amount.toFixed(2)}</p>
              <motion.button 
                whileTap={{ scale: 0.9, y: 1 }}
                onClick={() => {
                  vibrate('light');
                  handlePayClick(service.name, service.amount);
                }}
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  boxShadow: 'none',
                  border: 'none',
                }}
                className="text-[9px] font-black text-blue-900 px-3.5 py-1.5 rounded-xl uppercase tracking-wider transition-all"
              >
                Pagar
              </motion.button>
            </div>
          </div>
        ))}
      </div>

      <PaymentGatewayModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        serviceName={activeService?.name || ''} 
        amount={activeService?.amount || 0} 
      />


      <div 
        style={{
          background: 'linear-gradient(135deg, #3A69A3 0%, #4F84C4 100%)',
          boxShadow: 'none',
          border: '1px solid rgba(255,255,255,0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="rounded-[3.2rem] p-10 flex flex-col items-center text-center gap-6 mx-2"
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)', pointerEvents: 'none' }} />
        
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
            boxShadow: 'none',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          className="w-20 h-20 rounded-2xl flex items-center justify-center relative z-10"
        >
          <Icons.QrCode size={34} className="text-blue-400" />
        </div>
        <div className="space-y-2 relative z-10">
          <h3 className="text-xs font-black text-white uppercase tracking-widest">Pago Móvil con QR</h3>
          <p className="text-[11px] text-white/80 font-medium tracking-tight leading-relaxed max-w-[240px] mx-auto">Paga de forma instantánea escaneando códigos QR interbancarios.</p>
        </div>
        <motion.button 
          whileTap={{ scale: 0.95, y: 1 }}
          onClick={() => {
            vibrate('success');
          }}
          style={{
            background: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
            boxShadow: 'none',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          className="w-full text-white py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 relative z-10"
        >
          <Icons.Camera size={14} />
          Escanear Ahora
        </motion.button>
      </div>
      {isCalculatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 w-full max-w-sm rounded-[2rem] p-6 shadow-none relative">
            <button 
              onClick={() => setIsCalculatorOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400"
            >
              <Icons.X size={16} />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                 <Icons.Calculator size={20} className="text-[#4F84C4] dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-black text-black dark:text-white text-base">Calculadora BCV</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tasa oficial: Bs. 59.25</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Monto en Divisas (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input type="number" id="usd-input" placeholder="0.00" className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl pl-10 pr-4 text-sm font-bold text-black dark:text-white outline-none focus:border-[#4F84C4] transition-colors" onChange={(e) => {
                    const bsVal = parseFloat(e.target.value) * 59.25;
                    (document.getElementById('bs-input') as HTMLInputElement).value = isNaN(bsVal) ? '' : bsVal.toFixed(2);
                  }} />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                  <Icons.ArrowDown size={16} className="text-[#4F84C4]" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Monto en Bolívares (VES)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Bs</span>
                  <input type="number" id="bs-input" placeholder="0.00" className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl pl-10 pr-4 text-sm font-bold text-black dark:text-white outline-none focus:border-[#4F84C4] transition-colors" onChange={(e) => {
                    const usdVal = parseFloat(e.target.value) / 59.25;
                    (document.getElementById('usd-input') as HTMLInputElement).value = isNaN(usdVal) ? '' : usdVal.toFixed(2);
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
