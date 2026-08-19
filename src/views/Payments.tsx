
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../components/Icons';
import { PaymentGatewayModal } from '../components/PaymentGatewayModal';
import { ExchangeCalculator } from '../components/ExchangeCalculator';
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

  // La cinta de tasas se alimenta del BCV en vivo vía /api/rate.
  // Nunca un número escrito a mano: si no hay dato, la cinta lo dice.
  const [cinta, setCinta] = useState('consultando tasa oficial del BCV…');
  React.useEffect(() => {
    let activo = true;
    fetch('/api/rate')
      .then((r) => r.json())
      .then((t) => {
        if (!activo) return;
        if (t?.disponible && t.usd) {
          const usd = Number(t.usd).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          const eur = t.eur ? Number(t.eur).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : null;
          setCinta(`tasa bcv ${usd} bs/usd${eur ? ` • tasa euro ${eur} bs/eur` : ''}${t.fechaValor ? ` • fecha valor ${t.fechaValor}` : ''} • fuente bcv.org.ve`);
        } else {
          setCinta('tasa oficial del bcv no disponible en este momento');
        }
      })
      .catch(() => { if (activo) setCinta('tasa oficial del bcv no disponible en este momento'); });
    return () => { activo = false; };
  }, []);

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
              {cinta} — {cinta} —
            </span>
            <span className="text-[12px] font-black tracking-[0.1em] uppercase text-black dark:text-white pr-2">
              {cinta} — {cinta} —
            </span>
          </div>
        </div>

        {/* Symmetric Buttons */}
        <div className="px-4 flex gap-3 mb-2">
        <div 
          onClick={() => setIsCalculatorOpen(true)}
          style={{
            background: 'radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
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
            background: 'radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
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
              background: 'radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
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
          .map((service, iCh) => (
          <div 
            key={service.id} 
            style={{
              background: 'radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
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
                className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-none chip-aurora${['','-morado','-verde','-ambar','-rojo','-teal','-rosa','-lima'][iCh % 8]}`}
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
          background: 'radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
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
          className="w-20 h-20 rounded-2xl flex items-center justify-center relative z-10 chip-aurora"
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
      <ExchangeCalculator isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
    </div>
  );
};
