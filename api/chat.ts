/**
 * Adaptador para Vercel de la ruta /api/chat.
 *
 * El import es dinámico y todo va envuelto en try/catch: si el módulo
 * falla al cargar o algo revienta fuera de los try internos, la función
 * responde JSON con el mensaje real en vez de morir con un 500 vacío
 * imposible de diagnosticar desde el teléfono.
 */

export default async function handler(req: any, res: any) {
  try {
    const { chatRoute } = await import('../arreglos/chatRoute');
    return await chatRoute(req, res);
  } catch (err: any) {
    console.error('[api/chat] error no controlado', err);
    const detalle = (err?.message ?? String(err)).slice(0, 220);
    return res.status(500).json({
      error: `Error interno del chat (detalle técnico: ${detalle})`,
    });
  }
}

export const config = {
  maxDuration: 60, // El modelo puede tardar; el default de 10s se queda corto.
};
