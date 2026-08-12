/**
 * Tasa oficial del BCV para el cliente (ExchangeCalculator).
 *
 * El navegador no puede leer bcv.org.ve directamente (CORS), así que esta
 * función expone arreglos/bcvRate.ts: consulta en vivo, caché de 30 min,
 * y si no puede, dice que no puede en vez de inventar.
 */

import { obtenerTasaBCV } from '../arreglos/bcvRate';

export default async function handler(_req: unknown, res: any) {
  const tasa = await obtenerTasaBCV();
  res.status(tasa.disponible ? 200 : 503).json(tasa);
}

export const config = {
  maxDuration: 15,
};
