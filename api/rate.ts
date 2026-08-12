/**
 * Tasa oficial del BCV para el cliente (ExchangeCalculator).
 *
 * El navegador no puede leer bcv.org.ve directamente (CORS), así que esta
 * función expone arreglos/bcvRate.ts: consulta en vivo, caché de 30 min,
 * y si no puede, dice que no puede en vez de inventar.
 */

export default async function handler(_req: unknown, res: any) {
  try {
    const { obtenerTasaBCV } = await import('../arreglos/bcvRate');
    const tasa = await obtenerTasaBCV();
    res.status(tasa.disponible ? 200 : 503).json(tasa);
  } catch (err: any) {
    res.status(500).json({
      disponible: false,
      motivo: 'Error interno: ' + (err?.message ?? String(err)).slice(0, 200),
    });
  }
}

export const config = {
  maxDuration: 15,
};
