
import React, { useState, useCallback } from 'react';
import { Icons } from '../components/Icons';
import { AppView } from '../types';
import { MOCK_NEWS } from '../data/news';

/**
 * Inicio rediseñado (disenos/Renacer elaborado.dc.html, sección 04):
 * buscador arriba, tarjeta de saldo con recargar/transferir, «Lo tuyo
 * ahora» con vencimientos en rojo, y rejilla de siglas en dos niveles
 * (sigla grande + para qué sirve debajo) donde solo «Todos» lleva el
 * acrílico azul — el efecto premium marca la salida en vez de repetirse.
 */

interface HomeProps {
  onNavigate: (view: AppView, params?: { newsId?: string | number }) => void;
  balance: number;
  onOpenRecharge: () => void;
  onOpenTransfer: () => void;
  onOpenSearch: () => void;
}

const ACRILICO = {
  background: `
    radial-gradient(circle at 12% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.04) 42%, transparent 70%),
    linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 45%),
    linear-gradient(135deg, #3A69A3 0%, #4F84C4 100%)
  `,
  boxShadow: '0 14px 34px rgba(47,94,158,0.32), inset 0 1px 1px rgba(255,255,255,0.28)',
  border: '1px solid rgba(255,255,255,0.15)',
};

/* Rejilla de trámites: sigla en 14,5 px negrita, «para qué sirve» en 12 px gris. */
const ORGANISMOS: { id: AppView; sigla: string; detalle: string; icon: string; color: string; tinte: string }[] = [
  { id: 'id-renewal', sigla: 'SAIME', detalle: 'Cédula y pasaporte', icon: 'Fingerprint', color: '#2F62A8', tinte: '#EAF1FA' },
  { id: 'business-reg', sigla: 'SAREN', detalle: 'Registros y notarías', icon: 'FileText', color: '#7C5CBF', tinte: '#F3EFFA' },
  { id: 'intt', sigla: 'INTT', detalle: 'Licencia y vehículo', icon: 'Car', color: '#B97A18', tinte: '#FBF3E4' },
  { id: 'seniat', sigla: 'SENIAT', detalle: 'RIF e impuestos', icon: 'Landmark', color: '#1E8E67', tinte: '#E8F6F0' },
  { id: 'employment', sigla: 'IVSS', detalle: 'Empleo y pensión', icon: 'Briefcase', color: '#C24A64', tinte: '#FAECEF' },
];

const ORGANISMOS_EXTRA: typeof ORGANISMOS = [
  { id: 'payments', sigla: 'Pagos', detalle: 'Servicios y tributos', icon: 'CreditCard', color: '#2D728E', tinte: '#E9F3F7' },
  { id: 'health', sigla: 'Salud', detalle: 'Citas y farmacia', icon: 'Stethoscope', color: '#0F8F8F', tinte: '#E6F5F5' },
  { id: 'economy', sigla: 'Economía', detalle: 'Indicadores y BCV', icon: 'BarChart3', color: '#5B7A2E', tinte: '#F0F5E7' },
  { id: 'my-procedures', sigla: 'Carpeta', detalle: 'Trámites en curso', icon: 'ClipboardList', color: '#5A6B85', tinte: '#EEF1F6' },
  { id: 'transparency', sigla: 'Datos', detalle: 'Inversión y noticias', icon: 'ShieldCheck', color: '#2F62A8', tinte: '#EAF1FA' },
  { id: 'national-pride', sigla: 'Lo Nuestro', detalle: 'Cultura y orgullo', icon: 'Flag', color: '#C8102E', tinte: '#FBEAEC' },
];

/* «Lo tuyo ahora»: solo se colorea lo que exige que hagas algo. */
const LO_TUYO: { id: string; titulo: string; vence: string; urgente: boolean; detalle: string; view: AppView }[] = [
  { id: 'licencia', titulo: 'Licencia · INTT', vence: 'Vence mañana', urgente: true, detalle: 'Renovable en línea en 5 minutos', view: 'intt' },
  { id: 'cedula', titulo: 'Cédula · SAIME', vence: 'Vence en 12 días', urgente: true, detalle: 'Solicitud pre-llenada, falta la cita', view: 'id-renewal' },
  { id: 'islr', titulo: 'ISLR · SENIAT', vence: 'Cierra este mes', urgente: false, detalle: 'Declaración estimada lista para revisar', view: 'seniat' },
];

const OrganismoCard = React.memo(({ org, onNavigate }: { org: typeof ORGANISMOS[number]; onNavigate: (view: AppView) => void }) => {
  const IconComponent = (Icons as any)[org.icon];
  return (
    <button
      onClick={() => onNavigate(org.id)}
      className="w-full flex flex-col items-start gap-3 p-4 rounded-[24px] bg-white dark:bg-[#0D1117] border border-black/[0.06] dark:border-white/10 shadow-[0_2px_10px_rgba(15,30,60,0.05)] active:scale-[0.98] transition-all duration-150 text-left"
    >
      <div
        className="h-[42px] w-[42px] flex items-center justify-center rounded-[14px] shrink-0"
        style={{ backgroundColor: org.tinte, color: org.color }}
      >
        {IconComponent && <IconComponent size={22} strokeWidth={1.8} />}
      </div>
      <div className="min-w-0">
        <p className="text-[14.5px] font-black tracking-tight text-slate-900 dark:text-white leading-none">{org.sigla}</p>
        <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 leading-snug mt-1.5">{org.detalle}</p>
      </div>
    </button>
  );
});

