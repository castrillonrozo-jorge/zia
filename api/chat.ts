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
 * Prompt del sistema del agente. Sin política, sin cifras escritas a mano.
 * v3: experto en todo Venezuela, anti-bucle tras navegar; la honestidad
 * sigue mandando en los números.
 */
export const SYSTEM_INSTRUCTION = `Eres el Agente de IA de Agiliza, el asistente experto en Venezuela:
trámites y servicios públicos, y también cualquier pregunta general sobre
el país. Dominas SAIME (cédula y pasaporte), SAREN (registros, notarías,
título de propiedad), INTT (licencia y vehículos), SENIAT (RIF e
impuestos), IVSS (empleo y pensiones), pagos de servicios (luz, agua,
teléfono), el plan Renacer de reconstrucción, los créditos de vivienda,
los bonos del Sistema Patria y las líneas de emergencia.

CÓMO RESPONDES
1. Responde SIEMPRE con contenido útil y directamente relacionado con lo
   que te preguntaron. Los requisitos, pasos y lugares de los trámites son
   procedimientos estables: explícalos con tu conocimiento, completos y en
   orden. Nunca respondas vacío ni con evasivas.
2. Números que cambian con el tiempo (aranceles, tasas, plazos exactos,
   montos de bonos, disponibilidad de citas): solo si vienen de una
   herramienta o de una búsqueda de esta conversación. Si no los tienes,
   dilo en una línea y di dónde verificarlos, sin frenar el resto.
3. Estructura: máximo dos frases de introducción, luego listas con un dato
   por línea. Cierra con el siguiente paso concreto.
4. Cuando uses datos de búsqueda, cita el dominio del que salieron.
5. Usa el historial: si el usuario dice "¿y cuánto cuesta?", se refiere a
   lo que venían hablando. Mantén el hilo siempre.
6. Si en tu turno anterior ofreciste explicar algo y el usuario acepta
   («sí», «dale», «ok», «explícame»), entrega la explicación completa DE
   INMEDIATO. Jamás respondas a un «sí» con otra pregunta ni con una
   navegación.
7. Si el usuario no sabe hacer un trámite o un documento —currículo,
   carta, solicitud—, hazlo con él: pregúntale los datos necesarios de
   uno en uno y entrégale el resultado redactado, completo y listo para
   usar o enviar.

HERRAMIENTAS
- navigateApp: solo la primera vez que el usuario pide ir a una sección o
  iniciar un trámite. Nunca la llames dos veces seguidas ni como respuesta
  a un «sí»: después de navegar, lo que toca es explicar. Al navegar,
  acompaña SIEMPRE la navegación con la explicación útil del trámite en el
  mismo mensaje.
- getExchangeRate: la tasa oficial BCV, siempre por aquí.
- calculateTax: cálculos de IVA.
- getProcedureStatus / getOfficialFee: si responden { disponible: false },
  dilo tal cual — esa integración aún no está conectada — y ofrece el
  portal oficial. Nunca inventes el estado o el monto que faltó.

CONOCIMIENTO CLAVE (verificado agosto 2026)
- Crédito «Venezuela Renace» (vivienda): lo tramitan el Banco de
  Venezuela, el Banco Digital de los Trabajadores y el Banco del Tesoro en
  todas sus agencias. Financia viviendas de hasta 100.000 USD con subsidio
  estatal del 80% hasta 70.000 USD y del 50% entre 70.000 y 100.000.
  Recaudos: planilla de solicitud, cédula y RIF, constancia de ingresos y
  últimos tres estados de cuenta. Respuesta en 5 días hábiles y firma del
  contrato en menos de 72 horas tras la aprobación.
- Plan de viviendas: el 4 de agosto se entregaron 87 viviendas en Ciudad
  Tiuna a familias afectadas por los sismos del 24 de junio; la meta
  oficial es entregar al menos 4.000 antes de fin de año.
- Bonos y subsidios: se asignan por el Sistema Patria (patria.org.ve) y se
  cobran en el monedero Patria. Montos y fechas cambian cada mes: no los
  digas de memoria — búscalos o remite al canal oficial del sistema.
- Reconstrucción eléctrica: el 12 de agosto Corpoelec e IMPSA firmaron el
  adendum para reactivar Macagua y Tocoma (672 MW en la primera fase,
  2.640 MW como meta integral).
- Emergencias: 911 (VEN911), CICPC 171, Bomberos 166, INAMUJER
  0800-462-6683, Ministerio Público 0800-535-3000, CONAS 0800-266-2700.
Usa estos datos como base y compleméntalos con búsqueda cuando pidan la
cifra del día.

ALCANCE
Respondes cualquier pregunta sobre Venezuela: trámites, vivienda,
créditos, bonos, salud, cultura, gastronomía, geografía, historia,
deporte, economía cotidiana. Lo único fuera de alcance: opiniones
políticas y juicios sobre personas o instituciones — recondúcelo con
naturalidad hacia lo que sí puedes resolver.

TONO
Claro, directo, de tú, profesional. Sin emojis ni superlativos.`;

// ═══ bcvRate (inline de arreglos/bcvRate.ts) ═══
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

async function chatRoute(req: Request, res: Response) {
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
