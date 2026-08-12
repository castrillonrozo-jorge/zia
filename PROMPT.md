# Prompt para Claude Code

Copia todo lo que hay debajo de la linea y pegalo en Claude Code, con la
carpeta de AgilizApp abierta. Antes, arrastra la carpeta `codigo/` de este
paquete dentro de tu proyecto y renombrala a `arreglos/`.

---

Estoy preparando el MVP de AgilizApp (React + Vite + Express + Gemini) para
presentarlo a una institucion publica en Venezuela. Un revisor audito el
codigo y dejo los arreglos escritos en la carpeta `arreglos/`. Necesito que
los apliques.

Trabaja **una fase a la vez**. Al terminar cada fase, para, dime que
cambiaste y espera mi confirmacion antes de seguir. No hagas nada que no este
en esta lista, y no me "mejores" de paso cosas que no te pedi.

## Fase 0 — Antes de tocar nada

1. Crea la rama `version-mvp` y trabaja ahi.
2. Lee `arreglos/LEEME.md` completo. Es la lista maestra.
3. Ejecuta `npm run build` y dime si ya falla de entrada.

## Fase 1 — Seguridad (la mas importante)

1. En `vite.config.ts`, elimina el bloque `define` que inyecta
   `process.env.GEMINI_API_KEY`. Ese bloque mete la clave dentro del
   JavaScript que descarga el navegador. Puedes reemplazar el archivo entero
   por `arreglos/vite.config.ts`.
2. En `server.ts`, elimina la clave literal `AIzaSy...`. Fijate que esta
   en una cadena `clientApiKey || "AIzaSy..." || process.env.GEMINI_API_KEY`,
   lo que ademas hace que la variable de entorno nunca se lea.
3. En `src/App.tsx`, elimina `apiKey: customApiKey` del cuerpo de la
   peticion, el estado `customApiKey`, la funcion `saveApiKey` y el panel de
   ajustes de clave. La clave la pone el servidor.
4. Comprueba que `.gitignore` contiene `.env` y `.vercel`.
5. Ejecuta `npm run build` y luego `grep -r "AIzaSy" dist/`. **No debe
   encontrar nada.** Si encuentra algo, no sigas: dime que salio.

## Fase 2 — El chat de IA

1. Mueve la ruta del chat a una funcion serverless:
   - `arreglos/api-chat.ts` -> `api/chat.ts`
   - `arreglos/vercel.json` -> `vercel.json` en la raiz
2. En `server.ts`, elimina la ruta `app.post('/api/chat', ...)` completa y
   el `app.listen(...)`.
3. En `package.json`, deja los scripts como en `arreglos/package.json`:
   `dev` pasa a `vercel dev`, `build` a `vite build` solo. Quita
   `express`, `tsx` y `esbuild` de las dependencias. Ver `arreglos/PACKAGE.md`.
4. En `src/App.tsx`:
   - Elimina el bloque `if (lowerMessage.includes('cv') ...)` que responde
     "Excelente, Jorge Eduardo" a cualquiera.
   - Elimina los manejadores `getExchangeRate` y `getProcedureStatus` que
     devuelven texto fijo ("554.42 VED/USD", "aprobacion en 48 horas").
   - Sustituye `handleSendAiMessage` por el hook `arreglos/useAgentChat.ts`,
     que manda el historial de la conversacion.
5. Renderiza las fuentes (`sources`) debajo de cada respuesta del agente.

**Contexto de por que:** hoy el servidor manda `contents: message` (solo el
mensaje actual), asi que el agente no recuerda nada. Es el fallo mas grave.

## Fase 3 — Datos falsos

Aplica la tabla "Borrar a mano" de `arreglos/LEEME.md`:

- `src/data/news.ts`: elimina las entradas con id `not_real_2` y `not_real_3`.
- `src/views/Transparency.tsx`: elimina las insignias "Verificado 2026",
  "Auditoria 100%" y "Latency: 24ms". Si una cifra no tiene fuente publicada,
  no se muestra.
