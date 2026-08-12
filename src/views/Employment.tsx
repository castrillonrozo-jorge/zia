
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { motion, AnimatePresence } from 'motion/react';
import { OrganismoFicha } from '../components/OrganismoFicha';

export const Employment: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isApplying, setIsApplying] = useState(false);

  const companies = [
    { 
      name: 'PDVSA',
      logoRender: () => <span className="text-[14px] leading-none font-black text-red-600 tracking-tighter">PDVSA</span>,
      containerClass: 'bg-white border-[1.5px] border-black/10 dark:border-white/10' 
    },
    { 
      name: 'SLB',
      logoRender: () => <span className="text-[18px] leading-none font-black text-white tracking-widest">SLB</span>,
      containerClass: 'bg-[#001433] border-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]' 
    },
    { 
      name: 'SHELL',
      logoRender: () => <span className="text-[12px] leading-none font-black text-red-600 tracking-wider">SHELL</span>,
      containerClass: 'bg-white border-[3px] border-yellow-400 shadow-[0_0_0_2px_#ef4444,inset_0_0_0_1px_#ef4444]' 
    },
    { 
      name: 'REPSOL',
      logoRender: () => <span className="text-[11px] leading-none font-black text-slate-900 tracking-widest">REPSOL</span>,
      containerClass: 'bg-gradient-to-tr from-[#FF8200] via-white to-white border border-black/5' 
    },
    { 
      name: 'CANTV',
      logoRender: () => <span className="text-[13px] leading-none font-black text-blue-500 tracking-wide">CANTV</span>,
      containerClass: 'bg-white border border-black/5 dark:border-white/10' 
    },
    { 
      name: 'CORPOELEC',
      logoRender: () => <div className="text-[8px] leading-tight font-black text-orange-500 tracking-tighter text-center"><span className="text-[#888]">CORPO</span><br/>ELEC</div>,
      containerClass: 'bg-white border border-black/5 dark:border-white/10' 
    },
    { 
      name: 'BDV',
      logoRender: () => <span className="text-[16px] leading-none font-black text-[#004B87] tracking-widest">BDV</span>,
      containerClass: 'bg-white border border-black/5 dark:border-white/10' 
    },
  ];

  const jobs = [
    {
      id: "vac_1",
      empresa: "PDVSA",
      puesto: "Ingeniero de Operaciones Críticas",
      ubicacion: "Faja Petrolífera del Orinoco",
      tipo: "Tiempo Completo",
      estatus: "ACTIVA",
      proyectoTag: "⚡ Plan de Recuperación Cruda",
      category: 'Ingeniería',
      icon: Icons.Flame
    },
    {
      id: "vac_2",
      empresa: "SLB (Schlumberger)",
      puesto: "Field Engineer / Operaciones en Campo",
      ubicacion: "Base Maturín, Edo. Monagas",
      tipo: "Tiempo Completo",
      estatus: "NUEVA",
      proyectoTag: "⚙️ Convenio Tecnológico de Pozos",
      category: 'Ingeniería',
      icon: Icons.Settings
    },
    {
      id: "vac_3",
      empresa: "Shell",
      puesto: "Coordinador de Logística y Comercio Bilingüe",
      ubicacion: "Caracas, Distrito Capital",
      tipo: "Híbrido",
      estatus: "ACTIVA",
      proyectoTag: "⚓ Fase I - Explotación Gas Loran",
      category: 'Operaciones',
      icon: Icons.Globe
    },
    {
      id: "vac_4",
      empresa: "Repsol",
      puesto: "Supervisor de Higiene, Seguridad y Ambiente (HSE)",
      ubicacion: "Campo Quiriquire / Caracas",
      tipo: "Tiempo Completo",
      estatus: "ACTIVA",
      proyectoTag: "🌱 Proyecto de Reactivación de Yacimientos",
      category: 'Mantenimiento',
      icon: Icons.ShieldCheck
    },
    {
      id: "vac_5",
      empresa: "CANTV",
      puesto: "Especialista en Infraestructura de Fibra Óptica",
      ubicacion: "Eje Central / Nacional",
      tipo: "Tiempo Completo",
      estatus: "ACTIVA",
      proyectoTag: "🌐 Plan de Expansión de Conectividad",
      category: 'Tecnología',
      icon: Icons.Wifi
    },
    {
      id: "vac_6",
      empresa: "Repsol",
      puesto: "Ingeniero Supervisor de Yacimientos",
      ubicacion: "Operacional Nacional",
      tipo: "Tiempo Completo",
      estatus: "NUEVA",
      proyectoTag: "🛢️ Acuerdo Crudo y Gas PDVSA-Repsol",
      category: 'Ingeniería',
      icon: Icons.Flame
    },
    {
      id: "vac_7",
      empresa: "Inversiones Turísticas (Hotel Londres)",
      puesto: "Coordinador de Infraestructura y Logística",
      ubicacion: "Caracas, DC",
      tipo: "Tiempo Completo",
      estatus: "NUEVA",
      proyectoTag: "🏨 Plan Ejecutivo Renacer 2026",
      category: 'Operaciones',
      icon: Icons.Briefcase
    }
  ];

  const filteredJobs = activeCategory === 'Todas' ? jobs : jobs.filter(j => j.category === activeCategory);

  return (
    <div className="p-6 flex flex-col gap-8 animate-in fade-in duration-500 pb-32">
      <div className="space-y-1 px-2">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Empleo Nacional</h2>
        <p className="text-[10px] text-[#4F84C4] dark:text-blue-400 font-black uppercase tracking-[0.2em]">Bolsa de Trabajo Institucional</p>
      </div>

        <OrganismoFicha sigla="IVSS" nombre="Instituto Venezolano de los Seguros Sociales" />

      {/* Hero Header Card */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
          boxShadow: '0 12px 30px rgba(79, 132, 196, 0.25)',
          borderTop: '1px solid rgba(255, 255, 255, 0.25)',
        }}
        className="rounded-[2.5rem] p-10 text-white relative overflow-hidden group active:scale-[0.98] transition-all"
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)', pointerEvents: 'none' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(59,130,246,0.15),transparent_70%)]"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-black tracking-tight text-[#FFFFFF]">Oportunidades de Empleo y Vacantes Activas</h3>
          <p className="text-xs text-white/90 mt-3 font-medium leading-relaxed max-w-[280px]">Explora ofertas de trabajo y aplica a las nuevas vacantes técnicas, operativas y administrativas creadas por las alianzas de Venezuela</p>
          <div className="mt-8 flex flex-wrap gap-2">
            <span style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-[#FFFFFF]">1.254 Ofertas Hoy</span>
            <span style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-[#FFFFFF]">Nivel Nacional</span>
          </div>
        </div>
        <Icons.Briefcase size={120} className="absolute -right-8 -bottom-8 text-white/10 rotate-12" />
      </div>

      {/* Companies Scroll */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] px-4">Empresas Aliadas</h4>
        <div className="flex gap-5 overflow-x-auto no-scrollbar py-2 px-2">
          {companies.map((company, i) => (
            <div key={i} className="flex flex-col items-center gap-3 shrink-0 group active:scale-90 transition-all">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center overflow-hidden backdrop-blur-xl transition-transform group-hover:scale-105 ${company.containerClass}`}>
                {company.logoRender()}
              </div>
              <span className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{company.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Job Categories */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-2">
        {['Todas', 'Ingeniería', 'Tecnología', 'Mantenimiento', 'Administración', 'Operaciones'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeCategory === cat 
              ? 'bg-[#4F84C4] text-white shadow-none shadow-blue-600/20' 
              : 'bg-slate-100 dark:bg-[#0D1117] text-slate-500 dark:text-slate-400 border border-black/[0.05] dark:border-white/[0.08]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Job List */}
      <div className="space-y-4 px-2">
        {filteredJobs.map((job) => (
          <div 
            key={job.id} 
            style={{
              background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
              boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
              borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            }}
            className="p-8 rounded-[2.5rem] border border-white/10 shadow-none flex flex-col gap-6 group active:scale-[0.98] transition-all relative overflow-hidden"
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="flex gap-5">
                <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-14 h-14 rounded-2xl flex items-center justify-center text-[#FFFFFF] shadow-none shrink-0 relative z-10">
                  <job.icon size={26} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#FFFFFF] leading-tight tracking-tight relative z-10">{job.puesto}</h4>
                  <p className="text-[10px] font-black text-[#FFFFFF] opacity-90 uppercase tracking-widest mt-1.5 relative z-10">{job.empresa}</p>
                </div>
              </div>
              <span style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)' }} className={`text-[9px] font-black text-[#FFFFFF] px-3 py-1 rounded-lg uppercase tracking-widest shrink-0 relative z-10`}>{job.estatus}</span>
            </div>
            
            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex items-center gap-6 text-[10px] text-[#FFFFFF] opacity-90 font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Icons.MapPin size={14} className="text-[#FFFFFF]" /> <span className="line-clamp-1">{job.ubicacion}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Icons.Clock size={14} className="text-[#FFFFFF]" /> {job.tipo}
                </div>
              </div>

              <div className="flex items-start">
                <span style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)' }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-bold text-[#FFFFFF]">
                  {job.proyectoTag}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedJob(job)}
              style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
              className="w-full py-4 rounded-[12px] text-[10px] font-black uppercase tracking-widest text-[#FFFFFF] shadow-none hover:bg-white/20 transition-all relative z-10"
            >
              Postularse Ahora
            </button>
          </div>
        ))}
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{
                background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
                boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
              }}
              className="w-full max-w-md rounded-[3rem] overflow-hidden shadow-none border border-white/10 relative"
            >
              <div className="p-10 space-y-8 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-[#FFFFFF] tracking-tight">Postulación Directa</h3>
                    <p className="text-[10px] font-black text-[#FFFFFF] opacity-80 uppercase tracking-widest">{selectedJob.empresa}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedJob(null);
                      setIsApplying(false);
                    }} 
                    style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[#FFFFFF] hover:bg-white/20 transition-all"
                  >
                    <Icons.X size={20} />
                  </button>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)' }} className="p-6 rounded-[2rem]">
                  <h4 className="text-sm font-black text-[#FFFFFF] mb-1">{selectedJob.puesto}</h4>
                  <p className="text-[10px] text-[#FFFFFF] opacity-80 font-bold uppercase tracking-widest">{selectedJob.ubicacion}</p>
                </div>

                {!isApplying ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.15)' }} className="p-6 rounded-[2rem]">
                        <p className="text-[9px] text-[#FFFFFF] opacity-70 font-black uppercase tracking-[0.3em] mb-3">Tus Datos de Contacto</p>
                        <div className="space-y-2">
                          <p className="text-sm font-black text-[#FFFFFF]">Jorge Eduardo Pérez Rodríguez</p>
                          <p className="text-xs font-bold text-[#FFFFFF] opacity-80">j.eduardo@portal.ve | +58 412 123 4567</p>
                        </div>
                      </div>

                      <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(8px)', border: '2px dashed rgba(255, 255, 255, 0.2)' }} className="p-8 rounded-[2rem] flex flex-col items-center justify-center text-center gap-4 group cursor-pointer hover:bg-white/10 transition-all">
                        <div style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)' }} className="w-14 h-14 rounded-2xl flex items-center justify-center text-[#FFFFFF]">
                          <Icons.Upload size={24} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-[#FFFFFF] uppercase tracking-widest">Cargar Curriculum Vitae</p>
                          <p className="text-[9px] font-bold text-[#FFFFFF] opacity-70 uppercase tracking-tighter">PDF, DOCX (Máx. 5MB)</p>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setIsApplying(true)}
                      style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.3)' }}
                      className="w-full text-[#FFFFFF] h-16 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-none active:scale-95 transition-all hover:bg-white/30"
                    >
                      Enviar Postulación
                    </button>
                  </div>
                ) : (
                  <div className="py-10 flex flex-col items-center text-center gap-6">
                    <div style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)' }} className="w-20 h-20 rounded-full flex items-center justify-center text-[#FFFFFF]">
                      <Icons.CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-black text-[#FFFFFF] tracking-tight">¡Postulación Enviada!</h4>
                      <p className="text-xs text-[#FFFFFF] opacity-80 font-medium leading-relaxed">Tu perfil ha sido enviado exitosamente al departamento de RRHH de {selectedJob.empresa}.</p>
                    </div>
                    <button 
                      onClick={() => setSelectedJob(null)}
                      style={{ background: '#FFFFFF', color: '#4F84C4' }}
                      className="mt-4 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-none hover:opacity-90 transition-all"
                    >
                      Entendido
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
