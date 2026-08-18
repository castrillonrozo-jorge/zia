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
    <div className="view-transition pb-24">
      {/* Contenedor negro pleno: la única pantalla oscura de la app, a lo ancho */}
      <div
        className="rounded-[26px] overflow-hidden flex flex-col gap-3 p-4 relative"
        style={{ background: '#000000', minHeight: 'calc(100dvh - 130px)' }}
      >
        {/* Resplandor rojo superior */}
        <div style={{ position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)', width: 560, height: 340, background: 'radial-gradient(ellipse, rgba(224,32,64,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />

        {/* Estado del escudo */}
        <div className="relative flex justify-center mt-1">
          <span className="flex items-center gap-2 rounded-full px-4 py-1.5" style={{ background: 'rgba(62,217,164,0.10)', border: '1px solid rgba(62,217,164,0.4)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: '#3ED9A4', boxShadow: '0 0 10px rgba(62,217,164,0.9)' }} />
            <span className="text-[10.5px] font-bold uppercase tracking-[0.18em]" style={{ color: '#3ED9A4' }}>Activo</span>
          </span>
        </div>

        {/* Estás protegido */}
        <div className="relative text-center px-4">
          <span className="text-[24px] font-bold text-white tracking-tight block">Estás protegido</span>
          <span className="text-[12.5px] leading-relaxed text-white/55 block mt-2">
            Acceso directo a los organismos de seguridad del Estado. Tu ubicación se comparte solo cuando tú lo activas. Toda denuncia es confidencial.
          </span>
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

        {/* Botón de pánico — círculo central con ondas, mantener pulsado */}
        <div className="relative flex items-center justify-center my-2" style={{ height: 224 }}>
          <span className="absolute rounded-full" style={{ width: 190, height: 190, border: '1px solid rgba(224,32,64,0.5)', animation: 'onda-panico 2.6s ease-out infinite' }} />
          <span className="absolute rounded-full" style={{ width: 190, height: 190, border: '1px solid rgba(224,32,64,0.5)', animation: 'onda-panico 2.6s ease-out infinite 1.3s' }} />
          <motion.button
            onPointerDown={startPanicHold}
            onPointerUp={stopPanicHold}
            onPointerLeave={stopPanicHold}
            onContextMenu={(e) => e.preventDefault()}
            whileTap={{ scale: 0.96 }}
            className="relative rounded-full flex flex-col items-center justify-center gap-2 overflow-hidden"
            style={{
              width: 172,
              height: 172,
              background: panic
                ? 'radial-gradient(circle at 35% 28%, #FF5A78 0%, #E01840 55%, #8E0E28 100%)'
                : 'radial-gradient(circle at 35% 28%, #FF3355 0%, #B80E2E 55%, #6E0819 100%)',
              border: '1px solid rgba(255,255,255,0.18)',
              animation: 'brasa-panico 2.8s ease-in-out infinite',
              touchAction: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {!panic && holdProgress > 0 && (
              <span className="absolute inset-0 rounded-full pointer-events-none" style={{ background: `conic-gradient(rgba(0,0,0,0.35) ${holdProgress * 3.6}deg, transparent 0deg)` }} />
            )}
            <motion.svg animate={panic ? { scale: [1, 1.15, 1] } : {}} transition={{ duration: 0.8, repeat: Infinity }} width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round"><path d="M12 4.5v8" /><path d="M7.4 6.6a7 7 0 109.2 0" /></motion.svg>
            <span className="relative text-[9px] font-extrabold uppercase text-white" style={{ letterSpacing: '0.26em' }}>
              {panic ? 'Llamando al 911' : holdProgress > 0 ? 'Sigue presionando' : 'Mantén pulsado'}
            </span>
            <span className="relative text-[9px] font-semibold text-white/70" style={{ letterSpacing: '0.12em' }}>
              {panic ? 'VEN911 · Respuesta Inmediata' : '1,5 s · llama al 911'}
            </span>
          </motion.button>
        </div>

        {/* Botón Fucsia — su propio color, en vidrio oscuro */}
        <button
          onClick={() => {
            vibrate('medium');
            trigger('Conectando con INAMUJER · 0800-MUJERES');
            window.open('tel:08004626683', '_blank');
          }}
          className="relative w-full rounded-[20px] p-4 flex items-center gap-3.5 text-left active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(120deg, rgba(214,28,120,0.28), rgba(214,28,120,0.08))', border: '1px solid rgba(232,62,150,0.55)' }}
        >
          <div className="w-[46px] h-[46px] rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(232,62,150,0.25)', border: '1px solid rgba(232,62,150,0.6)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF9BCB" strokeWidth="1.9" strokeLinecap="round"><circle cx="12" cy="6.2" r="3.2" /><path d="M8 21l1.4-6.2H7.2L9 10.2h6l1.8 4.6h-2.2L16 21" /></svg>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[15.5px] font-extrabold tracking-tight" style={{ color: '#FFD3E8' }}>Botón Fucsia</span>
            <span className="text-[12px]" style={{ color: 'rgba(255,211,232,0.7)' }}>Atención a la mujer · INAMUJER · 0800-462-6683</span>
          </div>
        </button>

        {/* Compartir ubicación real */}
        <button
          onClick={compartirUbicacion}
          className="w-full rounded-[20px] px-5 py-4 flex items-center justify-between gap-3 active:scale-[0.98] transition-transform text-left"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-semibold text-white">Compartir mi ubicación</span>
            <span className="text-[13px] text-white/55">
              {ubicacion === 'buscando' ? 'Obteniendo tu posición GPS...' : ubicacion === 'compartida' ? 'Ubicación compartida' : ubicacion === 'error' ? 'Sin acceso al GPS — revisa el permiso' : 'Envía un enlace de mapa a quien tú elijas'}
            </span>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={ubicacion === 'error' ? '#F87171' : ubicacion === 'compartida' ? '#3ED9A4' : '#D4AF37'} strokeWidth="2" className={ubicacion === 'buscando' ? 'animate-pulse' : ''}><path d="M12 21s-7-6.1-7-11a7 7 0 1114 0c0 4.9-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
        </button>

        {/* Líneas directas */}
        <span className="text-[12px] font-bold tracking-widest uppercase mt-1 px-1" style={{ color: '#D4AF37' }}>Denuncias y líneas directas</span>
        <div className="flex flex-col gap-2">
          {lineas.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                vibrate('medium');
                trigger('Conectando con ' + l.nombre);
                l.accion();
              }}
              className="w-full rounded-[20px] px-5 py-4 flex items-center justify-between gap-3 active:scale-[0.98] transition-transform text-left"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
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
