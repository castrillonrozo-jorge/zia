import Anthropic from "@anthropic-ai/sdk";
import { JARVIS_SYSTEM_PROMPT, FUNCTIONS, AGENT_SPECIALISTS } from "../../src/constants";

// MIDAS — Cerebro con Claude (Anthropic)
// Arquitectura de orquestación real:
//   · Jarvis (orquestador): claude-sonnet-4-6 — razonamiento principal y tool use.
//   · Subagentes especialistas: claude-haiku-4-5 — análisis delegados vía 'consult_agent'.
// El bucle de agentes corre AQUÍ en el servidor: cuando Jarvis delega, esta función
// invoca al especialista, le devuelve el resultado y Jarvis continúa — todo dentro
// de la misma respuesta en streaming. Las funciones de UI (record_transaction, etc.)
// se reenvían al cliente, que es quien ejecuta sobre el estado local.

const ORCHESTRATOR_MODEL = "claude-sonnet-4-6";
const SPECIALIST_MODEL = "claude-haiku-4-5-20251001";
const MAX_AGENT_TURNS = 4;

const AGENT_LABELS: Record<string, string> = {
  pagador: "Agente Pagador",
  ahorrador: "Agente Ahorrador",
  inversor: "Agente Inversor",
  monitoreo: "Agente Vigilante",
  negociador: "Agente Negociador",
  anti_inflacion: "Escudo Anti-Inflación",
  metas: "Agente de Metas",
  recordatorio: "Crono-Gestor",
};

// --- Conversión de esquemas: formato Gemini (heredado) → formato Anthropic ---
function lowercaseSchema(node: any): any {
  if (Array.isArray(node)) return node.map(lowercaseSchema);
  if (node && typeof node === "object") {
    const out: any = {};
    for (const [k, v] of Object.entries(node)) {
      out[k] = k === "type" && typeof v === "string" ? v.toLowerCase() : lowercaseSchema(v);
    }
    return out;
  }
  return node;
}

function buildTools(): Anthropic.Tool[] {
  const clientTools: Anthropic.Tool[] = (FUNCTIONS as any[]).map((f) => ({
    name: f.name,
    description: f.description,
    input_schema: lowercaseSchema(f.parameters),
  }));
  const consultAgent: Anthropic.Tool = {
    name: "consult_agent",
    description:
      "Delega un análisis profundo a un subagente especialista de MIDAS (otra IA real). Úsalo para análisis de gastos, planes de pago, estrategias de inversión o dolarización, proyección de metas, purga de suscripciones o calendario financiero. NO lo uses para preguntas simples ni para registrar transacciones.",
    input_schema: {
      type: "object",
      properties: {
        agent: {
          type: "string",
          enum: Object.keys(AGENT_SPECIALISTS),
          description: "El especialista a consultar",
        },
        task: {
          type: "string",
          description: "Tarea específica con los datos relevantes del usuario incluidos",
        },
      },
      required: ["agent", "task"],
    },
  };
  return [consultAgent, ...clientTools];
}

// --- Traducción del historial: formato del cliente (heredado de Gemini) → Anthropic ---
function translateHistory(geminiMessages: any[]): Anthropic.MessageParam[] {
  const out: Anthropic.MessageParam[] = [];
  let toolIdCounter = 0;
  let lastToolUseId = "";

  for (const m of geminiMessages || []) {
    const role: "user" | "assistant" = m.role === "model" ? "assistant" : "user";
    const blocks: any[] = [];

    for (const part of m.parts || []) {
      if (typeof part.text === "string" && part.text.trim().length > 0) {
        blocks.push({ type: "text", text: part.text });
      } else if (part.functionCall) {
        lastToolUseId = `toolu_midas_${++toolIdCounter}`;
        blocks.push({
          type: "tool_use",
          id: lastToolUseId,
          name: part.functionCall.name,
          input: part.functionCall.args || {},
        });
      } else if (part.functionResponse) {
        blocks.push({
          type: "tool_result",
          tool_use_id: lastToolUseId || `toolu_midas_${++toolIdCounter}`,
          content: JSON.stringify(part.functionResponse.response ?? {}),
        });
      }
    }

    if (blocks.length === 0) continue;

    const prev = out[out.length - 1];
    if (prev && prev.role === role && Array.isArray(prev.content)) {
      (prev.content as any[]).push(...blocks);
    } else {
      out.push({ role, content: blocks });
    }
  }

  // Anthropic exige que el primer mensaje sea del usuario. El historial del
  // cliente siempre arranca con el saludo de Jarvis (assistant), así que
  // anteponemos un turno de usuario sintético para cumplir el contrato.
  if (out.length > 0 && out[0].role === "assistant") {
    out.unshift({
      role: "user",
      content: [{ type: "text", text: "[El usuario abre la aplicación MIDAS]" }],
    });
  }
  return out;
}

