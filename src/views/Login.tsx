
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { motion, AnimatePresence } from 'motion/react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanType, setScanType] = useState<'fingerprint' | 'face' | null>(null);

  const handleBiometric = (type: 'fingerprint' | 'face') => {
    setIsScanning(true);
    setScanType(type);
    setTimeout(() => {
      setIsScanning(false);
      onLogin();
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#05050A] p-8 flex flex-col items-center justify-between animate-in fade-in duration-1000 overflow-y-auto transition-colors duration-500 relative selection:bg-[#4F84C4]/30">
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
          >
            <div className="relative">
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-32 h-32 rounded-full bg-[#4F84C4]/10 flex items-center justify-center border-4 border-[#4F84C4]/20 shadow-none"
              >
                {scanType === 'fingerprint' ? (
                  <Icons.Fingerprint size={64} className="text-[#4F84C4] drop-shadow-none" />
                ) : (
                  <Icons.Eye size={64} className="text-[#4F84C4] drop-shadow-none" />
                )}
              </motion.div>
              
              {/* Scanning Line */}
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-[#4F84C4] shadow-none z-10"
              />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                {scanType === 'fingerprint' ? 'Escaneando Huella' : 'Reconocimiento Facial'}
              </h3>
              <p className="text-[10px] text-[#4F84C4] font-bold uppercase tracking-[0.4em] animate-pulse">Verificando Identidad...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-sm mt-12 mb-10 relative z-10">
        <div className="text-center mb-16 relative">
          <h1 className="text-5xl font-black tracking-tighter relative z-10">
            <span className="text-[#4F84C4]">Agil</span><span className="text-black dark:text-white">iza</span>
          </h1>
          <div className="flex items-center justify-center gap-1.5 mt-3 relative z-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4F84C4] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4F84C4]"></span>
            </span>
            <p className="text-[10px] font-black text-slate-500 dark:text-[#4F84C4] uppercase tracking-[0.4em] ml-1">Independencia Digital</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="relative group">
            <Icons.User className="absolute left-6 top-5 text-slate-400 dark:text-slate-500 group-focus-within:text-[#4F84C4] transition-colors z-10" size={24} />
            <input 
              type="text" 
              placeholder="Cédula de Identidad" 
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              className="w-full h-16 rounded-full pl-16 pr-6 text-sm font-bold text-slate-900 dark:text-white outline-none dark:focus:border-[#4F84C4] focus:border-[#4F84C4] focus:ring-4 dark:focus:ring-[#4F84C4]/20 focus:ring-[#4F84C4]/10 transition-all backdrop-blur-md" 
            />
          </div>

          <div className="relative group">
            <Icons.ShieldCheck className="absolute left-6 top-5 text-slate-400 dark:text-slate-500 group-focus-within:text-[#4F84C4] transition-colors z-10" size={24} />
            <input 
              type="password" 
              placeholder="Clave Dinámica" 
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              className="w-full h-16 rounded-full pl-16 pr-6 text-sm font-bold text-slate-900 dark:text-white outline-none dark:focus:border-[#4F84C4] focus:border-[#4F84C4] focus:ring-4 dark:focus:ring-[#4F84C4]/20 focus:ring-[#4F84C4]/10 transition-all backdrop-blur-md" 
            />
          </div>

          <button 
            onClick={onLogin}
            className="w-full bg-[#4F84C4] text-white h-16 rounded-full font-bold text-sm uppercase tracking-widest active:scale-95 transition-all mt-8 relative overflow-hidden group"
          >
            {/* Specular highlight */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)', pointerEvents: 'none' }} />
            <span className="relative z-10">Ingresar al Portal</span>
          </button>
        </div>

        <div className="flex items-center gap-6 my-10 px-4">
           <div className="flex-1 h-px bg-slate-200 dark:bg-white/10"></div>
           <span className="text-[10px] font-bold text-[#4F84C4] dark:text-[#4F84C4] uppercase tracking-widest whitespace-nowrap">O continuar con</span>
           <div className="flex-1 h-px bg-slate-200 dark:bg-white/10"></div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-10">
          <button 
            onClick={onLogin} 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            className="h-16 rounded-2xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 active:scale-95 transition-all relative overflow-hidden"
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)', pointerEvents: 'none' }} />
            <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </button>
          <button 
            onClick={onLogin} 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            className="h-16 rounded-2xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 active:scale-95 transition-all relative overflow-hidden"
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)', pointerEvents: 'none' }} />
            <svg className="w-5 h-5 relative z-10" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-6 my-10 px-4">
           <div className="flex-1 h-px bg-slate-200 dark:bg-white/10"></div>
           <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">Acceso Biométrico</span>
           <div className="flex-1 h-px bg-slate-200 dark:bg-white/10"></div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => handleBiometric('fingerprint')} 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
              boxShadow: 'none',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            className="flex-1 h-20 rounded-[1.25rem] flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 active:scale-95 transition-all group relative overflow-hidden"
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)', pointerEvents: 'none' }} />
            <Icons.Fingerprint size={28} className="text-slate-500 dark:text-slate-400 group-hover:text-[#4F84C4] transition-colors drop-shadow-none relative z-10" />
          </button>
        </div>
      </div>

      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center mb-8 max-w-xs leading-relaxed relative z-10">
        Tecnología Venezolana con<br/>
        Seguridad de Nivel Gubernamental.
      </p>
    </div>
  );
};

