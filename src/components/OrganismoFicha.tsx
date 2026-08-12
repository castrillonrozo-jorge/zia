import React, { useState } from 'react';

/**
 * Ficha de identidad del organismo (disenos/Logos y actualización.dc.html).
 *
 * Patrón único para las vistas de organismos: caja fija neutra de 76 px con
 * el logo oficial en `contain` (normaliza cualquier tamaño y fondo), sigla,
 * nombre completo y la línea de atribución que protege legalmente:
 * «Trámite operado por el X · integración propuesta».
 *
 * Los logos NO se dibujan ni se aproximan (regla 5): se cargan desde
 * /logos/<sigla>.png — archivos oficiales que aporta el dueño (SVG o PNG
 * con transparencia, 512 px mínimo, de los portales oficiales). Mientras
 * el archivo no exista, la caja muestra la sigla como marcador.
 */

interface OrganismoFichaProps {
  sigla: string;
  nombre: string;
}

export const OrganismoFicha: React.FC<OrganismoFichaProps> = ({ sigla, nombre }) => {
  const [logoDisponible, setLogoDisponible] = useState(true);
  const archivo = `/logos/${sigla.toLowerCase()}.png`;

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-white dark:bg-[#0D1117] rounded-[20px] p-4 shadow-[0_2px_8px_rgba(20,22,28,0.06)] border border-black/5 dark:border-white/10 flex items-center gap-4">
        <div className="w-[76px] h-[76px] rounded-[14px] bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
          {logoDisponible ? (
            <img
              src={archivo}
              alt={`Logo ${sigla}`}
              className="w-full h-full object-contain p-2"
              onError={() => setLogoDisponible(false)}
            />
          ) : (
            <span className="text-[13px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">{sigla}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-black tracking-tight text-slate-900 dark:text-white uppercase">{sigla}</p>
          <p className="text-[12px] leading-snug text-slate-500 dark:text-slate-400">{nombre}</p>
        </div>
      </div>
      <p className="text-[12.5px] text-slate-400 dark:text-slate-500 px-2">
        Trámite operado por el {sigla} · integración propuesta
      </p>
    </div>
  );
};
