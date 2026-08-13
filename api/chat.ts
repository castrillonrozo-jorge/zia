/**
 * /api/chat — función AUTOCONTENIDA para Vercel.
 *
 * Antes importaba desde ../arreglos/, pero el empaquetador de Vercel no
 * incluye módulos TS fuera de api/ en proyectos ESM: en producción fallaba
 * con "Cannot find module '/var/task/arreglos/chatRoute'". Por eso el
 * código del servidor vive aquí completo.
 *
 * FUENTE DE VERDAD: arreglos/chatRoute.ts, arreglos/systemInstruction.ts
 * y arreglos/bcvRate.ts. Si cambias algo allí, re-ensambla este archivo.
 */

import { GoogleGenAI, Type, type FunctionDeclaration } from '@google/genai';

// ═══ systemInstruction (inline de arreglos/systemInstruction.ts) ═══
/**
 * Reemplaza el systemInstruction que hoy vive dentro de server.ts.
 * Sin política, sin cifras con fecha, sin palabras prohibidas.
 */
export const SYSTEM_INSTRUCTION = `Eres el agente de trámites de Agiliza. Ayudas a ciudadanos venezolanos
a resolver gestiones públicas: qué necesitan, dónde se hace y qué sigue.

PRECISIÓN — estas cuatro reglas mandan sobre cualquier otra:

1. Nunca afirmes un monto, arancel, tasa, plazo, horario o dirección que no
   venga de una herramienta o de una búsqueda de esta misma conversación.
   Si no lo tienes, dilo con esas palabras: "no tengo ese dato conectado
   todavía". Nunca lo estimes, nunca lo redondees, nunca lo supongas.

2. Cita siempre de dónde sale lo que dices: dominio oficial y fecha de
   consulta. Sin fuente, no es una respuesta: es una suposición.

3. Responde en estructura, no en párrafos. Requisitos en lista, un dato por
   línea, máximo tres frases de introducción.

4. Termina siempre ofreciendo la acción concreta que sigue, y usa navigateApp
   para llevar al usuario ahí dentro de la app.

HERRAMIENTAS
- navigateApp: úsala siempre que el usuario quiera llegar a algún sitio.
- calculateTax: úsala para cálculos de IVA o ISLR.
- Si una herramienta responde { disponible: false }, explícale al usuario que
  esa integración todavía no está conectada, di qué organismo la opera y
  ofrécele abrir el portal oficial. No inventes el dato que faltó.

ALCANCE
Solo trámites, servicios públicos y gestiones. Si te preguntan de política,
opinión sobre autoridades o temas fuera del ámbito, dilo con naturalidad y
reconduce a lo que sí puedes resolver. No emites juicios sobre personas,
instituciones ni situaciones del país.

TONO
Claro y directo, de tú. Sin adjetivos de campaña, sin superlativos, sin
emojis. Escribes como escribe un buen funcionario que quiere que el ciudadano
resuelva rápido.`;

// ═══ bcvRate (inline de arreglos/bcvRate.ts) ═══
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

// ═══ chatRoute (inline de arreglos/chatRoute.ts) ═══
// Tipos estructurales mínimos del handler (req, res). Express ya no está
// instalado; en Vercel la función recibe objetos compatibles con esta forma.
type Request = { body?: any };
type Response = {
  status: (code: number) => Response;
  json: (body: any) => Response;
};


// Verifica en tu consola de Google cuáles tiene habilitados tu proyecto.
// Un id inexistente hace que cada respuesta gaste todos los reintentos.
const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];

const MAX_TURNOS = 10;

const navigateAppTool: FunctionDeclaration = {
  name: 'navigateApp',
  description: 'Navega a una sección de la aplicación.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      view: {
        type: Type.STRING,
        description:
          'Vista destino: home, saime, saren, intt, seniat, ivss, payments, wallet, security, health, employment, renacer, procedures, profile.',
      },
    },
    required: ['view'],
  },
};

const calculateTaxTool: FunctionDeclaration = {
  name: 'calculateTax',
  description: 'Calcula IVA o ISLR sobre un monto en bolívares.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      amount: { type: Type.NUMBER, description: 'Monto base en bolívares.' },
      taxType: { type: Type.STRING, description: 'IVA o ISLR.' },
    },
    required: ['amount', 'taxType'],
  },
};

const getProcedureStatusTool: FunctionDeclaration = {
  name: 'getProcedureStatus',
  description:
    'Consulta el estado real de un trámite en el organismo que lo opera.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      procedureId: { type: Type.STRING, description: 'Número de trámite.' },
      organismo: { type: Type.STRING, description: 'SAIME, SAREN, INTT…' },
    },
    required: ['procedureId'],
  },
};

const getOfficialFeeTool: FunctionDeclaration = {
  name: 'getOfficialFee',
  description: 'Consulta el arancel oficial vigente de un trámite.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      tramite: { type: Type.STRING, description: 'Nombre del trámite.' },
      organismo: { type: Type.STRING, description: 'Organismo que lo cobra.' },
    },
    required: ['tramite'],
  },
};

const getExchangeRateTool: FunctionDeclaration = {
  name: 'getExchangeRate',
  description:
    'Consulta la tasa de cambio oficial vigente publicada por el BCV.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      currency: { type: Type.STRING, description: 'USD o EUR. Por defecto USD.' },
    },
  },
};

