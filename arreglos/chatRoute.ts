/**
 * Ruta /api/chat con los arreglos aplicados.
 *
 * Qué cambia respecto a tu server.ts:
 *  1. La clave sale solo del entorno. Si falta, falla cerrado.
 *  2. Manda el historial de la conversación, no el mensaje suelto.
 *  3. Las herramientas sin integración devuelven { disponible: false }
 *     en vez de un texto inventado, y el modelo lo explica.
 *  4. Cuando el usuario pide datos actuales, se usa googleSearch y se
 *     devuelven las fuentes para pintarlas en la burbuja.
 *
 * Uso en server.ts:
 *   import { chatRoute } from './arreglos/chatRoute';
 *   app.post('/api/chat', chatRoute);
 */

// Tipos estructurales mínimos del handler (req, res). Express ya no está
// instalado; en Vercel la función recibe objetos compatibles con esta forma.
type Request = { body?: any };
type Response = {
  status: (code: number) => Response;
  json: (body: any) => Response;
};

import { GoogleGenAI, Type, type FunctionDeclaration } from '@google/genai';
import { SYSTEM_INSTRUCTION } from './systemInstruction';
import { obtenerTasaBCV } from './bcvRate';

// Verifica en tu consola de Google cuáles tiene habilitados tu proyecto.
// Un id inexistente hace que cada respuesta gaste todos los reintentos.
const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash'];

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

export async function chatRoute(req: Request, res: Response) {
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
  return res.status(503).json({
    error:
      'El asistente no está disponible en este momento. Intenta de nuevo en unos minutos.',
  });
}
