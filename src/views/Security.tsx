import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useVibration } from '../hooks/useVibration';

/**
 * Protección (disenos/Tour de bienvenida.dc.html, sección 02).
 *
 * La única pantalla oscura de la app: otro registro mental, mejor de noche.
 * El Botón Fucsia va primero —es una promesa distinta— y el fucsia no se
 * usa en ningún otro sitio de la app.
 *
 * Servicios y números reales (verificar antes de cada presentación):
 *  911  — VEN911, Sistema Nacional de Respuesta Inmediata
 *  171  — línea de emergencia / CICPC
 *  166  — Bomberos
 *  0800-462-6683 — INAMUJER (0800-MUJERES)
 *  0800-535-3000 — Ministerio Público (denuncias, mp.gob.ve)
 *  0800-266-2700 — CONAS, antiextorsión
 *  FUNVISIS — única fuente sísmica oficial (funvisis.gob.ve)
 */

const SecurityView: React.FC = () => {
  const { vibrate } = useVibration();
  const [sent, setSent] = useState<string | null>(null);
  const [panic, setPanic] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [ubicacion, setUbicacion] = useState<'inactiva' | 'buscando' | 'compartida' | 'error'>('inactiva');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const trigger = (msg: string) => {
    setSent(msg);
    setTimeout(() => setSent(null), 3500);
  };

  const startPanicHold = () => {
    if (panic) return;
    setHoldProgress(0);
    let progress = 0;
    vibrate('medium');
    timerRef.current = setInterval(() => {
      progress += 2; // llega a 100 en 1,5 s
      setHoldProgress(progress);
      if (progress % 20 === 0) vibrate('medium');
      if (progress >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        executePanic();
      }
    }, 30);
  };

  const stopPanicHold = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!panic) setHoldProgress(0);
  };

  const executePanic = () => {
    setPanic(true);
    setHoldProgress(100);
    vibrate('alert');
    setSent('🔴 Abriendo llamada al 911...');
    setTimeout(() => {
      window.open('tel:911', '_blank');
      setPanic(false);
      setHoldProgress(0);
      setSent(null);
    }, 1200);
  };

  // Comparte la ubicación real del dispositivo (GPS del navegador).
  // Si el usuario no da permiso o falla, se dice — no se simula.
  const compartirUbicacion = () => {
    if (!('geolocation' in navigator)) {
      setUbicacion('error');
      trigger('Este dispositivo no permite obtener la ubicación.');
      return;
    }
    setUbicacion('buscando');
    vibrate('medium');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const enlace = `https://maps.google.com/?q=${latitude.toFixed(6)},${longitude.toFixed(6)}`;
        const texto = `Mi ubicación actual (enviada desde Agiliza): ${enlace}`;
        try {
          if (navigator.share) {
            await navigator.share({ title: 'Mi ubicación', text: texto, url: enlace });
          } else {
            await navigator.clipboard.writeText(texto);
            trigger('Enlace de ubicación copiado. Pégalo donde lo necesites.');
          }
          setUbicacion('compartida');
        } catch {
          setUbicacion('inactiva');
        }
      },
      () => {
        setUbicacion('error');
        trigger('No se pudo obtener tu ubicación. Revisa el permiso de GPS.');
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const lineas = [
    {
      id: 'mp',
      nombre: 'Ministerio Público',
      detalle: 'Denuncias · 0800-535-3000',
      accion: () => window.open('tel:08005353000', '_blank'),
    },
    {
      id: 'cicpc',
      nombre: 'CICPC',
      detalle: 'Robo, extorsión, desaparición · 171',
      accion: () => window.open('tel:171', '_blank'),
    },
    {
      id: 'conas',
      nombre: 'CONAS — Antiextorsión',
      detalle: 'Línea directa · 0800-266-2700',
      accion: () => window.open('tel:08002662700', '_blank'),
    },
    {
      id: 'bomberos',
      nombre: 'Bomberos',
      detalle: 'Incendio y rescate · 166',
      accion: () => window.open('tel:166', '_blank'),
    },
    {
      id: 'denuncia-web',
      nombre: 'Denuncia en línea',
      detalle: 'Portal del Ministerio Público',
      accion: () => window.open('http://www.mp.gob.ve/index.php/denuncia/', '_blank'),
      externo: true,
    },
    {
      id: 'funvisis',
      nombre: 'Sismos y réplicas — FUNVISIS',
      detalle: 'La única fuente sísmica oficial',
      accion: () => window.open('http://www.funvisis.gob.ve/', '_blank'),
      externo: true,
    },
  ];

  return (
    <div className="view-transition px-2 pt-2 pb-28">
      {/* Contenedor oscuro: la única pantalla oscura de la app */}
      <div
        className="rounded-[32px] overflow-hidden flex flex-col gap-3 p-4"
        style={{ background: '#0B0E14', minHeight: 'calc(100dvh - 220px)' }}
      >
        {/* Estás protegido */}
        <div
          className="rounded-[26px] p-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #1A1F2B 0%, #0D1117 100%)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: 70, background: 'radial-gradient(circle, rgba(200,16,46,0.22) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div className="relative flex flex-col gap-2">
            <span className="text-[22px] font-bold text-white tracking-tight">Estás protegido</span>
            <span className="text-[14px] leading-relaxed text-white/70">
              Acceso directo a los organismos de seguridad del Estado. Tu ubicación se comparte solo cuando tú lo activas. Toda denuncia es confidencial.
            </span>
          </div>
        </div>

        {/* Aviso de estado */}
        <AnimatePresence>
          {sent && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl px-4 py-3 text-[13px] font-medium"
              style={{ background: 'rgba(52,199,89,0.15)', border: '1px solid rgba(52,199,89,0.3)', color: '#4ADE80' }}
            >
              ✓ {sent}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botón Fucsia — primero, con su propio color */}
        <button
          onClick={() => {
            vibrate('medium');
            trigger('Conectando con INAMUJER · 0800-MUJERES');
            window.open('tel:08004626683', '_blank');
          }}
          className="rounded-[26px] p-5 relative overflow-hidden text-left active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(140deg, #B01A63 0%, #E0349B 100%)', boxShadow: '0 10px 28px rgba(176,26,99,0.4)' }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 14% 10%, rgba(255,255,255,0.28) 0%, transparent 58%)', pointerEvents: 'none' }} />
          <div className="relative flex items-center gap-4">
            <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.9" strokeLinecap="round"><circle cx="12" cy="6.2" r="3.2" /><path d="M8 21l1.4-6.2H7.2L9 10.2h6l1.8 4.6h-2.2L16 21" /></svg>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[18px] font-extrabold text-white tracking-tight">Botón Fucsia</span>
              <span className="text-[14px] text-white/95">Atención a la mujer · INAMUJER · 0800-462-6683</span>
            </div>
          </div>
        </button>

        {/* Botón de pánico — mantener pulsado */}
        <motion.button
          onPointerDown={startPanicHold}
          onPointerUp={stopPanicHold}
          onPointerLeave={stopPanicHold}
          onContextMenu={(e) => e.preventDefault()}
          whileTap={{ scale: 0.97 }}
          className="rounded-[26px] p-5 relative overflow-hidden text-left"
          style={{
            background: panic ? 'linear-gradient(140deg, #FF3B30 0%, #D32F2F 100%)' : 'linear-gradient(140deg, #8A1224 0%, #C8102E 100%)',
            boxShadow: panic ? '0 0 0 6px rgba(255,59,48,0.2), 0 10px 28px rgba(255,59,48,0.45)' : '0 10px 28px rgba(200,16,46,0.36)',
            touchAction: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 14% 10%, rgba(255,255,255,0.26) 0%, transparent 58%)', pointerEvents: 'none' }} />
          {!panic && holdProgress > 0 && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, top: 0, background: 'rgba(0,0,0,0.25)', width: `${holdProgress}%`, transition: 'width 0.05s linear' }} />
          )}
          <div className="relative flex items-center gap-4">
            <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>
              <motion.svg animate={panic ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.8, repeat: Infinity }} width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"><path d="M12 4.5v8" /><path d="M7.4 6.6a7 7 0 109.2 0" /></motion.svg>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[18px] font-extrabold text-white tracking-tight">
                {panic ? 'Llamando al 911...' : 'Botón de pánico'}
              </span>
              <span className="text-[14px] text-white/95">
                {panic ? 'VEN911 · Sistema Nacional de Respuesta Inmediata' : holdProgress > 0 ? 'Sigue presionando...' : 'Mantén pulsado 1,5 s · llama al 911'}
              </span>
            </div>
          </div>
        </motion.button>

        {/* Compartir ubicación real */}
        <button
          onClick={compartirUbicacion}
          className="rounded-[18px] px-4 py-3.5 flex items-center justify-between gap-3 active:scale-[0.98] transition-transform text-left"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-semibold text-white">Compartir mi ubicación</span>
            <span className="text-[13px] text-white/55">
              {ubicacion === 'buscando' ? 'Obteniendo tu posición GPS...' : ubicacion === 'compartida' ? 'Ubicación compartida' : ubicacion === 'error' ? 'Sin acceso al GPS — revisa el permiso' : 'Envía un enlace de mapa a quien tú elijas'}
            </span>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ubicacion === 'error' ? '#F87171' : '#4ADE80'} strokeWidth="2" className={ubicacion === 'buscando' ? 'animate-pulse' : ''}><path d="M12 21s-7-6.1-7-11a7 7 0 1114 0c0 4.9-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
        </button>

        {/* Líneas directas */}
        <span className="text-[13px] font-bold text-white/55 tracking-widest uppercase mt-1 px-1">Denuncias y líneas directas</span>
        <div className="flex flex-col gap-2">
          {lineas.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                vibrate('medium');
                trigger('Conectando con ' + l.nombre);
                l.accion();
              }}
              className="rounded-[18px] px-4 py-3.5 flex items-center justify-between gap-3 active:scale-[0.98] transition-transform text-left"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-semibold text-white">{l.nombre}</span>
                <span className="text-[13px] text-white/55">{l.detalle}</span>
              </div>
              {l.externo ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><path d="M15 3h6v6" /><path d="M10 14L21 3" /></svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" /></svg>
              )}
            </button>
          ))}
        </div>

        <p className="text-[11px] text-white/35 text-center px-4 pt-2 leading-relaxed">
          Números verificados contra fuentes oficiales · Ago 2026. En emergencia real llama siempre al 911.
        </p>
      </div>
    </div>
  );
};

export default SecurityView;
