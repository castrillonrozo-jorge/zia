import React, { useCallback, useEffect, useState } from 'react';

/**
 * Tour de bienvenida (disenos/Tour de bienvenida.dc.html).
 *
 * Lenguaje visual tipo Dubái: velo claro que apaga la pantalla sin
 * ensuciarla, anillo turquesa que ilumina el elemento real (la sombra se
 * proyecta hacia afuera: lo resaltado queda nítido), y tarjetón azul
 * traslúcido con el texto centrado. Seis pasos como máximo, «Saltar»
 * siempre visible y «Comenzar» en el último.
 *
 * Cada paso apunta a un elemento real vía [data-tour="..."]; si el
 * elemento no existe todavía (p. ej. Renacer), el paso se omite solo.
 */

interface WelcomeTourProps {
  onFinish: () => void;
}

interface Paso {
  target: string;
  titulo: string;
  texto: string;
  radio: number;
  margen: number;
}

const PASOS: Paso[] = [
  {
    target: 'buscar',
    titulo: 'Buscar y avisos',
    texto: 'Escribe lo que necesitas —«pasaporte», «licencia»— y te llevo directo al trámite. La campana avisa de cada cambio de estado, y al lado cambias a modo oscuro.',
    radio: 26,
    margen: 6,
  },
  {
    target: 'tramites',
    titulo: 'Tus trámites',
    texto: 'SAIME, SAREN, INTT, SENIAT y el resto de organismos, cada uno a un toque. Sin colas, sin gestores, sin ir a la oficina.',
    radio: 32,
    margen: 8,
  },
  {
    target: 'pagos',
    titulo: 'Todos tus pagos y transferencias a un solo clic',
    texto: 'Servicios, tributos e impuestos, pago móvil y envíos a otros ciudadanos. Todo desde aquí.',
    radio: 32,
    margen: 6,
  },
  {
    target: 'renacer',
    titulo: 'Renacer',
    texto: 'Consulta el marcaje oficial de tu edificio, sigue el avance de las viviendas y resuelve los trámites: reponer los documentos perdidos, recuperar el título de propiedad y solicitar el crédito de vivienda.',
    radio: 32,
    margen: 6,
  },
  {
    target: 'noticias',
    titulo: 'Últimas noticias',
    texto: 'Novedades de inversión, reconstrucción y acuerdos, cada una con su fecha y su fuente. Toca cualquiera para leer la nota completa.',
    radio: 24,
    margen: 8,
  },
  {
    target: 'ia',
    titulo: 'Agentes de IA',
    texto: 'Especializados en todo sobre Venezuela: leyes, gacetas, requisitos, plazos y costos de cada organismo. Pregunta en tus palabras y ellos te orientan en la gestión completa.',
    radio: 30,
    margen: 8,
  },
  {
    target: 'proteccion',
    titulo: 'Protección',
    texto: 'Botón de pánico que llama al 911, compartir tu ubicación con un toque, denuncias al Ministerio Público y al CICPC, y el Botón Fucsia de atención inmediata a la mujer.',
    radio: 42,
    margen: 8,
  },
];

const TURQUESA = '#5FD9D2';
const VELO = 'rgba(205,216,231,0.7)';

