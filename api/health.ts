/**
 * Diagnóstico rápido del despliegue: GET /api/health
 * Dice si la función serverless corre y si GEMINI_API_KEY está presente
 * (solo un booleano — nunca el valor).
 */
export default function handler(_req: unknown, res: any) {
  res.status(200).json({
    ok: true,
    claveGeminiConfigurada: Boolean(process.env.GEMINI_API_KEY),
    hora: new Date().toISOString(),
  });
}
