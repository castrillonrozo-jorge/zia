
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { PaymentGatewayModal } from '../components/PaymentGatewayModal';
import { motion } from 'motion/react';
import { OrganismoFicha } from '../components/OrganismoFicha';

export const Seniat: React.FC = () => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [activeService, setActiveService] = useState<{name: string, amount: number} | null>(null);

  const handlePayClick = (name: string, amount: number) => {
    setActiveService({ name, amount });
    setIsPaymentOpen(true);
  };

  const seniatPayments = [
    { id: 'islr', name: 'ISLR - Persona Natural', desc: 'Declaración Definitiva de Rentas', amount: 1250.00, icon: Icons.Calculator, color: 'bg-blue-500/10 text-[#4F84C4]' },
    { id: 'iva', name: 'IVA - Autoliquidación', desc: 'Impuesto al Valor Agregado Mensual', amount: 840.50, icon: Icons.BarChart3, color: 'bg-amber-500/10 text-amber-600' },
    { id: 'igtf', name: 'IGTF', desc: 'Grandes Transacciones Financieras', amount: 320.00, icon: Icons.Zap, color: 'bg-pink-500/10 text-pink-600' },
    { id: 'ret-iva', name: 'Retenciones de IVA', desc: 'Declaración de Agentes de Retención', amount: 2100.00, icon: Icons.ShieldCheck, color: 'bg-blue-500/10 text-[#4F84C4]' },
    { id: 'ret-islr', name: 'Retenciones de ISLR', desc: 'Declaración Mensual de Retenciones', amount: 1580.00, icon: Icons.FileText, color: 'bg-amber-500/10 text-amber-600' },
    { id: 'sucesiones', name: 'Sucesiones y Donaciones', desc: 'Liquidación de Impuesto Herencial', amount: 4500.00, icon: Icons.Landmark, color: 'bg-pink-500/10 text-pink-600' },
    { id: 'multas', name: 'Multas y Sanciones', desc: 'Pagos por Incumplimiento Tributario', amount: 950.00, icon: Icons.AlertTriangle, color: 'bg-rose-500/10 text-rose-600' },
  ];

  return (
    <div className="view-transition p-6 flex flex-col gap-10 pb-32 pt-8">
      <div className="px-4 space-y-2">
        <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">Seniat</h2>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.4em]">Portal de Recaudación Tributaria</p>
      </div>

        <OrganismoFicha sigla="SENIAT" nombre="Servicio Nacional Integrado de Administración Aduanera y Tributaria" />

      <div className="grid grid-cols-1 gap-5 px-2">
        {seniatPayments.map((payment, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={payment.id} 
            style={{
              background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
              boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
              borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            }}
            className="p-6 md:p-8 rounded-[3rem] flex items-center justify-between group active:scale-[0.98] transition-all border border-white/10 shadow-none relative overflow-hidden"
          >
            <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0 pr-4 relative z-10">
              <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className={`w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 text-[#FFFFFF] shadow-none`}>
                <payment.icon size={24} className="md:w-7 md:h-7" strokeWidth={2.5} />
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="font-black text-sm text-[#FFFFFF] tracking-tight truncate">{payment.name}</h3>
                <p className="text-[9px] font-bold text-[#FFFFFF] opacity-80 uppercase tracking-widest line-clamp-2">{payment.desc}</p>
              </div>
            </div>
            <div className="text-right space-y-3 shrink-0 relative z-10">
              <p className="text-sm md:text-base font-black text-[#FFFFFF] tracking-tighter">Bs. {payment.amount.toFixed(2)}</p>
              <button 
                onClick={() => handlePayClick(payment.name, payment.amount)}
                style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                className="text-[#FFFFFF] px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all shadow-none"
              >
                Declarar
              </button>
            </div>
          </motion.div>
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
          background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
          boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
          borderTop: '1px solid rgba(255, 255, 255, 0.25)',
        }}
        className="rounded-[3.5rem] p-12 border border-white/10 flex flex-col items-center text-center gap-8 mx-2 shadow-none relative overflow-hidden"
      >
        <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-none relative z-10">
           <Icons.ShieldCheck size={32} className="text-[#FFFFFF]" />
        </div>
        <div className="space-y-3 relative z-10">
          <h3 className="text-xs font-black text-[#FFFFFF] uppercase tracking-widest">Cumplimiento Tributario</h3>
          <p className="text-[11px] text-[#FFFFFF] opacity-90 font-bold uppercase tracking-tighter leading-relaxed max-w-[240px] mx-auto">Tu historial de pagos está al día. Gracias por contribuir al desarrollo nacional.</p>
        </div>
        <button style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)' }} className="w-full text-[#FFFFFF] py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all relative z-10">
           Descargar Solvencia
        </button>
      </div>
    </div>
  );
};
