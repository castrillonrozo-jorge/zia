
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { motion } from 'motion/react';

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
      <div className="p-8 flex flex-col gap-12 animate-in fade-in duration-700 pt-12 pb-32">
        <div className="space-y-3">
          <h2 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em]">Sistemas de Identidad</h2>
          <p className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]">Identidad Digital</p>
        </div>

        {/* VenIA Contextual Help */}
        <div className="bg-[#4F84C4]/[0.05] border border-[#4F84C4]/20 p-6 rounded-[2.5rem] flex items-center gap-4 backdrop-blur-xl">
          <div 
            style={{
              background: 'linear-gradient(135deg, #3A69A3 0%, #4F84C4 100%)',
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
                  background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
                  boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
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
                  background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
                  boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
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
                  background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
                  boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
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
                  background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
                  boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
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
            background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
            boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
          }}
          className="p-10 rounded-[3.5rem] border border-white/10 flex items-center gap-8 relative overflow-hidden"
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
      <div className="p-8 flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pt-12 pb-32">
        <div className="flex items-center justify-between">
          <button onClick={resetFlow} className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
            <Icons.ArrowLeft size={20} className="text-slate-900 dark:text-white" />
          </button>
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">Cédula Digital</h2>
          <button className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
            <Icons.Share2 size={20} className="text-slate-900 dark:text-white" />
          </button>
        </div>

        {/* Digital ID Card with Holographic Effect - Centered and Refined */}
        <div style={{ perspective: 1000 }} className="relative aspect-[1.58/1] w-full cursor-pointer" onClick={() => setIsIdFlipped(!isIdFlipped)}>
          <motion.div
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: isIdFlipped ? 180 : 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
            className="relative w-full h-full"
          >
            {/* FRONT OF ID */}
            <div 
              style={{
                background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
                boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                backfaceVisibility: 'hidden' 
              }} 
              className="absolute inset-0 rounded-[3.5rem] p-12 text-[#FFFFFF] shadow-none overflow-hidden border border-white/10 group"
            >
              {/* Holographic Shimmer Overlay */}
              <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-transparent via-blue-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[3000ms] ease-in-out"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_70%)]"></div>
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

              <div className="relative z-10 h-full flex flex-col items-center text-center justify-between">
                <div className="w-full flex justify-between items-start">
                  <div className="text-left space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-30">República Bolivariana de Venezuela</span>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-none"></div>
                      <span className="text-[10px] font-black tracking-widest uppercase">Identidad Digital</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-30">Cédula No.</span>
                    <p className="text-sm font-black tracking-tighter">V-12.345.678</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-6">
                  <div className="w-32 h-40 bg-white/5 rounded-[2.5rem] backdrop-blur-3xl overflow-hidden border border-white/10 shadow-none relative flex items-center justify-center">
                    <Icons.User size={80} className="text-white/20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(148,185,255,0.1),transparent)]"></div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-2xl font-black uppercase tracking-tight leading-none">Jorge Luis Perez</p>
                    <div className="flex items-center justify-center gap-6">
                      <div className="space-y-1">
                        <span className="text-[7px] uppercase opacity-30 font-black tracking-[0.3em]">Nacimiento</span>
                        <p className="text-[10px] font-black tracking-widest">15 MAY 1985</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[7px] uppercase opacity-30 font-black tracking-[0.3em]">Vence</span>
                        <p className="text-[10px] font-black tracking-widest text-emerald-400">MAR 2032</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-between items-end">
                  <div className="text-left">
                    <span className="text-[7px] uppercase opacity-30 font-black tracking-[0.3em] block mb-2">Firma Digital</span>
                    <div className="h-10 flex items-center">
                       <Icons.Signature size={32} className="text-white/40 -rotate-6" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        <Icons.ShieldCheck size={20} className="text-emerald-500" />
                     </div>
                  </div>
                </div>
              </div>
              
              <Icons.Flag className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]" size={200} />
            </div>

            {/* BACK OF ID */}
            <div 
              style={{ 
                background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
                boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                backfaceVisibility: 'hidden', 
                transform: 'rotateY(180deg)' 
              }} 
              className="absolute inset-0 rounded-[3.5rem] p-8 text-[#FFFFFF] shadow-none overflow-hidden border border-white/10 flex flex-col justify-between"
            >
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
              <div className="relative z-10 w-full h-16 bg-black/50 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden mb-4">
                 {/* Simulate Magnetic Strip/Barcode */}
                 <div className="w-full flex opacity-60 px-4 gap-1 items-center justify-center">
                   {[...Array(40)].map((_, i) => (
                      <div key={i} className="h-12 bg-white" style={{ width: `${Math.random() * 4 + 1}px`, opacity: Math.random() * 0.5 + 0.3 }}></div>
                   ))}
                 </div>
              </div>
              
              <div className="relative z-10 flex flex-col gap-4 px-4 flex-1">
                <div className="flex justify-between items-start border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <span className="text-[7px] uppercase font-black tracking-[0.3em] text-slate-500">Estado Civil</span>
                    <p className="text-xs font-bold text-slate-200">Soltero(a)</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="text-[7px] uppercase font-black tracking-[0.3em] text-slate-500">Documento</span>
                    <p className="text-xs font-mono font-bold text-slate-200">DOC-9988221</p>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/10">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                       <Icons.Wifi size={18} className="text-emerald-400 animate-pulse" />
                     </div>
                     <div className="flex flex-col">
                       <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Microchip NFC</span>
                       <span className="text-xs font-bold text-emerald-400">Activo</span>
                     </div>
                   </div>
                   <Icons.QrCode size={40} className="opacity-80" />
                </div>
              </div>

              <div className="relative z-10 text-center mt-2">
                 <p className="text-[5px] font-mono text-slate-600 uppercase tracking-widest break-all">
                   IDVEN12345678&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                   8505156M3203152VEN&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;1
                   PEREZ&lt;&lt;JORGE&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                 </p>
              </div>
            </div>

            <div className="absolute top-6 right-6 z-20 text-[8px] text-white/40 uppercase tracking-[0.2em] font-black pointer-events-none flex items-center gap-1">
              <Icons.ArrowLeft size={10} className="rotate-[135deg]" />
              GIRAR
            </div>
          </motion.div>
        </div>

        {/* Real-time Verification Hub */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
            boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
          }}
          className="rounded-[3.5rem] p-10 border border-white/10 shadow-none space-y-8 relative overflow-hidden"
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#FFFFFF]">Estado de Verificación</h3>
              <p className="text-[10px] text-[#FFFFFF] font-bold uppercase tracking-widest opacity-80">Sincronizado con SAIME</p>
            </div>
            {isVerified && !isVerifying && (
              <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="px-4 py-1.5 rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] animate-pulse"></div>
                <span className="text-[9px] font-black text-[#FFFFFF] uppercase tracking-widest">Activo</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-8 relative z-10">
            <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="relative p-8 rounded-[3rem] group">
              <div className="w-56 h-56 flex items-center justify-center">
                <Icons.QrCode size={200} className={`text-[#FFFFFF] transition-all duration-700 ${isVerifying ? 'opacity-20 blur-sm' : 'opacity-100'}`} />
              </div>
              {isVerifying && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 border-4 border-[#FFFFFF] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[10px] font-black text-[#FFFFFF] uppercase tracking-widest animate-pulse">Consultando Registro...</p>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.3)' }} className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-none">
                  <Icons.Fingerprint size={28} className="text-[#FFFFFF]" />
                </div>
              </div>
            </div>

            <div className="w-full space-y-6">
              <div className="flex items-center justify-between px-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-[#FFFFFF] uppercase tracking-widest opacity-80">Token de Seguridad</span>
                  <p className="text-xs font-mono text-[#FFFFFF] font-bold">{qrValue}</p>
                </div>
                <button 
                  onClick={() => {
                    setIsVerifying(true);
                    setTimeout(() => {
                      setIsVerifying(false);
                      setIsVerified(true);
                    }, 2000);
                  }}
                  className="px-6 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-none"
                >
                  Verificar Ahora
                </button>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 30, ease: "linear", repeat: Infinity }}
                  className="h-full bg-[#4F84C4] shadow-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="h-20 rounded-[2.5rem] bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 border border-black/5 dark:border-white/10 active:scale-95 transition-all">
            <Icons.Download size={18} />
            Exportar
          </button>
          <button className="h-20 rounded-[2.5rem] bg-[#4F84C4] text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-none shadow-blue-600/30 active:scale-95 transition-all">
            <Icons.Smartphone size={18} />
            NFC Activo
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'view-passport') {
    return (
      <div className="p-8 flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pt-12 pb-32">
        <div className="flex items-center justify-between">
          <button onClick={resetFlow} className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
            <Icons.ArrowLeft size={20} className="text-slate-900 dark:text-white" />
          </button>
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">Pasaporte Bio</h2>
          <button className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
            <Icons.Globe size={20} className="text-slate-900 dark:text-white" />
          </button>
        </div>

        {/* Virtual Passport Preview - Enhanced Luxury */}
        <div style={{ perspective: 1000 }} className="relative aspect-[1.58/1] w-full cursor-pointer" onClick={() => setIsPassportFlipped(!isPassportFlipped)}>
          <motion.div
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: isPassportFlipped ? 180 : 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
            className="relative w-full h-full"
          >
            {/* FRONT OF PASSPORT */}
            <div 
              style={{
                background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
                boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                backfaceVisibility: 'hidden' 
              }} 
              className="absolute inset-0 rounded-[3.5rem] p-12 text-[#FFFFFF] shadow-none overflow-hidden border border-white/10 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-transparent to-transparent"></div>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(99,102,241,0.2),transparent_60%)]"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40">República Bolivariana de Venezuela</span>
                    <h4 className="text-xl font-black tracking-[0.2em] uppercase">Pasaporte</h4>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-xl flex items-center justify-center border border-white/10">
                    <Icons.ShieldCheck size={28} className="text-indigo-400" />
                  </div>
                </div>

                <div className="flex items-center gap-10">
                  <div className="w-28 h-36 bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden relative flex items-center justify-center">
                    <Icons.User size={60} className="text-white/20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <span className="text-[7px] uppercase opacity-30 font-black tracking-[0.3em]">Número de Pasaporte</span>
                      <p className="text-2xl font-black tracking-[0.1em] font-mono">092837465</p>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <span className="text-[7px] uppercase opacity-30 font-black tracking-[0.3em]">Tipo</span>
                        <p className="text-xs font-black">P / Personal</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[7px] uppercase opacity-30 font-black tracking-[0.3em]">Código</span>
                        <p className="text-xs font-black">VEN</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-12 right-12 flex items-center gap-3">
                 <div className="w-10 h-8 bg-indigo-500/20 rounded-lg border border-indigo-500/30 flex items-center justify-center shadow-none shadow-indigo-500/10">
                    <Icons.Cpu size={14} className="text-indigo-400" />
                 </div>
                 <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">Biometric Chip Active</span>
              </div>
            </div>

            {/* BACK OF PASSPORT/CHIP SCAN */}
            <div 
              style={{
                background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
                boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                backfaceVisibility: 'hidden', 
                transform: 'rotateY(180deg)' 
              }} 
              className="absolute inset-0 rounded-[3.5rem] p-10 text-white shadow-none overflow-hidden border border-white/10 flex flex-col justify-center items-center gap-8"
            >
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]"></div>
               <div className="absolute top-0 w-full h-[30%] bg-gradient-to-b from-indigo-500/5 to-transparent"></div>
               
               <div className="relative z-10 w-24 h-24 rounded-[2rem] bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-none">
                  <div className="absolute inset-0 border border-indigo-400 rounded-[2rem] animate-ping opacity-20"></div>
                  <Icons.Wifi size={40} className="text-indigo-400" />
               </div>
               
               <div className="relative z-10 text-center space-y-2">
                 <h3 className="text-lg font-black tracking-widest uppercase">NFC Ready</h3>
                 <p className="text-xs text-indigo-200/50 uppercase tracking-widest max-w-[200px]">Acerca tu dispositivo para leer los datos biométricos</p>
               </div>

               <div className="relative z-10 w-full mt-4 flex flex-col gap-2 opacity-50">
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ left: '0%' }}
                        animate={{ left: '66%' }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                        className="absolute top-0 bottom-0 w-1/3 bg-indigo-500/50 rounded-full"
                      />
                   </div>
                   <p className="text-[8px] font-mono text-center tracking-[0.3em] uppercase">Emitiendo señal de corto alcance...</p>
               </div>
            </div>
            
            <div className="absolute top-6 right-6 z-20 text-[8px] text-white/40 uppercase tracking-[0.2em] font-black pointer-events-none flex items-center gap-1">
              <Icons.ArrowLeft size={10} className="rotate-90" />
              Toca para Voltear
            </div>
          </motion.div>
        </div>

        {/* Travel Readiness Hub */}
        <div className="space-y-8">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Centro de Viajes Inteligente</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div 
              style={{
                background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
                boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
              }}
              className="p-10 rounded-[3rem] border border-white/10 shadow-none flex items-center justify-between group active:scale-[0.98] transition-all relative overflow-hidden"
            >
              <div className="flex items-center gap-6 relative z-10">
                <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-14 h-14 rounded-2xl flex items-center justify-center">
                  <Icons.CheckCircle2 size={28} className="text-[#FFFFFF]" />
                </div>
                <div>
                  <h4 className="text-base font-black text-[#FFFFFF] tracking-tight">Vigencia Confirmada</h4>
                  <p className="text-[10px] text-[#FFFFFF] font-bold uppercase tracking-widest opacity-80">Expira en 10 años (2036)</p>
                </div>
              </div>
              <Icons.ChevronRight size={20} className="text-[#FFFFFF] opacity-80 group-hover:translate-x-1 transition-transform relative z-10" />
            </div>

            <div 
              style={{
                background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
                boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
              }}
              className="p-10 rounded-[3rem] border border-white/10 shadow-none flex items-center justify-between group active:scale-[0.98] transition-all relative overflow-hidden"
            >
              <div className="flex items-center gap-6 relative z-10">
                <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-14 h-14 rounded-2xl flex items-center justify-center">
                  <Icons.FileText size={28} className="text-[#FFFFFF]" />
                </div>
                <div>
                  <h4 className="text-base font-black text-[#FFFFFF] tracking-tight">Visas Digitales</h4>
                  <p className="text-[10px] text-[#FFFFFF] font-bold uppercase tracking-widest opacity-80">3 Autorizaciones Activas</p>
                </div>
              </div>
              <Icons.ChevronRight size={20} className="text-[#FFFFFF] opacity-80 group-hover:translate-x-1 transition-transform relative z-10" />
            </div>

            <div 
              style={{
                background: 'linear-gradient(135deg, #4F84C4 0%, #254A75 100%)',
                boxShadow: '0 12px 30px rgba(79, 132, 196, 0.28)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
              }}
              className="p-10 rounded-[3rem] border border-white/10 shadow-none flex items-center justify-between group active:scale-[0.98] transition-all relative overflow-hidden"
            >
              <div className="flex items-center gap-6 relative z-10">
                <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-14 h-14 rounded-2xl flex items-center justify-center">
                  <Icons.Activity size={28} className="text-[#FFFFFF]" />
                </div>
                <div>
                  <h4 className="text-base font-black text-[#FFFFFF] tracking-tight">Salud Internacional</h4>
                  <p className="text-[10px] text-[#FFFFFF] font-bold uppercase tracking-widest opacity-80">Certificado PAI Sincronizado</p>
                </div>
              </div>
              <Icons.ChevronRight size={20} className="text-[#FFFFFF] opacity-80 group-hover:translate-x-1 transition-transform relative z-10" />
            </div>
          </div>
        </div>

        <button style={{ background: 'linear-gradient(135deg, #3A69A3 0%, #4F84C4 100%)' }} className="w-full h-24 rounded-[3rem] text-white font-black text-xs uppercase tracking-[0.3em] shadow-none active:scale-95 transition-all">
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
