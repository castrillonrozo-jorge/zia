
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { OrganismoFicha } from '../components/OrganismoFicha';

type SarenMode = 'menu' | 'form' | 'payments' | 'success';

export const BusinessRegistration: React.FC = () => {
  const [mode, setMode] = useState<SarenMode>('menu');
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');

  const sarenFunctions = [
    { 
      id: 'mercantil', 
      title: 'Registro Mercantil', 
      desc: 'Constitución de empresas, firmas personales y actas.',
      icon: Icons.Building2,
      color: 'bg-blue-50 text-blue-700'
    },
    { 
      id: 'notaria', 
      title: 'Notarías Públicas', 
      desc: 'Poderes, compra-venta de vehículos y autorizaciones.',
      icon: Icons.FileText,
      color: 'bg-amber-50 text-amber-700'
    },
    { 
      id: 'inmobiliario', 
      title: 'Registro Inmobiliario', 
      desc: 'Protocolización de viviendas, terrenos y gravámenes.',
      icon: Icons.Map,
      color: 'bg-emerald-50 text-emerald-700'
    },
    { 
      id: 'principal', 
      title: 'Registro Principal', 
      desc: 'Legalización de títulos, partidas de nacimiento y actas civiles.',
      icon: Icons.GraduationCap,
      color: 'bg-purple-50 text-purple-700'
    }
  ];

  const handleServiceSelect = (id: string) => {
    setSelectedService(id);
    setMode('form');
    setStep(1);
  };

  if (mode === 'menu') {
    return (
      <div className="p-6 flex flex-col gap-8 animate-in fade-in duration-500 pb-32 pt-8">
        <div className="space-y-1 px-2">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Saren Digital</h2>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.3em]">Servicio Autónomo de Registros y Notarías</p>
        </div>

        <OrganismoFicha sigla="SAREN" nombre="Servicio Autónomo de Registros y Notarías" />

        <div className="grid grid-cols-2 gap-4">
           <button 
            onClick={() => setMode('menu')} 
            style={{
              background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
              boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
              borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            }}
            className="text-[#FFFFFF] p-8 rounded-[2.5rem] flex flex-col justify-between h-44 shadow-none active:scale-95 transition-all border border-white/10"
           >
              <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-12 h-12 rounded-2xl flex items-center justify-center">
                <Icons.FileText size={24} className="text-[#FFFFFF]" />
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
            className="border border-white/10 text-[#FFFFFF] p-8 rounded-[2.5rem] flex flex-col justify-between h-44 shadow-none active:scale-95 transition-all"
           >
              <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-12 h-12 rounded-2xl flex items-center justify-center">
                <Icons.CreditCard size={24} className="text-[#FFFFFF]" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-left">Pagos PUB</span>
           </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {sarenFunctions.map((fn) => (
            <button
              key={fn.id}
              onClick={() => handleServiceSelect(fn.id)}
              style={{
                background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
                boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
              }}
              className="flex items-center gap-5 p-6 border border-white/10 rounded-[2.5rem] shadow-none hover:shadow-none active:scale-[0.98] transition-all text-left group relative overflow-hidden"
            >
              <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-none text-[#FFFFFF] relative z-10`}>
                <fn.icon size={28} />
              </div>
              <div className="flex-1 relative z-10">
                <h4 className="text-sm font-black text-[#FFFFFF] uppercase tracking-tight">{fn.title}</h4>
                <p className="text-[10px] text-[#FFFFFF] opacity-80 font-bold uppercase tracking-widest mt-1.5">{fn.desc}</p>
              </div>
              <Icons.ChevronRight className="text-[#FFFFFF] opacity-80 group-hover:opacity-100 transition-colors relative z-10" size={20} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (mode === 'payments') {
    return (
      <div className="p-6 flex flex-col gap-8 animate-in slide-in-from-right-4 duration-500 pb-32 pt-8">
        <div className="flex items-center justify-between px-2">
          <button onClick={() => setMode('menu')} className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 group">
            <Icons.ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver
          </button>
        </div>
        <div className="px-2">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Pagos de Aranceles</h2>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.3em] mt-1">Gestión de Planilla Única Bancaria</p>
        </div>
        
        <div 
          style={{
            background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
            boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
          }}
          className="border border-white/10 p-10 rounded-[3rem] flex flex-col gap-8 relative overflow-hidden"
        >
           <div className="space-y-3 relative z-10">
              <label className="text-[10px] font-black text-[#FFFFFF] opacity-90 uppercase tracking-widest ml-2">Planilla Única Bancaria (PUB)</label>
              <input type="text" placeholder="Nro de Planilla..." style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)' }} className="w-full p-5 rounded-2xl text-sm font-bold outline-none text-[#FFFFFF] placeholder:text-white/50" />
           </div>
           <button style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)' }} className="w-full text-[#FFFFFF] py-5 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all hover:bg-white/20 relative z-10">Consultar Monto</button>
        </div>

        <div className="bg-emerald-500/[0.05] dark:bg-emerald-400/[0.08] p-8 rounded-[2.5rem] border border-emerald-500/10 dark:border-emerald-400/20 flex gap-5 backdrop-blur-xl">
           <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Icons.ShieldCheck className="text-emerald-600 dark:text-emerald-400" size={24} />
           </div>
           <p className="text-[11px] text-emerald-800 dark:text-slate-200 font-bold leading-relaxed">Sus pagos se procesan de forma inmediata a través del sistema de banca nacional interconectada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-8 animate-in slide-in-from-right-4 duration-500 min-h-screen pb-32 pt-8">
      <div className="flex items-center justify-between px-2">
        <button onClick={() => setMode('menu')} className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 group">
          <Icons.ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver
        </button>
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Paso {step} de 3</span>
      </div>

      <div className="space-y-2 px-2">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {sarenFunctions.find(f => f.id === selectedService)?.title}
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Validación en Línea</span>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div 
            style={{
              background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
              boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
              borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            }}
            className="border border-white/10 p-10 rounded-[3rem] space-y-8 relative overflow-hidden"
          >
            <h3 className="text-xs font-black text-[#FFFFFF] opacity-80 uppercase tracking-widest relative z-10">Detalles del Solicitante</h3>
            
            <div className="space-y-3 relative z-10">
              <label className="text-[10px] font-black text-[#FFFFFF] opacity-90 uppercase tracking-widest ml-2">Documento a Tramitar</label>
              <div className="relative">
                <select style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)' }} className="w-full p-5 rounded-2xl text-sm font-bold outline-none appearance-none text-[#FFFFFF]">
                  {selectedService === 'mercantil' && (
                    <>
                      <option className="bg-[#4F84C4]">Constitución de Pyme</option>
                      <option className="bg-[#4F84C4]">Firma Personal</option>
                      <option className="bg-[#4F84C4]">Acta de Asamblea</option>
                    </>
                  )}
                  {selectedService === 'notaria' && (
                    <>
                      <option className="bg-[#4F84C4]">Poder Especial</option>
                      <option className="bg-[#4F84C4]">Venta de Vehículo</option>
                      <option className="bg-[#4F84C4]">Autorización de Viaje</option>
                    </>
                  )}
                  {selectedService === 'inmobiliario' && (
                    <>
                      <option className="bg-[#4F84C4]">Compra-Venta Inmueble</option>
                      <option className="bg-[#4F84C4]">Liberación de Hipoteca</option>
                      <option className="bg-[#4F84C4]">Declaración Jurada</option>
                    </>
                  )}
                  {selectedService === 'principal' && (
                    <>
                      <option className="bg-[#4F84C4]">Legalización de Título Universitario</option>
                      <option className="bg-[#4F84C4]">Certificación de Acta de Nacimiento</option>
                      <option className="bg-[#4F84C4]">Carta de Soltería</option>
                    </>
                  )}
                </select>
                <Icons.ChevronRight size={16} className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-[#FFFFFF] opacity-80 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <label className="text-[10px] font-black text-[#FFFFFF] opacity-90 uppercase tracking-widest ml-2">Nombre Completo / Razón Social</label>
              <input 
                type="text"
                placeholder="Introduzca los datos..."
                style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                className="w-full p-5 rounded-2xl text-sm font-bold outline-none text-[#FFFFFF] placeholder:text-white/50"
              />
            </div>
          </div>

          <button 
            onClick={() => setStep(2)}
            className="w-full bg-[#4F84C4] hover:bg-blue-500 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-none shadow-blue-600/20 active:scale-95 transition-all"
          >
            Continuar
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div 
            style={{
              background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
              boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
              borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            }}
            className="border border-white/10 p-10 rounded-[3rem] space-y-8 relative overflow-hidden"
          >
            <h3 className="text-xs font-black text-[#FFFFFF] opacity-80 uppercase tracking-widest relative z-10">Carga de Recaudos</h3>
            
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(8px)', border: '2px dashed rgba(255, 255, 255, 0.2)' }} className="rounded-[3rem] p-16 flex flex-col items-center gap-6 hover:bg-white/10 cursor-pointer transition-all group active:scale-[0.98] relative z-10">
              <div style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)' }} className="w-20 h-20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-none text-[#FFFFFF]">
                <Icons.Upload size={32} />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm font-black text-[#FFFFFF] tracking-tight">Seleccionar Archivos</p>
                <p className="text-[10px] text-[#FFFFFF] opacity-80 font-bold uppercase tracking-widest">Cédula, RIF y Planilla Única Bancaria (PUB)</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 dark:bg-white/5 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest text-slate-900 dark:text-white active:scale-95 transition-all">Atrás</button>
            <button onClick={() => setMode('success')} className="flex-[2] bg-[#4F84C4] hover:bg-blue-500 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-none shadow-blue-600/20 active:scale-95 transition-all">Enviar Solicitud</button>
          </div>
        </div>
      )}

      {mode === 'success' && (
        <div className="flex flex-col items-center justify-center gap-8 py-10 animate-in zoom-in duration-500 flex-1">
          <div className="w-28 h-28 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 shadow-none">
            <Icons.CheckCircle2 size={64} />
          </div>
          <div className="text-center space-y-3 px-4">
            <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Solicitud en Revisión</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-[240px] mx-auto">Su trámite ante el **Saren** ha sido registrado con éxito y está siendo procesado.</p>
          </div>
          <button 
            onClick={() => setMode('menu')}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest mt-8 shadow-none active:scale-95 transition-all"
          >
            Finalizar
          </button>
        </div>
      )}
    </div>
  );
};
