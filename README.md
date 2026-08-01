# MIDAS — Tesorero personal autónomo

App móvil/web de orquestación financiera para economías inflacionarias de
LatAm. Jarvis (Claude Sonnet) orquesta 8 agentes especialistas reales
(Claude Haiku) bajo un protocolo de autonomía graduada: Sugerir → Aprobar →
Autónomo con límite. La IA propone y narra; el código ejecuta bajo las
reglas del usuario.

## Stack

- React 19 + Vite + Tailwind v4 + Zustand (persist) + motion + recharts
- Cerebro: API de Anthropic vía función serverless (`netlify/functions/chat.mts`)
- Streaming SSE al cliente en formato `{text, functionCalls}`

## Ejecutar en local

1. `npm install`
2. Copia `.env.example` a `.env.local` y pon tu `ANTHROPIC_API_KEY`
3. `npm run dev` (levanta `server.ts`, que reutiliza el mismo handler de Netlify)

## Desplegar

Ver `INSTRUCCIONES-NETLIFY.md` (en español, paso a paso, sin jerga).

## Verificación

- `npx tsc --noEmit` — tipos limpios
- `npx vite build` — build de producción
