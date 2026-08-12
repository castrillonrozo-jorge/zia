import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * IMPORTANTE — qué se quitó y por qué.
 *
 * El archivo original tenía esto:
 *
 *   define: {
 *     'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
 *     'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
 *   }
 *
 * `define` sustituye ese texto por el VALOR LITERAL de la clave dentro del
 * JavaScript que se descarga el navegador. Es decir: cualquiera que abra la
 * app y mire el código fuente la ve. Y empeora al desplegar, porque Vercel
 * construye con la variable de entorno puesta: la clave acabaría publicada.
 *
 * La clave ahora vive solo en el servidor (api/chat.ts). El navegador no la
 * necesita nunca, así que `define` sobra y `loadEnv` también.
 */
export default defineConfig({
  base: '/',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
