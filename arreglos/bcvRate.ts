/**
 * Tasa oficial del BCV, consultada en vivo. Nunca escrita a mano.
 *
 * El BCV no ofrece API pública y su portal bloquea con frecuencia el
 * tráfico desde nubes (Vercel incluida). Por eso la consulta es una
 * CADENA con respaldo: primero bcv.org.ve; si no responde, espejos
 * públicos que republican la misma tasa oficial. La fuente real de cada
 * dato viaja en el campo `fuente` y se muestra en pantalla.
 *
 * Si ninguna fuente responde, devuelve disponible:false — se dice, no
 * se inventa.
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

const CACHE_MS = 30 * 60 * 1000; // El BCV publica una vez al día.

let cache: { valor: Tasa; expira: number } | null = null;

function aNumero(bruto: string): number | undefined {
  // El BCV publica "764,34860000" — coma decimal, sin separador de miles.
  const limpio = bruto.trim().replace(/\./g, '').replace(',', '.');
  const n = Number.parseFloat(limpio);
  return Number.isFinite(n) ? n : undefined;
}

function extraer(html: string, id: string): number | undefined {
  const bloque = new RegExp(
    `id=["']${id}["'][\\s\\S]{0,400}?<strong[^>]*>([^<]+)</strong>`,
    'i',
  ).exec(html);
  return bloque ? aNumero(bloque[1]) : undefined;
}

async function traer(url: string, ms = 6000): Promise<globalThis.Response> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'AgilizApp/1.0' },
    signal: AbortSignal.timeout(ms),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
}

// Fuente 1: la portada del propio BCV (USD y EUR).
async function desdeBCV(): Promise<Tasa> {
  const res = await traer('https://www.bcv.org.ve/', 8000);
  const html = await res.text();
  const usd = extraer(html, 'dolar');
  const eur = extraer(html, 'euro');
  if (!usd) throw new Error('No se pudo leer el valor del dólar');
  const fecha = /Fecha\s*Valor:?\s*([^<\n]+)/i.exec(html);
  return {
    disponible: true,
    usd,
    eur,
    fechaValor: fecha ? fecha[1].trim() : undefined,
    consultadoEn: new Date().toISOString(),
    fuente: 'bcv.org.ve',
  };
}

// Fuente 2: DolarApi (espejo público de la tasa oficial; solo USD).
async function desdeDolarApi(): Promise<Tasa> {
  const res = await traer('https://ve.dolarapi.com/v1/dolares/oficial');
  const data: any = await res.json();
  const usd = Number(data?.promedio ?? data?.venta);
  if (!Number.isFinite(usd) || usd <= 0) throw new Error('Respuesta sin tasa');
  return {
    disponible: true,
    usd,
    fechaValor: data?.fechaActualizacion
      ? String(data.fechaActualizacion).slice(0, 10)
      : undefined,
    consultadoEn: new Date().toISOString(),
    fuente: 'BCV vía dolarapi.com',
  };
}

// Fuente 3: pyDolarVenezuela (espejo público; USD y EUR del monitor BCV).
async function desdePyDolar(): Promise<Tasa> {
  const res = await traer('https://pydolarve.org/api/v1/dollar?page=bcv');
  const data: any = await res.json();
  const monitores = data?.monitors ?? {};
  const usd = Number(monitores?.usd?.price);
  const eur = Number(monitores?.eur?.price);
  if (!Number.isFinite(usd) || usd <= 0) throw new Error('Respuesta sin tasa');
  return {
    disponible: true,
    usd,
    eur: Number.isFinite(eur) && eur > 0 ? eur : undefined,
    fechaValor: data?.datetime?.date ? String(data.datetime.date) : undefined,
    consultadoEn: new Date().toISOString(),
    fuente: 'BCV vía pydolarve.org',
  };
}

export async function obtenerTasaBCV(): Promise<Tasa> {
  if (cache && Date.now() < cache.expira) return cache.valor;

  const errores: string[] = [];
  for (const intento of [desdeBCV, desdeDolarApi, desdePyDolar]) {
    try {
      const valor = await intento();
      cache = { valor, expira: Date.now() + CACHE_MS };
      return valor;
    } catch (err) {
      errores.push(err instanceof Error ? err.message : String(err));
    }
  }

  return {
    disponible: false,
    fuente: 'BCV',
    motivo:
      'Ni el portal del BCV ni los espejos de la tasa oficial respondieron. ' +
      `(${errores.join(' · ').slice(0, 160)})`,
  };
}
