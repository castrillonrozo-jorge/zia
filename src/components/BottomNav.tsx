
import React from 'react';
import { Icons } from './Icons';
import { AppView } from '../types';
import { motion } from 'motion/react';
import { useVibration } from '../hooks/useVibration';

interface BottomNavProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const { vibrate } = useVibration();
  const tabs = [
    { id: 'home', label: 'Inicio', icon: Icons.Home },
    { id: 'payments', label: 'Pagos', icon: Icons.CreditCard },
    { id: 'security', label: 'Protección', icon: Icons.ShieldAlert },
    { id: 'health', label: 'Salud', icon: Icons.Stethoscope },
    { id: 'profile', label: 'Perfil', icon: Icons.User },
  ];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-md pointer-events-none">
      <nav 
        className="pointer-events-auto h-[72px] rounded-full flex items-center justify-around px-2 shadow-lg backdrop-blur-xl border border-black/5 dark:border-white/10 bg-transparent hover:bg-white/95 dark:hover:bg-[#F2F2F7]/95 group/nav transition-colors duration-500"
      >
        {tabs.map((tab) => {
          const isActive = currentView === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => {
                vibrate('medium');
                setView(tab.id as AppView);
              }}
              className="relative flex flex-col items-center justify-center h-full flex-1 group"
            >
              {isActive && tab.id !== 'security' && (
                <motion.div 
                  layoutId="nav-active-bg"
                  className="absolute w-12 h-12 rounded-2xl bg-[#4F84C4]/20 group-hover/nav:bg-[#4F84C4]/10 transition-colors duration-300"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div 
                className={`relative z-10 flex flex-col items-center justify-center transition-all duration-300 ${tab.id === 'security' ? 'w-[46px] h-[46px] rounded-full bg-red-500/10 group-hover/nav:bg-red-500/20' : ''} ${isActive && tab.id !== 'security' ? 'scale-110' : ''}`}
              >
                {tab.id === 'security' && isActive && (
                  <span className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
                )}
                {tab.id === 'security' && isActive && (
                  <span className="absolute inset-0 rounded-full border-2 border-red-500/50 scale-125 transition-transform duration-500" />
                )}
                <Icon 
                  size={tab.id === 'security' ? 24 : 22} 
                  className={`transition-colors duration-300 ${
                    tab.id === 'security' 
                      ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]' 
                      : isActive 
                        ? 'text-[#4F84C4] drop-shadow-[0_0_8px_rgba(79,132,196,0.3)] group-hover/nav:drop-shadow-none' 
                        : 'text-slate-500 dark:text-slate-400 group-hover/nav:text-slate-500 dark:group-hover/nav:text-slate-600 hover:!text-[#4F84C4] dark:hover:!text-[#4F84C4]'
                  }`} 
                  strokeWidth={isActive || tab.id === 'security' ? 2.5 : 2}
                />
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
