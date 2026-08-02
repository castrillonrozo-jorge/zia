import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SaturnLogo } from './SaturnLogo';
import { LineChart, Coins, ShieldCheck, CreditCard, PiggyBank, TrendingUp, Eye, Handshake, Shield, Target, Bell, ArrowLeft, User, CheckCircle2, Circle } from 'lucide-react';
import { useUserProfileStore } from '../store/userProfileStore';

const GoogleIcon = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.365 2A3.208 3.208 0 0 0 15.2 4.41c-.482.593-.938 1.185-1.503 1.062-.128-.868.204-1.923.633-2.637C14.773 2.097 15.688 1.48 16.365 2zm-4.322 2.395c-1.383-.02-2.802.934-3.528.934-.735 0-1.85-.904-2.923-.884-1.4.03-2.697.818-3.418 2.083-1.464 2.55-1.012 5.568-.13 7.854.775 2.012 1.637 3.528 2.929 3.652.887.085 1.436-.452 2.766-.452 1.353 0 1.836.46 2.775.45.92-.01 1.58-.874 2.21-1.782.903-1.31 1.405-2.83 1.405-2.83-1.406-.57-1.876-2.193-1.87-3.412.01-1.355 1.096-2.39 1.146-2.422-.72-1.053-1.89-1.516-2.362-1.554z"/>
  </svg>
);

const ScreenWrapper = ({ children, bg = "crystal-bg", className = "" }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.98 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className={`absolute inset-0 w-full h-full flex flex-col justify-center ${bg} font-sans z-50`}
  >
    <div className={`w-full h-full flex flex-col relative overflow-y-auto overflow-x-hidden ${className}`}>
      {children}
    </div>
  </motion.div>
);

export const SplashScreen = ({ onComplete }: { onComplete: () => void, key?: string }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenWrapper className="items-center justify-center px-10">
      {/* El sello emerge del cristal: escala + bloom de luz dorada */}
      <motion.div
        initial={{ opacity: 0, scale: 0.82, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0.55] }}
          transition={{ delay: 0.7, duration: 1.6, times: [0, 0.6, 1] }}
          className="absolute inset-[-60px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(243,201,92,0.22) 0%, rgba(243,201,92,0.06) 45%, transparent 70%)' }}
        />
        <SaturnLogo size={148} className="relative rounded-[38px]" />
      </motion.div>

      {/* Wordmark con destello que lo recorre una vez */}
      <motion.h1
        initial={{ opacity: 0, letterSpacing: '0.55em' }}
        animate={{ opacity: 1, letterSpacing: '0.42em' }}
        transition={{ delay: 0.45, duration: 1.1, ease: 'easeOut' }}
        className="shine-text mt-9 text-[26px] font-semibold pl-[0.42em] font-display"
      >
        MIDAS
      </motion.h1>

      {/* Eslogan */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.15, duration: 0.9, ease: 'easeOut' }}
        className="mt-3 text-[15px] text-[#B9B4A6] font-light text-center tracking-[0.02em]"
      >
        Cuida tu dinero, sin esfuerzo.
      </motion.p>

      {/* Hilo de luz bajo el eslogan */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 1.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="mt-7 h-px w-24"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(243,201,92,0.7), transparent)' }}
      />
    </ScreenWrapper>
  );
};

