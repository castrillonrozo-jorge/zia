
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { motion, AnimatePresence } from 'motion/react';

interface HeritageItem {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  history: string;
  awards: string[];
  image: string;
  tag: string;
}

export const NationalPride: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<HeritageItem | null>(null);

  const items: HeritageItem[] = [
    {
      id: 'cacao',
      title: 'Cacao Venezolano',
      subtitle: 'El Oro Genético del Mundo',
      desc: 'El cacao venezolano ha pasado de ser una materia prima a ser el protagonista de las barras más premiadas del mundo por su genética criolla única.',
      history: 'El cacao venezolano es considerado el mejor del mundo por su complejidad aromática. El Cacao de Chuao es el único en el mundo con Denominación de Origen Controlada desde hace siglos. La variedad "Porcelana", originaria del Sur del Lago de Maracaibo, es la más pura y escasa, codiciada por los maestros chocolateros más exigentes de Europa para crear ediciones limitadas que pueden costar cientos de euros.',
      awards: [
        'International Chocolate Awards (2024-2025): Delirio Chocolate (Margarita) arrasó con 14 premios en la edición de América Latina y el Caribe 2025, incluyendo el Oro en micro-lotes de chocolate oscuro con su barra Barlovento 65%.',
        'Final Mundial 2024: El chocolate Güelitos 54% (con leche y cacao Carenero Superior) obtuvo la medalla de Oro, destacando por sus notas de caramelo y textura sedosa.',
        'Salón del Chocolate de París 2025: Venezuela recibió cuatro premios especiales al "Chocolate de Origen", reconociendo la excelencia de las cosechas de Chuao, Choroní, Ocumare y Barlovento.',
        'Cacao of Excellence 2025-2026: El cacao de la Hacienda El Recreo (Carabobo) fue seleccionado entre los 50 mejores del mundo y obtuvo la medalla de Bronce en la competencia global de 2026.',
        'Great Taste Awards: Variedades como el Sur del Lago 70 han sido calificadas como "Maravillosas" con dos estrellas por críticos británicos.'
      ],
      image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=800&auto=format&fit=crop',
      tag: 'Herencia'
    },
    {
      id: 'cafe',
      title: 'Café de Especialidad',
      subtitle: 'El Renacer de los Andes',
      desc: 'Tras años de bajo perfil, el café venezolano ha regresado a la élite mundial con puntajes de catación extraordinarios.',
      history: 'A finales del siglo XIX, Venezuela era el segundo productor mundial de café. Hoy, vivimos un renacimiento con el "Café de Especialidad". Productores en Boconó, Caripe y Santa Cruz de Mora están aplicando técnicas de fermentación anaeróbica y procesos "honey" que resaltan notas de panela, cítricos y jazmín. El café venezolano no solo es una bebida, es una tradición que une a las familias en cada rincón de nuestra geografía.',
      awards: [
        'EICEV 2025: Récord Mundial de Precio. Un kilogramo de café variedad Geisha producido en Venezuela alcanzó los $5.500 dólares en subasta histórica, pulverizando récords previos.',
        'Taza de Oro y Taza Presidencial 2025: La caficultora Eloyna de los Ángeles Useche (Mérida) ganó el máximo galardón con puntajes superiores a 90 puntos SCA.',
        'Certificación SCA: Reconocimiento internacional a la calidad sensorial de los granos provenientes de Boconó, Caripe y Santa Cruz de Mora.'
      ],
      image: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?q=80&w=800&auto=format&fit=crop',
      tag: 'Calidad'
    },
    {
      id: 'ron',
      title: 'Ron Venezolano',
      subtitle: 'El Espíritu del Trópico',
      desc: 'El Ron de Venezuela (D.O.C.) es reconocido por su envejecimiento mínimo de dos años, lo que le otorga una complejidad que domina los certámenes de destilados.',
      history: 'El Ron de Venezuela D.O.C. exige un mínimo de dos años de envejecimiento en barricas de roble blanco, sin reposición de mermas (el "impuesto de los ángeles"). El clima del Valle de Aragua y las llanuras de Monagas genera una evaporación acelerada que concentra sabores a vainilla, frutos secos y madera. Marcas como Santa Teresa 1796 y Diplomático son referentes globales de lujo, presentes en las barras más exclusivas de Londres, Nueva York y París.',
      awards: [
        'San Francisco World Spirits Competition (SFWSC): Ron Carúpano ha acumulado más de 100 medallas. Sus etiquetas Carúpano 21 y Reserva Exclusiva ganaron Doble Oro (2024-2025).',
        'Santa Teresa 1796: Medalla de Oro en 2025, manteniendo su racha de victorias en el prestigioso concurso SFWSC.',
        'Premios TAG Global Spirits y Rum & Cachaça Masters (2025): Marcas como Diplomático y Santa Teresa 1796 destacadas por Forbes como algunos de los destilados más exclusivos del mundo.',
        'The Global Luxury Masters: Ron Carúpano recibió títulos de Maestro y Oro en el certamen de 2025.',
        'London Spirits Competition: Venezuela mantiene presencia constante con medallas de Plata y Oro para sus rones añejos, evaluados por calidad, valor y empaque.'
      ],
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop',
      tag: 'Prestigio'
    }
  ];

  return (
    <div className="view-transition flex flex-col gap-12 pt-8 pb-32">
      {/* Hero Section */}
      <section className="px-6 text-center space-y-4">
        <h2 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em]">Lo Nuestro</h2>
        <h3 className="font-serif text-4xl italic leading-tight text-slate-900 dark:text-white tracking-tight">Lo más grandioso de nuestra tierra</h3>
      </section>

      {/* Content Cards */}
      <div className="space-y-20 px-4">
        {items.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-8"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] shadow-none dark:shadow-none border border-black/[0.05] dark:border-white/[0.08]">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-8 left-8">
                <span className="text-[9px] font-black bg-white/90 dark:bg-black/80 text-slate-900 dark:text-white px-5 py-2 rounded-full uppercase tracking-widest backdrop-blur-md border border-white/20 dark:border-white/10 shadow-none">
                  {item.tag}
                </span>
              </div>
            </div>
            
            <div className="px-6 space-y-4">
              <div className="space-y-1">
                <h4 className="font-serif text-3xl text-slate-900 dark:text-white tracking-tight">{item.title}</h4>
                <p className="text-[10px] font-black text-[#4F84C4] dark:text-blue-400 uppercase tracking-widest">{item.subtitle}</p>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {item.desc}
              </p>
              <button 
                onClick={() => setSelectedItem(item)}
                className="flex items-center gap-3 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest group pt-2 active:scale-95 transition-transform"
              >
                Descubrir más <Icons.ChevronRight size={16} className="group-hover:translate-x-1 transition-transform text-[#4F84C4] dark:text-blue-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-white dark:bg-[#05070A] overflow-y-auto p-8"
          >
            <div className="max-w-md mx-auto space-y-12 pb-24">
              <button 
                onClick={() => setSelectedItem(null)}
                className="w-14 h-14 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-8 border border-black/[0.05] dark:border-white/10 active:scale-90 transition-transform shadow-none chip-aurora"
              >
                <Icons.X size={24} className="text-slate-900 dark:text-white" />
              </button>

              <div className="space-y-4">
                <span className="text-[10px] font-black text-[#4F84C4] dark:text-blue-400 uppercase tracking-[0.4em]">{selectedItem.tag}</span>
                <h2 className="font-serif text-5xl text-slate-900 dark:text-white leading-tight tracking-tight">{selectedItem.title}</h2>
              </div>

              <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-none border border-black/[0.05] dark:border-white/10">
                <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Historia y Origen</h3>
                <p className="text-base text-slate-700 dark:text-slate-200 leading-relaxed font-bold">
                  {selectedItem.history}
                </p>
              </div>

              <div className="space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Reconocimientos</h3>
                <div className="space-y-4">
                  {selectedItem.awards.map((award, i) => (
                    <div 
                      key={i} 
                      style={{
                        background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
                        boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                      }}
                      className="flex items-start gap-5 p-6 rounded-[2rem] border border-white/10 shadow-none relative overflow-hidden"
                    >
                      <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 relative z-10 text-yellow-300 chip-aurora">
                        <Icons.Trophy size={20} />
                      </div>
                      <p className="text-sm font-bold text-[#FFFFFF] leading-snug relative z-10">{award}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setSelectedItem(null)}
                className="w-full h-20 rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest text-[10px] active:scale-95 transition-transform shadow-none shadow-black/20 dark:shadow-white/10"
              >
                Volver a Lo Nuestro
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quote Section */}
      <section 
        style={{
          background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
          boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
          borderTop: '1px solid rgba(255, 255, 255, 0.25)',
        }}
        className="px-8 py-16 rounded-[3.5rem] text-center space-y-6 border border-white/10 shadow-none mx-4 relative overflow-hidden"
      >
        <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto relative z-10 chip-aurora">
          <Icons.Sparkles size={24} className="text-[#FFFFFF]" />
        </div>
        <p className="font-serif text-2xl italic text-[#FFFFFF] leading-relaxed tracking-tight relative z-10">
          "Venezuela no es solo recursos; es el aroma del cacao, el cuerpo del café y el alma del ron."
        </p>
        <div className="h-px w-16 bg-white/20 mx-auto relative z-10"></div>
      </section>
    </div>
  );
};
