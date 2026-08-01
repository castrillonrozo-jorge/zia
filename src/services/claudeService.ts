// Servicio del cliente: consume el endpoint /api/chat (Claude vía funcion serverless)

export async function* chatWithJarvisStream(messages: { role: 'user' | 'model', parts: { text: string }[] }[], userContext: any = null) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, userContext })
    });

    if (!response.ok || !response.body) {
      // El servidor responde con JSON { error: "..." } cuando algo falla
      // (p. ej. falta ANTHROPIC_API_KEY). Mostramos ese mensaje real al
      // usuario en lugar de un error genérico.
      let serverMessage = `Error del servidor (HTTP ${response.status})`;
      try {
        const data = await response.json();
        if (data && typeof data.error === 'string') serverMessage = data.error;
      } catch { /* cuerpo no-JSON: dejamos el mensaje genérico */ }
      throw new Error(serverMessage);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataText = line.substring(6);
          if (dataText === '[DONE]') break;
          try {
            const chunk = JSON.parse(dataText);
            yield chunk;
          } catch (e) {
            console.error("Failed to parse chunk", e);
          }
        }
      }
    }
  } catch (error) {
    console.error("Claude Stream Error:", error);
    throw error;
  }
}
