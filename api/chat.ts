/**
 * Adaptador para Vercel. Copia este archivo a  api/chat.ts  en la raíz.
 *
 * Vercel no ejecuta un Express con app.listen: ejecuta funciones. La ruta
 * ya tenía la forma (req, res) que Vercel espera, así que solo hay que
 * reexportarla desde la carpeta api/.
 */

import { chatRoute } from '../arreglos/chatRoute';

export default chatRoute;

export const config = {
  maxDuration: 30, // El modelo puede tardar; el default de 10s se queda corto.
};
