# Arreglos listos para pegar

La guía paso a paso completa está en pantalla, en `Paso a paso Vercel.dc.html`.
Este archivo es la lista de borrados, para ir tachando.

Tres archivos que puedes copiar a tu proyecto tal cual, más la lista de
borrados que hay que hacer a mano. No pude tocar tu repositorio directamente
—no está conectado—, así que esto es lo más cerca que llego.

## 1. Copiar

Pon la carpeta `arreglos/` dentro de tu proyecto (al lado de `server.ts`).

    arreglos/systemInstruction.ts   el prompt reescrito
    arreglos/chatRoute.ts           la ruta /api/chat corregida
    arreglos/useAgentChat.ts        el hook del chat, con historial
    arreglos/bcvRate.ts             la tasa del BCV consultada en vivo
    arreglos/vite.config.ts         →  reemplaza tu vite.config.ts
    arreglos/package.json           →  copia solo el bloque scripts
    arreglos/api-chat.ts            →  api/chat.ts
    arreglos/vercel.json            →  vercel.json (en la raíz)
    arreglos/PACKAGE.md             qué cambia en los comandos y por qué

En `server.ts`:

    import { chatRoute } from './arreglos/chatRoute';
    app.post('/api/chat', chatRoute);

Y borra la ruta `/api/chat` que tienes ahora, entera.

## 2. Borrar a mano

| Archivo | Qué borrar | Por qué |
|---|---|---|
| `vite.config.ts` | El bloque `define` con `process.env.GEMINI_API_KEY` | **El más importante.** Mete tu clave dentro del JavaScript que descarga el navegador. Al desplegar, la publica |
| `package.json` | `"dev": "tsx server.ts"`, la mitad de esbuild en `"build"`, `"start"` | Arrancan un servidor propio que ya no existe |
| `package.json` | `express`, `tsx`, `esbuild` de las dependencias | Solo servían a ese servidor |
| `src/App.tsx` | `apiKey: customApiKey` y el panel de ajustes de clave | La clave la pone el servidor, no el usuario |
| `server.ts` | La clave `AIzaSy…` del literal | Está expuesta y además tapa `process.env` |
| `server.ts` | El `systemInstruction` viejo completo | Reglas políticas, palabras prohibidas, tasa BCV escrita a mano |
| `src/App.tsx` | El bloque `if (lowerMessage.includes('cv') …)` | Responde «¡Excelente, Jorge Eduardo!» a cualquiera |
| `src/App.tsx` | Los `if (call.name === 'getExchangeRate')` y `getProcedureStatus` | Devuelven datos inventados |
| `src/App.tsx` | El resto de `handleSendAiMessage` | Lo sustituye `useAgentChat` |
| `src/data/news.ts` | Las entradas `not_real_2` y `not_real_3` | Noticias falsas en el carrusel |
| `src/views/Transparency.tsx` | «Verificado 2026», «Auditoría 100%», «Latency: 24ms» | Sellos de verificación sobre datos sin fuente |
| `src/views/Login.tsx` | «Seguridad de Nivel Gubernamental» | No hay autenticación |
| `src/views/INTT.tsx` línea 169 | «Tasa Petro / Bolívar Soberano» | El petro ya no está en uso |
| `src/components/ExchangeCalculator.tsx` | Cualquier tasa escrita a mano | Ver la nota de abajo |
| `src/types.ts` | `onboarding` y `credits` de `AppView` | Vistas que no existen |
| raíz | `fix_home.ts`, `fix_home2.ts`, `move_insight*.ts`, `replace_*.ts`, `remove_insight_action.ts`, `script.ts`, `test-lucide.*` | Parches de un solo uso ya aplicados |
| raíz | `bun.lock` o `package-lock.json` | Dos lockfiles = dos instalaciones distintas |

## 2.b La tasa que tenías fija estaba 38% por debajo

El 12/08/2026 el BCV publicó **764,3486 Bs/USD** y **882,2952 Bs/EUR**.
Tu código decía 554,42 y 645,67 — un 38% y un 37% por debajo, presentados
al ciudadano como «la tasa oficial de hoy».

No cambies esos números por los nuevos: en tres semanas estarán igual de
viejos. Usa `arreglos/bcvRate.ts`, que consulta el portal del BCV, cachea
30 minutos y —cuando no puede— dice que no puede en vez de inventar.

## 3. Revocar la clave
La clave que estaba en `server.ts` queda en el historial de git aunque la
borres del archivo. Revócala en la consola de Google y genera una nueva.
Luego, solo en el entorno:

    GEMINI_API_KEY=...

Y asegúrate de que `.gitignore` tiene `.env` y `.vercel`.

## 4. Antes de la reunión, verifica

- Que la clave NO aparece en `dist/` después de construir:
  `grep -r "AIzaSy" dist/`

- Los ids de modelo de `MODELS` en `chatRoute.ts` contra los que tenga
  habilitados tu proyecto. Un id inexistente gasta todos los reintentos.
- La alícuota `ALICUOTA_IVA` en `chatRoute.ts`.
- Los números de emergencia de `src/views/Security.tsx`.
- Cada cifra de reconstrucción, contra su fuente, ese mismo día.

## 5. Sobre Vercel

Tu `server.ts` es un Express que escucha en un puerto. Vercel no ejecuta eso:
necesita funciones serverless. La adaptación es directa —`chatRoute` ya es un
handler `(req, res)`, que es justo la forma que Vercel espera— pero hay que
mover el archivo a `api/chat.ts` y quitar el `app.listen`. Si conectas el
repositorio lo dejo montado.
