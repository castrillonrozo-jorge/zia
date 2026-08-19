import React, { useEffect, useRef, useState } from 'react';
import { Icons } from '../components/Icons';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_NEWS } from '../data/news';

export const Transparency: React.FC<{ selectedNewsId?: string | number | null, onBack?: () => void }> = ({ selectedNewsId, onBack }) => {
  const newsRefs = useRef<{ [key: string | number]: HTMLDivElement | null }>({});
  const [expandedNews, setExpandedNews] = useState<string | number | null>(selectedNewsId || null);

  useEffect(() => {
    if (selectedNewsId && newsRefs.current[selectedNewsId]) {
      // Use setTimeout to ensure the DOM is fully rendered and transition has started before scrolling
      setTimeout(() => {
        newsRefs.current[selectedNewsId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [selectedNewsId]);

  const toggleExpand = (id: string | number) => {
    setExpandedNews(prev => prev === id ? null : id);
  };

  // Inversiones y alianzas reales, con su dato y su fecha.
  // Fuentes: anuncios oficiales y prensa (CAF, Infobae, La Iguana), Jun-Ago 2026.
  const investments = [
    { label: 'GE Vernova — Sistema Eléctrico', dato: '1.000 MW', detalle: 'Memorando · 24 meses · Jun 2026', icon: Icons.Zap },
    { label: 'Corpoelec + IMPSA — Macagua y Tocoma', dato: '672 MW', detalle: 'Adendum firmado · 12 Ago 2026', icon: Icons.Activity },
    { label: 'Shell — Campo de gas Loran', dato: 'Fase I', detalle: 'Licencia de exploración · Jun 2026', icon: Icons.TrendingUp },
    { label: 'CAF — Fondo de Reconstrucción', dato: 'Hasta $200M', detalle: 'Creado el 28 Jun 2026', icon: Icons.Landmark },
    { label: 'Viviendas Post-Terremoto', dato: '87 / 4.000', detalle: 'Entregadas · meta fin de año', icon: Icons.Home },
  ];

  const budgetStats = [
    { label: 'Fondo CAF Reconstrucción', value: 'Hasta $200M', icon: Icons.Landmark },
    { label: 'Viviendas Entregadas 04 Ago', value: '87', icon: Icons.Home },
    { label: 'Meta Viviendas 2026', value: '4.000', icon: Icons.Layers },
  ];

  return (
    <div className="view-transition flex flex-col gap-10 pb-[120px] pt-8">
      {/* Hero Section: Total Revenue */}
      <section className="px-6">
        <div 
          style={{
            background: 'radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
            boxShadow: 'none',
            border: '1px solid rgba(255,255,255,0.12)'
          }}
          className="relative overflow-hidden rounded-[3rem] p-6 md:p-12 text-white shadow-none group active:scale-[0.98] transition-all"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,56,147,0.2),transparent_70%)]"></div>
          
          <div className="relative z-10 space-y-8 flex flex-col h-full justify-between">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-none"></div>
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-white/80 shrink-0">Transparencia</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-6 md:pt-4 pb-2 relative group-hover:scale-[1.02] transition-transform duration-500">
              <div className="absolute -left-6 md:-left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-amber-300/40 to-transparent shadow-none"></div>
              <div className="flex items-center gap-3 text-amber-200/80">
                <Icons.BarChart3 size={16} />
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500/80">Fondo CAF · Recuperación y Reconstrucción</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-black text-amber-100/60 pr-1">hasta</span>
                <span className="text-5xl md:text-6xl font-black tracking-tighter leading-none inline-block text-transparent bg-clip-text bg-gradient-to-br from-white via-amber-50 to-amber-200/50 drop-shadow-none">200<span className="text-3xl md:text-4xl text-amber-100/50 px-1">M</span>$</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl backdrop-blur-sm mt-4 shadow-none">
                <Icons.TrendingUp size={14} className="text-amber-400" />
                <span className="text-[10px] font-black tracking-widest text-amber-100/90">Fuente: CAF · 28 Jun 2026</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-md shadow-none chip-aurora">
                  <Icons.ShieldCheck size={22} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/50">Última Actualización</p>
                  <p className="text-xs md:text-sm font-black text-white tracking-tight mt-0.5">13 Ago 2026 · Fuentes públicas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Budget Stats Bento */}
      <section className="px-6 grid grid-cols-3 gap-4">
        {budgetStats.map((stat, i) => (
          <div 
            key={i} 
            style={{
              background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
              boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
              borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            }}
            className="p-6 rounded-[2rem] border border-white/10 flex flex-col items-center text-center gap-3 shadow-none relative overflow-hidden"
          >
            <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-10 h-10 rounded-xl flex items-center justify-center text-[#FFFFFF] relative z-10 chip-aurora">
              <stat.icon size={20} />
            </div>
            <div className="space-y-0.5 relative z-10">
              <p className="text-[8px] font-black text-[#FFFFFF] opacity-80 uppercase tracking-widest leading-tight">{stat.label}</p>
              <p className="text-sm font-black text-[#FFFFFF] tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Investment Distribution */}
      <section className="px-6 space-y-8">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em]">Inversiones y Alianzas</h3>
          <div className="flex items-center gap-3">
            <Icons.PieChart size={18} className="text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {investments.map((item, idx) => (
            <div 
              key={idx} 
              style={{
                background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
                boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
              }}
              className="rounded-[3rem] p-8 border border-white/10 flex flex-col gap-8 group hover:shadow-none transition-all shadow-none active:scale-[0.98] relative overflow-hidden"
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-6">
                  <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-none chip-aurora`}>
                    <item.icon className="text-[#FFFFFF]" size={32} strokeWidth={2} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-[#FFFFFF] tracking-tight">{item.label}</h4>
                    <div className="flex items-center gap-3">
                      <p className="text-[10px] font-black text-[#FFFFFF] opacity-80 uppercase tracking-widest">{item.detalle}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-[#FFFFFF] tracking-tighter">{item.dato}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Transparency Footer */}
      <section className="px-10 mt-4 mb-2 text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Icons.ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Fuentes Públicas</span>
        </div>
        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] leading-relaxed max-w-[280px] mx-auto">
          Datos compilados de anuncios oficiales y prensa • Actualizado 13 Ago 2026
        </p>
      </section>

      {/* News Timeline Feed */}
      <section className="px-6 mt-8 space-y-6">
        <h3 className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
          <Icons.Activity size={18} className="text-[#4F84C4]" />
          LÍNEA DE TIEMPO: INVERSIONES Y DESARROLLO
        </h3>
        <div className="relative border-l-2 border-slate-200 dark:border-white/10 ml-2 space-y-8 pb-4">
          {MOCK_NEWS.map((news, index) => {
            const isExpanded = expandedNews === news.id;
            const isTarget = selectedNewsId === news.id;
            return (
              <div 
                key={news.id} 
                ref={(el) => (newsRefs.current[news.id] = el)}
                className={`relative pl-8 transition-all duration-300`}
              >
                {/* Timeline marker */}
                <div className={`absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-white dark:bg-[#05070A] border-4 transition-colors ${isExpanded || isTarget ? 'border-[#4F84C4]' : 'border-slate-300 dark:border-slate-600'}`}></div>
                
                <div 
                  onClick={() => toggleExpand(news.id)}
                  style={{
                    background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
                    boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                  }}
                  className={`rounded-2xl overflow-hidden border transition-all cursor-pointer shadow-sm hover:shadow-md ${isTarget && !isExpanded ? 'border-white' : 'border-white/10'} relative overflow-hidden`}
                >
                  <div className="p-5 flex flex-col justify-center relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        {(news as any).fecha && (
                          <span style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)' }} className="inline-block text-[#FFFFFF] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                            {(news as any).fecha}
                          </span>
                        )}
                        <h4 className="text-[15px] font-black text-[#FFFFFF] leading-snug">
                          {news.titulo}
                        </h4>
                      </div>
                      <div style={{ background: 'rgba(255, 255, 255, 0.1)' }} className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <Icons.ChevronDown size={16} className="text-[#FFFFFF]" />
                      </div>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden relative z-10"
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-white/10">
                          {news.imagenUrl && (
                            <div className="w-full h-40 md:h-48 rounded-xl overflow-hidden mb-4 relative">
                              <img src={news.imagenUrl} alt={news.titulo} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            </div>
                          )}
                          <p className="text-[14px] text-[#FFFFFF] opacity-90 font-medium leading-relaxed mb-3">
                            {news.descripcion}
                          </p>
                          <p className="text-[13px] text-[#FFFFFF] opacity-80 leading-relaxed font-normal">
                            {news.contenidoCompleto}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
