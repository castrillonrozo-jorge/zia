import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Icons } from './Icons';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 6200); // Dar tiempo a que el logo se lea bien (6.2s)
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Coordenadas relativas en porcentaje (%) distribuidas armónicamente
  const windows = [
    { title: 'SAIME', icon: 'Fingerprint', top: '15%', left: '15%' },
    { title: 'SENIAT', icon: 'Landmark', top: '12%', left: '75%' },
    { title: 'SAREN', icon: 'FileText', top: '40%', left: '10%' },
    { title: 'INTT', icon: 'Car', top: '45%', left: '85%' },
    { title: 'BANCA', icon: 'CreditCard', top: '65%', left: '15%' },
    { title: 'PATRIA', icon: 'Flag', top: '70%', left: '80%' },
    { title: 'IVSS', icon: 'HeartPulse', top: '85%', left: '30%' },
    { title: 'EMPLEO', icon: 'Briefcase', top: '82%', left: '70%' },
    { title: 'SALUD', icon: 'Activity', top: '25%', left: '50%' },
  ];

  return (
    <div className="w-full h-[100dvh] max-w-md mx-auto overflow-hidden relative flex items-center justify-center">
      {/* Fondo Azul Corporativo Premium con Iluminación Superior */}
      <div className="absolute inset-0 bg-[#4F84C4]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/30 via-transparent to-[#1A365D]/40" />

      {/* Dispositivo Central Miniatura Ultra Elegante */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-[74px] h-[156px] bg-slate-50/95 backdrop-blur-xl rounded-[18px] shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.4)_inset] relative flex flex-col items-center justify-center overflow-hidden z-10"
      >
        {/* Sutil reflejo interno del cristal del dispositivo */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none rounded-t-[18px]" />
        
        {/* Logo de Agiliza (Aparece después de que los iconos entran) */}
        <motion.div
           initial={{ opacity: 0, scale: 0.6 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 4.8, duration: 0.8, type: 'spring', bounce: 0.4 }}
           className="flex flex-col items-center justify-center text-center z-20 mt-1"
        >
           <h1 className="text-[14px] font-black tracking-tighter leading-none shadow-sm">
             <span className="text-[#4F84C4]">Agil</span><span className="text-slate-800">iza</span>
           </h1>
           <div className="flex items-center justify-center gap-0.5 mt-1 bg-white/80 backdrop-blur-xs px-1.5 py-[1px] rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
             <span className="relative flex h-[3px] w-[3px]">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4F84C4] opacity-80"></span>
               <span className="relative inline-flex rounded-full h-[3px] w-[3px] bg-[#4F84C4]"></span>
             </span>
             <p className="text-[3.5px] font-black text-[#4F84C4] uppercase tracking-[0.2em] ml-[1px]">Ecosistema</p>
           </div>
        </motion.div>
      </motion.div>

      {/* Ventanas de Trámites Flotantes (Ingeniería de Vuelo) */}
      {windows.map((win, idx) => {
        const IconComponent = (Icons as any)[win.icon] || Icons.Circle;
        return (
          <motion.div
            key={idx}
            className="absolute z-20 origin-center"
            initial={{ 
              top: win.top, 
              left: win.left, 
              scale: 0, 
              opacity: 0,
              x: '-50%',
              y: '-50%',
              rotate: (idx % 2 === 0 ? -15 : 15)
            }}
            animate={{ 
              top: [win.top, win.top, win.top, '50%'],
              left: [win.left, win.left, win.left, '50%'],
              scale: [0, 1, 1.02, 0.05],
              opacity: [0, 1, 1, 0],
              rotate: [(idx % 2 === 0 ? -15 : 15), 0, -5, (idx % 2 === 0 ? 90 : -90)]
            }}
            transition={{
              duration: 3.6, 
              times: [0, 0.12, 0.6, 1], // El vuelo toma el 40% del tiempo (1.4 seg), muy visible
              ease: ["easeOut", "easeInOut", "anticipate"],
              delay: idx * 0.15
            }}
          >
            {/* Animación de flotación suave mientras está estático */}
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
                delay: idx * 0.2
              }}
              className="flex flex-col items-center justify-center w-[60px] h-[56px] bg-white/15 backdrop-blur-md rounded-xl border border-white/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-2"
            >
              <IconComponent className="text-white drop-shadow-md mb-1 opacity-95" size={16} />
              <span className="text-[6.5px] font-bold text-white drop-shadow-md tracking-widest uppercase truncate w-full text-center">
                {win.title}
              </span>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};
