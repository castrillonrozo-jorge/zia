
import React from 'react';
import { Icons } from './Icons';

interface HealthModalsProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'teleconsulta' | 'citas' | 'historial' | 'farmacia' | null;
}

export const HealthModals: React.FC<HealthModalsProps> = ({ isOpen, onClose, type }) => {
  const [selectedRegion, setSelectedRegion] = React.useState<string | null>(null);

  if (!isOpen || !type) return null;

  const regions = [
    { name: 'Región Capital', hospitals: ['Hosp. Clínico Universitario', 'Hosp. José María Vargas', 'CDI Sierra Maestra'] },
    { name: 'Región Central', hospitals: ['Hosp. Central de Maracay', 'Hosp. Dr. Enrique Tejera', 'CDI Carabobo'] },
    { name: 'Región Zuliana', hospitals: ['Hosp. Universitario de Maracaibo', 'Hosp. General del Sur', 'CDI Zulia'] },
    { name: 'Región Los Andes', hospitals: ['Hosp. Universitario de Los Andes', 'Hosp. Central de San Cristóbal'] },
  ];

  const getContent = () => {
    switch (type) {
      case 'teleconsulta':
        return {
          title: 'Teleconsulta 24/7',
          icon: <Icons.PhoneCall size={40} className="text-[#4F84C4]" />,
          desc: 'Conéctate con un médico general en menos de 5 minutos. Servicio gratuito para todos los ciudadanos.',
          action: 'Iniciar Video-Llamada'
        };
      case 'citas':
        return {
          title: 'Citas Médicas',
          icon: <Icons.Calendar size={40} className="text-red-600" />,
          desc: 'Agenda tu cita en la red de hospitales públicos y Centros de Diagnóstico Integral (CDI).',
          action: 'Confirmar Cita'
        };
      case 'historial':
        return {
          title: 'Historial Digital',
          icon: <Icons.ClipboardList size={40} className="text-[#4F84C4]" />,
          desc: 'Accede a tus resultados de laboratorio, recetas médicas y antecedentes clínicos de forma segura.',
          action: 'Ver Documentos'
        };
      case 'farmacia':
        return {
          title: 'Farmacia Ven',
          icon: <Icons.Pill size={40} className="text-emerald-600" />,
          desc: 'Localiza medicamentos en la red de farmacias públicas y verifica disponibilidad en tiempo real.',
          action: 'Buscar Medicamento'
        };
      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) return null;

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[150] bg-black/40 backdrop-blur-sm flex items-end justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-none animate-in slide-in-from-bottom-full duration-500 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-start mb-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center chip-aurora">
            {content.icon}
          </div>
          <button 
            onClick={() => {
              onClose();
              setSelectedRegion(null);
            }}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors chip-aurora"
          >
            <Icons.X size={20} />
          </button>
        </div>

        <h3 className="text-xl font-black text-[#4F84C4] uppercase tracking-tight mb-2">{content.title}</h3>
        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
          {content.desc}
        </p>

        {type === 'citas' && (
          <div className="space-y-6 mb-8">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selecciona tu Región</h4>
            <div className="grid grid-cols-1 gap-3">
              {regions.map((region) => (
                <div key={region.name} className="space-y-3">
                  <button 
                    onClick={() => setSelectedRegion(selectedRegion === region.name ? null : region.name)}
                    className={`w-full p-5 rounded-2xl flex items-center justify-between transition-all border ${selectedRegion === region.name ? 'bg-[#4F84C4] text-white border-[#4F84C4]' : 'bg-slate-50 text-slate-900 border-black/5'}`}
                  >
                    <span className="text-xs font-black uppercase tracking-widest">{region.name}</span>
                    <Icons.ChevronDown size={16} className={`transition-transform ${selectedRegion === region.name ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {selectedRegion === region.name && (
                    <div className="grid grid-cols-1 gap-2 pl-4 animate-in slide-in-from-top-2 duration-300">
                      {region.hospitals.map((hospital) => (
                        <button key={hospital} className="p-4 rounded-xl bg-slate-50 text-left border border-black/5 hover:border-blue-500/30 transition-all">
                          <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{hospital}</p>
                          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1">Disponibilidad: Inmediata</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="w-full h-16 bg-[#4F84C4] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-none shadow-blue-900/20 active:scale-95 transition-transform">
          {content.action}
        </button>
      </div>
    </div>
  );
};
