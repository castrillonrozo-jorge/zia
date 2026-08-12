import React, { useEffect, useMemo } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

/**
 * Splash "Todo converge, y el reloj se acelera" (disenos/Splash.dc.html).
 *
 * - Primera apertura: secuencia completa (3,7 s) — las doce siglas convergen,
 *   el reloj acelerado, el nombre letra a letra.
 * - Aperturas siguientes: versión corta (1,4 s), con bandera en localStorage.
 * - prefers-reduced-motion: icono y nombre fijos 600 ms, sin animación.
 * - Solo transform/opacity; las siglas se colocan en cqmin para escalar solas.
 */

const ACCENT = '#4F84C4';
const SIGLAS = ['SAIME', 'SAREN', 'INTT', 'SENIAT', 'IVSS', 'SALUD', 'EMPLEO', 'BANCA', 'PAGOS', 'CITAS', 'RIF', 'INTI'];
const RADIOS = [39, 29.7, 36.4, 27.7, 38, 30.8, 39.5, 28.2, 36.9, 30.3, 38.5, 28.7];
const BANDERA = ['#FFCE00', '#2C6FE0', '#DC1B33'];
const VISTO_KEY = 'agiliza_splash_visto';

const KEYFRAMES = `
@keyframes spl-tileIn {
  0%   { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.62); }
  10%  { opacity: 1; transform: translate(var(--dx), var(--dy)) scale(1); }
  63%  { opacity: 1; transform: translate(var(--dx), var(--dy)) scale(1); }
  92%  { opacity: 1; transform: translate(calc(var(--dx) * 0.08), calc(var(--dy) * 0.08)) scale(0.42); }
  100% { opacity: 0; transform: translate(0px, 0px) scale(0.12); }
}
@keyframes spl-trailGrow {
  0%   { opacity: 0; transform: rotate(var(--a)) scaleX(0.1); }
  63%  { opacity: 0; transform: rotate(var(--a)) scaleX(0.12); }
  77%  { opacity: 0.95; transform: rotate(var(--a)) scaleX(0.92); }
  92%  { opacity: 0.75; transform: rotate(var(--a)) scaleX(0.7); }
  100% { opacity: 0; transform: rotate(var(--a)) scaleX(0.2); }
}
@keyframes spl-clockIn {
  0%   { opacity: 0; transform: scale(0.68); }
  58%  { opacity: 1; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes spl-clockOut { 0% { opacity: 1; } 100% { opacity: 0; } }
@keyframes spl-handSpin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(var(--turn)); }
}
@keyframes spl-iconIn {
  0%   { opacity: 0; transform: scale(0.5); }
  58%  { opacity: 1; transform: scale(1.07); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes spl-ringOut {
  0%   { opacity: 0.5; transform: scale(0.86); }
  100% { opacity: 0; transform: scale(2.3); }
}
@keyframes spl-glowIn { 0% { opacity: 0; } 100% { opacity: 1; } }
@keyframes spl-sweepX {
  0%   { transform: translateX(-150%) skewX(-18deg); }
  100% { transform: translateX(320%) skewX(-18deg); }
}
@keyframes spl-charIn {
  0%   { opacity: 0; transform: translateY(15px); filter: blur(7px); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}
@keyframes spl-barFill { 0% { width: 0%; } 100% { width: 100%; } }
`;

