
import React, { useState, useRef, useCallback } from 'react';
import { Icons } from '../components/Icons';
import { AppView, ServiceItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_NEWS } from '../data/news';

interface HomeProps {
  onNavigate: (view: AppView, params?: { newsId?: string | number }) => void;
}

const ServiceCard = React.memo(({ service, onNavigate }: { service: { id: string; title: string; icon: string; status?: string; statusColor?: string }, onNavigate: (view: AppView) => void }) => {
  const IconComponent = (Icons as any)[service.icon];

  return (
    <button
      onClick={() => onNavigate(service.id as AppView)}
      data-tour={service.id === 'payments' ? 'pagos' : service.id === 'renacer' ? 'renacer' : undefined}
      style={{
        background: 'radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
        aspectRatio: '1/1',
        position: 'relative',
        borderRadius: '28px',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
      }}
      className="w-full flex justify-between flex-col items-start p-4 active:scale-[0.98] transition-all duration-150 group hover:shadow-none overflow-hidden relative"
    >
      {/* Aurora + Noise background layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[28px]">
        {/* Subtle Aurora mesh */}
        <div className="absolute inset-[-50%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(25,198,181,0.35)_0%,transparent_50%),radial-gradient(ellipse_at_0%_100%,rgba(20,100,160,0.6)_0%,transparent_50%)] animate-[spin_30s_linear_infinite] mix-blend-screen" />
        {/* Noise layer */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
      </div>

      {/* 1. Especular brillo esquina superior izquierda */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '65%',
        height: '65%',
        background: 'radial-gradient(circle at 12% 12%, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)',
        borderRadius: '28px 0 0 0',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* 2. Reflejo de luz de estudio difuso superior */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '42%',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, transparent 100%)',
        borderRadius: '28px 28px 0 0',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Icons container */}
      <div className="relative z-10 w-full flex justify-end items-start mt-[-4px]">
        <div className="h-9 w-9 flex items-center justify-center rounded-[12px] bg-black/20 backdrop-blur-xl shadow-[inset_0_1px_4px_rgba(0,0,0,0.4),_0_1px_0_rgba(255,255,255,0.15)] border border-black/20 text-white group-hover:scale-110 transition-transform duration-300 chip-aurora">
          {IconComponent && <IconComponent size={20} strokeWidth={1.5} />}
        </div>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center mt-auto">
        <span 
          className="font-black text-white uppercase drop-shadow-sm mb-1 text-center w-full leading-[1.1] break-words px-1" 
          style={{ 
            fontSize: service.title.length > 10 ? '9px' : '11px',
            textShadow: '0 1px 2px rgba(0,0,0,0.4)', 
            letterSpacing: service.title.length > 10 ? '0.05em' : '0.1em' 
          }}
        >
          {service.title}
        </span>
        {service.status && (
          <div className="flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded-[0.5rem] backdrop-blur-md border border-white/10 mt-1 shadow-sm opacity-90 mx-auto max-w-[95%]">
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: service.statusColor || '#00FF66', boxShadow: `0 0 10px ${service.statusColor || '#00FF66'}CC` }} />
            <span className="text-[9px] font-bold text-[#FFFFFF] uppercase tracking-wider truncate">{service.status}</span>
          </div>
        )}
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
      onClick={() => item.enlace ? window.open(item.enlace, '_blank') : onNavigate('transparency', { newsId: item.id })}
    >
      {!imagenRota && item.imagenUrl && (
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
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{item.enlace ? `Leer en ${item.fuente ?? 'el portal'}` : 'Leer la nota completa'}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 5l7 7-7 7" /></svg>
        </div>
      </div>
    </div>
  );
});

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [showAllServices, setShowAllServices] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Noticias en vivo desde /api/news (La Iguana TV). Si el feed no
  // responde, el carrusel muestra solo las notas curadas — sin inventar.
  const [noticiasVivas, setNoticiasVivas] = useState<any[]>([]);
  React.useEffect(() => {
    let activo = true;
    fetch('/api/news')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (activo && d?.disponible && Array.isArray(d.noticias) && d.noticias.length > 0) {
          setNoticiasVivas(d.noticias);
        }
      })
      .catch(() => {});
    return () => { activo = false; };
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleServices = useCallback(() => {
    setShowAllServices(prev => !prev);
  }, []);

  const fixedServices = [
    { id: 'id-renewal', title: 'Saime', icon: 'Fingerprint', status: 'CITA EN 12 D.', statusColor: '#00FF66' },
    { id: 'business-reg', title: 'Saren', icon: 'FileText', status: 'FIRMA PENDIENTE', statusColor: '#FFA000' },
    { id: 'payments', title: 'Pagos', icon: 'CreditCard', status: 'SIN DEUDAS', statusColor: '#00FF66' },
    { id: 'renacer', title: 'Renacer', icon: 'Home', status: 'TU VIVIENDA', statusColor: '#00FF66' },
  ];

  const carouselServices = [
    { id: 'intt', title: 'Intt', icon: 'Car', status: 'VENCE MAÑANA', statusColor: '#FF9F0A' },
    { id: 'employment', title: 'Empleo', icon: 'Briefcase', status: 'VACANTES REPSOL', statusColor: '#00FF66' },
    { id: 'seniat', title: 'Seniat', icon: 'Landmark', status: 'CONTRIBUYENTE AL DÍA', statusColor: '#00FF66' },
    { id: 'economy', title: 'Economía', icon: 'BarChart3', status: 'TASA BCV ACTUALIZADA', statusColor: '#00FF66' },
    { id: 'national-pride', title: 'Lo Nuestro', icon: 'Flag', status: 'VERIFICADO', statusColor: '#00FF66' },
    { id: 'my-procedures', title: 'Trámites', icon: 'ClipboardList', status: '1 EN PROCESO', statusColor: '#FFA000' },
    { id: 'transparency', title: 'Transparencia', icon: 'ShieldCheck', status: 'VERIFICADO', statusColor: '#00FF66' },
  ];

  const getServiceSVG = (id: string) => {
    const stroke = "white";
    const size = "36";
    switch(id) {
      case 'id-renewal': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M6 16c0-2 1.5-3 3-3s3 1 3 3"/><path d="M15 9h3M15 13h2"/></svg>;
      case 'seniat': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"><path d="M3 9l9-6 9 6v11a1 1 0 01-1 1H4a1 1 0 01-1-1V9z"/><path d="M9 22V12h6v10"/></svg>;
      case 'payments': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M16 13a1 1 0 100 2 1 1 0 000-2z" fill="white"/><path d="M2 10h20"/></svg>;
      case 'employment': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="8" width="20" height="13" rx="2"/><path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M12 13v3M10 14h4"/></svg>;
      case 'intt': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"><path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/><path d="M5 12h14"/></svg>;
      case 'business-reg': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>;
      case 'economy': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"><path d="M3 20h18M5 20V10l4-4 4 4 4-6v16"/></svg>;
      case 'national-pride': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"><path d="M12 2l2.9 6.1L22 9.3l-5 4.9 1.2 6.9L12 18l-6.2 3.1 1.2-6.9L2 9.3l7.1-1.2L12 2z"/></svg>;
      case 'my-procedures': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/><path d="M7 7l.01 0"/></svg>;
      case 'transparency': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"><path d="M12 3v18M5 21h14"/><path d="M5 7l-3 6h6l-3-6zM19 7l-3 6h6l-3-6z"/><path d="M5 7h14"/></svg>;
      default: return null;
    }
  };

  const veniaAlerts = [
    { 
      id: 'id', 
      title: 'Tu Cédula vence en 12 días', 
      desc: 'He pre-llenado tu solicitud de renovación. ¿Quieres agendar tu cita biométrica ahora?',
      action: 'Gestionar ahora',
      view: 'id-renewal'
    },
    { 
      id: 'license', 
      title: 'Licencia de Conducir por vencer', 
      desc: 'Tu licencia vence el próximo mes. Puedes renovarla digitalmente en 5 minutos.',
      action: 'Renovar Licencia',
      view: 'intt'
    },
    { 
      id: 'tax', 
      title: 'Declaración de ISLR pendiente', 
      desc: 'El periodo fiscal está por cerrar. He calculado tu estimado basado en tus ingresos.',
      action: 'Declarar ISLR',
      view: 'payments'
    }
  ];

  const [activeAlert, setActiveAlert] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveAlert((prev) => (prev + 1) % veniaAlerts.length);
    }, 5000);
  };

  React.useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [veniaAlerts.length]);

  const handleNextAlert = () => {
    setActiveAlert((prev) => (prev + 1) % veniaAlerts.length);
    startTimer();
  };

  return (
    <div className="view-transition flex flex-col gap-8 pb-32 pt-4">
      

      {/* Bento Grid Services - iPhone Style */}
      <section className="px-4 space-y-4">
        <div data-tour="tramites" className="grid grid-cols-2 gap-3.5 px-4 mt-2">
          {showAllServices ? (
            <>
              {fixedServices.map((service) => (
                <ServiceCard key={service.id} service={service} onNavigate={onNavigate} />
              ))}
              {carouselServices.map((service) => (
                <ServiceCard key={service.id} service={service} onNavigate={onNavigate} />
              ))}
            </>
          ) : (
            <>
              {fixedServices.map((service) => (
                <ServiceCard key={service.id} service={service} onNavigate={onNavigate} />
              ))}
              <ServiceCard key="dynamic-carousel" service={carouselServices[carouselIndex]} onNavigate={onNavigate} />
            </>
          )}
          
          <button
            onClick={toggleServices}
            style={{
              background: 'radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
              aspectRatio: '1/1',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '28px',
              boxShadow: 'none',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
            className="w-full flex flex-col items-start justify-end p-5 active:scale-[0.98] transition-all duration-150 group hover:shadow-none bg-opacity-50 border border-white/10"
          >
            {/* 1. Especular brillo esquina superior izquierda */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '65%',
              height: '65%',
              background: 'radial-gradient(circle at 12% 12%, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)',
              borderRadius: '28px 0 0 0',
              pointerEvents: 'none',
              zIndex: 2,
            }} />

            {/* 2. Reflejo de luz de estudio difuso superior */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '42%',
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, transparent 100%)',
              borderRadius: '28px 28px 0 0',
              pointerEvents: 'none',
              zIndex: 1,
            }} />

            {/* 3. Sombra polarizada inferior */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '28%',
              background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.35) 0%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 1,
            }} />

            {/* Ícono perfectamente centrado con brillo difuso sutil del color temático */}
            <div 
              style={{ 
                position: 'absolute', 
                top: '46%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
              }}
              className="flex items-center justify-center text-[#FFFFFF] group-hover:text-white transition-colors"
            >
              <div 
                style={{ filter: `drop-shadow(0 0 10px rgba(255, 255, 255, 0.4))` }}
                className="transition-all duration-300"
              >
                {showAllServices ? <Icons.Minus size={38} strokeWidth={1.2} /> : <Icons.LayoutGrid size={38} strokeWidth={1.2} />}
              </div>
            </div>

            {/* Texto del servicio alineado abajo */}
            <div className="relative z-10 w-full flex flex-col items-center mt-auto">
              <span 
                style={{ 
                  color: '#FFFFFF', 
                  fontWeight: 900, 
                  fontSize: '11px', 
                  letterSpacing: '0.1em',
                  textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                }} 
                className="text-center w-full uppercase drop-shadow-sm leading-tight mb-1"
              >
                {showAllServices ? 'Menos' : 'Otros'}
              </span>
            </div>
          </button>
        </div>
      </section>

      

      {/* News Carousel */}
      <section data-tour="noticias" className="mt-8 mb-6 bg-white dark:bg-transparent">
        <h3 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 px-5">Últimas Noticias</h3>
        <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory no-scrollbar px-5 pb-4">
          {[...noticiasVivas, ...MOCK_NEWS].map(item => (
            <NewsCard key={item.id} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      

    </div>
  );
};
