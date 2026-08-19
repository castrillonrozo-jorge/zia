
import React from 'react';
import { Icons } from '../components/Icons';

export const Notifications: React.FC = () => {
  const alerts = [
    {
      id: 1,
      title: 'Bono de Guerra Económica',
      desc: 'Ha sido asignado el beneficio correspondiente al mes de Noviembre. Verifique su monedero.',
      date: 'Hace 10 min',
      icon: Icons.Zap,
      color: 'bg-amber-500/10 text-amber-500',
      unread: true
    },
    {
      id: 2,
      title: 'Trámite de Cédula Aprobado',
      desc: 'Su renovación de C.I. digital ha sido validada con éxito. Ya puede descargarla.',
      date: 'Hace 2 horas',
      icon: Icons.CheckCircle2,
      color: 'bg-emerald-500/10 text-emerald-500',
      unread: true
    },
    {
      id: 3,
      title: 'Alerta Hidrocapital',
      desc: 'Mantenimiento programado en la zona metropolitana. El servicio se restablecerá en 24h.',
      date: 'Ayer',
      icon: Icons.Droplets,
      color: 'bg-blue-500/10 text-blue-500',
      unread: false
    },
    {
      id: 4,
      title: 'Seguridad Digital',
      desc: 'Se ha detectado un inicio de sesión desde un nuevo dispositivo en su cuenta Agiliza.',
      date: '14 Nov',
      icon: Icons.ShieldCheck,
      color: 'bg-rose-500/10 text-rose-500',
      unread: false
    },
    {
      id: 5,
      title: 'Recordatorio SENIAT',
      desc: 'Quedan pocos días para la declaración estimada de ISLR. Evite sanciones.',
      date: '12 Nov',
      icon: Icons.Landmark,
      color: 'bg-slate-500/10 text-slate-500',
      unread: false
    }
  ];

  return (
    <div className="view-transition p-4 flex flex-col gap-10 pb-32 pt-8">
      <div className="flex items-center justify-between px-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Notificaciones</h2>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.3em]">Alertas Agiliza</p>
        </div>
        <button className="text-[10px] font-black text-[#4F84C4] dark:text-blue-400 uppercase tracking-widest hover:underline underline-offset-4 active:scale-95 transition-all">Marcar todo leido</button>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, iCh) => (
          <div 
            key={alert.id} 
            className={`p-8 rounded-[2.5rem] flex items-start gap-6 transition-all border border-black/[0.05] dark:border-white/[0.08] shadow-none active:scale-[0.98] ${alert.unread ? 'bg-[#4F84C4]/[0.03] dark:bg-blue-400/[0.05] border-[#4F84C4]/20 dark:border-blue-400/30' : 'bg-white dark:bg-[#0D1117]'}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${alert.color} dark:bg-white/5 backdrop-blur-xl shadow-none border border-black/[0.05] dark:border-white/[0.05] chip-aurora${['','-morado','-verde','-ambar','-rojo','-teal','-rosa','-lima'][iCh % 8]}`}>
              <alert.icon size={26} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-black text-sm leading-tight text-slate-900 dark:text-white tracking-tight">{alert.title}</h3>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase whitespace-nowrap ml-4 tracking-widest">{alert.date}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 font-bold">{alert.desc}</p>
              {alert.unread && (
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#4F84C4] dark:bg-blue-400 rounded-full shadow-none"></div>
                  <span className="text-[10px] font-black text-[#4F84C4] dark:text-blue-400 uppercase tracking-widest">Nueva Alerta</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 dark:bg-[#0D1117] rounded-[3.5rem] p-12 text-center space-y-8 border border-black/[0.05] dark:border-white/[0.08] shadow-none mx-2">
        <div className="w-20 h-20 rounded-3xl bg-white dark:bg-white/5 flex items-center justify-center mx-auto shadow-none border border-black/[0.05] dark:border-white/[0.05] chip-aurora">
          <Icons.Bell className="text-[#4F84C4] dark:text-blue-400" size={36} />
        </div>
        <div className="space-y-3">
          <p className="text-xs text-slate-900 dark:text-white font-black uppercase tracking-widest">Suscripciones Críticas</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold px-4 leading-relaxed uppercase tracking-tighter">Suscríbete a alertas de servicios públicos y trámites institucionales.</p>
        </div>
        <button className="w-full text-[10px] font-black text-white dark:text-slate-900 bg-slate-900 dark:bg-white px-8 py-5 rounded-2xl uppercase tracking-widest active:scale-95 transition-all shadow-none shadow-black/10 dark:shadow-white/10">
          Gestionar Canales
        </button>
      </div>
    </div>
  );
};
