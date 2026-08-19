/**
 * Base de conocimiento local del asistente.
 *
 * Vive dentro de la aplicación: responde al instante, sin red y sin
 * depender de ningún servicio externo. Cumple dos funciones:
 *
 *  1. Respaldo automático: si la IA remota falla o tarda demasiado, la
 *     respuesta sale de aquí y el ciudadano nunca ve un error.
 *  2. Modo presentación: fuerza que todas las respuestas salgan de aquí,
 *     de modo que una demostración en vivo sea siempre predecible.
 *
 * Solo contiene procedimientos estables (recaudos, pasos, lugares) y
 * datos verificados con su fuente. Nada que cambie a diario —aranceles,
 * tasas, montos de bonos— se afirma aquí: para eso está la IA en vivo y
 * la consulta a la fuente oficial.
 */

export type EntradaConocimiento = {
  id: string;
  claves: string[];
  respuesta: string;
  vista?: string;
};

export const BASE_CONOCIMIENTO: EntradaConocimiento[] = [
  {
    id: 'cedula',
    claves: ['cedula', 'cedula de identidad', 'renovar cedula', 'sacar cedula', 'cedulacion'],
    vista: 'id-renewal',
    respuesta: `Para renovar tu cédula de identidad en el SAIME necesitas:

- Cédula anterior (original), aunque esté vencida
- Partida de nacimiento si es primera vez
- Planilla de solicitud generada en el sistema del SAIME
- Comprobante del pago del arancel vigente

Pasos:
1. Solicita la cita en el sistema del SAIME y elige oficina y fecha.
2. Paga el arancel y guarda el comprobante.
3. Acude el día de la cita con los recaudos originales.
4. Te toman la foto, las huellas y la firma en el mismo acto.

El arancel y los tiempos de entrega cambian: confírmalos en saime.gob.ve antes de ir.

Siguiente paso: te llevo a la sección Saime para preparar tu solicitud.`,
  },
  {
    id: 'pasaporte',
    claves: ['pasaporte', 'prorroga', 'prorroga de pasaporte', 'pasaporte nuevo', 'viajar'],
    vista: 'id-renewal',
    respuesta: `Para el pasaporte en el SAIME:

Pasaporte nuevo o renovación:
- Cédula de identidad laminada y vigente
- Planilla de solicitud del sistema del SAIME
- Comprobante del pago del arancel
- Pasaporte anterior si lo tienes

Prórroga:
- Se solicita sobre un pasaporte vigente o vencido, sin cambiar la libreta
- Mismos recaudos y también requiere cita

Pasos:
1. Ingresa al sistema del SAIME y elige Pasaporte o Prórroga.
2. Selecciona oficina y fecha de la cita.
3. Paga el arancel en el banco o en línea.
4. Acude con los recaudos el día asignado.

Siguiente paso: te llevo a Saime para iniciar el trámite.`,
  },
  {
    id: 'rif',
    claves: ['rif', 'registro de informacion fiscal', 'sacar rif', 'actualizar rif'],
    vista: 'seniat',
    respuesta: `Para el RIF ante el SENIAT:

Persona natural:
- Cédula de identidad
- Documento que acredite el domicilio fiscal (recibo de servicio)
- Planilla de inscripción del portal del SENIAT

Persona jurídica:
- Documento constitutivo registrado ante el SAREN
- RIF de los socios y del representante legal
- Domicilio fiscal de la empresa

Pasos:
1. Inscríbete o actualiza en el portal del SENIAT.
2. Imprime la planilla que genera el sistema.
3. Consigna los recaudos en la oficina que te asignen.

El RIF debe actualizarse cada tres años o cuando cambien tus datos.

Siguiente paso: te llevo a la sección Seniat.`,
  },
  {
    id: 'islr',
    claves: ['islr', 'impuesto sobre la renta', 'declarar impuesto', 'declaracion'],
    vista: 'seniat',
    respuesta: `Para declarar el Impuesto sobre la Renta ante el SENIAT:

- Se declara por el portal del SENIAT con tu RIF y clave
- Necesitas los comprobantes de retención (ARC) que te entrega tu patrono
- Si eres independiente, tus facturas de ingresos y gastos deducibles
- El sistema calcula el monto y genera la planilla de pago

Pasos:
1. Ingresa al portal del SENIAT con tu RIF.
2. Selecciona la declaración definitiva de rentas del ejercicio.
3. Carga ingresos, retenciones y desgravámenes.
4. Genera la planilla y paga en la banca autorizada.

Las fechas límite y las unidades tributarias cambian cada ejercicio: verifícalas en seniat.gob.ve.

Siguiente paso: te llevo a Seniat.`,
  },
  {
    id: 'licencia',
    claves: ['licencia', 'licencia de conducir', 'conducir', 'intt', 'certificado medico'],
    vista: 'intt',
    respuesta: `Para la licencia de conducir en el INTT:

- Cédula de identidad vigente
- Certificado médico vial expedido por un centro autorizado
- Planilla de solicitud del sistema del INTT
- Comprobante del pago del arancel
- Licencia anterior si es renovación

Pasos:
1. Solicita la cita en el sistema del INTT.
2. Haz el examen médico vial en un centro autorizado.
3. Paga el arancel correspondiente al grado de licencia.
4. Acude a la oficina con todos los recaudos.

Para el grado 2 en adelante se exige experiencia previa y examen teórico.

Siguiente paso: te llevo a la sección INTT.`,
  },
  {
    id: 'vehiculo',
    claves: ['traspaso', 'vehiculo', 'carro', 'titulo de propiedad', 'placa'],
    vista: 'intt',
    respuesta: `Para el traspaso de un vehículo ante el INTT:

- Título de propiedad original del vehículo
- Cédula del comprador y del vendedor
- Documento de compraventa notariado
- Certificado de origen si el vehículo es nuevo
- Solvencia de multas y comprobante del pago del arancel

Pasos:
1. Notaría el documento de compraventa ante el SAREN.
2. Solicita el trámite en el sistema del INTT.
3. Paga el arancel y consigna los recaudos.
4. Recibe el nuevo título a nombre del comprador.

Siguiente paso: te llevo a INTT.`,
  },
  {
    id: 'empresa',
    claves: ['empresa', 'registrar empresa', 'saren', 'firma personal', 'compania', 'constituir'],
    vista: 'business-reg',
    respuesta: `Para registrar una empresa ante el SAREN:

- Reserva del nombre (denominación social) en el sistema del SAREN
- Documento constitutivo y estatutos redactados por un abogado
- Cédula y RIF de los socios
- Comprobante del depósito del capital suscrito
- Comprobante del pago de los aranceles registrales

Pasos:
1. Reserva el nombre en el portal del SAREN.
2. Consigna el documento constitutivo para su revisión.
3. Paga los aranceles y firma ante el registrador.
4. Retira el documento registrado y tramita el RIF de la empresa.

Después del registro debes inscribirte en el SENIAT y en el IVSS.

Siguiente paso: te llevo a la sección Saren.`,
  },
  {
    id: 'notaria',
    claves: ['notaria', 'notariar', 'documento', 'autenticar', 'poder', 'compraventa'],
    vista: 'business-reg',
    respuesta: `Para autenticar un documento en una notaría del SAREN:

- Documento redactado y visado por abogado
- Cédulas de todos los otorgantes
- RIF si alguna de las partes es persona jurídica
- Comprobante del pago del arancel notarial

Pasos:
1. Solicita la cita en el sistema del SAREN.
2. Consigna el documento para revisión previa.
3. Paga el arancel.
4. Acude con todos los otorgantes a firmar ante el notario.

Todos los firmantes deben estar presentes el día de la cita.

Siguiente paso: te llevo a Saren.`,
  },
  {
    id: 'vivienda',
    claves: ['vivienda', 'credito', 'renace', 'venezuela renace', 'casa', 'apartamento', 'subsidio', 'prestamo'],
    vista: 'renacer',
    respuesta: `El Crédito Especial Social «Venezuela Renace» lo tramitan el Banco de Venezuela, el Banco Digital de los Trabajadores y el Banco del Tesoro en todas sus agencias.

Condiciones:
- Financia viviendas de hasta 100.000 dólares
- Subsidio estatal del 80% hasta 70.000 dólares
- Subsidio del 50% entre 70.000 y 100.000 dólares

Recaudos:
- Planilla de solicitud del banco
- Cédula de identidad y RIF
- Constancia de ingresos
- Últimos tres estados de cuenta

Los bancos anunciaron respuesta en 5 días hábiles y firma del contrato en menos de 72 horas tras la aprobación. Fuente: prensa nacional, agosto 2026.

Siguiente paso: te llevo a Renacer, donde está el estado de tu vivienda y el crédito.`,
  },
  {
    id: 'renacer-plan',
    claves: ['renacer', 'reconstruccion', 'terremoto', 'sismo', 'damnificado', 'plan'],
    vista: 'renacer',
    respuesta: `El plan Renacer es el programa de reconstrucción tras los sismos del 24 de junio.

Lo que puedes hacer desde la app:
- Consultar el marcaje de tu vivienda (verde, amarillo o rojo)
- Solicitar el crédito de vivienda con subsidio estatal
- Hacer los trámites asociados: cédula, registro de propiedad y RIF
- Seguir los avances del plan con su fuente y su fecha

Avance verificado: el 4 de agosto se entregaron 87 viviendas en Ciudad Tiuna a familias afectadas, y la meta oficial es entregar al menos 4.000 antes de fin de año. Fuente: prensa nacional, 04-08-2026.

Siguiente paso: te llevo a la sección Renacer.`,
  },
  {
    id: 'bonos',
    claves: ['bono', 'bonos', 'patria', 'sistema patria', 'monedero', 'subsidio patria'],
    respuesta: `Los bonos y subsidios se asignan por el Sistema Patria y se cobran en el monedero Patria.

Cómo funciona:
- Debes estar registrado en patria.org.ve con tu cédula
- La asignación llega como notificación al monedero y por mensaje
- El monto se transfiere a tu cuenta bancaria desde el monedero

Los montos y las fechas de cada bono cambian mes a mes: no te los puedo afirmar de memoria. Consúltalos en el propio Sistema Patria, que es la fuente oficial, o pregúntame con la búsqueda activada para que traiga el dato del día con su fuente.`,
  },
  {
    id: 'ivss',
    claves: ['ivss', 'seguro social', 'pension', 'jubilacion', 'cuenta individual', 'cotizaciones'],
    vista: 'employment',
    respuesta: `Para los trámites del IVSS:

Cuenta individual:
- Se consulta en el portal del IVSS con tu número de cédula
- Muestra las semanas cotizadas y los patronos registrados

Pensión de vejez:
- Cédula de identidad
- Constancia de semanas cotizadas (mínimo exigido por ley)
- Edad requerida: 60 años los hombres, 55 las mujeres
- Planilla de solicitud del sistema

Pasos:
1. Verifica tus semanas en la cuenta individual.
2. Solicita la cita en el sistema del IVSS.
3. Consigna los recaudos en la oficina asignada.

Siguiente paso: te llevo a la sección de Empleo y seguridad social.`,
  },
  {
    id: 'curriculo',
    claves: ['curriculo', 'curriculum', 'cv', 'hoja de vida', 'postular', 'empleo', 'trabajo', 'vacante'],
    vista: 'employment',
    respuesta: `Puedo redactar tu currículo contigo, dato por dato.

Dime, y yo lo armo en formato profesional:
1. Tu nombre completo, cédula, teléfono y correo
2. Tu último grado de estudios y dónde lo cursaste
3. Tus dos o tres últimos empleos: cargo, empresa y años
4. Las tareas que sabes hacer mejor

Con eso te entrego el currículo redactado y listo para enviar, y te digo cómo postularte a la vacante que te interese.

Siguiente paso: te llevo a Empleo, donde están las vacantes activas.`,
  },
  {
    id: 'pagos',
    claves: ['pagar', 'pago', 'luz', 'corpoelec', 'agua', 'hidrocapital', 'cantv', 'servicio', 'factura', 'recibo'],
    vista: 'payments',
    respuesta: `Desde Pagos puedes cancelar tus servicios y tributos en un solo lugar:

- Corpoelec (electricidad)
- Hidrocapital (agua)
- CANTV y ABA (telefonía e internet)
- Aseo urbano y tributos municipales
- Impuestos del SENIAT

Cada factura muestra el monto y la fecha de vencimiento, y el pago se hace desde tu billetera o con pago móvil.

Siguiente paso: te llevo a Pagos.`,
  },
  {
    id: 'tasa',
    claves: ['tasa', 'dolar', 'bcv', 'euro', 'cambio', 'cuanto esta el dolar', 'divisa'],
    vista: 'payments',
    respuesta: `La tasa oficial del BCV se consulta en vivo desde la app: la verás en la cinta de la pantalla de Pagos y en la calculadora de la cabecera, siempre con su fecha valor y la fuente de donde salió.

No te doy una cifra de memoria: una tasa vieja mostrada como si fuera de hoy es peor que no mostrarla. Abre la calculadora y tendrás el valor del día, con conversión de dólares y euros a bolívares.

Siguiente paso: te llevo a Pagos, donde está la tasa y la calculadora.`,
  },
  {
    id: 'emergencia',
    claves: ['emergencia', 'policia', 'panico', 'auxilio', '911', 'denuncia', 'robo', 'violencia', 'proteccion'],
    vista: 'security',
    respuesta: `En Protección tienes acceso directo a los organismos de seguridad:

- Botón de pánico: mantén pulsado 1,5 segundos y llama al 911 (VEN911)
- Botón Fucsia: atención a la mujer, INAMUJER, 0800-462-6683
- Compartir tu ubicación con quien elijas, con un toque
- CICPC 171 para robo, extorsión y desaparición
- Ministerio Público 0800-535-3000 para denuncias
- CONAS 0800-266-2700 antiextorsión
- Bomberos 166
- FUNVISIS para información sísmica oficial

En una emergencia real llama siempre al 911.

Siguiente paso: te llevo a Protección.`,
  },
  {
    id: 'salud',
    claves: ['salud', 'medico', 'cita medica', 'hospital', 'consulta', 'medicina', 'farmacia'],
    vista: 'health',
    respuesta: `Desde Salud puedes:

- Consultar tu ficha médica digital: tipo de sangre, alergias y seguro
- Solicitar una cita en la red de hospitales públicos
- Acceder a teleconsulta con médicos en línea
- Buscar medicamentos en la red de farmacias
- Revisar tu historial clínico

Siguiente paso: te llevo a la sección de Salud.`,
  },
  {
    id: 'tramites-estado',
    claves: ['mis tramites', 'estado', 'como va mi tramite', 'seguimiento', 'expediente'],
    vista: 'my-procedures',
    respuesta: `En Mis Trámites ves todo lo que tienes en curso: qué solicitaste, en qué paso va y qué te falta por consignar.

Ten en cuenta una cosa importante: la consulta del estado real ante cada organismo depende de la integración oficial con sus sistemas, que está propuesta y aún no conectada. Mientras tanto la app te muestra tu expediente y los pasos, pero el estado definitivo debes confirmarlo en el portal del organismo.

Siguiente paso: te llevo a Mis Trámites.`,
  },
  {
    id: 'derechos-revision',
    claves: ['revisar mi telefono', 'revisar el telefono', 'requisa', 'me pueden revisar', 'alcabala', 'policia me para', 'revision policial'],
    respuesta: `En Venezuela, el contenido de tu teléfono está protegido por el secreto de las comunicaciones privadas, reconocido en el artículo 48 de la Constitución: solo puede interferirse por orden de un tribunal y cumpliendo las formalidades de ley.

Lo que dice el marco legal:
- Un funcionario puede hacer una inspección corporal y de tus pertenencias cuando existe motivo fundado, y debe advertírtelo antes (Código Orgánico Procesal Penal, artículo 191).
- Revisar el contenido —mensajes, fotos, contactos— es distinto de ver el aparato: eso es una intervención de comunicaciones privadas y requiere orden judicial motivada.
- Tienes derecho a preguntar el motivo del procedimiento, a identificar al funcionario y a que el trato sea respetuoso.
- En flagrancia el procedimiento cambia y el funcionario puede actuar sin orden previa, dejando constancia en el acta.

Si consideras que hubo un abuso, puedes denunciarlo ante el Ministerio Público (0800-535-3000) o la Defensoría del Pueblo.

Esto es orientación general, no asesoría jurídica: para un caso concreto consulta a un abogado o al Ministerio Público.`,
  },
  {
    id: 'derechos-detencion',
    claves: ['detencion', 'me detuvieron', 'arresto', 'mis derechos', 'detenido', 'preso'],
    respuesta: `Si te detienen en Venezuela, la Constitución y el Código Orgánico Procesal Penal reconocen que:

- Nadie puede ser detenido sin orden judicial, salvo en flagrancia (artículo 44 de la Constitución).
- Debes ser presentado ante un juez dentro de las 48 horas siguientes a la detención.
- Tienes derecho a ser informado de los motivos, a comunicarte de inmediato con tus familiares y con un abogado, y a guardar silencio.
- Tienes derecho a un trato digno: está prohibida toda forma de tortura o trato degradante.
- La defensa es inviolable en todo estado y grado de la investigación.

Dónde acudir: Ministerio Público 0800-535-3000, Defensoría del Pueblo, o el CICPC 171.

Esto es orientación general, no asesoría jurídica.`,
  },
  {
    id: 'apostilla',
    claves: ['apostilla', 'apostillar', 'legalizar documento', 'documento para el exterior', 'partida'],
    respuesta: `Para apostillar un documento venezolano (uso en el exterior):

- La apostilla electrónica se solicita en el sistema del Ministerio del Poder Popular para Relaciones Exteriores
- El documento debe estar previamente registrado o notariado ante el SAREN
- Para partidas de nacimiento, matrimonio o defunción: primero la copia certificada del registro civil
- Para títulos y notas: primero la legalización ante el ministerio correspondiente

Pasos:
1. Obtén la copia certificada o el documento notariado.
2. Legalízalo ante el ministerio del ramo si aplica.
3. Solicita la apostilla en el sistema del MPPRE.
4. Descarga la apostilla electrónica con su código de verificación.

Verifica los recaudos vigentes en el portal del MPPRE antes de iniciar.`,
  },
  {
    id: 'que-puedes-hacer',
    claves: ['que puedes hacer', 'ayuda', 'para que sirves', 'quien eres', 'hola', 'buenas'],
    respuesta: `Soy el asistente de Agiliza. Te ayudo con todo lo que necesites del Estado venezolano:

- Trámites: cédula, pasaporte, RIF, licencia, registro de empresas, notarías
- Vivienda: el crédito Venezuela Renace y el plan de reconstrucción
- Pagos: servicios, impuestos y la tasa oficial del BCV en vivo
- Empleo: vacantes activas y tu currículo redactado por mí
- Salud, seguridad social y líneas de emergencia
- Y cualquier pregunta sobre Venezuela

Pregúntame en tus palabras, como se lo dirías a alguien de confianza, y te llevo directo a la sección que resuelve tu gestión.`,
  },
];

/** Quita acentos y signos para comparar sin depender de cómo se escriba. */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Busca la entrada que mejor responde a la pregunta. Devuelve null si
 * ninguna encaja: preferimos decirlo a responder cualquier cosa.
 */
export function buscarRespuestaLocal(pregunta: string): EntradaConocimiento | null {
  const texto = normalizar(pregunta);
  if (!texto) return null;

  let mejor: EntradaConocimiento | null = null;
  let mejorPuntaje = 0;

  for (const entrada of BASE_CONOCIMIENTO) {
    let puntaje = 0;
    for (const clave of entrada.claves) {
      const c = normalizar(clave);
      if (!c) continue;
      if (texto === c) puntaje += 10;
      else if (texto.includes(c)) puntaje += c.includes(' ') ? 5 : 3;
    }
    if (puntaje > mejorPuntaje) {
      mejorPuntaje = puntaje;
      mejor = entrada;
    }
  }

  return mejorPuntaje >= 3 ? mejor : null;
}