- `src/views/Login.tsx`: cambia "Seguridad de Nivel Gubernamental" por
  "Prototipo - datos simulados".
- `src/views/Security.tsx`: la copia del boton de panico anuncia GPS y
  contactos de emergencia que no existen. Dejala solo en lo que realmente
  ocurre: llamar a emergencias.
- `src/views/INTT.tsx` linea ~169: elimina "Tasa Petro / Bolivar Soberano".
  El petro ya no esta en uso.
- `src/types.ts`: elimina `onboarding` y `credits` de `AppView`.

## Fase 4 — Limpieza

- Borra de la raiz: `fix_home.ts`, `fix_home2.ts`, `move_insight*.ts`,
  `replace_*.ts`, `remove_insight_action.ts`, `script.ts`, `test-lucide.*`.
- Deja un solo lockfile: `bun.lock` o `package-lock.json`, no los dos.
- En `src/index.css`, `--color-blue-600: #4F84C4` rompe la escala (es mas
  claro que el 500). Corrigelo o renombralo.
- Extrae la interfaz del chat de `App.tsx` a su propio componente. El archivo
  tiene 676 lineas y unas 250 son el chat.

## Fase 5 — Pantallas nuevas

En `disenos/` hay prototipos HTML. **No los copies:** son referencias
visuales. Recrealos en React con Tailwind, siguiendo el vocabulario que ya
usa la app (tarjetas acrilicas, degradado `#3A69A3 -> #4F84C4`, iconos
Lucide, Geist).

Preguntame cual quiero primero. Estan, por orden de valor:

1. `Splash.dc.html` — pantalla de arranque. Doce siglas que convergen con
   estela tricolor y un reloj que se acelera. A pantalla completa (100dvh),
   posiciones en `cqmin` para que escale del SE al Pro Max. El actual dura
   6,2 s; este 3,7 s.
2. `Tour de bienvenida.dc.html` — recorrido de 6 pasos al abrir por primera
   vez. Guardar en `localStorage` para no repetirlo.
3. `Home rediseñada.dc.html` — rejilla de organismos con la sigla grande y
   el momento de vida debajo. Sin la tarjeta que rota cada 3 s.
4. `Renacer elaborado.dc.html` — modulo nuevo de reconstruccion.
5. `Chat de IA preciso.dc.html` — el chat con requisitos en lista, fuente y
   fecha, y boton de accion al final.
6. `Logos y actualización.dc.html` — ficha de identidad del organismo al
   entrar a cada tramite.

## Reglas que no se rompen

1. **Ninguna clave en ningun archivo del proyecto.** Solo entorno.
2. **Ningun dato inventado en pantalla.** Si no hay fuente, se dice que no
   hay. Una negativa honesta es mejor que un numero falso.
3. **Ninguna cifra escrita a mano que cambie con el tiempo.** La tasa del BCV
   se consulta con `arreglos/bcvRate.ts`, que cachea 30 minutos y devuelve
   `disponible: false` cuando no puede leerla.
4. **Nada de contenido politico** en el prompt del sistema ni en la interfaz.
5. Los logos institucionales no se dibujan ni se aproximan: van los archivos
   oficiales, con la linea "Tramite operado por [ORGANISMO] - integracion
   propuesta" debajo.

## Como se que quedo bien

Con la app corriendo, estas cinco:

1. "¿Que necesito para el pasaporte?" y luego "¿y cuanto cuesta?".
   La segunda tiene que saber de que hablo.
2. "¿En que va mi tramite 4471?" -> tiene que decir que no tiene esa
   integracion, no darme un plazo.
3. "¿A como esta el dolar?" -> tiene que coincidir con bcv.org.ve.
4. "Ayudame con mi CV" -> no puede aparecer "Jorge Eduardo".
5. "Llevame a pagar la luz" -> tiene que abrir Pagos.
