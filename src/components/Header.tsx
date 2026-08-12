
import React from 'react';
import { Icons } from './Icons';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
  onNotifications?: () => void;
  onOpenCalculator?: () => void;
  onOpenAI?: () => void;
  onSearch?: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  onBack, 
  showBack, 
  onNotifications, 
  onOpenCalculator,
  onOpenAI,
  onSearch,
  isDarkMode,
  toggleDarkMode
}) => {
  return (
    <header className="sticky top-0 z-[60] px-6 py-5 bg-white/70 dark:bg-[#05070A]/70 backdrop-blur-xl flex items-center justify-between relative overflow-hidden border-b border-black/[0.03] dark:border-white/[0.03]">
      {/* Subtle background accent */}
      <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      
      <div className="flex items-center gap-3">
        {showBack && (
          <button 
            onClick={onBack} 
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
              boxShadow: 'none',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-all text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white"
          >
            <Icons.ArrowLeft size={16} />
          </button>
        )}
        <div className="flex flex-col">
          <h1 className="text-xl font-black tracking-tight leading-none">
            {title === 'Agiliza' ? (
              <div className="flex flex-col items-start pt-0.5">
                <span className="flex items-center tracking-tighter text-[22px]">
                  <span className="text-[#4F84C4] font-black">Agil</span>
                  <span className="text-slate-900 dark:text-white font-black">iza</span>
                </span>
                <span className="text-[6.5px] font-bold tracking-[0.25em] text-slate-400/80 dark:text-slate-500 uppercase mt-[2.5px]">Ecosistema Digital</span>
              </div>
            ) : <span className="text-slate-900 dark:text-slate-100">{title}</span>}
          </h1>
        </div>
      </div>

      {/* Centered Compact AI Assistant Button (VenIA) */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center">
        <button
          onClick={onOpenAI}
          data-tour="ia"
          style={{
            background: 'linear-gradient(135deg, #4F84C4 0%, #315C91 100%)',
            boxShadow: '0 4px 12px rgba(79, 132, 196, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          className="h-10 px-5 rounded-full flex items-center gap-2.5 active:scale-95 transition-transform group"
          title="VenIA - Inteligencia Artificial"
        >
          <div className="flex items-center justify-center gap-1.5">
            <Icons.MessageCircle size={15} className="text-[#00FF66] group-hover:scale-110 transition-transform duration-300 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-bold tracking-widest text-white uppercase" style={{ color: '#FFFFFF' }}>IA</span>
        </button>
      </div>

      <div data-tour="buscar" className="flex items-center h-10 bg-slate-100 dark:bg-white/5 rounded-full p-1 border border-black/5 dark:border-white/5">
        <button 
          onClick={toggleDarkMode}
          className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-all text-slate-500 dark:text-slate-300 hover:text-blue-500 hover:bg-white dark:hover:bg-white/10 dark:hover:text-white"
          title={isDarkMode ? "Modo Claro" : "Modo Oscuro"}
        >
          {isDarkMode ? <Icons.Sun size={14} /> : <Icons.Moon size={14} />}
        </button>

        <button 
          onClick={onNotifications}
          className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-all relative text-slate-500 dark:text-slate-300 hover:text-blue-500 hover:bg-white dark:hover:bg-white/10 dark:hover:text-white"
        >
          <Icons.Bell size={14} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse border-2 border-white dark:border-[#05070A]"></span>
        </button>

        <button 
          onClick={onSearch}
          className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-all group text-slate-500 dark:text-slate-300 hover:text-blue-500 hover:bg-white dark:hover:bg-white/10 dark:hover:text-white"
        >
          <Icons.Search size={14} />
        </button>
      </div>
    </header>
  );
};
