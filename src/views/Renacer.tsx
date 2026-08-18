import React, { useState } from 'react';
import { AppView } from '../types';
import { MOCK_NEWS } from '../data/news';

/**
 * Renacer (disenos/Renacer elaborado.dc.html).
 *
 * El módulo de la reconstrucción tras el doble sismo del 24 de junio:
 * primero lo que el damnificado puede hacer, después lo que puede leer.
 * Un solo acrílico (la cabecera azul); el resto blanco con sombra suave.
 *
 * Cifras con fuente y fecha visibles — cambian cada semana, verificarlas
 * contra la fuente antes de cada presentación:
 *  - 41.624 viviendas evaluadas: 25.325 verde / 9.866 amarillo / 6.433 rojo
 *    (balance Asamblea Nacional, 4 ago 2026)
 *  - 4.000 viviendas comprometidas para 2026; 87 entregadas el 4 ago
 *  - Crédito "Venezuela Renace": BDV, BDT y Banco del Tesoro; hasta
 *    $100.000 con subsidio estatal (80% hasta $70.000, 50% de 70 a 100 mil)
 *    — prensa nacional, 7-11 ago 2026
 */

interface RenacerProps {
  onNavigate: (view: AppView, params?: { newsId?: string | number }) => void;
}

export const Renacer: React.FC<RenacerProps> = ({ onNavigate }) => {
  const [detalle, setDetalle] = useState<'ninguno' | 'vivienda' | 'credito'>('ninguno');

  const noticiasRenacer = MOCK_NEWS.filter((n: any) => n.renacer);

  return (
    <div className="view-transition flex flex-col gap-3 pb-28 pt-2 px-2">
      {/* Cabecera: el único acrílico de la pantalla */}
      <div
        className="rounded-[24px] p-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(140deg, #2F5E9E 0%, #4F84C4 100%)',
          boxShadow: '0 10px 26px rgba(47,94,158,0.28)',
          border: '1px solid rgba(255,255,255,0.16)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 14% 10%, rgba(255,255,255,0.30) 0%, transparent 58%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '44%', background: 'linear-gradient(180deg, rgba(255,255,255,0.13) 0%, transparent 100%)', pointerEvents: 'none' }} />
        <div className="relative flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#7DE8B0' }} />
            <span className="text-[12.5px] font-bold tracking-widest uppercase text-white/90">Plan de reconstrucción</span>
          </div>
          <p className="text-[17.5px] leading-snug text-white font-semibold m-0">
            Reconstrucción tras el doble sismo del 24 de junio
          </p>
          <div className="flex items-baseline gap-2 pt-2 border-t border-white/20">
            <span className="text-[19px] font-extrabold text-white">4.000</span>
            <span className="text-[12.5px] text-white/90">viviendas comprometidas para 2026</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[19px] font-extrabold text-white">87</span>
            <span className="text-[12.5px] text-white/90">entregadas el 4 ago · primeras 240 familias el 20 jul</span>
          </div>
          <span className="text-[12px] text-white/80">Asamblea Nacional y anuncios oficiales · Ago 2026</span>
        </div>
      </div>

      {/* Tu vivienda */}
      <div className="bg-white dark:bg-[#0D1117] rounded-[22px] p-4 shadow-[0_2px_8px_rgba(20,22,28,0.06)] border border-black/5 dark:border-white/10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[16px] font-bold text-slate-900 dark:text-white">Tu vivienda</span>
          <button
            onClick={() => setDetalle(detalle === 'vivienda' ? 'ninguno' : 'vivienda')}
            className="text-[13.5px] font-semibold text-[#2F62A8] dark:text-[#7FB0E4]"
          >
            ¿Cómo consulto mi edificio?
          </button>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 rounded-[13px] px-2.5 py-2 flex flex-col gap-0.5" style={{ background: '#EAF5EE' }}>
            <span className="text-[17px] font-extrabold" style={{ color: '#1F6E4A' }}>25.325</span>
            <span className="text-[12px] leading-tight" style={{ color: '#3A6350' }}>Verde · habitable</span>
          </div>
          <div className="flex-1 rounded-[13px] px-2.5 py-2 flex flex-col gap-0.5" style={{ background: '#FBF3E3' }}>
            <span className="text-[17px] font-extrabold" style={{ color: '#8A6410' }}>9.866</span>
            <span className="text-[12px] leading-tight" style={{ color: '#6E5518' }}>Amarillo · revisión</span>
          </div>
          <div className="flex-1 rounded-[13px] px-2.5 py-2 flex flex-col gap-0.5" style={{ background: '#FBEBEC' }}>
            <span className="text-[17px] font-extrabold" style={{ color: '#C8102E' }}>6.433</span>
            <span className="text-[12px] leading-tight" style={{ color: '#96323F' }}>Rojo · alto riesgo</span>
          </div>
        </div>
        <span className="text-[11.5px] text-slate-400 dark:text-slate-500">
          41.624 viviendas evaluadas · Balance oficial, 4 ago 2026
        </span>
        {detalle === 'vivienda' && (
          <div className="rounded-[14px] px-4 py-3 text-[13px] leading-relaxed bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-black/5 dark:border-white/10">
            El marcaje oficial es la <strong>etiqueta de color colocada en la fachada</strong> de tu edificio
            por los equipos técnicos (sistema de tres colores unificado por el Colegio de Ingenieros y el
            Ejecutivo, jul 2026). La consulta en línea por dirección todavía no existe como servicio
            público — cuando el ente la habilite, se conectará aquí. Si tu edificio no tiene etiqueta,
            solicita la inspección a Protección Civil o a tu alcaldía.
          </div>
        )}
      </div>

      {/* Trámites de la reconstrucción */}
      <div className="flex flex-col gap-2">
        <span className="text-[16px] font-bold text-slate-900 dark:text-white px-1">Trámites de la reconstrucción</span>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onNavigate('id-renewal')}
            className="bg-white dark:bg-[#0D1117] rounded-[17px] p-3 shadow-[0_2px_8px_rgba(20,22,28,0.06)] border border-black/5 dark:border-white/10 flex flex-col gap-1.5 text-left active:scale-[0.97] transition-transform min-h-[92px]"
          >
            <div className="w-[30px] h-[30px] rounded-[10px] flex items-center justify-center" style={{ background: '#E9F0F9' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2F62A8" strokeWidth="1.9"><rect x="3" y="5" width="18" height="14" rx="2.5" /><circle cx="9" cy="11" r="2" /><path d="M6 16c.4-1.7 1.6-2.4 3-2.4s2.6.7 3 2.4M15 10h3" /></svg>
            </div>
            <span className="text-[13.5px] font-bold text-slate-900 dark:text-white leading-tight">Reponer cédula</span>
            <span className="text-[12.5px] font-semibold" style={{ color: '#2F62A8' }}>SAIME</span>
          </button>

          <button
            onClick={() => onNavigate('business-reg')}
            className="bg-white dark:bg-[#0D1117] rounded-[17px] p-3 shadow-[0_2px_8px_rgba(20,22,28,0.06)] border border-black/5 dark:border-white/10 flex flex-col gap-1.5 text-left active:scale-[0.97] transition-transform min-h-[92px]"
          >
            <div className="w-[30px] h-[30px] rounded-[10px] flex items-center justify-center" style={{ background: '#F3EDE7' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8A4B2A" strokeWidth="1.9"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M8.5 13h7" /></svg>
            </div>
            <span className="text-[13.5px] font-bold text-slate-900 dark:text-white leading-tight">Título de propiedad</span>
            <span className="text-[12.5px] font-semibold" style={{ color: '#8A4B2A' }}>SAREN</span>
          </button>

          <button
            onClick={() => setDetalle(detalle === 'credito' ? 'ninguno' : 'credito')}
            className="bg-white dark:bg-[#0D1117] rounded-[17px] p-3 shadow-[0_2px_8px_rgba(20,22,28,0.06)] border border-black/5 dark:border-white/10 flex flex-col gap-1.5 text-left active:scale-[0.97] transition-transform min-h-[92px]"
          >
            <div className="w-[30px] h-[30px] rounded-[10px] flex items-center justify-center" style={{ background: '#E9F2EC' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1F6E4A" strokeWidth="1.9"><path d="M3.5 11L12 4.5l8.5 6.5" /><path d="M5.5 10v10h13V10" /><path d="M10 20v-5.5h4V20" /></svg>
            </div>
            <span className="text-[13.5px] font-bold text-slate-900 dark:text-white leading-tight">Crédito de vivienda</span>
            <span className="text-[12.5px] font-semibold" style={{ color: '#1F6E4A' }}>Banca pública</span>
          </button>
        </div>

        {detalle === 'credito' && (
          <div className="bg-white dark:bg-[#0D1117] rounded-[17px] p-4 shadow-[0_2px_8px_rgba(20,22,28,0.06)] border border-black/5 dark:border-white/10 flex flex-col gap-2.5">
            <span className="text-[15px] font-bold text-slate-900 dark:text-white">Crédito Especial «Venezuela Renace»</span>
            <ul className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-1.5 m-0">
              <li><strong>Dónde:</strong> todas las agencias del Banco de Venezuela, Banco Digital de los Trabajadores (BDT) y Banco del Tesoro.</li>
              <li><strong>Monto:</strong> viviendas de hasta $100.000 — subsidio estatal del 80% hasta $70.000, y del 50% entre $70.000 y $100.000.</li>
              <li><strong>Recaudos:</strong> planilla de solicitud, cédula y RIF, constancia de ingresos o certificación laboral vigente, y los últimos tres estados de cuenta.</li>
              <li><strong>Plazos anunciados:</strong> respuesta en 5 días hábiles y firma del contrato en menos de 72 horas tras la aprobación.</li>
            </ul>
            <span className="text-[11.5px] text-slate-400 dark:text-slate-500">
              Programa para afectados por los sismos del 24 jun · Prensa nacional, 7-11 ago 2026. Confirma condiciones en tu agencia.
            </span>
          </div>
        )}
      </div>

      {/* Renace Venezuela — programa nacional para jóvenes */}
      <div className="bg-white dark:bg-[#0D1117] rounded-[22px] p-4 shadow-[0_2px_8px_rgba(20,22,28,0.06)] border border-black/5 dark:border-white/10 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(140deg, #F7C325 0%, #E8A317 100%)', boxShadow: '0 6px 16px rgba(232,163,23,0.35)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="7" r="3.2" /><path d="M5.5 21c.5-4 3-6.2 6.5-6.2s6 2.2 6.5 6.2" /><path d="M12 2v1.5M18.5 4.5l-1 1M5.5 4.5l1 1" /></svg>
          </div>
          <div className="min-w-0">
            <span className="text-[16px] font-bold text-slate-900 dark:text-white block leading-tight">Renace Venezuela</span>
            <span className="text-[12.5px] text-slate-500 dark:text-slate-400">Programa nacional para jóvenes</span>
          </div>
        </div>
        <button
          onClick={() => window.open('https://renacevenezuela.gob.ve', '_blank')}
          className="w-full py-3.5 rounded-2xl text-white font-black text-[11px] uppercase tracking-[0.2em] active:scale-[0.98] transition-all"
          style={{
            background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
            boxShadow: '0 10px 24px rgba(47, 94, 158, 0.30), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
          }}
        >
          Conocer el programa · renacevenezuela.gob.ve
        </button>
      </div>

      {/* Noticias, al final: primero lo que puedes hacer, después lo que puedes leer */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-baseline justify-between px-1">
          <span className="text-[16px] font-bold text-slate-900 dark:text-white">Noticias</span>
          <button onClick={() => onNavigate('transparency')} className="text-[13.5px] font-semibold text-[#2F62A8] dark:text-[#7FB0E4]">
            Ver todas
          </button>
        </div>
        {noticiasRenacer.map((n) => (
          <button
            key={n.id}
            onClick={() => onNavigate('transparency', { newsId: n.id })}
            className="bg-white dark:bg-[#0D1117] rounded-[17px] p-3 shadow-[0_2px_8px_rgba(20,22,28,0.06)] border border-black/5 dark:border-white/10 flex gap-3 items-center text-left active:scale-[0.98] transition-transform"
          >
            <img src={n.imagenUrl} alt="" className="w-[44px] h-[44px] rounded-[12px] object-cover shrink-0" />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[14px] font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2">{n.titulo}</span>
              <span className="text-[12px] text-slate-400 dark:text-slate-500">{(n as any).fecha ?? ''} · con fuente en la nota</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