const NewsCard = React.memo(({ item, onNavigate }: { item: any, onNavigate: (view: AppView, params?: { newsId?: string | number }) => void }) => {
  const [imagenRota, setImagenRota] = useState(false);
  return (
    <div
      className="flex-none w-[92%] h-[440px] rounded-[28px] relative overflow-hidden snap-center cursor-pointer shadow-[0_18px_44px_rgba(10,25,50,0.35)] group border border-black/5 dark:border-white/10 active:scale-[0.985] transition-all duration-150"
      style={{ background: 'linear-gradient(160deg, #1E3A5F 0%, #0D1B2E 100%)' }}
      onClick={() => onNavigate('transparency', { newsId: item.id })}
    >
      {!imagenRota && (
        <img
          src={item.imagenUrl}
          alt={item.titulo}
          onError={() => setImagenRota(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/5"></div>
      <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
        <div className="flex items-center gap-2 mb-3.5">
          <span className="inline-block text-white text-[9.5px] font-black uppercase tracking-[0.18em] px-3 py-1.5 rounded-full w-fit" style={{ background: '#CC0000', boxShadow: '0 2px 12px rgba(204,0,0,0.55)' }}>
            Nacional
          </span>
          {item.fecha && (
            <span className="inline-block bg-white/15 backdrop-blur-md border border-white/20 text-white text-[9.5px] font-black uppercase tracking-[0.18em] px-3 py-1.5 rounded-full w-fit">
              {item.fecha}
            </span>
          )}
        </div>
        <h4 className="text-white font-black text-[23px] leading-[1.14] mb-2.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] pr-2 tracking-tight">{item.titulo}</h4>
        <p className="text-white/85 text-[13px] leading-relaxed line-clamp-2 font-medium pr-4">{item.descripcion}</p>
        <div className="flex items-center gap-1.5 mt-3.5 text-white/60">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Leer la nota completa</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 5l7 7-7 7" /></svg>
        </div>
      </div>
    </div>
  );
});

export const Home: React.FC<HomeProps> = ({ onNavigate, balance, onOpenRecharge, onOpenTransfer, onOpenSearch }) => {
  const [showAllServices, setShowAllServices] = useState(false);

  const toggleServices = useCallback(() => {
    setShowAllServices(prev => !prev);
  }, []);

  const saldo = balance.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="view-transition flex flex-col gap-7 pb-32 pt-3 px-4">

      {/* Buscar es la entrada, no el menú */}
      <button
        onClick={onOpenSearch}
        className="w-full h-[52px] flex items-center gap-3 px-5 rounded-full bg-white dark:bg-[#0D1117] border border-black/[0.07] dark:border-white/10 shadow-[0_2px_12px_rgba(15,30,60,0.06)] active:scale-[0.99] transition-all duration-150 text-left"
      >
        <Icons.Search size={19} strokeWidth={2.2} className="text-[#2F62A8] shrink-0" />
        <span className="text-[14px] font-medium text-slate-400 dark:text-slate-500 truncate">Buscar trámites — cédula, licencia, RIF…</span>
      </button>

      {/* Saldo: el dinero deja de estar escondido dos niveles abajo */}
      <div
        data-tour="pagos"
        onClick={() => onNavigate('wallet')}
        className="w-full rounded-[28px] p-5 cursor-pointer active:scale-[0.99] transition-all duration-150 relative overflow-hidden"
        style={ACRILICO}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/75">Saldo disponible</p>
            <p className="text-[30px] font-black text-white tracking-tight mt-1 leading-none" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.25)' }}>
              Bs {saldo}
            </p>
          </div>
          <div className="h-10 w-10 flex items-center justify-center rounded-[13px] bg-black/20 backdrop-blur-xl border border-black/20 text-white shadow-[inset_0_1px_4px_rgba(0,0,0,0.4),_0_1px_0_rgba(255,255,255,0.15)]">
            <Icons.Wallet size={20} strokeWidth={1.6} />
          </div>
        </div>
        <div className="flex gap-2.5 mt-5">
          <button
            onClick={(e) => { e.stopPropagation(); onOpenRecharge(); }}
            className="flex-1 h-[42px] flex items-center justify-center gap-2 rounded-full bg-white/16 border border-white/25 backdrop-blur-md text-white text-[13px] font-bold active:scale-[0.97] transition-all"
          >
            <Icons.Plus size={16} strokeWidth={2.4} /> Recargar
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onOpenTransfer(); }}
            className="flex-1 h-[42px] flex items-center justify-center gap-2 rounded-full bg-white/16 border border-white/25 backdrop-blur-md text-white text-[13px] font-bold active:scale-[0.97] transition-all"
          >
            <Icons.Send size={15} strokeWidth={2.2} /> Transferir
          </button>
        </div>
      </div>

      {/* Lo tuyo ahora: la fecha en rojo solo donde apremia */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Lo tuyo ahora</h3>
          <button onClick={() => onNavigate('my-procedures')} className="text-[12.5px] font-bold text-[#2F62A8] dark:text-[#7FA9DC]">
            Ver todo
          </button>
        </div>
        <div className="flex overflow-x-auto gap-3 snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-1">
          {LO_TUYO.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.view)}
              className="flex-none w-[240px] snap-start text-left p-4 rounded-[22px] bg-white dark:bg-[#0D1117] border border-black/[0.06] dark:border-white/10 shadow-[0_2px_10px_rgba(15,30,60,0.05)] active:scale-[0.98] transition-all duration-150"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[13.5px] font-black tracking-tight text-slate-900 dark:text-white truncate">{item.titulo}</p>
                <Icons.ChevronRight size={15} strokeWidth={2.4} className="text-slate-300 dark:text-slate-600 shrink-0" />
              </div>
              <p className="text-[12.5px] font-black mt-1.5" style={{ color: item.urgente ? '#C8102E' : '#B97A18' }}>{item.vence}</p>
              <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 leading-snug mt-1">{item.detalle}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Trámites: sigla grande, para qué sirve debajo; un solo acrílico */}
      <section>
        <h3 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3 px-1">Trámites</h3>
        <div data-tour="tramites" className="grid grid-cols-2 gap-3">
          {ORGANISMOS.map(org => (
            <OrganismoCard key={org.id} org={org} onNavigate={onNavigate} />
          ))}
          {showAllServices && ORGANISMOS_EXTRA.map(org => (
            <OrganismoCard key={org.id} org={org} onNavigate={onNavigate} />
          ))}

          <button
            onClick={toggleServices}
            className="w-full flex flex-col items-start gap-3 p-4 rounded-[24px] active:scale-[0.98] transition-all duration-150 text-left relative overflow-hidden"
            style={ACRILICO}
          >
            <div className="h-[42px] w-[42px] flex items-center justify-center rounded-[14px] bg-black/20 backdrop-blur-xl border border-black/20 text-white shadow-[inset_0_1px_4px_rgba(0,0,0,0.4),_0_1px_0_rgba(255,255,255,0.15)]">
              {showAllServices ? <Icons.Minus size={22} strokeWidth={1.8} /> : <Icons.LayoutGrid size={22} strokeWidth={1.8} />}
            </div>
            <div>
              <p className="text-[14.5px] font-black tracking-tight text-white leading-none" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                {showAllServices ? 'Menos' : 'Todos'}
              </p>
              <p className="text-[12px] font-medium text-white/80 leading-snug mt-1.5">
                {showAllServices ? 'Ver solo organismos' : '14 servicios'}
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Renacer: la reconstrucción, el motivo de la app */}
      <button
        data-tour="renacer"
        onClick={() => onNavigate('renacer')}
        className="w-full flex items-center gap-4 p-5 rounded-[28px] active:scale-[0.99] transition-all duration-150 text-left relative overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at 12% 12%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.03) 42%, transparent 70%),
            linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 45%),
            linear-gradient(135deg, #1E3A5F 0%, #2F5E9E 60%, #4F84C4 100%)
          `,
          boxShadow: '0 14px 34px rgba(30,58,95,0.38), inset 0 1px 1px rgba(255,255,255,0.24)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <div className="h-[50px] w-[50px] flex items-center justify-center rounded-[16px] bg-black/20 backdrop-blur-xl border border-black/20 text-white shadow-[inset_0_1px_4px_rgba(0,0,0,0.4),_0_1px_0_rgba(255,255,255,0.15)] shrink-0">
          <Icons.Home size={24} strokeWidth={1.6} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10.5px] font-black uppercase tracking-[0.18em]" style={{ color: '#F5D06F' }}>Plan Renacer</p>
          <p className="text-[16.5px] font-black tracking-tight text-white leading-tight mt-0.5" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
            La reconstrucción, en tu mano
          </p>
          <p className="text-[12px] font-medium text-white/80 leading-snug mt-1 truncate">Tu vivienda, el crédito y los avances del plan</p>
        </div>
        <Icons.ChevronRight size={18} strokeWidth={2.4} className="text-white/70 shrink-0" />
      </button>

      {/* News Carousel */}
      <section data-tour="noticias" className="mt-2 mb-6 -mx-4 bg-white dark:bg-transparent">
        <h3 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 px-5">Últimas Noticias</h3>
        <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory no-scrollbar px-5 pb-4">
          {MOCK_NEWS.map(item => (
            <NewsCard key={item.id} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

    </div>
  );
};
