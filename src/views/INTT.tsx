
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { PaymentGatewayModal } from '../components/PaymentGatewayModal';
import { OrganismoFicha } from '../components/OrganismoFicha';
import { ExchangeCalculator } from '../components/ExchangeCalculator';

type INTTMode = 'menu' | 'form' | 'payments' | 'success';

export const INTT: React.FC = () => {
  const [mode, setMode] = useState<INTTMode>('menu');
  const [step, setStep] = useState(1);
  const [selectedProcedure, setSelectedProcedure] = useState('');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isTasaOpen, setIsTasaOpen] = useState(false);
  const [activePayment, setActivePayment] = useState<{name: string, amount: number} | null>(null);

  const handlePayClick = (name: string, amount: string) => {
    setActivePayment({ name, amount: parseFloat(amount) });
    setIsPaymentOpen(true);
  };

  const procedures = [
    { id: 'licencia', title: 'Licencia de Conducir', desc: 'Renovación, primera vez y duplicados.', icon: Icons.User, color: 'bg-blue-50 text-blue-700' },
    { id: 'registro', title: 'Registro de Vehículo', desc: 'Traspasos, cambio de características y placas.', icon: Icons.Zap, color: 'bg-slate-50 text-slate-700' },
    { id: 'multas', title: 'Gestión de Multas', desc: 'Consulta y pago de infracciones de tránsito.', icon: Icons.ClipboardList, color: 'bg-red-50 text-red-700' },
    { id: 'permisos', title: 'Permisos Especiales', desc: 'Carga pesada, transporte público y escolar.', icon: Icons.Ship, color: 'bg-emerald-50 text-emerald-700' }
  ];

  const pendingPayments = [
    { id: 1, desc: 'Arancel Renovación Licencia 3ra', amount: '120.00', date: 'Vence 24/11' },
    { id: 2, desc: 'Multa Exceso Velocidad (ARC)', amount: '350.00', date: 'Vence 30/11' }
  ];

  const handleProcedureSelect = (id: string) => {
    setSelectedProcedure(id);
    setMode('form');
    setStep(1);
  };

  if (mode === 'menu') {
    return (
      <div className="p-6 flex flex-col gap-8 animate-in fade-in duration-200 pb-32">
        <div className="space-y-1 px-2">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">INTT Digital</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Instituto Nacional de Transporte Terrestre</p>
        </div>

        <OrganismoFicha sigla="INTT" nombre="Instituto Nacional de Transporte Terrestre" />

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => document.getElementById('intt-servicios')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
              boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
              borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            }}
            className="p-8 rounded-[2.5rem] text-[#FFFFFF] flex flex-col justify-between h-44 shadow-none active:scale-95 transition-all border border-white/10"
          >
            <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-12 h-12 rounded-2xl flex items-center justify-center">
              <Icons.Layers size={24} className="text-[#FFFFFF]" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-left">Trámites</span>
          </button>
          <button 
            onClick={() => setMode('payments')}
            style={{
              background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
              boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
              borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            }}
            className="p-8 rounded-[2.5rem] text-[#FFFFFF] flex flex-col justify-between h-44 shadow-none active:scale-95 transition-all border border-white/10"
          >
            <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-12 h-12 rounded-2xl flex items-center justify-center">
              <Icons.CreditCard size={24} className="text-[#FFFFFF]" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-left">Pagos</span>
          </button>
        </div>

        <div id="intt-servicios" className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4">Servicios Disponibles</h4>
          <div className="grid grid-cols-1 gap-4">
            {procedures.map((proc) => (
              <button
                key={proc.id}
                onClick={() => handleProcedureSelect(proc.id)}
                style={{
                  background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
                  boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                }}
                className="flex items-center gap-5 p-6 border border-white/10 rounded-[2.5rem] shadow-none hover:shadow-none transition-all text-left group active:scale-[0.98] relative overflow-hidden"
              >
                <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-none text-[#FFFFFF] relative z-10`}>
                  <proc.icon size={26} />
                </div>
                <div className="flex-1 relative z-10">
                  <h4 className="text-sm font-black text-[#FFFFFF] uppercase tracking-tight">{proc.title}</h4>
                  <p className="text-[10px] text-[#FFFFFF] opacity-80 font-bold uppercase tracking-widest mt-1">{proc.desc}</p>
                </div>
                <Icons.ChevronRight className="text-[#FFFFFF] opacity-80 group-hover:opacity-100 transition-colors relative z-10" size={20} />
              </button>
            ))}
          </div>
        </div>
        <ExchangeCalculator isOpen={isTasaOpen} onClose={() => setIsTasaOpen(false)} />
      </div>
    );
  }

  if (mode === 'payments') {
    return (
      <div className="p-6 flex flex-col gap-8 animate-in slide-in-from-right-4 duration-200 pb-32">
        <div className="flex items-center justify-between px-2">
          <button onClick={() => setMode('menu')} className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 group">
            <Icons.ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver
          </button>
        </div>
        <div className="px-2">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Pagos Pendientes</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">Gestión de Aranceles y Multas</p>
        </div>
        
        <div className="space-y-4">
          {pendingPayments.map((pay) => (
            <div 
              key={pay.id} 
              style={{
                background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
                boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
              }}
              className="p-8 rounded-[2.5rem] border border-white/10 shadow-none flex items-center justify-between group active:scale-[0.98] transition-all relative overflow-hidden"
            >
              <div className="relative z-10">
                <h4 className="text-sm font-black text-[#FFFFFF] tracking-tight">{pay.desc}</h4>
                <p className="text-[10px] text-rose-300 font-black uppercase tracking-widest mt-1">{pay.date}</p>
              </div>
              <div className="text-right relative z-10">
                <p className="text-base font-black text-[#FFFFFF] tracking-tighter">Bs. {pay.amount}</p>
                <button 
                  onClick={() => handlePayClick(pay.desc, pay.amount)}
                  style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                  className="px-4 py-2 mt-2 rounded-xl text-[9px] font-black text-[#FFFFFF] uppercase tracking-widest hover:bg-white/20 transition-all"
                >
                  Pagar
                </button>
              </div>
            </div>
          ))}
        </div>

        <PaymentGatewayModal 
          isOpen={isPaymentOpen} 
          onClose={() => setIsPaymentOpen(false)} 
          serviceName={activePayment?.name || ''} 
          amount={activePayment?.amount || 0} 
        />

        <div 
          style={{
            background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
            boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
          }}
          className="p-10 rounded-[2.5rem] border border-white/10 text-center space-y-6 shadow-none relative overflow-hidden"
        >
           <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-none relative z-10">
            <Icons.Calculator size={32} className="text-[#FFFFFF]" />
           </div>
           <div className="space-y-2 relative z-10">
            <p className="text-xs text-[#FFFFFF] font-black uppercase tracking-widest">Calculadora de Aranceles</p>
           </div>
           <button onClick={() => setIsTasaOpen(true)} style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)' }} className="w-full text-[#FFFFFF] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all relative z-10">Consultar Tasa</button>
        </div>
        <ExchangeCalculator isOpen={isTasaOpen} onClose={() => setIsTasaOpen(false)} />
      </div>
    );
  }

  if (mode === 'form') {
    return (
      <div className="p-6 flex flex-col gap-8 animate-in slide-in-from-right-4 duration-200 pb-32">
        <div className="flex items-center justify-between px-2">
          <button onClick={() => setMode('menu')} className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 group">
            <Icons.ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver
          </button>
        </div>
        <div className="px-2">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Registro de Trámite</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">Complete los datos de su solicitud</p>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); setMode('success'); }} className="space-y-6">
          <div className="space-y-4 bg-white dark:bg-[#0D1117] p-8 rounded-[2.5rem] border border-black/[0.05] dark:border-white/[0.08] shadow-none">
            {selectedProcedure === 'licencia' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Grado de Licencia</label>
                  <select required className="w-full bg-slate-50 dark:bg-white/5 border border-black/[0.05] dark:border-white/[0.1] rounded-2xl h-14 px-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors">
                    <option value="">Seleccione Grado</option>
                    <option value="2">2do Grado</option>
                    <option value="3">3er Grado</option>
                    <option value="4">4to Grado</option>
                    <option value="5">5to Grado</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Tipo de Trámite</label>
                  <select required className="w-full bg-slate-50 dark:bg-white/5 border border-black/[0.05] dark:border-white/[0.1] rounded-2xl h-14 px-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors">
                    <option value="">Seleccione Tipo</option>
                    <option value="primera">Primera Vez</option>
                    <option value="renovacion">Renovación</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Certificado Médico Nro</label>
                  <input type="text" placeholder="Ej. 12345678" className="w-full bg-slate-50 dark:bg-white/5 border border-black/[0.05] dark:border-white/[0.1] rounded-2xl h-14 px-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors" required />
                </div>
              </>
            )}
            {selectedProcedure === 'registro' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Placa del Vehículo</label>
                  <input type="text" placeholder="Ej. ABC12D" className="w-full bg-slate-50 dark:bg-white/5 border border-black/[0.05] dark:border-white/[0.1] rounded-2xl h-14 px-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Serial de Carrocería</label>
                  <input type="text" placeholder="Ej. 8AD9293883" className="w-full bg-slate-50 dark:bg-white/5 border border-black/[0.05] dark:border-white/[0.1] rounded-2xl h-14 px-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors" required />
                </div>
              </>
            )}
            
            {selectedProcedure === 'multas' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Cédula o Placa</label>
                  <input type="text" placeholder="Ej. V-12345678" className="w-full bg-slate-50 dark:bg-white/5 border border-black/[0.05] dark:border-white/[0.1] rounded-2xl h-14 px-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors" required />
                </div>
              </>
            )}

            {selectedProcedure === 'permisos' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Tipo de Permiso</label>
                  <select required className="w-full bg-slate-50 dark:bg-white/5 border border-black/[0.05] dark:border-white/[0.1] rounded-2xl h-14 px-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors">
                    <option value="">Seleccione Permiso</option>
                    <option value="pesada">Carga Pesada</option>
                    <option value="transporte">Transporte Público</option>
                    <option value="escolar">Transporte Escolar</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Ruta (Origen - Destino)</label>
                  <input type="text" placeholder="Ej. Caracas - Valencia" className="w-full bg-slate-50 dark:bg-white/5 border border-black/[0.05] dark:border-white/[0.1] rounded-2xl h-14 px-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors" required />
                </div>
              </>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-[#4F84C4] hover:bg-[#4F84C4] text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-none shadow-[#4F84C4]/20 active:scale-95 transition-all"
          >
            Enviar Solicitud al Sistema Central
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-8 animate-in slide-in-from-right-4 duration-500 min-h-screen pb-32 text-center justify-center">
       <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto shadow-none">
        <Icons.CheckCircle2 size={64} />
       </div>
       <div className="space-y-2">
        <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Trámite Iniciado</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-[240px] mx-auto">Su solicitud ha sido enviada al sistema central del INTT con éxito.</p>
       </div>
       <button 
         onClick={() => setMode('menu')}
         className="w-full bg-[#4F84C4] hover:bg-[#4F84C4] text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest mt-8 shadow-none shadow-blue-600/20 active:scale-95 transition-all"
       >
         Volver al Menú
       </button>
    </div>
  );
};
