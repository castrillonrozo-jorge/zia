# AgilizApp — proyecto completo con los arreglos

Tu proyecto tal como me lo enviaste, mas todo lo que hicimos.

## Que cambio respecto a tu zip original

Solo dos cosas, y ninguna toca tu codigo:

- **Se añadieron** las carpetas `arreglos/` y `disenos/`, y el archivo
  `PROMPT.md`.
- **Se borraron** los diez scripts de un solo uso de la raiz (`fix_home.ts`,
  `move_insight*.ts`, `replace_*.ts`, `script.ts`, `test-lucide.*`) y la
  carpeta `migrated_prompt_history/`, que pesaba de mas y no se usa.

Tus archivos de `src/`, `server.ts`, `vite.config.ts` y `package.json`
estan **intactos**. Los arreglos hay que aplicarlos: por eso existe el
`PROMPT.md`.

## Por donde empezar

1. Abre `PROMPT.md`, copia todo lo que va despues de la linea horizontal.
2. Abre esta carpeta en Claude Code.
3. Pega el prompt. Va en cinco fases y se detiene al final de cada una.

Si prefieres hacerlo tu a mano, abre en el navegador
`disenos/Paso a paso Vercel.dc.html`: es la guia visual, sin dar nada por
sabido.

## Lo primero de todo, antes de cualquier cosa

Tu clave de Gemini esta expuesta por **dos** caminos a la vez:

1. Escrita a mano en `server.ts`. Ademas, por el orden de la expresion
   `clientApiKey || "AIzaSy..." || process.env.GEMINI_API_KEY`, la variable
   de entorno **nunca se lee**: lo que pongas en Vercel se ignora.
2. `vite.config.ts` tiene un bloque `define` que copia la clave dentro del
   JavaScript que descarga el navegador. Cualquiera que abra la app la ve.

Crea una clave nueva, ponla en Vercel, comprueba que el chat responde, y
recien entonces borra la vieja. El detalle esta en la Fase 1 del prompt.

## Que hay en cada carpeta

    arreglos/    codigo real, se copia tal cual. Empieza por LEEME.md
    disenos/     prototipos HTML. Referencias visuales, no codigo final
    PROMPT.md    el prompt para Claude Code

## Los cinco hallazgos que mas importan

1. **La clave de API**, por los dos caminos de arriba.
2. **El agente no tiene memoria.** El servidor manda `contents: message`,
   solo el mensaje actual. La segunda pregunta de cualquier conversacion
   llega sin la primera.
3. **Datos inventados con sello de verificado.** Noticias con id
   `not_real_2`, cifras de presupuesto bajo una insignia "Verificado 2026",
   y un estado de tramite fijo que siempre dice "48 horas".
4. **La tasa del BCV escrita a mano** (554,42) estaba un 38% por debajo de
   la real el 12/08/2026 (764,3486). Ahora se consulta en vivo.
5. **El boton de panico** anuncia GPS y contactos de emergencia que no
   existen en el codigo. Es el unico con consecuencias fisicas.
