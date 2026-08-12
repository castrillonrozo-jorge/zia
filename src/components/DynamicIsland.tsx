
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icons } from './Icons';

interface DynamicIslandProps {
  message: string | null;
  type?: 'success' | 'info' | 'warning' | 'error';
  onClear: () => void;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({ message, type = 'info', onClear }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClear();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClear]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <Icons.CheckCircle2 size={14} className="text-emerald-500" />;
      case 'error': return <Icons.ShieldAlert size={14} className="text-red-500" />;
      case 'warning': return <Icons.AlertTriangle size={14} className="text-amber-500" />;
      default: return <Icons.Info size={14} className="text-blue-500" />;
    }
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] pointer-events-none">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="pointer-events-auto bg-black dark:bg-white text-white dark:text-black rounded-none px-6 py-3 flex items-center gap-3 shadow-none min-w-[200px] justify-center"
          >
            <div className="w-6 h-6 rounded-full bg-white/10 dark:bg-black/10 flex items-center justify-center">
              {getIcon()}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
              {message}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
