
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { HealthModals } from '../components/HealthModals';

export const Health: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'teleconsulta' | 'citas' | 'historial' | 'farmacia' | null>(null);

  const healthServices = [
    { id: 'teleconsulta', title: 'Teleconsulta 24/7', desc: 'Médicos en línea vía video', icon: Icons.PhoneCall, color: 'bg-blue-50 text-[#4F84C4]' },
    { id: 'citas', title: 'Citas Médicas', desc: 'Red de Hospitales Públicos', icon: Icons.Calendar, color: 'bg-red-50 text-red-600' },
    { id: 'historial', title: 'Historial Digital', desc: 'Tus datos clínicos seguros', icon: Icons.ClipboardList, color: 'bg-slate-50 text-[#4F84C4]' },
    { id: 'farmacia', title: 'Farmacia Ven', desc: 'Buscador de medicamentos', icon: Icons.Pill, color: 'bg-emerald-50 text-emerald-600' }
  ];

  return (
    <div className="view-transition p-6 flex flex-col gap-10 animate-in fade-in duration-200 pb-32 pt-8">
      {/* Tarjeta de Salud con Datos Médicos Críticos */}
      <div 
        style={{
          background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
          boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
          borderTop: '1px solid rgba(255, 255, 255, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="rounded-[3rem] p-10 text-white select-none active:scale-[0.99] transition-all"
      >
        {/* Specular glare edge */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)', pointerEvents: 'none' }} />
        
        <div className="relative z-10 space-y-1 text-center">
          <h2 className="text-3xl font-black tracking-tight text-[#FFFFFF]">Salud Pública</h2>
          <p className="text-[10px] text-[#FFFFFF] font-semibold uppercase tracking-[0.3em]">Ficha Médica Digital</p>
        </div>
        
        <div className="mt-10 grid grid-cols-3 gap-4 relative z-10">
           <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-[#FFFFFF]">Sangre</p>
              <p className="text-sm font-black mt-1.5 text-white">O Rh+</p>
           </div>
           <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-[#FFFFFF]">Alergias</p>
              <p className="text-sm font-black mt-1.5 text-[#FF6B6B]">Penicilina</p>
           </div>
           <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-[#FFFFFF]">Seguro</p>
              <p className="text-sm font-black mt-1.5 text-[#00FFCC]">ACTIVO</p>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] px-4">Servicios Médicos</h3>
        <div className="grid grid-cols-1 gap-4">
          {healthServices.map((service, i) => (
            <div 
              key={i} 
              onClick={() => setActiveModal(service.id as any)}
              style={{
                background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
                boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                position: 'relative',
                overflow: 'hidden',
              }}
              className="p-6 rounded-[2.5rem] flex items-center gap-6 hover:shadow-none transition-all cursor-pointer active:scale-95 group"
            >
              {/* Specular glare edge */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)', pointerEvents: 'none' }} />
              
              <div 
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)',
                  boxShadow: 'none',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-none relative z-10 chip-aurora${['','-morado','-verde','-ambar','-rojo','-teal','-rosa','-lima'][i % 8]}`}
              >
                  <service.icon size={25} className="text-white group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex-1 relative z-10">
                <h4 className="text-sm font-bold text-white tracking-tight">{service.title}</h4>
                <p className="text-[10px] text-white/80 font-medium uppercase tracking-widest mt-1">{service.desc}</p>
              </div>
              <Icons.ChevronRight className="text-white/80 group-hover:text-white transition-colors relative z-10" size={20} />
            </div>
          ))}
        </div>
      </div>

      <div 
        style={{
          background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
          boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
          borderTop: '1px solid rgba(255, 255, 255, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="rounded-[3.5rem] p-10 flex flex-col gap-6 mx-2 animate-in fade-in duration-300"
      >
         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)', pointerEvents: 'none' }} />
         
         <div className="flex items-center gap-4 relative z-10">
            <div 
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)',
                boxShadow: 'none',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              className="w-10 h-10 rounded-xl flex items-center justify-center chip-aurora"
            >
              <Icons.Activity className="text-blue-400 font-bold" size={20} />
            </div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Tu Actividad Semanal</h4>
         </div>
         <div className="flex items-end gap-3 h-24 px-2 relative z-10">
            {[30, 45, 25, 60, 80, 50, 40].map((h, i) => (
              <div key={i} className="flex-1 bg-white/5 rounded-full group relative h-full">
                 <div className="absolute bottom-0 w-full bg-blue-500 rounded-full transition-all duration-1000 shadow-none" style={{ height: `${h}%` }}></div>
              </div>
            ))}
         </div>
         <div className="space-y-1 relative z-10">
          <p className="text-[10px] text-white font-black uppercase tracking-widest text-center">Nivel de bienestar optimizado</p>
          <p className="text-[11px] text-white/80 font-bold uppercase tracking-tighter text-center">Sincronizado con tus dispositivos</p>
         </div>
      </div>

      <HealthModals 
        isOpen={activeModal !== null} 
        onClose={() => setActiveModal(null)} 
        type={activeModal} 
      />
    </div>
  );
};
