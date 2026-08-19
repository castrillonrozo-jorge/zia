/**
 * Hook del chat con historial. Sustituye a handleSendAiMessage en App.tsx.
 *
 * Qué cambia:
 *  1. Guarda los turnos y los manda al servidor: el agente recuerda.
 *  2. Se eliminó el atajo del currículum y las respuestas fijas de
 *     tasa de cambio y estado de trámite.
 *  3. Recibe y expone las fuentes para pintarlas bajo la respuesta.
 *
 * Uso:
 *   const chat = useAgentChat({ onNavigate: handleNavigate });
 *   chat.send('¿qué necesito para el pasaporte?');
 */

import { useCallback, useRef, useState } from 'react';
import { buscarRespuestaLocal } from '../src/data/baseConocimiento';

export type Fuente = { titulo: string; url: string };

export type Mensaje = {
  role: 'user' | 'ai';
  text: string;
  sources?: Fuente[];
  /** 'local' = respondió la base de conocimiento del propio dispositivo. */
  origen?: 'ia' | 'local';
};

type Opciones = {
  onNavigate?: (view: string) => void;
  endpoint?: string;
  /** Fuerza que todas las respuestas salgan de la base local. */
  modoLocal?: boolean;
};

/** Más allá de esto, la espera se vuelve incómoda en una demostración. */
const TIEMPO_MAXIMO_MS = 12000;

export function useAgentChat({
  onNavigate,
  endpoint = '/api/chat',
  modoLocal = false,
}: Opciones = {}) {
  const [messages, setMessages] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const enVuelo = useRef(false);

  const send = useCallback(
    async (texto: string, opciones?: { useSearch?: boolean }) => {
      const mensaje = texto.trim();
      if (!mensaje || enVuelo.current) return;

      enVuelo.current = true;
      setError(null);
      setLoading(true);

      // El historial se congela ANTES de añadir el turno nuevo.
      const historial = messages.map((m) => ({ role: m.role, text: m.text }));
      setMessages((prev) => [...prev, { role: 'user', text: mensaje }]);

      // Red de seguridad: si la IA remota falla o tarda demasiado, responde
      // la base de conocimiento del dispositivo. El ciudadano nunca se queda
      // sin respuesta por una caída ajena.
      const responderEnLocal = (): boolean => {
        const local = buscarRespuestaLocal(mensaje);
        if (!local) return false;
        setMessages((prev) => [
          ...prev,
          { role: 'ai', text: local.respuesta, sources: [], origen: 'local' },
        ]);
        if (local.vista) onNavigate?.(local.vista);
        return true;
      };

      if (modoLocal) {
        if (!responderEnLocal()) {
          setError(
            'En modo sin conexión solo puedo resolver los trámites cargados en el dispositivo. ' +
            'Desactiva el modo sin conexión para preguntarme cualquier otra cosa.',
          );
        }
        setLoading(false);
        enVuelo.current = false;
        return;
      }

      const corte = new AbortController();
      const reloj = setTimeout(() => corte.abort(), TIEMPO_MAXIMO_MS);

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: corte.signal,
          body: JSON.stringify({
            message: mensaje,
            history: historial,
            useSearch: opciones?.useSearch ?? false,
          }),
        });

        let data: any = null;
        try {
          data = await res.json();
        } catch {
          // El servidor respondió, pero no con JSON: función ausente (404),
          // caída (500) o cortada por tiempo (504).
          if (responderEnLocal()) return;
          setError(
            `El servidor del chat respondió ${res.status} sin datos. ` +
            (res.status === 404
              ? 'La función /api/chat no está desplegada.'
              : res.status === 504
                ? 'La respuesta tardó demasiado y el servidor la cortó.'
                : 'Revisa los Logs del proyecto en Vercel.'),
          );
          return;
        }

        if (!res.ok) {
          if (responderEnLocal()) return;
          setError(data?.error ?? 'No se pudo contactar al asistente.');
          return;
        }

        if (data.text) {
          setMessages((prev) => [
            ...prev,
            { role: 'ai', text: data.text, sources: data.sources ?? [] },
          ]);
        } else if (!data.action) {
          // Respuesta 200 sin texto ni acción: que nunca parezca que murió.
          if (!responderEnLocal()) {
            setError('El asistente respondió sin contenido. Intenta reformular.');
          }
        }

        if (data.action?.type === 'navigate' && data.action.view) {
          onNavigate?.(data.action.view);
        }
      } catch {
        if (!responderEnLocal()) {
          setError('Sin conexión con el asistente. Revisa tu red.');
        }
      } finally {
        clearTimeout(reloj);
        setLoading(false);
        enVuelo.current = false;
      }
    },
    [messages, endpoint, onNavigate, modoLocal],
  );

  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, send, reset };
}
