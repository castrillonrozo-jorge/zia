/**
 * /api/rate — tasa oficial del BCV, función AUTOCONTENIDA para Vercel
 * (el empaquetador no incluye módulos fuera de api/; ver api/chat.ts).
 * FUENTE DE VERDAD: arreglos/bcvRate.ts.
 */

/**
 * Tasa oficial del BCV, consultada en vivo. Nunca escrita a mano.
 *
 * Por qué existe este archivo: el valor que tenías fijo en el código
 * (554,42 Bs/USD y 645,67 Bs/EUR) estaba un 38% y un 37% por debajo del
 * publicado por el BCV el 12/08/2026 (764,3486 y 882,2952). Una cifra fija
 * en un país con esta inflación no envejece: nace vieja.
 *
 * El BCV no ofrece API pública, así que esto lee su portada. Es frágil por
 * definición: si cambian el HTML, deja de parsear. Por eso nunca devuelve
 * un número sin decir de cuándo es, y si falla devuelve disponible:false
 * en vez de inventar.
 */

export type Tasa = {
  disponible: boolean;
  usd?: number;
  eur?: number;
  fechaValor?: string;
  consultadoEn?: string;
  fuente: string;
  motivo?: string;
};

const FUENTE = 'https://www.bcv.org.ve/';
const CACHE_MS = 30 * 60 * 1000; // El BCV publica una vez al día.

let cache: { valor: Tasa; expira: number } | null = null;

function aNumero(bruto: string): number | undefined {
  // El BCV publica "764,34860000" — coma decimal, sin separador de miles.
  const limpio = bruto.trim().replace(/\./g, '').replace(',', '.');
  const n = Number.parseFloat(limpio);
  return Number.isFinite(n) ? n : undefined;
}

function extraer(html: string, id: string): number | undefined {
  // Estructura observada: <div id="dolar"> … <strong> 764,34860000 </strong>
  const bloque = new RegExp(
    `id=["']${id}["'][\\s\\S]{0,400}?<strong[^>]*>([^<]+)</strong>`,
    'i',
  ).exec(html);
  return bloque ? aNumero(bloque[1]) : undefined;
}

export async function obtenerTasaBCV(): Promise<Tasa> {
  if (cache && Date.now() < cache.expira) return cache.valor;

  try {
    const res = await fetch(FUENTE, {
      headers: { 'User-Agent': 'AgilizApp/1.0' },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    const usd = extraer(html, 'dolar');
    const eur = extraer(html, 'euro');

    if (!usd) throw new Error('No se pudo leer el valor del dólar');

    const fecha = /Fecha\s*Valor:?\s*([^<\n]+)/i.exec(html);

    const valor: Tasa = {
      disponible: true,
      usd,
      eur,
      fechaValor: fecha ? fecha[1].trim() : undefined,
      consultadoEn: new Date().toISOString(),
      fuente: FUENTE,
    };

    cache = { valor, expira: Date.now() + CACHE_MS };
    return valor;
  } catch (err) {
    // Si el BCV no responde o cambió el HTML, se dice. No se inventa.
    return {
      disponible: false,
      fuente: FUENTE,
      motivo:
        'No se pudo consultar la tasa oficial del BCV en este momento. ' +
        (err instanceof Error ? err.message : ''),
    };
  }
}

/**
 * Nota operativa: el certificado TLS del BCV ha dado problemas en Node en
 * el pasado. Si ves errores de certificado en producción, la salida correcta
 * NO es desactivar la verificación: es poner un proxy propio que consulte una
 * vez al día y sirva el valor con su fecha. Desactivar TLS en una app que
 * maneja identidad ciudadana es indefendible en una auditoría.
 */

export default async function handler(_req: unknown, res: any) {
  try {
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
