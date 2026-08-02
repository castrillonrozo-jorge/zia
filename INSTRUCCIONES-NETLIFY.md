# MIDAS — Cómo publicarla en internet (Netlify)

No necesitas saber programar. Son 3 pasos y unos 15 minutos.

> ⚠️ **Importante:** NO uses la opción de "arrastrar la carpeta" (app.netlify.com/drop).
> Ese método solo sirve para páginas ya construidas y NO despliega el cerebro de
> Jarvis (la función serverless del chat). La app cargaría pero el chat nunca
> respondería. Usa el método de GitHub de abajo: Netlify construye todo solo.

## Paso 1 — Consigue tu clave de IA

Tienes dos opciones; con cualquiera de las dos funciona el chat:

**Opción A — Claude (recomendada, es el cerebro para el que está afinada la app):**

1. Entra a **console.anthropic.com** e inicia sesión.
2. Ve a **Settings → Billing** y carga un poco de crédito prepago (~$5 alcanza
   de sobra para probar; cada conversación cuesta centavos).
   *Ojo: el plan de claude.ai (Max/Pro) NO sirve para la API; son cuentas distintas.*
3. Ve a **API Keys → Create API key**, copia la clave (texto largo tipo
   `sk-ant-...`) y guárdala. La usarás en el Paso 3.

**Opción B — Gemini (GRATIS, sin tarjeta; ideal para empezar hoy mismo):**

1. Entra a **aistudio.google.com/apikey** con tu cuenta de Google.
2. Haz clic en **"Create API key"**, copia la clave (empieza con `AIza...`)
   y guárdala. La usarás en el Paso 3 con el nombre `GEMINI_API_KEY`.
3. El nivel gratuito tiene límites de uso por minuto y por día, de sobra
   para probar la app. Cuando quieras, pasas a Claude sin tocar código:
   solo agregas la otra clave (si están las dos, la app prefiere Claude).

## Paso 2 — Conecta Netlify con tu GitHub

El código de MIDAS ya vive en tu repositorio de GitHub (`castrillonrozo-jorge/zia`).

1. Entra a **app.netlify.com** y crea una cuenta gratis (con GitHub es un clic
   y de paso queda conectada).
2. Haz clic en **"Add new site" → "Import an existing project"**.
3. Elige **GitHub**, autoriza a Netlify si te lo pide, y selecciona el
   repositorio **zia**.
4. En "Branch to deploy" elige la rama que quieres publicar (por ejemplo
   `main`, o la rama con los últimos cambios si aún no se han unido a main).
5. No cambies nada más: Netlify lee el archivo `netlify.toml` del proyecto y
   se configura solo (construye la app Y despliega la función del chat).
6. Haz clic en **"Deploy"**. Espera 1–2 minutos y te dará una dirección tipo
   `https://algo-aleatorio.netlify.app`. ¡Esa ya es tu app en internet!

Ventaja extra: cada vez que el código cambie en GitHub, Netlify actualiza la
app solo, sin que tengas que subir nada.

## Paso 3 — Conecta la clave de IA

El chat de Jarvis necesita la clave del Paso 1:

1. En Netlify, entra a tu sitio recién creado.
2. Ve a **Site configuration → Environment variables → Add a variable**.
3. En "Key" escribe exactamente: `ANTHROPIC_API_KEY` (si elegiste Claude)
   o `GEMINI_API_KEY` (si elegiste la opción gratuita de Gemini).
4. En "Value" pega tu clave. Guarda.
5. Ve a la pestaña **Deploys** y haz clic en **"Trigger deploy" → "Deploy site"**
   (esto reinicia la app con la clave ya conectada).

Listo. Abre tu dirección `.netlify.app` desde el celular o la computadora
y habla con Jarvis.

## Si algo falla

- **El chat no responde:** casi siempre es la clave. Revisa que la variable se
  llame exactamente `ANTHROPIC_API_KEY` o `GEMINI_API_KEY` (mayúsculas, sin
  espacios), que la cuenta correspondiente tenga crédito (Claude) o cuota
  disponible (Gemini gratuito), y vuelve a hacer "Trigger deploy". La app te
  muestra el mensaje de error real en el chat, así sabrás si es la clave.
- **Probaste antes y ves cosas raras:** abre la app en una ventana de
  incógnito (los datos viejos guardados en el navegador interfieren).
- **Quieres cambiar el nombre de la dirección:** Site configuration →
  Site details → Change site name.

## Para desarrolladores (opcional)

- Local: `npm install`, clave en `.env.local`, `npm run dev` (usa server.ts).
- Producción: Netlify compila con `npx vite build` y sirve el chat desde la
  función serverless `netlify/functions/chat.mts` con Claude Sonnet
  (orquestador) + Claude Haiku (subagentes) — ver `netlify.toml`.
