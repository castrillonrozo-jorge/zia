# Qué cambia en package.json y por qué

No lo copies encima del tuyo sin mirar: puede que hayas añadido dependencias
que yo no conozco. Copia solo el bloque `scripts` y quita del bloque
`dependencies` las que aquí no están.

## scripts

| Antes | Ahora | Por qué |
|---|---|---|
| `"dev": "tsx server.ts"` | `"dev": "vercel dev"` | Al mover el chat a `api/chat.ts` y quitar el `app.listen`, `tsx server.ts` arranca y se cierra sin servir nada. `vercel dev` levanta la app y la función juntas, igual que en producción. |
| — | `"dev:ui": "vite"` | Para trabajar solo la interfaz, sin API. Más rápido. |
| `"build": "vite build && esbuild server.ts …"` | `"build": "vite build"` | La mitad de esbuild empaquetaba `server.ts` para un servidor propio. Vercel no lo usa: sobra en cada construcción. |
| `"start": "node dist/server.cjs"` | eliminado | Ya no hay servidor propio que arrancar. |

Para que `npm run dev` funcione necesitas la herramienta de Vercel, una vez:

    npm i -g vercel
    vercel login

La primera vez que ejecutes `npm run dev` te preguntará a qué proyecto
enlazar. Elige el que creaste, y te leerá sus variables de entorno solo.

## dependencies

Fuera `express`: el servidor propio desaparece.
Fuera `tsx`, `esbuild`: solo servían para arrancar y empaquetar ese servidor.

Si al quitarlas algo se rompe, es que quedó código importando express.
Búscalo con `Ctrl + Shift + F` y bórralo.
