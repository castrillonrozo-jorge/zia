import React, { useState } from 'react';
import { Icons } from './Icons';
import { AppView } from '../types';

interface SearchModalProps {
  onClose: () => void;
  onNavigate: (view: AppView) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  const searchItems = [
    { id: 'wallet', title: 'Billetera', view: 'wallet' as AppView, icon: Icons.Wallet },
    { id: 'payments', title: 'Pagos y Servicios', view: 'payments' as AppView, icon: Icons.Banknote },
    { id: 'id_renewal', title: 'SAIME - Cédula y Pasaporte', view: 'id_renewal' as AppView, icon: Icons.Fingerprint },
    { id: 'seniat', title: 'SENIAT - Impuestos', view: 'seniat' as AppView, icon: Icons.Calculator },
    { id: 'intt', title: 'INTT - Trámites', view: 'intt' as AppView, icon: Icons.Car },
    { id: 'health', title: 'Salud', view: 'health' as AppView, icon: Icons.Stethoscope },
    { id: 'business', title: 'Registro Mercantil', view: 'business' as AppView, icon: Icons.Building2 },
    { id: 'my_procedures', title: 'Mis Trámites', view: 'my_procedures' as AppView, icon: Icons.FileText },
    { id: 'economy', title: 'Economía Nacional', view: 'economy' as AppView, icon: Icons.Landmark },
    { id: 'national_pride', title: 'Orgullo Nacional', view: 'national_pride' as AppView, icon: Icons.Star },
    { id: 'security', title: 'Seguridad Ciudadana', view: 'security' as AppView, icon: Icons.ShieldCheck },
    { id: 'employment', title: 'Empleo SPNV', view: 'employment' as AppView, icon: Icons.Briefcase },
  ];

  const filteredItems = searchItems.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="flex-1 bg-white dark:bg-[#0a0a0a] rounded-t-[3rem] mt-24 shadow-none flex flex-col relative overflow-hidden">
        {/* Notch indicator */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-slate-200 dark:bg-white/20 rounded-full"></div>
        
        <div className="px-6 pt-12 pb-6 border-b border-black/5 dark:border-white/5 relative z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white chip-aurora"
            >
              <Icons.ArrowLeft size={18} />
            </button>
            <div className="flex-1 relative">
              <input 
                autoFocus
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="¿Qué trámite buscas?" 
                className="w-full h-12 bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl pl-12 pr-4 text-sm font-bold text-black dark:text-white outline-none focus:border-blue-500 placeholder-slate-400"
              />
              <Icons.Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-2 relative z-10">
          {query && filteredItems.length === 0 ? (
            <div className="text-center py-10">
              <Icons.Search size={40} className="mx-auto text-slate-300 dark:text-white/20 mb-4" />
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No se encontraron resultados para "{query}"</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <button 
                key={item.id}
                onClick={() => {
                  onNavigate(item.view);
                  onClose();
                }}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center gap-4 group active:scale-[0.98] transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center chip-aurora">
                  <item.icon size={20} className="text-[#4F84C4] dark:text-blue-400" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-sm font-black text-black dark:text-white tracking-tight">{item.title}</h4>
                </div>
                <Icons.ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
