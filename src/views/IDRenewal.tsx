
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { motion } from 'motion/react';
import { OrganismoFicha } from '../components/OrganismoFicha';

type IdentityMode = 'choice' | 'id' | 'passport' | 'view-id' | 'view-passport';

export const IDRenewal: React.FC = () => {
  const [mode, setMode] = useState<IdentityMode>('choice');
  const [step, setStep] = useState(1);
  const [qrValue, setQrValue] = useState('VEN-ID-8273-9182-X');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [isIdFlipped, setIsIdFlipped] = useState(false);
  const [isPassportFlipped, setIsPassportFlipped] = useState(false);
  const totalSteps = mode === 'passport' ? 6 : 5;

  // Simulate dynamic QR code
  React.useEffect(() => {
    const interval = setInterval(() => {
      setQrValue(`VEN-ID-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-X`);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const resetFlow = () => {
    setMode('choice');
    setStep(1);
  };

  if (mode === 'choice') {
    return (
      <div className="px-4 flex flex-col gap-8 animate-in fade-in duration-700 pt-8 pb-32">
        <div className="space-y-3">
          <h2 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em]">Sistemas de Identidad</h2>
          <p className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]">Identidad Digital</p>
        </div>

        <OrganismoFicha sigla="SAIME" nombre="Servicio Administrativo de Identificación, Migración y Extranjería" />

        {/* VenIA Contextual Help */}
        <div className="bg-[#4F84C4]/[0.05] border border-[#4F84C4]/20 p-6 rounded-[2.5rem] flex items-center gap-4 backdrop-blur-xl">
          <div 
            style={{
              background: 'radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
              boxShadow: 'none',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            className="w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0"
          >
            <Icons.Brain size={20} className="text-white" />
          </div>
          <p className="text-[11px] text-[#4F84C4] dark:text-slate-200 font-bold leading-relaxed">
            Tus documentos digitales están protegidos con cifrado de grado militar. Puedes usarlos para trámites oficiales.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {/* Section: My Documents Hub */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Mis Documentos Activos</h3>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Virtual ID Quick Access */}
              <button 
                onClick={() => setMode('view-id')}
                className="group relative h-[210px] w-full rounded-[2.5rem] overflow-hidden p-8 text-left transition-all duration-500 active:scale-[0.96] outline-none"
                style={{
                  background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
                  boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                }}
              >
                {/* Authentic Reflections */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#4F84C4]/20 rounded-full blur-[80px] group-hover:bg-[#4F84C4]/30 transition-colors duration-700 pointer-events-none"></div>
                <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)', backgroundSize: '16px 16px' }}></div>

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                       <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-14 h-14 rounded-[18px] flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden relative">
                         <Icons.User size={24} className="text-[#FFFFFF]" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-[#FFFFFF] uppercase tracking-[0.3em]">Cédula Digital</p>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] shadow-none animate-pulse"></div>
                            <span className="text-[9px] font-bold text-[#FFFFFF] uppercase tracking-widest">Activo</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="mt-auto space-y-3">
                    <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-8 h-6 rounded flex items-center justify-center">
                      <Icons.Cpu size={12} className="text-[#FFFFFF]" />
                    </div>
                    <h4 className="text-[26px] font-black text-[#FFFFFF] tracking-widest font-mono drop-shadow-none">V-12.345.678</h4>
                  </div>
                </div>
                <Icons.QrCode size={120} className="absolute -bottom-4 -right-4 text-[#FFFFFF] opacity-5 rotate-12 pointer-events-none" />
              </button>

              {/* Virtual Passport Quick Access */}
              <button 
                onClick={() => setMode('view-passport')}
                className="group relative h-[210px] w-full rounded-[2.5rem] overflow-hidden p-8 text-left transition-all duration-500 active:scale-[0.96] outline-none"
                style={{
                  background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
                  boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                }}
              >
                {/* Passport Texture & Lighting */}
                <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-indigo-500/10 via-transparent to-transparent -translate-y-full group-hover:translate-y-0 transition-transform duration-[1500ms] pointer-events-none"></div>
                <div className="absolute -bottom-24 -right-12 w-80 h-80 bg-[#FFFFFF] opacity-5 rounded-full blur-[80px] transition-colors duration-700 pointer-events-none"></div>

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-14 h-14 rounded-[18px] flex items-center justify-center group-hover:scale-105 transition-transform relative overflow-hidden">
                      <Icons.Globe size={26} className="text-[#FFFFFF] drop-shadow-none" />
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-[9px] font-black text-[#FFFFFF] uppercase tracking-[0.3em] mb-1.5 drop-shadow-none">Pasaporte Bio</p>
                      <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="flex items-center gap-2 px-2 py-1 rounded-full">
                        <Icons.Wifi size={10} className="text-[#FFFFFF]" />
                        <span className="text-[8px] font-bold text-[#FFFFFF] uppercase tracking-widest">NFC Ready</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-[7px] uppercase font-black tracking-[0.3em] text-[#FFFFFF] opacity-80">Documento No.</span>
                      <h4 className="text-[26px] font-black text-[#FFFFFF] tracking-widest font-mono drop-shadow-none">092837465</h4>
                    </div>
                    <Icons.ShieldCheck size={40} className="text-[#FFFFFF] opacity-20" />
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Section: Renewals & Management */}
          <div className="space-y-6 pt-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Gestión y Renovación</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setMode('id')}
                style={{
                  background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
                  boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                }}
                className="p-6 rounded-[2.5rem] border border-white/10 text-left space-y-4 active:scale-95 transition-all relative overflow-hidden"
              >
                <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-10 h-10 rounded-xl flex items-center justify-center relative z-10">
                  <Icons.RefreshCw size={20} className="text-[#FFFFFF]" />
                </div>
                <p className="text-[10px] font-black text-[#FFFFFF] uppercase tracking-widest leading-tight relative z-10">Renovar Cédula</p>
              </button>
              <button 
                onClick={() => setMode('passport')}
                style={{
                  background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
                  boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                }}
                className="p-6 rounded-[2.5rem] border border-white/10 text-left space-y-4 active:scale-95 transition-all relative overflow-hidden"
              >
                <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-10 h-10 rounded-xl flex items-center justify-center relative z-10">
                  <Icons.Plane size={20} className="text-[#FFFFFF]" />
                </div>
                <p className="text-[10px] font-black text-[#FFFFFF] uppercase tracking-widest leading-tight relative z-10">Gestionar Pasaporte</p>
              </button>
            </div>
          </div>
        </div>

        <div 
          style={{
            background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
            boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
          }}
          className="p-6 rounded-[28px] border border-white/10 flex items-center gap-5 relative overflow-hidden"
        >
           <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-16 h-16 rounded-3xl flex items-center justify-center relative z-10 shrink-0">
             <Icons.ShieldCheck size={32} className="text-[#FFFFFF]" />
           </div>
           <div className="space-y-1 relative z-10">
             <p className="text-[10px] text-[#FFFFFF] font-black uppercase tracking-[0.2em]">Seguridad Institucional</p>
             <p className="text-xs text-[#FFFFFF] font-bold leading-tight">
               Tus datos están protegidos por el protocolo V-Digital 2.0.
             </p>
           </div>
        </div>
      </div>
    );
  }

  if (mode === 'view-id') {
    return (
      <div className="px-4 flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-8 duration-700 pt-6 pb-32">
        <div className="flex items-center justify-between">
          <button onClick={resetFlow} className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
            <Icons.ArrowLeft size={19} className="text-slate-900 dark:text-white" />
          </button>
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">Cédula Digital</h2>
          <button
            onClick={() => {
              const texto = 'Cédula Digital Agiliza · V-12.345.678 · Token ' + qrValue;
              if (navigator.share) { navigator.share({ title: 'Cédula Digital', text: texto }); }
              else { navigator.clipboard?.writeText(texto); }
            }}
            className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center"
          >
            <Icons.Share2 size={19} className="text-slate-900 dark:text-white" />
          </button>
        </div>

        {/* ══ Cédula de identidad realista (toca para girar) ══ */}
        <div style={{ perspective: 1200 }} className="relative aspect-[1.586/1] w-full cursor-pointer" onClick={() => setIsIdFlipped(!isIdFlipped)}>
          <motion.div
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: isIdFlipped ? 180 : 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
            className="relative w-full h-full"
          >
            {/* ANVERSO */}
            <div
              style={{
                background: 'linear-gradient(150deg, #FBFDFF 0%, #EDF3FA 45%, #DFE9F4 100%)',
                boxShadow: '0 16px 36px rgba(20,45,80,0.22), inset 0 1px 0 rgba(255,255,255,0.9)',
                backfaceVisibility: 'hidden',
              }}
              className="absolute inset-0 rounded-[18px] overflow-hidden border border-slate-300/60"
            >
              {/* Guilloché de seguridad */}
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'repeating-radial-gradient(circle at 30% 40%, #2F5E9E 0px, transparent 2px, transparent 7px), repeating-radial-gradient(circle at 75% 70%, #C8102E 0px, transparent 2px, transparent 9px)' }} />
              {/* Franja tricolor */}
              <div className="absolute top-0 left-0 right-0 h-[5px] flex">
                <div className="flex-1" style={{ background: '#F7C325' }} />
                <div className="flex-1" style={{ background: '#2C5CB0' }} />
                <div className="flex-1" style={{ background: '#C8102E' }} />
              </div>
              {/* Brillo holográfico */}
              <div className="absolute inset-0 opacity-25 bg-gradient-to-tr from-transparent via-sky-200/60 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-[2500ms] pointer-events-none" />

              <div className="relative h-full flex flex-col px-4 pt-3.5 pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[6.5px] font-black uppercase tracking-[0.28em] text-slate-500">República Bolivariana de Venezuela</p>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#14345E] mt-0.5">Cédula de Identidad</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[6px] font-black uppercase tracking-[0.25em] text-slate-400">N.º</p>
                    <p className="text-[13px] font-black font-mono tracking-tight text-[#14161C] whitespace-nowrap">V-12.345.678</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-2.5 flex-1 min-h-0">
                  <div className="w-[72px] shrink-0 flex flex-col gap-1">
                    <div className="h-[88px] rounded-[8px] overflow-hidden border border-slate-300/80 bg-slate-200 relative">
                      <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=250" alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(148,185,255,0.12),transparent)]" />
                    </div>
                    <div className="flex items-center gap-1 justify-center">
                      <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[6.5px] font-black uppercase tracking-[0.2em] text-emerald-600">Activo</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-[5px] min-w-0">
                    <div>
                      <p className="text-[5.5px] font-black uppercase tracking-[0.22em] text-slate-400">Apellidos</p>
                      <p className="text-[11px] font-extrabold text-[#14161C] uppercase tracking-tight leading-tight">Pérez Rodríguez</p>
                    </div>
                    <div>
                      <p className="text-[5.5px] font-black uppercase tracking-[0.22em] text-slate-400">Nombres</p>
                      <p className="text-[11px] font-extrabold text-[#14161C] uppercase tracking-tight leading-tight">Jorge Eduardo</p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2">
                      <div>
                        <p className="text-[5.5px] font-black uppercase tracking-[0.22em] text-slate-400">F. Nacimiento</p>
                        <p className="text-[9.5px] font-bold font-mono text-[#14161C]">15-05-1985</p>
                      </div>
                      <div>
                        <p className="text-[5.5px] font-black uppercase tracking-[0.22em] text-slate-400">Nacionalidad</p>
                        <p className="text-[9.5px] font-bold text-[#14161C] uppercase">Venezolana</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2">
                      <div>
                        <p className="text-[5.5px] font-black uppercase tracking-[0.22em] text-slate-400">Expedición</p>
                        <p className="text-[9.5px] font-bold font-mono text-[#14161C]">15-03-2022</p>
                      </div>
                      <div>
                        <p className="text-[5.5px] font-black uppercase tracking-[0.22em] text-slate-400">Vencimiento</p>
                        <p className="text-[9.5px] font-bold font-mono text-[#0E7C4A]">15-03-2032</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-end justify-between mt-1">
                  <div>
                    <p className="font-serif italic text-[13px] text-[#25406B] leading-none whitespace-nowrap" style={{ transform: 'rotate(-2deg)' }}>Jorge E. Pérez</p>
                    <p className="text-[5px] font-black uppercase tracking-[0.25em] text-slate-400 mt-0.5">Firma del titular</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-[30px] h-[22px] rounded-[5px] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #E8C878 0%, #C9A24E 50%, #E8C878 100%)', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.2)' }}>
                      <div className="absolute inset-[3px] border border-[#9A7A34]/50 rounded-[3px]" />
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#9A7A34]/50" />
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-[#9A7A34]/50" />
                    </div>
                    <Icons.QrCode size={22} className="text-[#25406B]" />
                  </div>
                </div>
              </div>
            </div>

            {/* REVERSO */}
            <div
              style={{
                background: 'linear-gradient(150deg, #FBFDFF 0%, #EDF3FA 45%, #DFE9F4 100%)',
                boxShadow: '0 16px 36px rgba(20,45,80,0.22)',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
              className="absolute inset-0 rounded-[18px] overflow-hidden border border-slate-300/60"
            >
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'repeating-radial-gradient(circle at 70% 30%, #2F5E9E 0px, transparent 2px, transparent 7px)' }} />
              <div className="relative h-full flex flex-col px-4 pt-3.5 pb-3">
                {/* Código de barras */}
                <div className="h-[34px] bg-white rounded-[6px] border border-slate-200 flex items-center justify-center gap-[2px] px-3 overflow-hidden">
                  {[...Array(46)].map((_, i) => (
                    <div key={i} className="h-[22px] bg-[#14161C]" style={{ width: `${(i * 7) % 3 + 1}px`, opacity: (i * 13) % 4 === 0 ? 0.5 : 1 }} />
                  ))}
                </div>

                <div className="flex items-center justify-between mt-2.5 bg-white/70 rounded-[10px] border border-slate-200 px-3 py-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[8px] bg-[#EAF1F9] flex items-center justify-center">
                      <Icons.Wifi size={15} className="text-emerald-500 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-[6.5px] font-black uppercase tracking-[0.2em] text-slate-400">Microchip NFC</p>
                      <p className="text-[10px] font-extrabold text-emerald-600">Activo</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <p className="text-[6.5px] font-black uppercase tracking-[0.2em] text-slate-400">Estado civil</p>
                      <p className="text-[10px] font-extrabold text-[#14161C]">Soltero</p>
                    </div>
                    <Icons.Fingerprint size={26} className="text-[#25406B]/70" />
                  </div>
                </div>

                {/* Zona de lectura mecánica (MRZ) */}
                <div className="mt-auto bg-white rounded-[8px] border border-slate-200 px-2.5 py-2">
                  <p className="font-mono text-[8px] leading-[1.5] tracking-[0.08em] text-[#14161C] whitespace-pre">{'IDVEN12345678<8<<<<<<<<<<<<<<<\n8505155M3203159VEN<<<<<<<<<<<0\nPEREZ<RODRIGUEZ<<JORGE<EDUARDO'}</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 left-0 right-0 text-center text-[8px] text-slate-400 uppercase tracking-[0.25em] font-black pointer-events-none">
              Toca la tarjeta para girarla
            </div>
          </motion.div>
        </div>

        {/* Estado de verificación */}
        <div
          style={{
            background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
            boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
          }}
          className="rounded-[28px] p-5 border border-white/10 space-y-5 relative overflow-hidden mt-4"
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-0.5">
              <h3 className="text-xs font-black uppercase tracking-widest text-white">Estado de Verificación</h3>
              <p className="text-[10px] text-white font-bold uppercase tracking-widest opacity-80">Sincronizado con SAIME</p>
            </div>
            {isVerified && !isVerifying && (
              <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="px-3.5 py-1.5 rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Activo</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="relative p-3 rounded-[20px] shrink-0">
              <div className="w-[124px] h-[124px] flex items-center justify-center">
                <Icons.QrCode size={116} className={`text-white transition-all duration-700 ${isVerifying ? 'opacity-20 blur-sm' : 'opacity-100'}`} />
              </div>
              {isVerifying && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.3)' }} className="w-10 h-10 rounded-xl flex items-center justify-center">
                  <Icons.Fingerprint size={20} className="text-white" />
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <span className="text-[9px] font-black text-white uppercase tracking-widest opacity-80 block">Token de Seguridad</span>
                <p className="text-[11px] font-mono text-white font-bold break-all">{qrValue}</p>
              </div>
              <button
                onClick={() => {
                  setIsVerifying(true);
                  setTimeout(() => {
                    setIsVerifying(false);
                    setIsVerified(true);
                  }, 2000);
                }}
                className="w-full py-3 rounded-2xl bg-white text-[#254A75] text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
              >
                Verificar Ahora
              </button>
              <div className="h-1.5 w-full bg-white/15 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 30, ease: "linear", repeat: Infinity }}
                  className="h-full bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              const texto = 'Cédula Digital Agiliza · V-12.345.678 · Token ' + qrValue;
              if (navigator.share) { navigator.share({ title: 'Cédula Digital', text: texto }); }
              else { navigator.clipboard?.writeText(texto); }
            }}
            className="h-16 rounded-[22px] bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 border border-black/5 dark:border-white/10 active:scale-95 transition-all"
          >
            <Icons.Download size={17} />
            Exportar
          </button>
          <button className="h-16 rounded-[22px] bg-[#4F84C4] text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all">
            <Icons.Smartphone size={17} />
            NFC Activo
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'view-passport') {
    return (
      <div className="px-4 flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-8 duration-700 pt-6 pb-32">
        <div className="flex items-center justify-between">
          <button onClick={resetFlow} className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
            <Icons.ArrowLeft size={19} className="text-slate-900 dark:text-white" />
          </button>
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">Pasaporte Bio</h2>
          <button
            onClick={() => window.open('https://www.saime.gob.ve/', '_blank')}
            className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center"
          >
            <Icons.Globe size={19} className="text-slate-900 dark:text-white" />
          </button>
        </div>

        {/* ══ Página de datos del pasaporte (toca para ver la portada) ══ */}
        <div style={{ perspective: 1200 }} className="relative aspect-[1.28/1] w-full cursor-pointer" onClick={() => setIsPassportFlipped(!isPassportFlipped)}>
          <motion.div
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: isPassportFlipped ? 180 : 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
            className="relative w-full h-full"
          >
            {/* PÁGINA DE DATOS */}
            <div
              style={{
                background: 'linear-gradient(150deg, #FDFEFF 0%, #F1F5FA 50%, #E7EEF6 100%)',
                boxShadow: '0 16px 36px rgba(20,45,80,0.22), inset 0 1px 0 rgba(255,255,255,0.9)',
                backfaceVisibility: 'hidden',
              }}
              className="absolute inset-0 rounded-[14px] overflow-hidden border border-slate-300/60"
            >
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'repeating-radial-gradient(circle at 25% 35%, #7A1F3D 0px, transparent 2px, transparent 8px), repeating-radial-gradient(circle at 80% 65%, #2F5E9E 0px, transparent 2px, transparent 10px)' }} />
              <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-transparent via-rose-100/70 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-[2500ms] pointer-events-none" />

              <div className="relative h-full flex flex-col px-4 pt-3 pb-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[6.5px] font-black uppercase tracking-[0.26em] text-slate-500">República Bolivariana de Venezuela</p>
                    <p className="text-[10.5px] font-black uppercase tracking-[0.16em] text-[#5A1428] mt-0.5 whitespace-nowrap">Pasaporte · Passport</p>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <p className="text-[6px] font-black uppercase tracking-[0.2em] text-slate-400">Tipo</p>
                      <p className="text-[10px] font-black font-mono text-[#14161C]">P</p>
                    </div>
                    <div>
                      <p className="text-[6px] font-black uppercase tracking-[0.2em] text-slate-400">País</p>
                      <p className="text-[10px] font-black font-mono text-[#14161C]">VEN</p>
                    </div>
                    <div>
                      <p className="text-[6px] font-black uppercase tracking-[0.2em] text-slate-400">Pasaporte N.º</p>
                      <p className="text-[12px] font-black font-mono text-[#8A1224]">092837465</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-2 flex-1 min-h-0">
                  <div className="w-[64px] shrink-0">
                    <div className="h-[80px] rounded-[7px] overflow-hidden border border-slate-300/80 bg-slate-200 relative">
                      <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=250" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center gap-1 justify-center mt-1">
                      <Icons.Cpu size={9} className="text-[#8A6410]" />
                      <span className="text-[6px] font-black uppercase tracking-[0.15em] text-[#8A6410]">Chip Biométrico</span>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-[4px] content-start min-w-0">
                    <div className="col-span-2">
                      <p className="text-[5.5px] font-black uppercase tracking-[0.22em] text-slate-400">Apellidos / Surname</p>
                      <p className="text-[10.5px] font-extrabold text-[#14161C] uppercase leading-tight">Pérez Rodríguez</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[5.5px] font-black uppercase tracking-[0.22em] text-slate-400">Nombres / Given names</p>
                      <p className="text-[10.5px] font-extrabold text-[#14161C] uppercase leading-tight">Jorge Eduardo</p>
                    </div>
                    <div>
                      <p className="text-[5.5px] font-black uppercase tracking-[0.22em] text-slate-400">Nacionalidad</p>
                      <p className="text-[9px] font-bold text-[#14161C] uppercase">Venezolana</p>
                    </div>
                    <div>
                      <p className="text-[5.5px] font-black uppercase tracking-[0.22em] text-slate-400">Sexo / Sex</p>
                      <p className="text-[9px] font-bold font-mono text-[#14161C]">M</p>
                    </div>
                    <div>
                      <p className="text-[5.5px] font-black uppercase tracking-[0.22em] text-slate-400">F. Nacimiento</p>
                      <p className="text-[9px] font-bold font-mono text-[#14161C]">15-05-1985</p>
                    </div>
                    <div>
                      <p className="text-[5.5px] font-black uppercase tracking-[0.22em] text-slate-400">Lugar de Nac.</p>
                      <p className="text-[9px] font-bold text-[#14161C] uppercase">Caracas, VEN</p>
                    </div>
                    <div>
                      <p className="text-[5.5px] font-black uppercase tracking-[0.22em] text-slate-400">F. Emisión</p>
                      <p className="text-[9px] font-bold font-mono text-[#14161C]">15-03-2022</p>
                    </div>
                    <div>
                      <p className="text-[5.5px] font-black uppercase tracking-[0.22em] text-slate-400">F. Vencimiento</p>
                      <p className="text-[9px] font-bold font-mono text-[#0E7C4A]">15-03-2032</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[5.5px] font-black uppercase tracking-[0.22em] text-slate-400">Autoridad / Authority</p>
                      <p className="text-[9px] font-bold text-[#14161C] uppercase">SAIME</p>
                    </div>
                  </div>
                </div>

                {/* MRZ */}
                <div className="mt-1.5 bg-white rounded-[7px] border border-slate-200 px-2.5 py-1.5">
                  <p className="font-mono text-[7.5px] leading-[1.55] tracking-[0.06em] text-[#14161C] whitespace-pre">{'P<VENPEREZ<RODRIGUEZ<<JORGE<EDUARDO<<<<<<<<<<\n092837465<8VEN8505155M3203159<<<<<<<<<<<<<<06'}</p>
                </div>
              </div>
            </div>

            {/* PORTADA */}
            <div
              style={{
                background: 'linear-gradient(155deg, #5E1626 0%, #491020 55%, #350A16 100%)',
                boxShadow: '0 16px 36px rgba(40,8,18,0.45)',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
              className="absolute inset-0 rounded-[14px] overflow-hidden"
            >
              <div className="absolute inset-0 opacity-[0.12] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/leather.png")' }} />
              <div className="absolute inset-3 border border-[#D8B25C]/50 rounded-[10px] pointer-events-none" />
              <div className="absolute inset-[15px] border border-[#D8B25C]/25 rounded-[8px] pointer-events-none" />
              <div className="relative h-full flex flex-col items-center justify-between py-8 px-6 text-center">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] leading-relaxed" style={{ color: '#E4C170' }}>
                  República Bolivariana<br />de Venezuela
                </p>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center" style={{ borderColor: 'rgba(228,193,112,0.55)' }}>
                    <Icons.Globe size={28} style={{ color: '#E4C170' }} />
                  </div>
                  <p className="text-[15px] font-black uppercase tracking-[0.42em]" style={{ color: '#E4C170' }}>Pasaporte</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="20" height="14" viewBox="0 0 24 16" fill="none" stroke="#E4C170" strokeWidth="1.4"><rect x="1" y="1" width="22" height="14" rx="2.5" /><circle cx="12" cy="8" r="4" /><path d="M1 8h7M16 8h7" /></svg>
                  <p className="text-[7px] font-bold uppercase tracking-[0.3em]" style={{ color: '#E4C170' }}>Pasaporte Electrónico</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 left-0 right-0 text-center text-[8px] text-slate-400 uppercase tracking-[0.25em] font-black pointer-events-none">
              Toca para ver la portada
            </div>
          </motion.div>
        </div>

        {/* Centro de Viajes Inteligente */}
        <div className="space-y-4 mt-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-2">Centro de Viajes Inteligente</h3>

          <div className="grid grid-cols-1 gap-3">
            <div
              style={{
                background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
                boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
              }}
              className="w-full p-5 rounded-[24px] border border-white/10 flex items-center justify-between group active:scale-[0.98] transition-all relative overflow-hidden"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
                  <Icons.CheckCircle2 size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-[15px] font-black text-white tracking-tight">Vigencia Confirmada</h4>
                  <p className="text-[10px] text-white font-bold uppercase tracking-widest opacity-80">Expira en 10 años (2032)</p>
                </div>
              </div>
              <Icons.ChevronRight size={20} className="text-white opacity-80 relative z-10" />
            </div>

            <div
              style={{
                background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
                boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
              }}
              className="w-full p-5 rounded-[24px] border border-white/10 flex items-center justify-between group active:scale-[0.98] transition-all relative overflow-hidden"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
                  <Icons.FileText size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-[15px] font-black text-white tracking-tight">Visas Digitales</h4>
                  <p className="text-[10px] text-white font-bold uppercase tracking-widest opacity-80">3 Autorizaciones Activas</p>
                </div>
              </div>
              <Icons.ChevronRight size={20} className="text-white opacity-80 relative z-10" />
            </div>

            <div
              style={{
                background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
                boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
              }}
              className="w-full p-5 rounded-[24px] border border-white/10 flex items-center justify-between group active:scale-[0.98] transition-all relative overflow-hidden"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
                  <Icons.Activity size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-[15px] font-black text-white tracking-tight">Salud Internacional</h4>
                  <p className="text-[10px] text-white font-bold uppercase tracking-widest opacity-80">Certificado PAI Sincronizado</p>
                </div>
              </div>
              <Icons.ChevronRight size={20} className="text-white opacity-80 relative z-10" />
            </div>
          </div>
        </div>

        <button
          onClick={() => window.open('https://siic.saime.gob.ve/', '_blank')}
          style={{ background: 'radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)', boxShadow: '0 12px 30px rgba(79, 132, 196, 0.35)' }}
          className="w-full h-16 rounded-[24px] text-white font-black text-xs uppercase tracking-[0.3em] active:scale-95 transition-all"
        >
          Solicitar Nueva Libreta
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-8 animate-in fade-in slide-in-from-right-8 duration-700 min-h-[calc(100vh-160px)]">
      {/* Progress Bar - Minimalist */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-2">
          <button onClick={resetFlow} className="text-[10px] font-black text-black dark:text-white uppercase tracking-[0.2em] flex items-center gap-2 group">
            <Icons.ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paso</span>
            <span className="text-sm font-black text-black dark:text-white">{step} / {totalSteps}</span>
          </div>
        </div>
        <div className="h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-black dark:bg-white transition-all duration-700 ease-out" 
            style={{ width: `${(step/totalSteps)*100}%` }}
          ></div>
        </div>
      </div>

      {mode === 'id' ? (
        <div className="flex-1 flex flex-col gap-8">
          {step === 1 && (
            <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter text-black dark:text-white">Datos de Identidad</h2>
                <p className="text-sm text-slate-500 dark:text-white font-medium leading-relaxed">
                  Ingresa tus datos personales y rasgos físicos según constan en el registro oficial.
                </p>
              </div>
              
              <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] pl-2">Primer Nombre</label>
                    <input type="text" defaultValue="JORGE" className="w-full h-14 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-black dark:text-white outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] pl-2">Primer Apellido</label>
                    <input type="text" defaultValue="PEREZ" className="w-full h-14 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-black dark:text-white outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] pl-2">Estado Civil</label>
                    <div className="relative">
                      <select className="w-full h-14 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-2xl px-4 text-sm font-bold outline-none appearance-none text-black dark:text-white">
                        <option>Soltero(a)</option>
                        <option>Casado(a)</option>
                        <option>Divorciado(a)</option>
                        <option>Viudo(a)</option>
                      </select>
                      <Icons.ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] pl-2">Color de Ojos</label>
                    <div className="relative">
                      <select className="w-full h-14 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-2xl px-4 text-sm font-bold outline-none appearance-none text-black dark:text-white">
                        <option>Oscuros</option>
                        <option>Claros</option>
                        <option>Café</option>
                      </select>
                      <Icons.ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-auto">
                <button onClick={() => setStep(2)} className="flex-1 h-20 bg-[#4F84C4] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-none active:scale-95 transition-all">Siguiente</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter text-black dark:text-white">Registro Civil</h2>
                <p className="text-sm text-slate-500 dark:text-white font-medium leading-relaxed">
                  Proporciona los datos de tu acta de nacimiento.
                </p>
              </div>
              
              <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] pl-2">Estado</label>
                    <div className="relative">
                      <select className="w-full h-14 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-2xl px-4 text-sm font-bold outline-none appearance-none text-black dark:text-white">
                        <option>Distrito Capital</option>
                        <option>Miranda</option>
                        <option>Zulia</option>
                      </select>
                      <Icons.ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] pl-2">Municipio</label>
                    <div className="relative">
                      <select className="w-full h-14 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-2xl px-4 text-sm font-bold outline-none appearance-none text-black dark:text-white">
                        <option>Libertador</option>
                        <option>Chacao</option>
                      </select>
                      <Icons.ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] pl-2">Registro Civil</label>
                    <input type="text" placeholder="Ej. San Juan" className="w-full h-14 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-black dark:text-white outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] pl-2">Año de Registro</label>
                    <input type="number" placeholder="1985" className="w-full h-14 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-black dark:text-white outline-none focus:border-blue-500" />
                  </div>
                  <div className="col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] pl-2">Número de Acta</label>
                    <input type="text" placeholder="1234" className="w-full h-14 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-black dark:text-white outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-auto">
                <button onClick={() => setStep(1)} className="flex-1 h-20 bg-slate-100 dark:bg-white/5 rounded-[2rem] font-black text-slate-400 uppercase tracking-widest text-[10px]">Atrás</button>
                <button onClick={() => setStep(3)} className="flex-[2] h-20 bg-[#4F84C4] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-none">Siguiente</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter text-black dark:text-white">Dirección de Domicilio</h2>
                <p className="text-sm text-slate-500 dark:text-white font-medium leading-relaxed">
                  Ingresa la dirección donde resides actualmente.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] pl-2">Estado</label>
                    <div className="relative">
                      <select className="w-full h-14 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-2xl px-4 text-sm font-bold outline-none appearance-none text-black dark:text-white">
                        <option>Distrito Capital</option>
                        <option>Miranda</option>
                      </select>
                      <Icons.ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] pl-2">Municipio</label>
                    <div className="relative">
                      <select className="w-full h-14 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-2xl px-4 text-sm font-bold outline-none appearance-none text-black dark:text-white">
                        <option>Libertador</option>
                      </select>
                      <Icons.ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] pl-2">Detalle de Dirección</label>
                    <input type="text" placeholder="Ej. Calle principal, Edificio XYZ, Apto 4" className="w-full h-14 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-black dark:text-white outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] pl-2">Código Postal</label>
                    <input type="text" placeholder="1010" className="w-full h-14 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-black dark:text-white outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-auto">
                <button onClick={() => setStep(2)} className="flex-1 h-20 bg-slate-100 dark:bg-white/5 rounded-[2rem] font-black text-slate-400 uppercase tracking-widest text-[10px]">Atrás</button>
                <button onClick={() => setStep(4)} className="flex-[2] h-20 bg-[#4F84C4] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-none">Siguiente</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex-1 flex flex-col gap-10 animate-in fade-in duration-700">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter text-black dark:text-white">Revisión de Orden</h2>
                <p className="text-sm text-slate-500 dark:text-white font-medium">Verifica la información registrada antes de proceder al agendamiento de cita.</p>
              </div>

              <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5 space-y-6">
                <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-4">
                  <span className="text-xs font-bold text-slate-500">Trámite</span>
                  <span className="text-sm font-black text-black dark:text-white uppercase">Renovación de Cédula</span>
                </div>
                <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-4">
                  <span className="text-xs font-bold text-slate-500">Titular</span>
                  <span className="text-sm font-black text-black dark:text-white uppercase">JORGE PEREZ (V-12.345.678)</span>
                </div>
                <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-4">
                  <span className="text-xs font-bold text-slate-500">Dirección</span>
                  <span className="text-sm font-black text-black dark:text-white">Distrito Capital, Libertador</span>
                </div>
                <div className="flex items-center gap-3 bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                  <Icons.Info size={16} className="text-blue-500" />
                  <p className="text-[10px] text-[#4F84C4] dark:text-blue-300 font-bold uppercase tracking-widest">El trámite de Cédula de Identidad es gratuito.</p>
                </div>
              </div>

              <div className="flex gap-4 mt-auto">
                <button onClick={() => setStep(3)} className="flex-1 h-20 bg-slate-100 dark:bg-white/5 rounded-[2rem] font-black text-slate-400 uppercase tracking-widest text-[10px]">Modificar</button>
                <button onClick={() => setStep(5)} className="flex-[2] h-20 bg-black dark:bg-white text-white dark:text-black rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-none">Confirmar y Agendar</button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter text-black dark:text-white">Cita Presencial</h2>
                <p className="text-sm text-slate-500 dark:text-white font-medium">Configura la ubicación para la toma de fotografía y huellas.</p>
              </div>
 
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] ml-2">Región / Estado</label>
                  <div className="relative">
                    <select className="w-full h-16 bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 text-sm font-bold outline-none appearance-none text-black dark:text-white">
                       <option className="bg-white dark:bg-[#0a0a0a]">Distrito Capital</option>
                       <option className="bg-white dark:bg-[#0a0a0a]">Miranda</option>
                    </select>
                    <Icons.ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] ml-2">Oficina SAIME</label>
                  <div className="relative">
                    <select className="w-full h-16 bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 text-sm font-bold outline-none appearance-none text-black dark:text-white">
                       <option className="bg-white dark:bg-[#0a0a0a]">Sede Principal (Plaza Caracas)</option>
                       <option className="bg-white dark:bg-[#0a0a0a]">Centro de Atención Comercial</option>
                    </select>
                    <Icons.ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] ml-2">Fecha Disponible</label>
                  <div className="relative">
                    <input type="date" className="w-full h-16 bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl px-6 text-sm font-bold outline-none appearance-none text-black dark:text-white" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-auto">
                <button onClick={() => setStep(4)} className="flex-1 h-20 bg-slate-100 dark:bg-white/5 rounded-[2rem] font-black text-slate-400 uppercase tracking-widest text-[10px]">Atrás</button>
                <button onClick={resetFlow} className="flex-[2] h-20 bg-[#4F84C4] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-none flex items-center justify-center gap-2">
                  <Icons.Download size={18} /> Planilla PDF
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-8">
          {step === 1 && (
            <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter text-black dark:text-white">Trámite de Pasaporte</h2>
                <p className="text-sm text-slate-500 dark:text-white font-medium">Selecciona la operación que deseas realizar en el sistema central.</p>
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={() => setStep(2)} className="w-full bg-slate-50 dark:bg-white/5 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5 text-left group active:scale-[0.98] transition-all flex items-center justify-between">
                   <div className="space-y-1">
                     <h4 className="text-sm font-black uppercase tracking-tight text-black dark:text-white">Renovación Adulto</h4>
                     <p className="text-[10px] text-slate-400 dark:text-white font-bold uppercase tracking-widest">Vigencia 10 años</p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-white dark:bg-black flex items-center justify-center shadow-none group-hover:translate-x-1 transition-transform">
                     <Icons.ChevronRight size={18} className="text-black dark:text-white" />
                   </div>
                </button>
                <button onClick={() => setStep(2)} className="w-full bg-slate-50 dark:bg-white/5 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5 text-left group active:scale-[0.98] transition-all flex items-center justify-between">
                   <div className="space-y-1">
                     <h4 className="text-sm font-black uppercase tracking-tight text-black dark:text-white">Nuevo (Menores)</h4>
                     <p className="text-[10px] text-slate-400 dark:text-white font-bold uppercase tracking-widest">Vigencia 5 años</p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-white dark:bg-black flex items-center justify-center shadow-none group-hover:translate-x-1 transition-transform">
                     <Icons.ChevronRight size={18} className="text-black dark:text-white" />
                   </div>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter text-black dark:text-white">Datos de Identidad</h2>
                <p className="text-sm text-slate-500 dark:text-white font-medium leading-relaxed">
                  Confirma tus datos personales para la libreta.
                </p>
              </div>
              
              <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] pl-2">Primer Nombre</label>
                    <input type="text" defaultValue="JORGE" className="w-full h-14 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-black dark:text-white outline-none focus:border-blue-500" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] pl-2">Primer Apellido</label>
                    <input type="text" defaultValue="PEREZ" className="w-full h-14 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-black dark:text-white outline-none focus:border-blue-500" />
                  </div>
                  <div className="col-span-2 space-y-3">
                     <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] pl-2">Fecha de Nacimiento</label>
                     <input type="date" defaultValue="1985-05-15" className="w-full h-14 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-black dark:text-white outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-auto">
                <button onClick={() => setStep(1)} className="flex-1 h-20 bg-slate-100 dark:bg-white/5 rounded-[2rem] font-black text-slate-400 uppercase tracking-widest text-[10px]">Atrás</button>
                <button onClick={() => setStep(3)} className="flex-[2] h-20 bg-[#4F84C4] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-none active:scale-95 transition-all">Siguiente</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter text-black dark:text-white">Dirección y Contacto</h2>
                <p className="text-sm text-slate-500 dark:text-white font-medium leading-relaxed">
                  Datos de contacto.
                </p>
              </div>
              
              <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] pl-2">Correo Electrónico Principal</label>
                    <input type="email" defaultValue="jorge.perez@ejemplo.com" className="w-full h-14 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-black dark:text-white outline-none focus:border-blue-500" />
                  </div>
                  <div className="col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] pl-2">Teléfono Celular</label>
                    <input type="tel" defaultValue="0414-1234567" className="w-full h-14 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-black dark:text-white outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-auto">
                <button onClick={() => setStep(2)} className="flex-1 h-20 bg-slate-100 dark:bg-white/5 rounded-[2rem] font-black text-slate-400 uppercase tracking-widest text-[10px]">Atrás</button>
                <button onClick={() => setStep(4)} className="flex-[2] h-20 bg-[#4F84C4] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-none active:scale-95 transition-all">Siguiente</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter text-black dark:text-white">Confirmación de Trámite</h2>
                <p className="text-sm text-slate-500 dark:text-white font-medium">Revisa tu información y conoce el monto a pagar.</p>
              </div>

              <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5 space-y-6">
                <div className="flex justify-between items-center border-b border-black/5 dark:border-white/10 pb-4">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Trámite</span>
                  <span className="text-sm font-black text-black dark:text-white uppercase">Pasaporte 10 años</span>
                </div>
                <div className="flex justify-between items-center bg-white dark:bg-[#0a0a0a] p-4 rounded-xl border border-black/5 dark:border-white/10">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Arancel Trámite</span>
                  <span className="text-sm font-black text-black dark:text-white">200 USD</span>
                </div>
              </div>

              <div className="flex gap-4 mt-auto">
                <button onClick={() => setStep(3)} className="flex-1 h-20 bg-slate-100 dark:bg-white/5 rounded-[2rem] font-black text-slate-400 uppercase tracking-widest text-[10px]">Atrás</button>
                <button onClick={() => setStep(5)} className="flex-[2] h-20 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-none active:scale-95 transition-all">Ir a Pagar</button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter text-black dark:text-white">Pago del Trámite</h2>
                <p className="text-sm text-slate-500 dark:text-white font-medium">Selecciona tu método de pago preferido para liquidar los aranceles correspondientes.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button onClick={() => setStep(6)} className="w-full bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] border border-black/5 dark:border-white/5 flex items-center justify-between group active:scale-[0.98] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-none">
                      <Icons.CreditCard size={24} className="text-white" />
                    </div>
                    <div className="text-left space-y-1">
                      <h4 className="text-sm font-black text-black dark:text-white">Pasarela Banco de Venezuela</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Tarjeta de Débito / BiopagoBDV</p>
                    </div>
                  </div>
                   <Icons.ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <button onClick={() => setStep(4)} className="mt-auto block w-full text-center text-[10px] font-black text-slate-400 uppercase tracking-widest underline decoration-slate-300 underline-offset-4">Cancelar Pago</button>
            </div>
          )}

          {step === 6 && (
            <div className="flex-1 flex flex-col gap-8 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter text-black dark:text-white">Cita Presencial</h2>
                <p className="text-sm text-slate-500 dark:text-white font-medium">El pago fue exitoso. Agenda tu cita para captación de datos en una oficina.</p>
              </div>
 
              <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5 space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] ml-2">Sede</label>
                  <div className="relative">
                    <select className="w-full h-14 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-2xl px-4 text-sm font-bold outline-none appearance-none text-black dark:text-white">
                       <option>Venezuela - Distrito Capital (Plaza Caracas)</option>
                    </select>
                    <Icons.ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-white uppercase tracking-[0.3em] ml-2">Fecha y Hora</label>
                  <div className="flex gap-4">
                    <input type="date" className="flex-1 w-full h-14 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-2xl px-4 text-sm font-bold outline-none appearance-none text-black dark:text-white" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-auto">
                <button onClick={resetFlow} className="w-full h-20 bg-[#4F84C4] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-none flex items-center justify-center gap-2">
                  <Icons.CheckCircle2 size={18} /> Confirmar Cita y Finalizar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="h-20"></div>
    </div>
  );
};
