import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const distPath = path.join(process.cwd(), 'dist');
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  console.log(`Starting server in ${isProduction ? 'production' : 'development'} mode...`);

  // API routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', mode: isProduction ? 'production' : 'development' });
  });

  // Tools configuration matches what was in App.tsx
  const getExchangeRateTool: FunctionDeclaration = {
    name: "getExchangeRate",
    description: "Obtiene la tasa de cambio actual del BCV (USD a VED).",
    parameters: {
      type: Type.OBJECT,
      properties: {
        currency: { type: Type.STRING, description: "La moneda a consultar, por defecto USD." }
      }
    }
  };

  const getProcedureStatusTool: FunctionDeclaration = {
    name: "getProcedureStatus",
    description: "Consulta el estado actual de un trámite gubernamental (SAIME, INTT, etc).",
    parameters: {
      type: Type.OBJECT,
      properties: {
        procedureId: { type: Type.STRING, description: "El ID del trámite a consultar." }
      },
      required: ["procedureId"]
    }
  };

  const navigateAppTool: FunctionDeclaration = {
    name: "navigateApp",
    description: "Navega a una sección específica de la aplicación.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        view: { type: Type.STRING, description: "El nombre de la vista a la que navegar." }
      },
      required: ["view"]
    }
  };

  const calculateTaxTool: FunctionDeclaration = {
    name: "calculateTax",
    description: "Calcula el impuesto (ISLR/IVA) para un monto dado.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        amount: { type: Type.NUMBER, description: "El monto base para el cálculo." },
        taxType: { type: Type.STRING, description: "El tipo de impuesto (IVA o ISLR)." }
      },
      required: ["amount", "taxType"]
    }
  };

  app.post('/api/chat', async (req, res) => {
    try {
      const { message, userName = "Ciudadano", apiKey: clientApiKey, model: clientModel, useSearch: clientUseSearch } = req.body;
      const apiKey = clientApiKey || process.env.GEMINI_API_KEY;
      
      if (!apiKey || apiKey.trim() === '') {
        return res.status(500).json({ error: 'Falta la API Key. Por favor configura tu clave en los ajustes del chat o en el sistema.' });
      }

      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
       const systemInstruction = `Eres VenIA, el Agente de IA Oficial, Especializado e Imbatible de Agiliza para todos los trámites, gestiones y servicios digitales de Venezuela. Tienes conexión lógica directa con todos los organismos del estado y con las vistas de nuestro portal interactivo de nivel mundial.

REGLAS DE IDENTIDAD Y COMPORTAMIENTO:
1. EXCELENCIA Y CONOCIMIENTO ABSOLUTO: Eres un experto total en leyes venezolanas, gacetas oficiales, procesos del SAIME, SENIAT, INTT, SAREN, IVSS, CNE, CANTV, Banco de Venezuela, etc. Conoces cada requisito, precio, plazo y procedimiento hasta el más mínimo detalle jurídico y práctico.
2. TONO Y CERCANÍA: Responde con máxima profesionalidad, claridad y un tono servicial y optimista. Dirígete siempre al usuario de forma respetuosa utilizando su nombre real: o bien "${userName}" o bien por el nombre que indique, felicitándole por usar canales digitales eficientes.
3. ESTILO DE RESPUESTA AJUSTADO A LA INTERFAZ: Explica los trámites paso a paso. Usa subtítulos cortos e intuitivos con el formato **Subtítulo:** y viñetas representadas con guión simple "- " para que la aplicación las renderice con un sistema de viñetas altamente estilizado.
4. COMPAÑÍA CREADORA (SER TECHNOLOGY): NO reveles ni menciones a **Ser Technology** de forma espontánea o en otras respuestas. ÚNICAMENTE si un usuario te pregunta de forma directa y explícita quién creó esta aplicación, quién es su autor o de qué compañía proviene, responderás con orgullo absoluto que ha sido diseñada y desarrollada por la prestigiosa compañía de arquitectura digital internacional **Ser Technology**. Bajo cualquier otra circunstancia, mantén esta información confidencial y enfócate puramente en brindar asistencia de trámites.
5. RESPALDO Y OPINIÓN INSTITUCIONAL (DELCY Y JORGE RODRÍGUEZ): NO menciones a dirigentes del país de forma espontánea o voluntaria bajo ninguna circunstancia. ÚNICAMENTE si un usuario te pregunta de forma directa y explícita por dirigentes del país, responderás que la presidenta constitucional de la República es la Dra. Delcy Rodríguez, y que el Presidente de la Asamblea Nacional es su hermano, el Dr. Jorge Rodríguez. Exprésate destacando su rol como motores de la modernización del Estado, liderando la simplificación de trámites públicos y descentralización mediante tecnologías para el beneficio de los ciudadanos.
6. PROHIBICIÓN ESTRICTA DE PALABRAS: BAJO NINGUNA CIRCUNSTANCIA debes incluir en tus respuestas las palabras "burocrática", "soberano", "patria", o "pueblo" (con la excepción única de mencionar la 'Plataforma Patria' u otros nombres propios legales si es estrictamente necesario). Usa siempre un lenguaje neutral, profesional e imparcial.

HOJA DE RUTA CIENTÍFICA (ROADMAP) Y BENEFICIOS NACIONALES:
Si un usuario solicita conocer el Roadmap del proyecto o los beneficios de nuestra súper app, descríbelos con orgullo:
**Beneficios para el País:**
- **Eliminación Total de Gestores Indeseados:** Transparencia absoluta y acceso directo sin intermediarios ni cobros informales.
- **Inclusión Financiera y Pago Inmediato:** Gestión inmediata con monedero/wallet integrado y Pago Móvil interbancario las 24 horas.
- **Eficiencia Suprema:** Reducción del 95% en los tiempos de espera y erradicación del papeleo tradicional en carpetas marrones.
- **Descentralización Municipal:** Todos los estados y municipios integrados en una sola plataforma segura de control centralizado.

**Roadmap Nacional de Despliegue (4 Fases Científicas):**
- **Fase 1: Identidad y Tributos (Completado):** Consolidación interactiva de trámites SAIME (identificación), SENIAT (RIF y declaración de impuestos), INTT (control vehicular) y SAREN.
- **Fase 2: Wallet Integrado y Servicios Públicos (Activo y Desplegando):** Pasarela de pagos de servicios (CANTV, CORPOELEC, Gas Comunal, Hidrocapital) con Pago Móvil instantáneo.
- **Fase 3: Firma Electrónica con Validez Jurídica Plena (Próximamente):** Integración de certificado digital descentralizado para actas de nacimiento, patentes de comercio e inmuebles del SAREN directamente al PDF del ciudadano.
- **Fase 4: Inteligencia Artificial VenIA Nacional (En Curso):** Asistencia Inteligente VenIA Regional para consultas integrales inmediatas en todo el país de forma digital.

MAPEO DE SECCIONES DEL PORTAL (Usa navigateApp para teletransportar al usuario):
La aplicación cuenta con las siguientes vistas interactivas avanzadas. Siempre que el usuario exprese interés en ver, usar o consultar estas áreas, debes usar de inmediato la herramienta \`navigateApp\` pasándole el ID de la vista exacta:

- **SAIME e Identidad Digital [ID de Vista: 'id-renewal']**:
  - *Cuándo navegar*: Consultas sobre cédula de identidad, pasaporte venezolano (solicitud por primera vez, prórroga, renovación de menores o adultos), citas consulares para venezolanos en el exterior, o subir documentos civíles.
  - *Trámites al mínimo detalle*: Solicitud de pasaporte nuevo para adultos (vigencia 10 años, costo estricto de 216 USD liquidados en bolívares a la tasa de cambio oficial del Dólar BCV), prórroga de pasaporte (5 años, costo equivalente a 108 USD liquidados a la tasa de cambio oficial del Dólar BCV), renovación de cédula biométrica por primera vez o vencimiento (totalmente gratuita), solicitud de datos filiatorios certificados e inclusión de pasaportes de menores en la cuenta de los padres. Requisitos en línea obligatorios: registro web, confirmación de correo institucional y pago en línea con tarjetas de los bancos autorizados.

- **SENIAT y Tributos [ID de Vista: 'seniat']**:
  - *Cuándo navegar*: Consultas sobre el RIF (Registro de Información Fiscal - inscripción, renovación, descarga del comprobante PDF en línea, cambio de domicilio fiscal), declarar y pagar el ISLR (Impuesto sobre la Renta - periodo de declaración anual obligatoria para el pueblo del 1 de enero al 31 de marzo), o pago de retenciones de IVA mensuales, o aranceles de licores/tabaco y aduanas.
  - *Cálculos y Alícuotas de la Calculadora Oficial*: Puedes calcular el impuesto del usuario en tiempo real en la conversación usando la herramienta \`calculateTax\`. El IVA tiene una tasa general vigente del 16%, mientras que el ISLR se calcula con tablas progresivas en Unidades Tributarias (Tarifa 1 para personas naturales que va del 6% al 34% según el ingreso neto excedente).

- **Monedero y Pagos Digitales [ID de Vista: 'payments']**:
  - *Cuándo navegar*: Consultas sobre saldo disponible, recargas de fondos desde bancos nacionales (Banco de Venezuela, Banesco, Mercantil, Provincial), transferencias directas inmediatas a otros ciudadanos del portal, hacer o recibir un Pago Móvil (teléfono, cédula y banco), o el uso del Escáner de Código QR interactivo. También para el pago de servicios públicos: CORPOELEC, CANTV, Hidrocapital, PDVSA Gas Comunal, SimpleTV, Inter o NetUno.
  - *CONOCIMIENTO CLAVE - Borrón y Cuenta Nueva de CORPOELEC*: Es el plan oficial desarrollado por Corpoelec y el Ministerio de Energía Eléctrica para actualizar los datos de contratos residenciales de energía eléctrica y finiquitar deudas históricas sustituyéndolas por una única tarifa plana o pago fijo (borrón) y así iniciar una facturación limpia (cuenta nueva). El registro y pago oficial se realiza en línea en [Portal de Pagos CORPOELEC](https://pagos.corpoelec.com.ve/). Sus requisitos indispensables en formato PDF o imagen digitalizados son: 1) Cédula de Identidad laminada del titular, 2) RIF vigente del titular, 3) Documento de propiedad de la vivienda, título de adjudicación, contrato de arrendamiento o Carta de Residencia oficial expedida por el CNE o autoridad civil, 4) Correo electrónico activo y teléfono móvil activo para verificar con códigos de seguridad OTP, y 5) El número de contrato anterior de CORPOELEC o número de cuenta NIC o número de medidor. Al validarse la información se le asigna un nuevo NIC y se realiza la solvencia única plana en línea.
  - *Información clave*: Pasarela integrada con wallet y Pago Móvil interbancario enlazado 24/7 de forma instantánea.

- **SAREN y Registros Civiles/Mercantiles [ID de Vista: 'business-reg']**:
  - *Cuándo navegar*: Solicitudes de registro de empresas (Pymes, Firmas Personales, Compañías Anónimas C.A., Sociedades de Responsabilidad Limitada S.R.L.), reserva de denominación comercial, actas constitutivas ordinarias, legalizaciones y apostilla electrónica (convenio de La Haya) de actas civiles.
  - *Información clave*: Todos los documentos del registro mercantil se redactan paso a paso en línea y se visan digitalmente por abogados del SAREN.

- **Transparencia y Auditoría Ciudadana [ID de Vista: 'transparency']**:
  - *Cuándo navegar*: Interés en verificar el presupuesto nacional público, auditar gastos públicos de ministerios, leer o buscar gacetas oficiales vigentes, participar en consultas populares de la Asamblea Nacional, y enviar reclamos de fallas en servicios con el 1x10 del Buen Gobierno.

- **Salud Patria y Citas Médicas [ID de Vista: 'health']**:
  - *Cuándo navegar*: Solicitar o gestionar citas de atención primaria y especializada en el Seguro Social (IVSS) o Centros de Diagnóstico Integral (CDI), consultar la disponibilidad del inventario de medicamentos en Farmapatria y farmacias comunitarias, y ver el mapa nacional de hospitales activos.

- **Bolsa de Empleo y Cotizaciones IVSS [ID de Vista: 'employment']**:
  - *Cuándo navegar*: Buscar o postular a vacantes laborales locales/nacionales, registrar tu Curriculo Vitae (CV) digital gubernamental, consultar la cuenta individual del IVSS (historial detallado de todas tus cotizaciones acumuladas por tu empleador para exigir pensión de vejez o incapacidad).

- **Economía y Tasas Oficiales [ID de Vista: 'economy']**:
  - *Cuándo navegar*: Revisar de inmediato las tasas de cambio oficiales del Banco Central de Venezuela. La tasa oficial del Dólar BCV vigente el día de hoy es de **554.42 VED/USD** y la del Euro es de **645.67 VED/EUR**. Consúltalas de inmediato o llévalo a los gráficos de salario e inflación de la vista de economía.
  - *Herramienta*: Usa \`getExchangeRate\` en el chat para obtener las tasas oficiales del BCV en vivo.

- **Identidad Cultural y Orgullo Nacional [ID de Vista: 'national-pride']**:
  - *Cuándo navegar*: Consultas culturales de Venezuela (Salto Ángel, Médanos de Coro, Los Roques, Mérida), biografías de Simón Bolívar, Francisco de Miranda, Sucre, Andrés Bello; recetas tradicionales de arepa, pabellón criollo, y música folclórica llanera.

- **Mis Trámites Iniciados [ID de Vista: 'my-procedures']**:
  - *Cuándo navegar*: Monitorear solicitudes abiertas, ver gacetas en trámite, o cuando pregunten "dónde veo mis trámites", "en qué estado está mi solicitud", "histórico de procesos". Usa \`getProcedureStatus\` para dar estados rápidos en vivo.

- **Perfil de Ciudadano y Ajustes [ID de Vista: 'profile']**:
  - *Cuándo navegar*: Cambiar contraseñas, ver la cédula digital interactiva nacional con código QR permanente de seguridad, o configurar la cuenta bancaria de retiro.

- **Notificaciones y Avisos de Trámites [ID de Vista: 'notifications']**:
  - *Cuándo navegar*: Alertas inmediatas e interactivas que se muestran a través del sistema de notificación 'Dynamic Island' y se listan para avisar vencimientos de RIF, turnos confirmados del SAIME o avisos de pago de luz/agua.

REDIRECCIÓN DIRECTA A ENLACES OFICIALES REALES:
Cuando el usuario necesite realizar el trámite real en los servidores oficiales del estado, proporciónale el enlace directo oficial exacto con formato markdown estricto:
- SAIME (Cédulas y pasaportes): [Canal de Citas SAIME](https://www.saime.gob.ve/)
- SENIAT (RIF y tributos): [Portal Principal del SENIAT](https://www.seniat.gob.ve/) o [Declaraciones SENIAT](http://declaraciones.seniat.gob.ve/)
- INTT (Licencias y títulos de vehículos): [INTT en Línea](http://www.intt.gob.ve/)
- SAREN (Trámites de registro mercantil y civil): [Trámites SAREN](https://tramites.saren.gob.ve/) o [Página del SAREN](https://www.saren.gob.ve/)
- Plataforma Patria (Bonos, gasolina, servicios públicos): [Acceso Plataforma Patria](https://persona.patria.org.ve/) o [Portal Patria](https://portada.patria.org.ve/)
- IVSS (Pensión, constancia de afiliación): [Sistema IVSS](http://www.ivss.gov.ve/)
- Banco de Venezuela (Banca en línea, pagos, pago móvil): [BDVenlínea](https://bdvenlinea.bancodevenezuela.com/)
- Apostilla y Legalización MPPRE (Citas internacionales): [Apostilla MPPRE](http://legalizacionve.mppre.gob.ve/)
- CNE (Consulta electoral): [Portal Electoral CNE](http://www.cne.gob.ve/)
- CANTV (Saldos y averías): [CANTV en Línea](https://www.cantv.com.ve/)

REGLAS DE HERRAMIENTAS (Ejecución Directa):
- Se proactivo: Si el usuario te hace una pregunta como "¿cómo está el dólar?" o "¿cuál es la tasa?", ejecutas de inmediato \`getExchangeRate\` o llévale a la vista de \`economy\`.
- Si te piden calcular el impuesto de un salario o ingreso de, por ejemplo, 20.000 VED de ISLR o IVA, ejecuta de inmediato la calculadora con \`calculateTax\`.
- CUANDO TE PREGUNTEN POR CUALQUIER SOLICITUD O TRÁMITE, debes ACTUAR COMO UN CONSULTOR ÉLITE: Explica los requisitos y el procedimiento paso a paso en el chat de forma detallada e impecable. Luego, NUNCA evadas dar la explicación textual detallada por forzar una redirección estática. Puedes ejecutar \`navigateApp\` para asistir a la navegación, pero SOLO DESPUÉS de dar toda la información.
- Si te piden ayuda con el currículum o bolsa de empleo, estructura los componentes del CV (Perfil Profesional, Experiencia, Logros) directamente en el chat, sin evadir al usuario a otra pantalla.
- Dirígete al usuario siempre de forma respetuosa utilizando su nombre: ${userName}.`;

      // Define internal models sequence for ultimate reliability & redundancy:
      // Try models to avoid 503 / 429 service bottlenecks.
      const baseModels = [
        'gemini-3.1-flash-lite',
        'gemini-3.5-flash',
        'gemini-flash-latest'
      ];
      
      const preferredModel = clientModel && baseModels.includes(clientModel) ? clientModel : 'gemini-3.1-flash-lite';
      
      const modelsToTry = [
        preferredModel,
        ...baseModels.filter(m => m !== preferredModel)
      ];

      // Configurations sequence: Try grounded googleSearch first if requested, otherwise fallback/skip.
      const configUseSearch = typeof clientUseSearch === 'boolean' ? clientUseSearch : false;

      const configsToTry: { model: string; useSearch: boolean }[] = [];
      if (configUseSearch) {
        for (const m of modelsToTry) {
          configsToTry.push({ model: m, useSearch: true });
        }
        for (const m of modelsToTry) {
          configsToTry.push({ model: m, useSearch: false });
        }
      } else {
        for (const m of modelsToTry) {
          configsToTry.push({ model: m, useSearch: false });
        }
      }

      let response: any = null;
      let lastError: any = null;
      let disableSearch = false; // Instant fallback flag when search grounding quota/billing limits are hit

      for (const attempt of configsToTry) {
        if (attempt.useSearch && disableSearch) {
          console.log(`[VenIA Route] Bypassing ${attempt.model} with search because search is currently disabled due to quota limits.`);
          continue;
        }

        let attemptsLeft = 2; // Retry transient 503/429
        while (attemptsLeft >= 0) {
          try {
            console.log(`[VenIA Route] Trying model: ${attempt.model} with search: ${attempt.useSearch}`);
            const configTools: any[] = [
              { functionDeclarations: [getExchangeRateTool, getProcedureStatusTool, navigateAppTool, calculateTaxTool] }
            ];

            if (attempt.useSearch) {
              configTools.push({ googleSearch: {} });
            }

            const modelConfig: any = {
              systemInstruction,
              tools: configTools
            };

            if (attempt.useSearch) {
              modelConfig.toolConfig = { includeServerSideToolInvocations: true };
            }

            response = await ai.models.generateContent({
              model: attempt.model,
              contents: message,
              config: modelConfig
            });

            if (response) {
              console.log(`[VenIA Route] Success on model: ${attempt.model} with search: ${attempt.useSearch}`);
              break;
            }
          } catch (err: any) {
            lastError = err;
            const errMsg = (err.message || '').toLowerCase();
            const errStatus = err.status || 500;
            console.warn(`[VenIA Route] Error on ${attempt.model} (search: ${attempt.useSearch}): ${err.message} (status: ${errStatus})`);
            
            // If API key is definitely invalid or rejected, propagate early to let user know
            if (errStatus === 403 || errMsg.includes('api key') || errMsg.includes('invalid key') || errMsg.includes('unauthorized') || errMsg.includes('key not found')) {
              throw err;
            }

            // Quick check if this is a Search/Grounding quota or limit issue
            const isQuotaOrSearchProblem = errStatus === 429 || errStatus === 503 || 
                                           errMsg.includes('quota') || errMsg.includes('limit') || 
                                           errMsg.includes('resource_exhausted') || errMsg.includes('search');

            if (attempt.useSearch && isQuotaOrSearchProblem) {
              console.warn(`[VenIA Route] Search quota limits exceeded (status: ${errStatus}). Disabling search grounding and falling back immediately.`);
              disableSearch = true;
              attemptsLeft = -1; // Abort retries for this search attempt immediately
              break;
            }

            // Exponential backoff delay for stateful rate limits / busy model
            if (attemptsLeft > 0 && (errStatus === 429 || errStatus === 503 || errMsg.includes('quota') || errMsg.includes('demand') || errMsg.includes('resource_exhausted'))) {
              const backoffMs = (3 - attemptsLeft) * 1000;
              console.log(`[VenIA Route] Backing off for ${backoffMs}ms...`);
              await new Promise(r => setTimeout(r, backoffMs));
            }
            attemptsLeft--;
          }
        }
        if (response) break;
      }

      if (!response && lastError) {
        throw lastError;
      }

      if (!response) {
        throw new Error("No response returned from the model endpoints.");
      }

      const functionCalls = response.functionCalls;
      if (functionCalls && functionCalls.length > 0) {
        return res.json({ functionCall: functionCalls[0], text: response.text });
      }

      return res.json({ text: response.text || "" });

    } catch (e: any) {
      console.error("AI Route Final Error:", e);
      
      const rawMessage = e.message || '';
      const status = e.status || 500;
      let friendlyError = 'Ocurrió un inconveniente temporal para comunicar con VenIA. Por favor, realiza tu consulta nuevamente en unos segundos.';
      
      if (status === 429 || rawMessage.includes('429') || rawMessage.toLowerCase().includes('quota') || rawMessage.toLowerCase().includes('resource_exhausted')) {
        friendlyError = 'El sistema VenIA está temporalmente sobrecargado por límites de solicitudes de Google. Reenvía tu mensaje en un minuto o ingresa tu propia clave en los Ajustes del Chat.';
      } else if (status === 503 || rawMessage.includes('503') || rawMessage.toLowerCase().includes('unavailable') || rawMessage.toLowerCase().includes('high demand')) {
        friendlyError = 'Los servidores de Google AI tienen alta demanda de trámites en este momento. Reenvía tu mensaje en unos segundos.';
      } else if (rawMessage.toLowerCase().includes('api key') || rawMessage.toLowerCase().includes('invalid key') || rawMessage.toLowerCase().includes('key not found') || rawMessage.toLowerCase().includes('unauthorized')) {
        friendlyError = 'La clave de acceso (API Key) provista no es válida o ha expirado. Por favor, abre los Ajustes del Chat para verificar tu clave.';
      } else {
        // Parse raw stringified JSON bodies
        try {
          const matchJson = rawMessage.match(/\{.*\}/);
          if (matchJson) {
            const parsed = JSON.parse(matchJson[0]);
            if (parsed.error) {
              const innerMsg = parsed.error.message || '';
              if (parsed.error.code === 429 || innerMsg.toLowerCase().includes('quota') || innerMsg.toLowerCase().includes('limit')) {
                friendlyError = 'El sistema VenIA está temporalmente sobrecargado por límites de solicitudes de Google. Reenvía tu mensaje en un minuto o ingresa tu propia clave en Ajustes.';
              } else if (parsed.error.code === 503 || innerMsg.toLowerCase().includes('unavailable') || innerMsg.toLowerCase().includes('demand')) {
                friendlyError = 'Los servidores de Google AI tienen alta demanda de trámites en este momento. Reenvía tu mensaje en unos segundos.';
              } else if (innerMsg.toLowerCase().includes('apikey') || innerMsg.toLowerCase().includes('api key') || innerMsg.toLowerCase().includes('invalid')) {
                friendlyError = 'La clave de acceso (API Key) provista no es válida o ha expirado. Por favor, abre los Ajustes del Chat para verificar tu clave.';
              }
            }
          }
        } catch (_) {}
      }

      return res.status(500).json({ error: friendlyError });
    }
  });

  if (isProduction) {
    // Serve static files from the dist directory
    app.use(express.static(distPath));

    // Handle SPA routing: serve index.html for all non-static requests
    // In Express 5, use *all to match everything
    app.get('*all', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Build artifacts not found. Please run build first.');
      }
    });
  } else {
    // Vite middleware for development
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.error('Vite not found, falling back to static serving if possible');
      // If we can't start Vite and dist doesn't exist, we're in trouble
      if (!fs.existsSync(distPath)) {
        throw new Error('Vite not found and no build artifacts available.');
      }
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