// --- Subagente especialista: llamada real e independiente a Claude ---
async function runSpecialist(
  client: Anthropic,
  agent: string,
  task: string,
  userContext: unknown
): Promise<string> {
  const systemPrompt = AGENT_SPECIALISTS[agent];
  if (!systemPrompt) return `Agente '${agent}' no encontrado.`;

  const contextBlock = userContext
    ? `\n\n=== DATOS REALES DEL USUARIO ===\n${JSON.stringify(userContext, null, 2)}`
    : "";

  const msg = await client.messages.create({
    model: SPECIALIST_MODEL,
    max_tokens: 1024,
    system: systemPrompt + contextBlock + "\n\nResponde en español, conciso y con cifras concretas.",
    messages: [{ role: "user", content: task }],
  });

  return msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

// --- Modo respaldo: Gemini (nivel gratuito, sin tarjeta) -------------------
// Se activa solo cuando falta ANTHROPIC_API_KEY pero existe GEMINI_API_KEY.
// El historial del cliente ya viene en formato Gemini (herencia del proyecto
// original), así que aquí se pasa casi tal cual. La delegación a subagentes
// (consult_agent) también funciona: el especialista corre en otra llamada.

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

async function geminiGenerate(key: string, payload: object): Promise<any> {
  const res = await fetch(`${GEMINI_BASE}/${GEMINI_MODEL}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Gemini API ${res.status}: ${detail.slice(0, 300)}`);
  }
  return res.json();
}

async function runSpecialistGemini(
  key: string,
  agent: string,
  task: string,
  userContext: unknown
): Promise<string> {
  const systemPrompt = AGENT_SPECIALISTS[agent];
  if (!systemPrompt) return `Agente '${agent}' no encontrado.`;
  const contextBlock = userContext
    ? `\n\n=== DATOS REALES DEL USUARIO ===\n${JSON.stringify(userContext, null, 2)}`
    : "";
  const data = await geminiGenerate(key, {
    system_instruction: {
      parts: [{ text: systemPrompt + contextBlock + "\n\nResponde en español, conciso y con cifras concretas." }],
    },
    contents: [{ role: "user", parts: [{ text: task }] }],
  });
  const parts = data?.candidates?.[0]?.content?.parts || [];
  return parts.filter((p: any) => typeof p.text === "string").map((p: any) => p.text).join("\n");
}

