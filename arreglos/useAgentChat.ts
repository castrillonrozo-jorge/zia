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

export type Fuente = { titulo: string; url: string };

export type Mensaje = {
  role: 'user' | 'ai';
  text: string;
  sources?: Fuente[];
};

type Opciones = {
  onNavigate?: (view: string) => void;
  endpoint?: string;
};

export function useAgentChat({
  onNavigate,
  endpoint = '/api/chat',
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

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
          // caída (500) o cortada por tiempo (504). Mostrar el código real.
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
          setError(data?.error ?? 'No se pudo contactar al asistente.');
          return;
        }

        if (data.text) {
          setMessages((prev) => [
            ...prev,
            { role: 'ai', text: data.text, sources: data.sources ?? [] },
          ]);
        }

        if (data.action?.type === 'navigate' && data.action.view) {
          onNavigate?.(data.action.view);
        }
      } catch {
        setError('Sin conexión con el asistente. Revisa tu red.');
      } finally {
        setLoading(false);
        enVuelo.current = false;
      }
    },
    [messages, endpoint, onNavigate],
  );

  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, send, reset };
}