export const OnboardingCarousel = ({ onSkip }: { onSkip: () => void, key?: string }) => {
  const [slide, setSlide] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState<{name: string, icon: any, refInfo: string, bg: string} | null>(null);

  return (
    <ScreenWrapper className="pt-[60px] pb-[40px] px-[40px]">
      <div className="flex w-full items-center justify-between mb-auto absolute top-10 left-0 px-10">
        <div className="flex gap-1 items-center">
          {[0, 1].map(i => (
            <div key={i} className={`h-[3px] w-8 rounded-full transition-colors ${slide === i ? 'gold-gradient' : 'bg-white/10'}`} />
          ))}
        </div>
        <button onClick={onSkip} className="text-white opacity-50 text-[14px] font-medium hover:opacity-100 transition-opacity">
          Saltar
        </button>
      </div>

      <div className="flex-1 flex flex-col py-8 mt-12 w-full max-w-[400px] mx-auto overflow-y-auto custom-scrollbar">
        {slide === 0 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="flex flex-col items-center text-center">
            <SaturnLogo size={128} className="mb-9" />
            <h1 className="text-[38px] font-bold text-white tracking-[-1.2px] leading-[1.08] mb-5 font-display">
              Cuida tu dinero,
              <br />
              <span className="gold-text-gradient">sin esfuerzo.</span>
            </h1>
            <p className="text-[15.5px] font-normal text-[#B9B4A6] leading-[1.6] max-w-[310px]">
              Recibe asesoría financiera personalizada 24/7 con el poder de agentes de IA
              y expertos en finanzas, economía, ahorro e inversión.
            </p>
          </motion.div>
        )}

        {slide === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <h2 className="text-[32px] font-bold text-white leading-[1.12] mb-8 font-display tracking-[-0.5px]">Tu ecosistema financiero</h2>
            <div className="space-y-4">
              {[
                { Icon: LineChart, title: 'Análisis profesional', desc: 'Diagnóstico financiero completo en minutos.' },
                { Icon: TrendingUp, title: 'Inversión inteligente', desc: 'Estrategias de agentes de IA expertos en mercados financieros.' },
                { Icon: PiggyBank, title: 'Ahorro optimizado', desc: 'Tu Bóveda crece sola con reglas automáticas a tu medida.' },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="glass-panel rounded-[18px] p-4 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-[13px] gold-gradient flex items-center justify-center flex-shrink-0">
                    <Icon size={22} strokeWidth={2.2} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-[16px] mb-0.5">{title}</h3>
                    <p className="font-normal text-[#B9B4A6] text-[14.5px] leading-[1.45]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <button 
        onClick={() => {
          if (slide < 1) setSlide(s => s + 1);
          else onSkip();
        }}
        className="w-full h-[56px] gold-gradient gold-glow rounded-[16px] font-semibold text-[16px] transition-all mt-8 mb-4 max-w-[400px] mx-auto flex items-center justify-center"
      >
        {slide === 0 ? 'Continuar' : 'Comenzar'}
      </button>

      <AnimatePresence>
        {selectedAgent && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="absolute inset-0 z-[100] bg-[#0A0A0A] p-6 flex flex-col"
          >
             <div className="flex items-center justify-between mb-8 text-white relative z-10 pt-4">
                <button onClick={() => setSelectedAgent(null)} className="p-2 hover:bg-gray-800 rounded-full transition-colors bg-[#151515]">
                  <ArrowLeft size={20} />
                </button>
                <span className="font-black tracking-widest text-gold-primary text-xs uppercase opacity-80">{selectedAgent.refInfo}</span>
             </div>
             
             <div className="flex-1 flex flex-col pt-10">
                <div className={`w-20 h-20 rounded-2xl ${selectedAgent.bg} flex items-center justify-center mb-6`}>
                   <selectedAgent.icon size={40} className="text-gold-primary" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Dashboard de {selectedAgent.name}</h2>
                <p className="text-gray-400 mb-8 border-b border-gray-800 pb-8">
                  Aquí el agente IA procesa tu información financiera de manera autónoma, utilizando modelos avanzados para optimizar tu {selectedAgent.name.toLowerCase()}.
                </p>

                <div className="space-y-4">
                  <div className="h-16 bg-[#151515] rounded-2xl flex items-center px-4 animate-pulse">
                     <div className="w-10 h-10 bg-gray-800 rounded-full mr-4"></div>
                     <div className="flex-1 space-y-2">
                        <div className="h-2 bg-gray-800 rounded w-1/2"></div>
                        <div className="h-2 bg-gray-800 rounded w-1/4"></div>
                     </div>
                  </div>
                  <div className="h-16 bg-[#151515] rounded-2xl flex items-center px-4 animate-pulse">
                     <div className="w-10 h-10 bg-gray-800 rounded-full mr-4"></div>
                     <div className="flex-1 space-y-2">
                        <div className="h-2 bg-gray-800 rounded w-1/3"></div>
                        <div className="h-2 bg-gray-800 rounded w-1/5"></div>
                     </div>
                  </div>
                  <div className="h-32 bg-[#151515] rounded-2xl p-4 flex flex-col justify-end animate-pulse">
                     <div className="flex w-full items-end gap-2 h-20">
                        {[40, 70, 45, 90, 60, 80].map((h, i) => (
                           <div key={i} className="flex-1 bg-gray-800 rounded-t-sm" style={{ height: `${h}%` }}></div>
                        ))}
                     </div>
                  </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenWrapper>
  );
};

export const LoginScreen = ({ onComplete }: { onComplete: () => void, key?: string }) => {
  const [loading, setLoading] = useState(false);

  const handleAuth = () => {
    setLoading(true);
    setTimeout(() => onComplete(), 1200);
  };

  return (
    <ScreenWrapper bg="bg-[#FFFFFF]" className="p-[32px]">
      <div className="pt-8 mb-20">
        <SaturnLogo size={56} />
      </div>
      
      <div className="mb-[64px]">
        <h1 className="text-[40px] font-bold text-[#1A1A18] tracking-[-1px] mb-2">Bienvenido.</h1>
        <p className="text-[17px] font-normal text-[#6B6B65]">Inicia sesión para empezar.</p>
      </div>

      <div className="space-y-3">
        <button 
          onClick={handleAuth}
          disabled={loading}
          className="w-full flex items-center justify-center relative bg-white border border-[#E5E5E5] h-[56px] rounded-[16px] hover:bg-gray-50 transition-colors"
        >
          {loading ? (
             <div className="w-5 h-5 border-2 border-gold-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <GoogleIcon className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2" />
              <span className="text-[16px] font-medium text-black">Continuar con Google</span>
            </>
          )}
        </button>
        <button 
          onClick={handleAuth}
          disabled={loading}
          className="w-full flex items-center justify-center relative bg-black h-[56px] rounded-[16px] hover:bg-gray-900 transition-colors"
        >
          {loading ? (
             <div className="w-5 h-5 border-2 border-gold-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <AppleIcon className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-white" />
              <span className="text-[16px] font-medium text-white">Continuar con Apple</span>
            </>
          )}
        </button>
      </div>

      <p className="mt-auto text-[13px] text-center text-gray-500 pb-4">
        Al continuar aceptas los <span className="text-black underline cursor-pointer">Términos</span> y <span className="text-black underline cursor-pointer">Política de Privacidad</span>
      </p>
    </ScreenWrapper>
  );
};

export const FacialKYCScreen = ({ onBack, onComplete }: { onBack: () => void, onComplete: () => void, key?: string }) => {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(-1);

  const startScan = () => {
    setActive(true);
    setTimeout(() => setStep(0), 1000);
    setTimeout(() => setStep(1), 2000);
    setTimeout(() => setStep(2), 3000);
    setTimeout(() => onComplete(), 4000);
  };

  return (
    <ScreenWrapper bg="bg-[#FFFFFF]" className="p-[32px]">
      <button onClick={onBack} className="mt-8 mb-8 p-2 -ml-2 w-fit text-[#1A1A18] hover:bg-gray-100 rounded-full transition-colors">
        <ArrowLeft size={24} />
      </button>

      <h1 className="text-[28px] font-bold text-[#1A1A18] mb-2">Verificación de identidad.</h1>
      <p className="text-[15px] font-normal text-gray-500 mb-[60px]">Esto nos toma 30 segundos. Tu rostro garantiza tu seguridad.</p>

      <div className="flex flex-col items-center justify-center mb-10 flex-1">
        <div className={`w-[260px] h-[260px] rounded-full border-2 flex items-center justify-center relative transition-colors duration-500 ${active ? 'border-gold-primary' : 'border-[#E5E5E5]'}`}>
          <User size={80} className="text-gold-primary opacity-50" strokeWidth={1} />
          {active && (
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-[-2px] rounded-full border-2 border-transparent border-t-gold-primary opacity-80"
            />
          )}
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {[
          'Detectando rostro...',
          'Verificando iluminación...',
          'Confirmando identidad...'
        ].map((text, i) => (
          <div key={i} className="flex items-center gap-3">
            {step >= i ? <CheckCircle2 size={24} className="text-green-500" /> : <Circle size={24} className="text-gray-300" />}
            <span className={`text-[15px] font-medium transition-colors ${step >= i ? 'text-black' : 'text-gray-400'}`}>{text}</span>
          </div>
        ))}
      </div>

      <button 
        onClick={startScan}
        disabled={active}
        className={`w-full h-[56px] rounded-[16px] font-semibold text-[16px] transition-all
          ${active ? 'bg-gray-100 text-gray-400' : 'gold-gradient gold-glow'}
        `}
      >
        {step >= 2 ? 'Completado' : 'Iniciar verificación'}
      </button>
    </ScreenWrapper>
  );
};

export const UserDataScreen = ({ onComplete }: { onComplete: (name: string, age?: number) => void, key?: string }) => {
  const { profile } = useUserProfileStore();
  const [name, setName] = useState(profile.name || '');
  const [age, setAge] = useState(profile.age?.toString() || '');

  return (
    <ScreenWrapper bg="bg-[#FFFFFF]" className="p-[32px] flex flex-col min-h-0">
      <div className="pt-20">
        <h1 className="text-[28px] font-bold text-[#1A1A18] mb-2">Para empezar, ¿cómo te llamas?</h1>
        <p className="text-[15px] text-gray-500 mb-8">Queremos conocerte para personalizar tu experiencia.</p>
        <div className="space-y-4">
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" autoFocus className="w-full h-[56px] border border-[#E5E5E5] rounded-[16px] px-[16px] text-[16px] outline-none focus:border-gold-primary transition-colors text-black placeholder:text-gray-400" />
          <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Tu edad (ej. 30)" className="w-full h-[56px] border border-[#E5E5E5] rounded-[16px] px-[16px] text-[16px] outline-none focus:border-gold-primary transition-colors text-black placeholder:text-gray-400" />
        </div>
      </div>

      <div className="mt-auto mb-4">
        <button 
          onClick={() => onComplete(name.trim() || 'Amigo', Number(age) > 0 ? Number(age) : undefined)}
          className="w-full h-[56px] gold-gradient gold-glow rounded-[16px] font-semibold text-[16px] transition-all flex items-center justify-center"
        >
          Continuar
        </button>
      </div>
    </ScreenWrapper>
  );
};
