/**
 * GET /api/news — Noticias en vivo desde portales venezolanos (RSS).
 *
 * Igual que /api/rate: el navegador no puede leer los portales
 * directamente (CORS), así que esta función lo hace del lado del
 * servidor. Se intenta una cadena de fuentes en orden — variantes del
 * feed de La Iguana TV y un portal de respaldo — con agente de usuario
 * de navegador real (algunos WAF devuelven una página HTML a los bots).
 * Acepta RSS 2.0 (<item>) y Atom (<entry>). Si ninguna fuente responde,
 * se dice con claridad (disponible: false) y el detalle técnico lista
 * qué falló en cada una — nunca se inventan noticias.
 */

const FUENTES: { nombre: string; url: string }[] = [
  { nombre: 'La Iguana TV', url: 'https://www.laiguana.tv/feed/' },
  { nombre: 'La Iguana TV', url: 'https://www.laiguana.tv/?feed=rss2' },
  { nombre: 'La Iguana TV', url: 'https://laiguana.tv/feed/' },
  { nombre: 'Últimas Noticias', url: 'https://ultimasnoticias.com.ve/feed/' },
];

const UA_NAVEGADOR =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

const CACHE_MS = 20 * 60 * 1000; // 20 minutos
const MAX_NOTICIAS = 6;

interface NoticiaViva {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  imagenUrl: string | null;
  enlace: string;
  fuente: string;
}

let cache: { hora: number; fuente: string; noticias: NoticiaViva[] } | null = null;

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function limpiarTexto(s: string): string {
  return s
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#8211;/g, '–')
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8217;|&#8216;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extraerEtiqueta(bloque: string, etiqueta: string): string {
  const m = bloque.match(new RegExp(`<${etiqueta}[^>]*>([\\s\\S]*?)</${etiqueta}>`, 'i'));
  return m ? m[1] : '';
}

function extraerImagen(bloque: string): string | null {
  const media = bloque.match(/<(?:media:content|media:thumbnail|enclosure)[^>]*url="([^"]+\.(?:jpe?g|png|webp|gif)[^"]*)"/i);
  if (media) return media[1];
  const img = bloque.match(/<img[^>]*src="([^"]+)"/i);
  if (img && /\.(jpe?g|png|webp|gif)/i.test(img[1])) return img[1];
  return null;
}

function formatearFecha(cruda: string): string {
  const d = new Date(cruda);
  if (isNaN(d.getTime())) return '';
  return `${String(d.getUTCDate()).padStart(2, '0')} ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function parsearRss(xml: string, fuente: string): NoticiaViva[] {
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  const noticias: NoticiaViva[] = [];
  for (const item of items) {
    const titulo = limpiarTexto(extraerEtiqueta(item, 'title'));
    const enlace = limpiarTexto(extraerEtiqueta(item, 'link'));
    if (!titulo || !/^https?:/i.test(enlace)) continue;
    const contenido = extraerEtiqueta(item, 'content:encoded') || extraerEtiqueta(item, 'description');
    noticias.push({
      id: 'viva-' + noticias.length + '-' + (enlace.split('/').filter(Boolean).pop() ?? ''),
      titulo,
      descripcion: limpiarTexto(extraerEtiqueta(item, 'description')).slice(0, 220),
      fecha: formatearFecha(limpiarTexto(extraerEtiqueta(item, 'pubDate'))),
      imagenUrl: extraerImagen(item) ?? extraerImagen(contenido),
      enlace,
      fuente,
    });
    if (noticias.length >= MAX_NOTICIAS) break;
  }
  return noticias;
}

function parsearAtom(xml: string, fuente: string): NoticiaViva[] {
  const entradas = xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) ?? [];
  const noticias: NoticiaViva[] = [];
  for (const entrada of entradas) {
    const titulo = limpiarTexto(extraerEtiqueta(entrada, 'title'));
    const enlaceM = entrada.match(/<link[^>]*href="([^"]+)"/i);
    const enlace = enlaceM ? enlaceM[1] : '';
    if (!titulo || !/^https?:/i.test(enlace)) continue;
    const contenido = extraerEtiqueta(entrada, 'content') || extraerEtiqueta(entrada, 'summary');
    noticias.push({
      id: 'viva-' + noticias.length + '-' + (enlace.split('/').filter(Boolean).pop() ?? ''),
      titulo,
      descripcion: limpiarTexto(extraerEtiqueta(entrada, 'summary')).slice(0, 220),
      fecha: formatearFecha(limpiarTexto(extraerEtiqueta(entrada, 'published') || extraerEtiqueta(entrada, 'updated'))),
      imagenUrl: extraerImagen(entrada) ?? extraerImagen(contenido),
      enlace,
      fuente,
    });
    if (noticias.length >= MAX_NOTICIAS) break;
  }
  return noticias;
}

async function leerFuente(fuente: { nombre: string; url: string }): Promise<NoticiaViva[]> {
  const controlador = new AbortController();
  const timeout = setTimeout(() => controlador.abort(), 6000);
  try {
    const res = await fetch(fuente.url, {
      signal: controlador.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': UA_NAVEGADOR,
        Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*;q=0.8',
        'Accept-Language': 'es-VE,es;q=0.9',
      },
    });
    if (!res.ok) throw new Error(`respondió ${res.status}`);
    const cuerpo = await res.text();

    let noticias = parsearRss(cuerpo, fuente.nombre);
    if (noticias.length === 0) noticias = parsearAtom(cuerpo, fuente.nombre);
    if (noticias.length === 0) {
      const esHtml = /<html[\s>]/i.test(cuerpo.slice(0, 2000));
      throw new Error(esHtml ? 'devolvió una página web, no el feed' : `sin ítems legibles (inicio: ${cuerpo.slice(0, 120).replace(/\s+/g, ' ')})`);
    }
    return noticias;
  } finally {
    clearTimeout(timeout);
  }
}

async function obtenerNoticias(): Promise<{ fuente: string; noticias: NoticiaViva[] }> {
  // Todas las fuentes a la vez (6 s de tope cada una) y se elige la
  // primera del orden de prioridad que haya respondido con noticias.
  const intentos = await Promise.allSettled(FUENTES.map((f) => leerFuente(f)));
  const errores: string[] = [];
  for (let i = 0; i < FUENTES.length; i++) {
    const intento = intentos[i];
    if (intento.status === 'fulfilled') {
      return { fuente: FUENTES[i].nombre, noticias: intento.value };
    }
    errores.push(`${FUENTES[i].url}: ${intento.reason?.message ?? String(intento.reason)}`);
  }
  throw new Error(errores.join(' | '));
}

export default async function handler(_req: any, res: any) {
  res.setHeader('Cache-Control', 's-maxage=1200, stale-while-revalidate=600');
  if (cache && Date.now() - cache.hora < CACHE_MS) {
    return res.status(200).json({ disponible: true, fuente: cache.fuente, noticias: cache.noticias });
  }
  try {
    const { fuente, noticias } = await obtenerNoticias();
    cache = { hora: Date.now(), fuente, noticias };
    return res.status(200).json({ disponible: true, fuente, noticias });
  } catch (err: any) {
    if (cache) {
      return res.status(200).json({ disponible: true, fuente: cache.fuente, noticias: cache.noticias });
    }
    return res.status(503).json({
      disponible: false,
      error: 'No se pudo leer ningún portal de noticias en este momento.',
      detalle: err?.message ?? String(err),
    });
  }
}

export const config = { maxDuration: 30 };
