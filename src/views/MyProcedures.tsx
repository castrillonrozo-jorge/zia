
import React from 'react';
import { Icons } from '../components/Icons';

export const MyProcedures: React.FC = () => {
  const procedures = [
    {
      id: 'SAI-99812',
      title: 'Renovación de Cédula',
      agency: 'SAIME',
      status: 'En Proceso',
      statusColor: 'text-[#4F84C4] bg-[#4F84C4]/10 dark:bg-[#4F84C4]/20',
      date: '15 Nov 2024',
      icon: Icons.Fingerprint
    },
    {
      id: 'PAS-10224',
      title: 'Cita de Pasaporte Nuevo',
      agency: 'SAIME',
      status: 'Agendado',
      statusColor: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10',
      date: '10 Nov 2024',
      icon: Icons.Globe
    },
    {
      id: 'RIF-4421',
      title: 'Actualización de RIF',
      agency: 'SENIAT',
      status: 'Finalizado',
      statusColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10',
      date: '02 Nov 2024',
      icon: Icons.Landmark
    },
    {
      id: 'INTT-551',
      title: 'Renovación Licencia 3ra',
      agency: 'INTT',
      status: 'En Revisión',
      statusColor: 'text-slate-600 bg-slate-50 dark:bg-slate-500/10',
      date: '28 Oct 2024',
      icon: Icons.Zap
    },
    {
      id: 'MPP-8123',
      title: 'Apostilla de Documentos',
      agency: 'MPPRE',
      status: 'En Proceso',
      statusColor: 'text-[#4F84C4] bg-[#4F84C4]/10 dark:bg-[#4F84C4]/20',
      date: '12 Ago 2025',
      icon: Icons.Signature
    },
    {
      id: 'MIJ-904',
      title: 'Certificado Antecedentes Penales',
      agency: 'MPPRIJP',
      status: 'Finalizado',
      statusColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10',
      date: '04 Abr 2026',
      icon: Icons.FileText
    },
    {
      id: 'SAR-218',
      title: 'Registro de Título Universitario',
      agency: 'SAREN',
      status: 'Finalizado',
      statusColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10',
      date: '10 Ene 2026',
      icon: Icons.GraduationCap
    }
  ];

  return (
    <div className="view-transition p-6 flex flex-col gap-10 pb-32 pt-8">
      <div className="space-y-1 px-2">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Mis Trámites</h2>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.3em]">Seguimiento de Solicitudes</p>
      </div>

      <div className="flex flex-col gap-5">
        {procedures.map((proc, iCh) => (
          <div key={proc.id} 
              style={{
                background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
                boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
              }}
              className="p-8 rounded-[2.5rem] flex flex-col gap-6 group active:scale-[0.98] transition-all relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
              <div className="flex gap-5">
                <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className={`w-14 h-14 rounded-2xl flex items-center justify-center text-[#FFFFFF] shadow-none chip-aurora${['','-morado','-verde','-ambar','-rojo','-teal','-rosa','-lima'][iCh % 8]}`}>
                  <proc.icon size={26} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#FFFFFF] tracking-tight">{proc.title}</h4>
                  <p className="text-[10px] font-semibold text-white/80 uppercase tracking-widest mt-1.5">{proc.agency} • {proc.id}</p>
                </div>
              </div>
              <span style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-[#FFFFFF]`}>
                {proc.status}
              </span>
            </div>

            <div className="h-px bg-white/10 relative z-10"></div>

            <div className="flex justify-between items-center relative z-10">
              <span className="text-[10px] font-semibold text-white/80 uppercase tracking-widest">Iniciado: {proc.date}</span>
              <button className="text-[10px] font-black text-[#FFFFFF] uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                Ver Detalles <Icons.ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div 
        style={{
          background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
          boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
          borderTop: '1px solid rgba(255, 255, 255, 0.25)',
        }}
        className="rounded-[3.5rem] p-12 text-center space-y-8 mx-2 relative overflow-hidden">
        <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-none chip-aurora">
           <Icons.Clock size={32} className="text-[#FFFFFF]" />
        </div>
        <div className="space-y-3 relative z-10">
          <p className="text-xs text-[#FFFFFF] font-black uppercase tracking-widest">Estado en Tiempo Real</p>
          <p className="text-[11px] text-white/90 font-bold px-4 leading-relaxed uppercase tracking-tighter">Recibirás notificaciones push sobre cualquier cambio de estatus en tus solicitudes.</p>
        </div>
        <button style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-full text-[#FFFFFF] py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all relative z-10">
          Habilitar Alertas Push
        </button>
      </div>
    </div>
  );
};