type Modo = 'completo' | 'corto' | 'reducido';

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const modo: Modo = useMemo(() => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'reducido';
    }
    if (typeof localStorage !== 'undefined' && localStorage.getItem(VISTO_KEY)) {
      return 'corto';
    }
    return 'completo';
  }, []);

  const total = modo === 'completo' ? 3700 : modo === 'corto' ? 1400 : 600;

  // La versión corta arranca con las siglas ya colapsando: mismos fotogramas,
  // desplazados para que icono y nombre entren casi de inmediato.
  const t = modo === 'completo'
    ? { glow: 2360, ring: 2500, clockIn: 2540, clockOut: 3320, hands: 2600, icon: 2420, sweep: 2620, word: 3160 }
    : { glow: 0, ring: 120, clockIn: -1, clockOut: -1, hands: -1, icon: 80, sweep: 320, word: 480 };

  useEffect(() => {
    try { localStorage.setItem(VISTO_KEY, '1'); } catch { /* modo privado */ }
    const timer = setTimeout(onComplete, total);
    return () => clearTimeout(timer);
  }, [onComplete, total]);

  const animado = modo !== 'reducido';

  return (
    <div
      className="relative w-full h-[100dvh] overflow-hidden"
      style={{ containerType: 'size', background: '#08111F', fontFamily: 'Geist, system-ui, sans-serif' } as React.CSSProperties}
    >
      <style>{KEYFRAMES}</style>

      {/* Luz superior */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 120% 55% at 50% -8%, rgba(120,170,225,0.20) 0%, transparent 62%)' }}
      />

      {/* Halo central */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '50%', top: '43%', width: 460, height: 460, marginLeft: -230, marginTop: -230,
          borderRadius: 230,
          background: 'radial-gradient(circle, rgba(79,132,196,0.34) 0%, rgba(79,132,196,0.09) 42%, transparent 70%)',
          opacity: animado ? undefined : 1,
          animation: animado ? `spl-glowIn 700ms ease-out both ${t.glow}ms` : undefined,
        }}
      />

      {/* Siglas convergiendo con estelas de bandera (solo primera apertura) */}
      {modo === 'completo' && SIGLAS.map((sigla, i) => {
        const deg = -90 + i * 30;
        const rad = (deg * Math.PI) / 180;
        const r = RADIOS[i];
        const color = BANDERA[i % 3];
        return (
          <div
            key={sigla}
            style={{
              position: 'absolute', left: '50%', top: '43%', width: 0, height: 0,
              '--dx': `${(Math.cos(rad) * r).toFixed(2)}cqmin`,
              '--dy': `${(Math.sin(rad) * r).toFixed(2)}cqmin`,
              animation: `spl-tileIn 2500ms cubic-bezier(0.42,0,0.3,1) both ${i * 30}ms`,
            } as React.CSSProperties}
          >
            <div
              style={{
                position: 'absolute', left: 0, top: -5, width: `${(r * 0.62).toFixed(2)}cqmin`, height: 10,
                borderRadius: 5, transformOrigin: '0 50%', pointerEvents: 'none',
                '--a': `${deg}deg`,
                background: `linear-gradient(90deg, ${color} 0%, ${color}C0 22%, rgba(44,111,224,0.55) 56%, rgba(220,27,51,0.28) 80%, transparent 100%)`,
                filter: 'blur(3px)',
                animation: `spl-trailGrow 2500ms cubic-bezier(0.42,0,0.3,1) both ${i * 30}ms`,
              } as React.CSSProperties}
            />
            <div
              style={{
                position: 'absolute', left: -29, top: -29, width: 58, height: 58,
                borderRadius: 17, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.16)', border: `1.5px solid ${color}`,
                boxShadow: `0 0 20px ${color}66, inset 0 1px 2px rgba(255,255,255,0.3)`,
                backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
                color: '#FFFFFF', whiteSpace: 'nowrap',
                transform: `rotate(${i % 2 ? 10 : -10}deg)`,
              }}
            >
              {sigla}
            </div>
          </div>
        );
      })}

      {/* Anillo expansivo */}
      {animado && t.ring >= 0 && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: '50%', top: '43%', width: 92, height: 92, marginLeft: -46, marginTop: -46,
            borderRadius: 26, border: '1.5px solid rgba(140,190,240,0.7)',
            animation: `spl-ringOut 760ms cubic-bezier(0.16,1,0.3,1) both ${t.ring}ms`,
          }}
        />
      )}

      {/* El reloj acelerado (solo primera apertura) */}
      {modo === 'completo' && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: '50%', top: '43%', width: 176, height: 176, marginLeft: -88, marginTop: -88,
            animation: `spl-clockIn 460ms cubic-bezier(0.34,1.35,0.5,1) both ${t.clockIn}ms, spl-clockOut 320ms ease-in both ${t.clockOut}ms`,
          }}
        >
          <div
            style={{
              position: 'absolute', inset: 6, borderRadius: 82,
              border: '1.5px solid rgba(255,255,255,0.28)',
              boxShadow: '0 0 30px rgba(120,175,235,0.28)',
            }}
          />
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute', left: '50%', top: '50%', width: 1.5,
                height: i % 3 === 0 ? 11 : 6, marginLeft: -0.75,
                background: i % 3 === 0 ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.4)',
                transformOrigin: '50% 0', transform: `rotate(${i * 30}deg) translateY(-80px)`,
              }}
            />
          ))}
          <div
            style={{
              position: 'absolute', left: '50%', top: '50%', width: 2.5, height: 66,
              marginLeft: -1.25, borderRadius: 2, background: 'rgba(255,255,255,0.92)',
              boxShadow: '0 0 10px rgba(180,215,255,0.8)', transformOrigin: '50% 100%',
              marginTop: -66, '--turn': '1140deg',
              animation: `spl-handSpin 900ms cubic-bezier(0.1,0.85,0.2,1) both ${t.hands}ms`,
            } as React.CSSProperties}
          />
          <div
            style={{
              position: 'absolute', left: '50%', top: '50%', width: 3, height: 46,
              marginLeft: -1.5, borderRadius: 2, background: 'rgba(255,255,255,0.75)',
              boxShadow: '0 0 8px rgba(180,215,255,0.6)', transformOrigin: '50% 100%',
              marginTop: -46, '--turn': '660deg',
              animation: `spl-handSpin 900ms cubic-bezier(0.1,0.85,0.2,1) both ${t.hands}ms`,
            } as React.CSSProperties}
          />
          <div
            style={{
              position: 'absolute', left: '50%', top: '50%', width: 7, height: 7,
              marginLeft: -3.5, marginTop: -3.5, borderRadius: 4, background: '#FFFFFF',
            }}
          />
        </div>
      )}

      {/* Icono de la app */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: '50%', top: '43%', width: 88, height: 88, marginLeft: -44, marginTop: -44,
          borderRadius: 25,
          background: `linear-gradient(155deg, #6FA3DC 0%, ${ACCENT} 38%, #2A5490 100%)`,
          boxShadow: '0 18px 44px rgba(20,60,120,0.55), inset 0 1.5px 2px rgba(255,255,255,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: animado ? `spl-iconIn 420ms cubic-bezier(0.34,1.4,0.5,1) both ${t.icon}ms` : undefined,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 24% 16%, rgba(255,255,255,0.4) 0%, transparent 58%)' }}
        />
        <span
          style={{
            position: 'relative', fontSize: 46, fontWeight: 800, letterSpacing: '-0.04em',
            color: '#FFFFFF', lineHeight: 1, textShadow: '0 1px 3px rgba(20,60,120,0.4)',
          }}
        >
          A
        </span>
        {animado && (
          <div
            style={{
              position: 'absolute', top: -20, bottom: -20, left: 0, width: 34,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
              animation: `spl-sweepX 620ms cubic-bezier(0.4,0,0.2,1) both ${t.sweep}ms`,
            }}
          />
        )}
      </div>

      {/* El nombre, letra a letra */}
      <div
        className="absolute left-0 right-0 text-center"
        style={{ top: '43%', marginTop: 76, fontSize: 33, fontWeight: 700, letterSpacing: '-0.025em' }}
      >
        {'Agiliza'.split('').map((letra, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              color: i < 4 ? '#FFFFFF' : ACCENT,
              animation: animado ? `spl-charIn 420ms cubic-bezier(0.16,1,0.3,1) both ${t.word + i * 24}ms` : undefined,
            }}
          >
            {letra}
          </span>
        ))}
      </div>

      {/* Barra de progreso */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: '50%', bottom: 'calc(56px + env(safe-area-inset-bottom, 0px))', width: 108, height: 2,
          marginLeft: -54, borderRadius: 1, background: 'rgba(255,255,255,0.12)',
        }}
      >
        <div
          style={{
            height: '100%', background: 'rgba(255,255,255,0.5)', borderRadius: 1,
            width: animado ? undefined : '100%',
            animation: animado ? `spl-barFill ${total}ms cubic-bezier(0.5,0,0.2,1) both` : undefined,
          }}
        />
      </div>
    </div>
  );
};
