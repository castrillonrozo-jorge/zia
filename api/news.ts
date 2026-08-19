/**
 * GET /api/news — Noticias en vivo desde el feed RSS de La Iguana TV.
 *
 * Igual que /api/rate: el navegador no puede leer el portal directamente
 * (CORS), así que esta función lo hace del lado del servidor, extrae
 * título, enlace, fecha, resumen e imagen de cada nota y responde JSON.
 * Si el feed no responde o cambia de formato, se dice con claridad
 * (disponible: false) — nunca se inventan noticias.
 */

const FEED_URL = 'https://www.laiguana.tv/feed/';
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

let cache: { hora: number; noticias: NoticiaViva[] } | null = null;

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

function extraerEtiqueta(item: string, etiqueta: string): string {
  const m = item.match(new RegExp(`<${etiqueta}[^>]*>([\\s\\S]*?)</${etiqueta}>`, 'i'));
  return m ? m[1] : '';
}

function extraerImagen(item: string): string | null {
  // 1) media:content / enclosure con url de imagen
  const media = item.match(/<(?:media:content|enclosure)[^>]*url="([^"]+\.(?:jpe?g|png|webp|gif)[^"]*)"/i);
  if (media) return media[1];
  // 2) primer <img src="..."> dentro de content:encoded o description
  const img = item.match(/<img[^>]*src="([^"]+)"/i);
  if (img && /\.(jpe?g|png|webp|gif)/i.test(img[1])) return img[1];
  return null;
}

function formatearFecha(pubDate: string): string {
  const d = new Date(pubDate);
  if (isNaN(d.getTime())) return '';
  return `${String(d.getUTCDate()).padStart(2, '0')} ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

async function obtenerNoticias(): Promise<NoticiaViva[]> {
  const controlador = new AbortController();
  const timeout = setTimeout(() => controlador.abort(), 15000);
  try {
    const res = await fetch(FEED_URL, {
      signal: controlador.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AgilizaApp/1.0; lector RSS)',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
    });
    if (!res.ok) throw new Error(`El feed respondió ${res.status}`);
    const xml = await res.text();

    const items = xml.match(/<item>[\s\S]*?<\/item>/gi) ?? [];
    const noticias: NoticiaViva[] = [];
    for (const item of items) {
      const titulo = limpiarTexto(extraerEtiqueta(item, 'title'));
      const enlace = limpiarTexto(extraerEtiqueta(item, 'link'));
      if (!titulo || !enlace) continue;
      const contenido = extraerEtiqueta(item, 'content:encoded') || extraerEtiqueta(item, 'description');
      const descripcion = limpiarTexto(extraerEtiqueta(item, 'description')).slice(0, 220);
      noticias.push({
        id: 'iguana-' + noticias.length + '-' + enlace.split('/').filter(Boolean).pop(),
        titulo,
        descripcion,
        fecha: formatearFecha(limpiarTexto(extraerEtiqueta(item, 'pubDate'))),
        imagenUrl: extraerImagen(item) ?? extraerImagen(contenido),
        enlace,
        fuente: 'La Iguana TV',
      });
      if (noticias.length >= MAX_NOTICIAS) break;
    }
    if (noticias.length === 0) throw new Error('El feed no trajo ninguna noticia legible');
    return noticias;
  } finally {
    clearTimeout(timeout);
  }
}

export default async function handler(_req: any, res: any) {
  res.setHeader('Cache-Control', 's-maxage=1200, stale-while-revalidate=600');
  if (cache && Date.now() - cache.hora < CACHE_MS) {
    return res.status(200).json({ disponible: true, fuente: 'La Iguana TV', noticias: cache.noticias });
  }
  try {
    const noticias = await obtenerNoticias();
    cache = { hora: Date.now(), noticias };
    return res.status(200).json({ disponible: true, fuente: 'La Iguana TV', noticias });
  } catch (err: any) {
    if (cache) {
      return res.status(200).json({ disponible: true, fuente: 'La Iguana TV', noticias: cache.noticias });
    }
    return res.status(503).json({
      disponible: false,
      error: 'No se pudo leer el portal de noticias en este momento.',
      detalle: err?.message ?? String(err),
    });
  }
}

export const config = { maxDuration: 30 };
