
import React from 'react';
import { Icons } from '../components/Icons';
import { motion } from 'motion/react';

export const Economy: React.FC = () => {
  const commodities = [
    { name: 'Petróleo (Brent)', price: '81.45', trend: '-1.2%', unit: 'USD/Bbl', icon: Icons.Droplets, color: 'text-blue-500' },
    { name: 'Oro (Spot)', price: '2,450.20', trend: '+0.8%', unit: 'USD/Oz', icon: Icons.Trophy, color: 'text-amber-500' },
    { name: 'Hierro (Fines)', price: '124.30', trend: '-0.5%', unit: 'USD/Ton', icon: Icons.Cpu, color: 'text-slate-500' },
    { name: 'Gas Natural', price: '2.95', trend: '+1.4%', unit: 'USD/MMBtu', icon: Icons.Flame, color: 'text-orange-500' },
  ];

  const historicalData = [
    { month: 'Mar', brent: 86.1, gold: 2345, iron: 128 },
    { month: 'Abr', brent: 84.5, gold: 2380, iron: 126 },
    { month: 'May', brent: 82.3, gold: 2410, iron: 125 },
    { month: 'Jun', brent: 81.4, gold: 2450, iron: 124 },
  ];

  const news = [
    {
      title: 'Aumento en la producción de la Faja del Orinoco',
      desc: 'Nuevas alianzas estratégicas impulsan la extracción de crudo pesado en el sur del país alcanzando los 900k bpd.',
      date: 'Hace 2 horas',
      tag: 'Petróleo'
    },
    {
      title: 'Nuevas regulaciones para la minería artesanal de oro',
      desc: 'El Ministerio de Minas anuncia plan de formalización para mineros en el Arco Minero con trazabilidad blockchain.',
      date: 'Hace 5 horas',
      tag: 'Oro'
    },
    {
      title: 'Exportación de Hierro alcanza cifras récord en el primer trimestre',
      desc: 'La demanda asiática impulsa los envíos desde las empresas básicas de Guayana con un incremento del 25%.',
      date: 'Ayer',
      tag: 'Hierro'
    }
  ];

  return (
    <div className="view-transition flex flex-col gap-12 pt-12 pb-32 animate-in fade-in duration-200">
      {/* Header Section */}
      <section className="px-6">
        <div className="space-y-3 mb-10 px-2">
          <h2 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em]">Mercados Globales</h2>
          <p className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]">Monitor de Commodities</p>
        </div>
        
        <div 
          style={{
            background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
            boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
          }}
          className="rounded-[3rem] border border-white/10 overflow-hidden shadow-none"
        >
          {commodities.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center justify-between py-8 px-10 hover:bg-white/5 transition-colors group cursor-pointer ${idx !== commodities.length - 1 ? 'border-b border-white/10' : ''}`}
            >
              <div className="flex items-center gap-6 relative z-10">
                <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className={`w-14 h-14 rounded-2xl flex items-center justify-center text-[#FFFFFF] shadow-none group-hover:scale-110 transition-transform duration-500 chip-aurora${['','-morado','-verde','-ambar','-rojo','-teal','-rosa','-lima'][idx % 8]}`}>
                  <item.icon size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#FFFFFF] uppercase tracking-widest">{item.name}</p>
                  <p className="text-[9px] font-bold text-[#FFFFFF] opacity-80 uppercase tracking-tighter mt-1">{item.unit}</p>
                </div>
              </div>
              <div className="text-right relative z-10">
                <p className="text-xl font-black font-mono tracking-tighter text-[#FFFFFF]">{item.price}</p>
                <p className={`text-[10px] font-black uppercase tracking-widest mt-1.5 ${item.trend.startsWith('+') ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {item.trend}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Historical Table Section */}
      <section className="px-6">
        <h2 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em] mb-8 px-4">Histórico de Precios (Q1 2026)</h2>
        <div 
          style={{
            background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
            boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
          }}
          className="rounded-[2.5rem] border border-white/10 overflow-hidden shadow-none relative"
        >
          <table className="w-full text-left relative z-10">
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                <th className="px-8 py-5 text-[9px] font-black text-[#FFFFFF] opacity-80 uppercase tracking-widest">Mes</th>
                <th className="px-8 py-5 text-[9px] font-black text-[#FFFFFF] opacity-80 uppercase tracking-widest">Brent</th>
                <th className="px-8 py-5 text-[9px] font-black text-[#FFFFFF] opacity-80 uppercase tracking-widest">Oro</th>
                <th className="px-8 py-5 text-[9px] font-black text-[#FFFFFF] opacity-80 uppercase tracking-widest">Hierro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {historicalData.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-8 py-5 text-xs font-black text-[#FFFFFF]">{row.month}</td>
                  <td className="px-8 py-5 text-xs font-mono text-[#FFFFFF]">${row.brent}</td>
                  <td className="px-8 py-5 text-xs font-mono text-[#FFFFFF]">${row.gold}</td>
                  <td className="px-8 py-5 text-xs font-mono text-[#FFFFFF]">${row.iron}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* News Section */}
      <section className="px-6">
        <h2 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em] mb-8 px-4">Noticias del Sector</h2>
        <div className="space-y-6">
          {news.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="p-10 rounded-[3rem] border border-white/10 shadow-none group cursor-pointer active:scale-[0.98] transition-all relative overflow-hidden"
              style={{
                background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
                boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <span style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="text-[9px] font-black text-[#FFFFFF] px-4 py-1.5 rounded-full uppercase tracking-widest shadow-none">{item.tag}</span>
                <span className="text-[9px] font-black text-[#FFFFFF] opacity-80 uppercase tracking-widest">{item.date}</span>
              </div>
              <h3 className="text-xl font-black leading-tight text-[#FFFFFF] transition-colors mb-4 tracking-tight relative z-10">{item.title}</h3>
              <p className="text-sm text-[#FFFFFF] opacity-90 font-medium leading-relaxed relative z-10">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Insight Section */}
      <section className="px-6">
        <div 
          style={{
            background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
            boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
          }}
          className="p-12 rounded-[3.5rem] border border-white/10 shadow-none relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFFFFF]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] transition-colors duration-1000"></div>
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div 
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
              }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center chip-aurora"
            >
              <Icons.Brain size={24} className="text-[#FFFFFF]" />
            </div>
            <span className="text-[10px] font-black text-[#FFFFFF] uppercase tracking-[0.3em]">Análisis VenIA</span>
          </div>
          <p className="text-base text-[#FFFFFF] font-bold leading-relaxed italic relative z-10">
            "La estabilidad de los precios del crudo Brent por encima de los $80 permite una proyección de ingresos estable para el segundo trimestre. Es crucial diversificar hacia el sector gasífero para capturar la demanda europea."
          </p>
          <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between relative z-10">
            <span className="text-[9px] font-black text-[#FFFFFF] opacity-80 uppercase tracking-widest">IA Predictiva v2.0</span>
            <Icons.ChevronRight size={16} className="text-[#FFFFFF] opacity-80" />
          </div>
        </div>
      </section>
    </div>
  );
};