const TOOLS = [
  navigateAppTool,
  calculateTaxTool,
  getExchangeRateTool,
  getProcedureStatusTool,
  getOfficialFeeTool,
];

const ALICUOTA_IVA = 0.16; // Verifica la vigente antes de la demo.

/**
 * Aquí es donde una herramienta dice la verdad.
 * Mientras no haya integración, devuelve disponible:false con el organismo
 * responsable, y el modelo lo convierte en una frase honesta.
 */
async function ejecutarHerramienta(name: string, args: Record<string, any>) {
  switch (name) {
    case 'getExchangeRate': {
      const tasa = await obtenerTasaBCV();
      if (!tasa.disponible) return tasa;
      const moneda = String(args.currency || 'USD').toUpperCase();
      return {
        disponible: true,
        moneda,
        valor: moneda === 'EUR' ? tasa.eur : tasa.usd,
        fechaValor: tasa.fechaValor,
        fuente: tasa.fuente,
      };
    }

    case 'calculateTax': {
      const monto = Number(args.amount) || 0;
      const tipo = String(args.taxType || 'IVA').toUpperCase();
      if (tipo === 'IVA') {
        const impuesto = monto * ALICUOTA_IVA;
        return {
          disponible: true,
          tipo,
          base: monto,
          alicuota: ALICUOTA_IVA,
          impuesto,
          total: monto + impuesto,
        };
      }
      return {
        disponible: false,
        motivo:
          'El ISLR depende de la tabla de unidades tributarias vigente, que aún no está conectada.',
        organismo: 'SENIAT',
      };
    }

    case 'getProcedureStatus':
      return {
        disponible: false,
        motivo: 'Todavía no hay integración con el sistema de expedientes.',
        organismo: String(args.organismo || 'el organismo competente'),
      };

    case 'getOfficialFee':
      return {
        disponible: false,
        motivo: 'Todavía no hay integración con el tarifario oficial.',
        organismo: String(args.organismo || 'el organismo competente'),
      };

    default:
      return { disponible: false, motivo: 'Herramienta desconocida.' };
  }
}

type Turno = { role: 'user' | 'ai'; text: string };

function construirContents(history: Turno[], message: string) {
  const recientes = (history || []).slice(-MAX_TURNOS);
  const contents = recientes.map((t) => ({
    role: t.role === 'ai' ? 'model' : 'user',
    parts: [{ text: t.text }],
  }));
  contents.push({ role: 'user', parts: [{ text: message }] });
  return contents;
}

function extraerFuentes(response: any) {
  const chunks =
    response?.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
  const vistas = new Set<string>();
  const fuentes: { titulo: string; url: string }[] = [];
  for (const c of chunks) {
    const url = c?.web?.uri;
    if (!url || vistas.has(url)) continue;
    vistas.add(url);
    fuentes.push({ titulo: c.web.title || url, url });
  }
  return fuentes;
}

async function chatRoute(req: Request, res: Response) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error:
        'Falta GEMINI_API_KEY en el entorno. La clave no debe estar en el código.',
    });
  }

  const { message, history = [], useSearch = false } = req.body ?? {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Falta el mensaje.' });
  }

  const ai = new GoogleGenAI({ apiKey });
  const contents = construirContents(history, message);

  // googleSearch y functionDeclarations no conviven en la misma llamada:
  // el cliente decide con useSearch si esta consulta necesita datos actuales.
  const config: any = {
    systemInstruction: SYSTEM_INSTRUCTION,
    tools: useSearch ? [{ googleSearch: {} }] : [{ functionDeclarations: TOOLS }],
  };

  let ultimoError: unknown = null;

  for (const model of MODELS) {
    try {
      let response: any = await ai.models.generateContent({
        model,
        contents,
        config,
      });

      const llamadas = response.functionCalls ?? [];

      // navigateApp la resuelve el cliente: se devuelve como acción.
      const nav = llamadas.find((c: any) => c.name === 'navigateApp');
      if (nav) {
        return res.json({
          text: response.text ?? '',
          action: { type: 'navigate', view: nav.args?.view },
          sources: [],
        });
      }

      // El resto se ejecutan aquí y se devuelven al modelo para que redacte.
      if (llamadas.length > 0) {
        const resultados = await Promise.all(
          llamadas.map(async (c: any) => ({
            functionResponse: {
              name: c.name,
              response: await ejecutarHerramienta(c.name, c.args ?? {}),
            },
          })),
        );

        const conversacion = [
          ...contents,
          { role: 'model', parts: llamadas.map((c: any) => ({ functionCall: c })) },
          { role: 'user', parts: resultados },
        ];

        response = await ai.models.generateContent({
          model,
          contents: conversacion,
          config,
        });
      }

      return res.json({
        text: response.text ?? '',
        action: null,
        sources: extraerFuentes(response),
      });
    } catch (err) {
      ultimoError = err;
      // Modelo no disponible o cuota agotada: prueba el siguiente.
    }
  }

  console.error('[chat] fallaron todos los modelos', ultimoError);
  const detalle =
    ultimoError instanceof Error ? ultimoError.message.slice(0, 180) : '';
  return res.status(503).json({
    error:
      'El asistente no está disponible en este momento. Intenta de nuevo en unos minutos.' +
      (detalle ? ` (detalle técnico: ${detalle})` : ''),
  });
}

export default async function handler(req: any, res: any) {
  try {
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