export const WelcomeTour: React.FC<WelcomeTourProps> = ({ onFinish }) => {
  // Solo los pasos cuyo elemento existe en pantalla. Se escanea tras el
  // montaje: al mismo tiempo que este componente se está montando el Home,
  // y en el primer render sus elementos aún no están en el DOM.
  const [pasos, setPasos] = useState<Paso[] | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      const existentes = PASOS.filter((p) => document.querySelector(`[data-tour="${p.target}"]`));
      if (existentes.length === 0) {
        onFinish();
      } else {
        setPasos(existentes);
      }
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [indice, setIndice] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const medir = useCallback(() => {
    const paso = pasos?.[indice];
    if (!paso) return;
    const el = document.querySelector(`[data-tour="${paso.target}"]`);
    if (el) setRect(el.getBoundingClientRect());
  }, [pasos, indice]);

  useEffect(() => {
    const paso = pasos?.[indice];
    if (!paso) return;
    const el = document.querySelector(`[data-tour="${paso.target}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }
    const t = setTimeout(medir, 320);
    window.addEventListener('resize', medir);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', medir);
    };
  }, [indice, pasos, medir]);

  if (!pasos) return null;

  const paso = pasos[indice];
  const esUltimo = indice === pasos.length - 1;

  const x = rect ? rect.left - paso.margen : 0;
  const y = rect ? rect.top - paso.margen : 0;
  const w = rect ? rect.width + paso.margen * 2 : 0;
  const h = rect ? rect.height + paso.margen * 2 : 0;

  // El tarjetón va debajo del hueco si este queda en la mitad superior.
  const tarjetaAbajo = rect ? y + h / 2 < window.innerHeight * 0.5 : true;

  return (
    <div className="fixed inset-0 z-[300]" style={{ pointerEvents: 'none' }}>
      {/* Hueco iluminado: el velo es la sombra proyectada hacia afuera */}
      {rect && (
        <div
          style={{
            position: 'fixed',
            left: x,
            top: y,
            width: w,
            height: h,
            borderRadius: paso.radio,
            border: `3px solid ${TURQUESA}`,
            boxShadow: `0 0 0 9999px ${VELO}, 0 0 0 5px rgba(95,217,210,0.32), 0 10px 30px rgba(47,94,158,0.28)`,
            transition: 'all 320ms cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      )}

      {/* Tarjetón azul traslúcido */}
      {rect && (
        <div
          style={{
            position: 'fixed',
            left: 20,
            right: 20,
            ...(tarjetaAbajo
              ? { top: Math.min(y + h + 24, window.innerHeight - 300) }
              : { bottom: window.innerHeight - y + 24 }),
            borderRadius: 16,
            padding: '22px 24px',
            background: 'rgba(37,93,166,0.86)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            fontFamily: 'Rubik, Geist, sans-serif',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 9,
            transition: 'all 320ms cubic-bezier(0.4,0,0.2,1)',
          }}
          className="max-w-[430px] mx-auto"
        >
          <span style={{ fontSize: 22, fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.005em' }}>
            {paso.titulo}
          </span>
          <span style={{ fontSize: 16, lineHeight: 1.46, color: '#FFFFFF' }}>{paso.texto}</span>
        </div>
      )}

      {/* Barra de control */}
      <div
        className="fixed left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[398px]"
        style={{
          bottom: 'calc(96px + env(safe-area-inset-bottom, 0px))',
          height: 54,
          borderRadius: 27,
          background: 'rgba(255,255,255,0.78)',
          border: '1px solid rgba(20,22,28,0.06)',
          boxShadow: '0 6px 20px rgba(30,52,84,0.12)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px 0 18px',
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={onFinish}
          style={{ background: 'transparent', border: 'none', fontSize: 14.5, fontWeight: 600, color: '#35506F', cursor: 'pointer', padding: 0 }}
        >
          Saltar
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {pasos.map((p, i) => (
            <div
              key={p.target}
              style={{
                width: i === indice ? 18 : 5,
                height: 5,
                borderRadius: 3,
                background: i === indice ? '#2F5E9E' : 'rgba(47,94,158,0.3)',
                transition: 'all 250ms ease',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => setIndice((i) => Math.max(0, i - 1))}
            style={{
              width: 38, height: 38, borderRadius: 19, background: '#FFFFFF', border: 'none',
              boxShadow: '0 2px 8px rgba(30,52,84,0.16)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', padding: 0,
              opacity: indice === 0 ? 0.4 : 1,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2F5E9E" strokeWidth="2.6"><path d="M14.5 5L8 12l6.5 7" /></svg>
          </button>
          {esUltimo ? (
            <button
              onClick={onFinish}
              style={{
                height: 38, padding: '0 18px', borderRadius: 19, background: '#2F5E9E', border: 'none',
                boxShadow: '0 2px 8px rgba(47,94,158,0.35)', fontSize: 14.5, fontWeight: 700,
                color: '#FFFFFF', cursor: 'pointer',
              }}
            >
              Comenzar
            </button>
          ) : (
            <button
              onClick={() => setIndice((i) => Math.min(pasos.length - 1, i + 1))}
              style={{
                width: 38, height: 38, borderRadius: 19, background: '#2F5E9E', border: 'none',
                boxShadow: '0 2px 8px rgba(47,94,158,0.35)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', padding: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.6"><path d="M9.5 5L16 12l-6.5 7" /></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