function runGeminiChat(
  key: string,
  system: string,
  messages: any[],
  userContext: unknown
): Response {
  const contents: any[] = (messages || [])
    .map((m: any) => ({
      role: m.role === "model" ? "model" : "user",
      parts: (m.parts || []).filter(
        (p: any) =>
          (typeof p.text === "string" && p.text.trim().length > 0) ||
          p.functionCall ||
          p.functionResponse
      ),
    }))
    .filter((m: any) => m.parts.length > 0);

  // Gemini también exige que la conversación arranque con el usuario.
  if (contents.length > 0 && contents[0].role === "model") {
    contents.unshift({ role: "user", parts: [{ text: "[El usuario abre la aplicación MIDAS]" }] });
  }

  const consultAgentDecl = {
    name: "consult_agent",
    description:
      "Delega un análisis profundo a un subagente especialista de MIDAS (otra IA real). Úsalo para análisis de gastos, planes de pago, estrategias de inversión o dolarización, proyección de metas, purga de suscripciones o calendario financiero. NO lo uses para preguntas simples ni para registrar transacciones.",
    parameters: {
      type: "OBJECT",
      properties: {
        agent: {
          type: "STRING",
          enum: Object.keys(AGENT_SPECIALISTS),
          description: "El especialista a consultar",
        },
        task: {
          type: "STRING",
          description: "Tarea específica con los datos relevantes del usuario incluidos",
        },
      },
      required: ["agent", "task"],
    },
  };
  const tools = [{ functionDeclarations: [consultAgentDecl, ...(FUNCTIONS as any[])] }];
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      const emit = (payload: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));

      try {
        for (let turn = 0; turn < MAX_AGENT_TURNS; turn++) {
          const data = await geminiGenerate(key, {
            system_instruction: { parts: [{ text: system }] },
            contents,
            tools,
          });
          const parts: any[] = data?.candidates?.[0]?.content?.parts || [];

          const text = parts
            .filter((p) => typeof p.text === "string")
            .map((p) => p.text)
            .join("");
          if (text) emit({ text });

          const calls = parts.filter((p) => p.functionCall);
          if (calls.length === 0) break;

          const specialistCalls = calls.filter((p) => p.functionCall.name === "consult_agent");
          const clientCalls = calls.filter((p) => p.functionCall.name !== "consult_agent");

          if (clientCalls.length > 0) {
            emit({
              text: "",
              functionCalls: clientCalls.map((p) => ({
                name: p.functionCall.name,
                args: p.functionCall.args || {},
              })),
            });
            break;
          }

          contents.push({ role: "model", parts });
          const responseParts: any[] = [];
          for (const call of specialistCalls) {
            const input = (call.functionCall.args || {}) as { agent?: string; task?: string };
            const label = AGENT_LABELS[input.agent || ""] || input.agent;
            emit({ text: `\n\n*🧠 Consultando al ${label}…*\n\n` });
            let analysis: string;
            try {
              analysis = await runSpecialistGemini(key, input.agent || "", input.task || "", userContext);
            } catch (err) {
              analysis = `El especialista no pudo completar el análisis: ${String(err)}`;
            }
            responseParts.push({
              functionResponse: { name: "consult_agent", response: { analysis } },
            });
          }
          contents.push({ role: "user", parts: responseParts });
        }

        emit({ text: "" });
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        emit({ text: `\n\n⚠️ Error del servidor: ${String(err)}` });
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { messages?: any[]; userContext?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!apiKey && !geminiKey) {
    return new Response(
      JSON.stringify({
        error:
          "Falta una clave de IA. Configura ANTHROPIC_API_KEY (Claude) o GEMINI_API_KEY (Gemini, con nivel gratuito) en Netlify: Site configuration → Environment variables.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages, userContext } = body;

  let system = JARVIS_SYSTEM_PROMPT;
  if (userContext) {
    system += `\n\n=== CONTEXTO DEL USUARIO ===\n${JSON.stringify(userContext, null, 2)}\n\nUsa estos datos financieros reales del usuario para dar consejos personalizados. Si su salud financiera está 'En Riesgo' o 'Crítica', propón pasos urgentes. Si es 'Saludable', enfócate en inversión y crecimiento.`;
  }

  // Sin clave de Anthropic pero con clave de Gemini → modo respaldo gratuito.
  if (!apiKey && geminiKey) {
    return runGeminiChat(geminiKey, system, messages || [], userContext);
  }

  const client = new Anthropic({ apiKey });
  const tools = buildTools();
  const anthMessages = translateHistory(messages || []);
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      const emit = (payload: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));

      try {
        for (let turn = 0; turn < MAX_AGENT_TURNS; turn++) {
          const stream = client.messages.stream({
            model: ORCHESTRATOR_MODEL,
            max_tokens: 2048,
            system,
            messages: anthMessages,
            tools,
          });

          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta" &&
              event.delta.text
            ) {
              emit({ text: event.delta.text });
            }
          }

          const final = await stream.finalMessage();
          const toolUses = final.content.filter(
            (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
          );

          if (final.stop_reason !== "tool_use" || toolUses.length === 0) break;

          const specialistCalls = toolUses.filter((t) => t.name === "consult_agent");
          const clientCalls = toolUses.filter((t) => t.name !== "consult_agent");

          // Funciones de UI/estado → las ejecuta el cliente (formato heredado)
          if (clientCalls.length > 0) {
            emit({
              text: "",
              functionCalls: clientCalls.map((t) => ({ name: t.name, args: t.input })),
            });
            break;
          }

          // Delegación real: ejecutar especialistas aquí y devolverle el resultado a Jarvis
          anthMessages.push({ role: "assistant", content: final.content });
          const results: any[] = [];
          for (const call of specialistCalls) {
            const input = call.input as { agent?: string; task?: string };
            const label = AGENT_LABELS[input.agent || ""] || input.agent;
            emit({ text: `\n\n*🧠 Consultando al ${label}…*\n\n` });
            let analysis: string;
            try {
              analysis = await runSpecialist(client, input.agent || "", input.task || "", userContext);
            } catch (err) {
              analysis = `El especialista no pudo completar el análisis: ${String(err)}`;
            }
            results.push({ type: "tool_result", tool_use_id: call.id, content: analysis });
          }
          anthMessages.push({ role: "user", content: results });
          // El bucle continúa: Jarvis integra el análisis y sigue respondiendo.
        }

        emit({ text: "" });
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        emit({ text: `\n\n⚠️ Error del servidor: ${String(err)}` });
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
};
