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
const MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash', 'gemini-flash-latest'];

// Gemini responde 503/429 en picos de demanda; son fallos transitorios
// que se resuelven reintentando con una pequeña espera antes de saltar
// al siguiente modelo de la lista.
function esErrorTransitorio(err: unknown): boolean {
  const texto = String((err as any)?.message ?? err);
  return (
    texto.includes('503') ||
    texto.includes('429') ||
    texto.includes('overloaded') ||
    texto.includes('high demand') ||
    texto.includes('UNAVAILABLE') ||
    texto.includes('RESOURCE_EXHAUSTED')
  );
}

async function generarConReintento(ai: any, peticion: any, intentos = 2): Promise<any> {
  let ultimo: unknown;
  for (let i = 0; i <= intentos; i++) {
    try {
      return await generarConReintento(ai, peticion);
    } catch (err) {
      ultimo = err;
      if (!esErrorTransitorio(err) || i === intentos) throw err;
      await new Promise((r) => setTimeout(r, 700 * (i + 1)));
    }
  }
  throw ultimo;
}

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
  // Varias claves permitidas: si una agota su cuota o la rechazan por
  // demanda, se intenta con la siguiente sin que el usuario note nada.
  const claves = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
  ].filter((k): k is string => Boolean(k && k.trim()));

  if (claves.length === 0) {
    return res.status(500).json({
      error:
        'Falta GEMINI_API_KEY en el entorno. La clave no debe estar en el código.',
    });
  }

  const { message, history = [], useSearch = false } = req.body ?? {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Falta el mensaje.' });
  }

  const contents = construirContents(history, message);

  // googleSearch y functionDeclarations no conviven en la misma llamada.
  // Estrategia en dos pasadas: la primera SIEMPRE con herramientas (navegar,
  // tasa, IVA); si el modelo no las necesita y la búsqueda está permitida,
  // una segunda pasada con grounding responde con datos frescos y fuentes.
  const config: any = {
    systemInstruction: SYSTEM_INSTRUCTION,
    tools: [{ functionDeclarations: TOOLS }],
  };

  let ultimoError: unknown = null;

  // Cada combinación de clave y modelo es un intento independiente: hacen
  // falta muchos fallos simultáneos de Google para que el chat se quede
  // sin responder.
  const intentos: { clave: string; model: string }[] = [];
  for (const clave of claves) {
    for (const model of MODELS) intentos.push({ clave, model });
  }

  for (const { clave, model } of intentos) {
    const ai = new GoogleGenAI({ apiKey: clave });
    try {
      let response: any = await generarConReintento(ai, {
        model,
        contents,
        config,
      });

      const llamadas = response.functionCalls ?? [];

      // navigateApp la resuelve el cliente: se devuelve como acción.
      // El modelo habla en su vocabulario (saime, pagos, salud…); aquí se
      // traduce a los ids reales de AppView. Y siempre va un texto: si el
      // modelo solo emitió la orden de navegar, el cliente no tendría nada
      // que mostrar y la conversación parecería muerta.
      const nav = llamadas.find((c: any) => c.name === 'navigateApp');
      if (nav) {
        const VISTAS: Record<string, string> = {
          home: 'home', inicio: 'home',
          saime: 'id-renewal', 'id-renewal': 'id-renewal', cedula: 'id-renewal', 'cédula': 'id-renewal', pasaporte: 'id-renewal', identidad: 'id-renewal',
          saren: 'business-reg', 'business-reg': 'business-reg', registro: 'business-reg',
          intt: 'intt', seniat: 'seniat',
          ivss: 'employment', empleo: 'employment', employment: 'employment',
          payments: 'payments', pagos: 'payments',
          wallet: 'wallet', billetera: 'wallet',
          security: 'security', proteccion: 'security', 'protección': 'security', seguridad: 'security',
          health: 'health', salud: 'health',
          renacer: 'renacer', vivienda: 'renacer',
          procedures: 'my-procedures', 'my-procedures': 'my-procedures', tramites: 'my-procedures', 'trámites': 'my-procedures',
          profile: 'profile', perfil: 'profile',
          economy: 'economy', economia: 'economy', 'economía': 'economy',
          transparency: 'transparency', transparencia: 'transparency',
        };
        const solicitada = String(nav.args?.view ?? '').toLowerCase().trim();
        const vista = VISTAS[solicitada] ?? 'home';

        // Si el modelo navegó sin redactar, se le devuelve el resultado de
        // la herramienta y se le pide el texto SIN herramientas (así no
        // puede volver a navegar): el usuario recibe la explicación
        // completa junto con la navegación, nunca una muletilla en bucle.
        let textoNav = (response.text ?? '').trim();
        if (!textoNav) {
          try {
            const turnoNav =
              response.candidates?.[0]?.content ??
              { role: 'model', parts: [{ functionCall: nav }] };
            const seguimiento: any = await generarConReintento(ai, {
              model,
              contents: [
                ...contents,
                turnoNav,
                {
                  role: 'user',
                  parts: [{
                    functionResponse: {
                      name: 'navigateApp',
                      response: {
                        ok: true,
                        vista,
                        instruccion:
                          'Navegación realizada. Redacta ahora la respuesta completa para el usuario: qué encontrará en la sección y los requisitos o pasos del trámite. No llames más herramientas.',
                      },
                    },
                  }],
                },
              ],
              config: { systemInstruction: SYSTEM_INSTRUCTION },
            });
            textoNav = (seguimiento?.text ?? '').trim();
          } catch {
            // cae al texto de respaldo
          }
        }
        return res.json({
          text: textoNav || 'Listo, ya estás en la sección. Dime qué parte del trámite te explico.',
          action: { type: 'navigate', view: vista },
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

        // El turno del modelo debe devolverse TAL CUAL lo envió: sus parts
        // incluyen la thought_signature que Gemini 2.5+ exige recibir de
        // vuelta con cada functionCall. Reconstruirlo a mano la pierde y
        // la API responde 400.
        const turnoModelo =
          response.candidates?.[0]?.content ??
          { role: 'model', parts: llamadas.map((c: any) => ({ functionCall: c })) };

        const conversacion = [
          ...contents,
          turnoModelo,
          { role: 'user', parts: resultados },
        ];

        response = await generarConReintento(ai, {
          model,
          contents: conversacion,
          config,
        });
      }

      // Segunda pasada con búsqueda: para todo lo informativo, con fuentes.
      if (useSearch !== false) {
        try {
          const conBusqueda: any = await generarConReintento(ai, {
            model,
            contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              tools: [{ googleSearch: {} }],
            },
          });
          if (conBusqueda?.text) {
            return res.json({
              text: conBusqueda.text,
              action: null,
              sources: extraerFuentes(conBusqueda),
            });
          }
        } catch {
          // La respuesta de la primera pasada sirve de respaldo.
        }
      }

      return res.json({
        text:
          response.text ||
          'No obtuve una respuesta con contenido esta vez. ¿Puedes reformular la pregunta?',
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
