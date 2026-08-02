import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ChevronLeft, ChevronDown, Shield, CreditCard, GraduationCap, Info,
  Download, Trash2, Lock, Plus, Star, X, MessageCircleQuestion, Mail,
} from 'lucide-react';
import { useUserProfileStore } from '../store/userProfileStore';

// Secciones reales del perfil: Seguridad, Métodos de Pago, Educación y Ayuda.
// Cada una hace trabajo verdadero sobre el dispositivo (persistencia local,
// exportación de datos, bloqueo con PIN) o se integra con Jarvis.

export type ProfileSectionId = 'security' | 'payments' | 'education' | 'help';

const SectionShell = ({ title, icon: Icon, onClose, children }: any) => (
  <motion.div
    initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
    transition={{ type: 'spring', damping: 26, stiffness: 220 }}
    className="absolute inset-0 bg-bg-main z-50 p-6 overflow-y-auto"
  >
    <div className="flex items-center gap-3 mb-8">
      <button onClick={onClose} aria-label="Volver al perfil" className="p-2 -ml-2 hover:bg-bg-bubble-jarvis rounded-full transition-colors bg-bg-chat shadow-sm border border-border-subtle">
        <ChevronLeft size={24} className="text-gold-deep" />
      </button>
      <Icon size={20} className="text-gold-primary" />
      <h2 className="font-bold text-lg text-text-primary">{title}</h2>
    </div>
    {children}
  </motion.div>
);

/* ============================== SEGURIDAD ============================== */

export const PIN_KEY = 'midas_pin';

export const SecuritySection = ({ onClose }: { onClose: () => void }) => {
  const [hasPin, setHasPin] = useState(() => !!localStorage.getItem(PIN_KEY));
  const [settingPin, setSettingPin] = useState(false);
  const [pinDraft, setPinDraft] = useState('');
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const savePin = () => {
    if (pinDraft.length !== 4) return;
    if (confirmed === null) {
      setConfirmed(pinDraft);
      setPinDraft('');
      return;
    }
    if (confirmed === pinDraft) {
      localStorage.setItem(PIN_KEY, pinDraft);
      setHasPin(true);
      setSettingPin(false);
      setConfirmed(null);
      setPinDraft('');
    } else {
      setConfirmed(null);
      setPinDraft('');
    }
  };

  const exportData = () => {
    const dump = {
      exportadoEl: new Date().toISOString(),
      perfil: useUserProfileStore.getState().getProfile(),
      nota: 'Copia completa de tus datos de MIDAS. Este archivo vive solo en tu dispositivo.',
    };
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `midas-datos-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wipeAll = () => {
    if (!window.confirm('Esto borra tu perfil, movimientos y ajustes de este dispositivo. ¿Continuar?')) return;
    useUserProfileStore.getState().resetProfile();
    localStorage.clear();
    window.location.reload();
  };

  return (
    <SectionShell title="Seguridad y Privacidad" icon={Shield} onClose={onClose}>
      <div className="space-y-3">
        <div className="bg-bg-chat border border-border-subtle rounded-2xl p-4 premium-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock size={20} className="text-gold-deep" />
              <div>
                <div className="text-sm font-bold text-text-primary">Bloqueo con PIN</div>
                <div className="text-[11px] text-text-secondary mt-0.5">Pide un PIN de 4 dígitos al abrir MIDAS</div>
              </div>
            </div>
            <button
              onClick={() => {
                if (hasPin) {
                  localStorage.removeItem(PIN_KEY);
                  setHasPin(false);
                } else {
                  setSettingPin(true);
                }
              }}
              aria-label={hasPin ? 'Desactivar PIN' : 'Activar PIN'}
              className={`w-12 h-6 flex-shrink-0 rounded-full relative transition-colors ${hasPin ? 'bg-gold-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <div className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${hasPin ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
          {settingPin && (
            <div className="mt-4 pt-4 border-t border-border-subtle">
              <div className="text-xs font-bold text-text-primary mb-2">
                {confirmed === null ? 'Elige tu PIN de 4 dígitos' : 'Repítelo para confirmar'}
              </div>
              <div className="flex gap-2">
                <input
                  type="password" inputMode="numeric" maxLength={4} value={pinDraft} autoFocus
                  onChange={(e) => setPinDraft(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  onKeyDown={(e) => e.key === 'Enter' && savePin()}
                  className="flex-1 h-11 border border-border-subtle rounded-xl px-4 text-center tracking-[8px] text-lg font-bold outline-none focus:border-gold-primary bg-bg-main text-text-primary"
                  placeholder="••••"
                />
                <button onClick={savePin} disabled={pinDraft.length !== 4} className="px-4 rounded-xl gold-gradient font-bold text-sm disabled:opacity-40">
                  OK
                </button>
                <button onClick={() => { setSettingPin(false); setConfirmed(null); setPinDraft(''); }} aria-label="Cancelar" className="px-3 rounded-xl border border-border-subtle text-text-secondary">
                  <X size={16} />
                </button>
              </div>
              <p className="text-[10px] text-text-secondary mt-2">Si lo olvidas, tendrás que restablecer la app desde el perfil.</p>
            </div>
          )}
        </div>

        <button onClick={exportData} className="w-full bg-bg-chat border border-border-subtle rounded-2xl p-4 premium-shadow flex items-center gap-3 hover:border-gold-primary/40 transition-colors text-left">
          <Download size={20} className="text-gold-deep" />
          <div>
            <div className="text-sm font-bold text-text-primary">Exportar mis datos</div>
            <div className="text-[11px] text-text-secondary mt-0.5">Descarga un archivo JSON con todo tu perfil y movimientos</div>
          </div>
        </button>

        <div className="bg-bg-chat border border-border-subtle rounded-2xl p-4 premium-shadow">
          <div className="text-sm font-bold text-text-primary mb-1">¿Dónde viven mis datos?</div>
          <p className="text-[12px] text-text-secondary leading-relaxed">
            Todo tu perfil financiero se guarda únicamente en este dispositivo. Al chatear, tus cifras
            viajan cifradas a la IA solo para generar la respuesta y no se almacenan en ningún servidor de MIDAS.
          </p>
        </div>

        <button onClick={wipeAll} className="w-full border border-red-200 dark:border-red-900 rounded-2xl p-4 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left">
          <Trash2 size={20} className="text-red-500" />
          <div>
            <div className="text-sm font-bold text-red-500">Borrar todos mis datos</div>
            <div className="text-[11px] text-text-secondary mt-0.5">Elimina perfil, movimientos y ajustes de este dispositivo</div>
          </div>
        </button>
      </div>
    </SectionShell>
  );
};

/* =========================== MÉTODOS DE PAGO =========================== */

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  alias: string;
  isDefault: boolean;
}

const PM_KEY = 'midas_payment_methods';
const loadMethods = (): PaymentMethod[] => {
  try { return JSON.parse(localStorage.getItem(PM_KEY) || '[]'); } catch { return []; }
};

export const PaymentsSection = ({ onClose }: { onClose: () => void }) => {
  const [methods, setMethods] = useState<PaymentMethod[]>(loadMethods);
  const [adding, setAdding] = useState(false);
  const [brand, setBrand] = useState('Visa');
  const [last4, setLast4] = useState('');
  const [alias, setAlias] = useState('');

  useEffect(() => {
    localStorage.setItem(PM_KEY, JSON.stringify(methods));
  }, [methods]);

  const addMethod = () => {
    if (last4.length !== 4) return;
    setMethods((prev) => [
      ...prev,
      {
        id: Date.now().toString(36),
        brand,
        last4,
        alias: alias.trim() || `${brand} •${last4}`,
        isDefault: prev.length === 0,
      },
    ]);
    setAdding(false); setLast4(''); setAlias('');
  };

  const setDefault = (id: string) =>
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));

  const remove = (id: string) =>
    setMethods((prev) => {
      const next = prev.filter((m) => m.id !== id);
      if (next.length > 0 && !next.some((m) => m.isDefault)) next[0].isDefault = true;
      return next;
    });

  return (
    <SectionShell title="Métodos de Pago" icon={CreditCard} onClose={onClose}>
      <p className="text-[12px] text-text-secondary mb-4 leading-relaxed">
        El Agente Pagador usará tu método preferido cuando le autorices un pago.
        Solo se guarda la referencia (marca y últimos 4 dígitos), nunca el número completo.
      </p>
      <div className="space-y-3">
        {methods.map((m) => (
          <div key={m.id} className="bg-bg-chat border border-border-subtle rounded-2xl p-4 premium-shadow flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-8 rounded-lg gold-gradient flex items-center justify-center text-[10px] font-black uppercase">
                {m.brand.slice(0, 4)}
              </div>
              <div>
                <div className="text-sm font-bold text-text-primary flex items-center gap-2">
                  {m.alias}
                  {m.isDefault && <span className="text-[9px] bg-gold-pale text-gold-deep px-2 py-0.5 rounded-full font-black uppercase">Preferida</span>}
                </div>
                <div className="text-[11px] text-text-secondary mt-0.5">Termina en {m.last4}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!m.isDefault && (
                <button onClick={() => setDefault(m.id)} aria-label="Hacer preferida" className="p-2 text-text-secondary hover:text-gold-deep transition-colors">
                  <Star size={16} />
                </button>
              )}
              <button onClick={() => remove(m.id)} aria-label="Eliminar método" className="p-2 text-text-secondary hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {methods.length === 0 && !adding && (
          <div className="text-center py-8 border border-dashed border-border-subtle rounded-2xl">
            <p className="text-sm text-text-secondary">Aún no tienes métodos guardados.</p>
          </div>
        )}

        {adding ? (
          <div className="bg-bg-chat border border-gold-primary/40 rounded-2xl p-4 premium-shadow space-y-3">
            <div className="flex gap-2">
              <select value={brand} onChange={(e) => setBrand(e.target.value)} className="h-11 border border-border-subtle rounded-xl px-3 text-sm font-semibold bg-bg-main text-text-primary outline-none focus:border-gold-primary">
                {['Visa', 'Mastercard', 'Amex', 'Zelle', 'PayPal', 'Binance'].map((b) => <option key={b}>{b}</option>)}
              </select>
              <input
                value={last4} inputMode="numeric" maxLength={4} placeholder="Últimos 4"
                onChange={(e) => setLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="flex-1 h-11 border border-border-subtle rounded-xl px-3 text-sm bg-bg-main text-text-primary outline-none focus:border-gold-primary"
              />
            </div>
            <input
              value={alias} placeholder="Alias (ej. Tarjeta nómina)" onChange={(e) => setAlias(e.target.value)}
              className="w-full h-11 border border-border-subtle rounded-xl px-3 text-sm bg-bg-main text-text-primary outline-none focus:border-gold-primary"
            />
            <div className="flex gap-2">
              <button onClick={addMethod} disabled={last4.length !== 4} className="flex-1 h-11 gold-gradient rounded-xl font-bold text-sm disabled:opacity-40">Guardar</button>
              <button onClick={() => setAdding(false)} className="px-4 h-11 border border-border-subtle rounded-xl text-sm text-text-secondary">Cancelar</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} className="w-full h-12 border border-gold-primary text-gold-deep rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gold-pale transition-colors">
            <Plus size={16} /> Agregar método de pago
          </button>
        )}
      </div>
    </SectionShell>
  );
};

/* ========================= EDUCACIÓN FINANCIERA ========================= */

const LESSONS = [
  {
    title: 'El fondo de emergencia: tu primera meta',
    body: 'Antes de invertir un solo dólar, reúne entre 3 y 6 meses de tus gastos básicos en un lugar seguro y líquido (tu Bóveda). Ese colchón evita que una emergencia —salud, trabajo, familia— te obligue a endeudarte o a vender inversiones en mal momento. Regla práctica: multiplica tus gastos fijos mensuales por 3; ese es tu primer objetivo.',
    prompt: '¿Cuánto debería tener yo en mi fondo de emergencia según mis gastos reales, y en cuánto tiempo puedo llegar?',
  },
  {
    title: 'La regla 50/30/20',
    body: 'Divide tu ingreso en tres bolsas: 50% para necesidades (vivienda, comida, transporte), 30% para gustos, y 20% para ahorro e inversión. No es una ley: en economías con inflación alta conviene empujar el ahorro por encima del 20% y dolarizarlo. Lo importante es que el ahorro sea un "gasto fijo" que se paga primero, no lo que sobra al final.',
    prompt: 'Compara mi distribución real de gastos contra la regla 50/30/20 y dime qué ajustar.',
  },
  {
    title: 'Interés compuesto: el tiempo vale más que el monto',
    body: 'Invertir $100 al mes desde los 25 años supera por mucho a invertir $300 al mes desde los 40, gracias al interés compuesto: los rendimientos generan sus propios rendimientos. La variable más poderosa no es cuánto inviertes, sino cuántos años dejas trabajar el dinero. Empezar pequeño hoy gana a empezar grande mañana.',
    prompt: 'Muéstrame escenarios de interés compuesto con mi disponible real a 5, 10 y 20 años.',
  },
  {
    title: 'Salir de deudas: avalancha o bola de nieve',
    body: 'Método avalancha: paga primero la deuda con la tasa de interés más alta; es lo matemáticamente óptimo. Método bola de nieve: paga primero la deuda más pequeña; da victorias rápidas que te mantienen motivado. Ambos funcionan — el mejor es el que puedas sostener. Mientras tanto, nunca pagues solo el mínimo de la tarjeta.',
    prompt: 'Con mis deudas actuales, ¿me conviene avalancha o bola de nieve? Arma el plan mes a mes.',
  },
  {
    title: 'Protegerte de la inflación',
    body: 'Si tu moneda local pierde valor, ahorrar en ella es perder en cámara lenta. Estrategias probadas: mantener el fondo de emergencia en moneda dura (USD o stablecoins), convertir el excedente apenas llega el ingreso, y solo dejar en moneda local lo que gastarás ese mes. Tu Escudo Anti-Inflación de MIDAS monitorea exactamente esto.',
    prompt: '¿Cuánto de mi dinero debería dolarizar según mi situación real y cómo lo hago paso a paso?',
  },
];

export const EducationSection = ({ onClose, onAskJarvis }: { onClose: () => void; onAskJarvis: (prompt: string) => void }) => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <SectionShell title="Educación Financiera" icon={GraduationCap} onClose={onClose}>
      <p className="text-[12px] text-text-secondary mb-4 leading-relaxed">
        Lecciones de 2 minutos. Cada una termina con un botón para aplicarla a <b>tus</b> números reales con Jarvis.
      </p>
      <div className="space-y-3">
        {LESSONS.map((l, i) => (
          <div key={i} className="bg-bg-chat border border-border-subtle rounded-2xl premium-shadow overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full p-4 flex items-center justify-between text-left">
              <span className="text-sm font-bold text-text-primary pr-3">{l.title}</span>
              <ChevronDown size={18} className={`text-gold-deep flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && (
              <div className="px-4 pb-4">
                <p className="text-[13px] text-text-secondary leading-relaxed mb-3">{l.body}</p>
                <button
                  onClick={() => onAskJarvis(l.prompt)}
                  className="w-full h-11 gold-gradient rounded-xl font-bold text-[13px] flex items-center justify-center gap-2"
                >
                  <MessageCircleQuestion size={16} /> Aplicarlo a mis números con Jarvis
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionShell>
  );
};

/* ============================ AYUDA Y SOPORTE ============================ */

const FAQS = [
  {
    q: '¿Cómo registro un gasto o un ingreso?',
    a: 'Escríbelo en el chat con tus palabras: "Gasté $20 en mercado" o "Me pagaron $500". Jarvis lo clasifica, lo guarda en tu perfil y actualiza tu salud financiera al instante.',
  },
  {
    q: '¿Qué hace cada agente?',
    a: 'Pagador ejecuta pagos autorizados; Ahorrador aparta un % de cada ingreso hacia tu Bóveda; Inversor propone estrategias; Vigilante categoriza movimientos; Negociador detecta suscripciones caras; Anti-Inflación protege tu poder de compra; Metas proyecta tus objetivos; y el Crono-Gestor vigila fechas de pago.',
  },
  {
    q: '¿Dónde están guardados mis datos?',
    a: 'Solo en este dispositivo (almacenamiento local del navegador). Puedes exportarlos o borrarlos cuando quieras desde Seguridad y Privacidad.',
  },
  {
    q: '¿Puedo cambiar cuánto decide cada agente por su cuenta?',
    a: 'Sí. Entra al HUB de Agentes (ícono de chip arriba) y abre cualquier agente: puedes elegir entre Sugerir, Aprobar o Autónomo, y fijar el límite máximo por operación.',
  },
  {
    q: 'El chat no responde, ¿qué reviso?',
    a: 'Casi siempre es la clave de IA del despliegue (ANTHROPIC_API_KEY o GEMINI_API_KEY en Netlify). El propio chat te mostrará el motivo exacto del error.',
  },
];

export const HelpSection = ({ onClose }: { onClose: () => void }) => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <SectionShell title="Ayuda y Soporte" icon={Info} onClose={onClose}>
      <div className="space-y-3 mb-6">
        {FAQS.map((f, i) => (
          <div key={i} className="bg-bg-chat border border-border-subtle rounded-2xl premium-shadow overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full p-4 flex items-center justify-between text-left">
              <span className="text-sm font-bold text-text-primary pr-3">{f.q}</span>
              <ChevronDown size={18} className={`text-gold-deep flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && <p className="px-4 pb-4 text-[13px] text-text-secondary leading-relaxed">{f.a}</p>}
          </div>
        ))}
      </div>

      <a
        href="mailto:castrillonrozo@gmail.com?subject=Soporte%20MIDAS"
        className="w-full h-12 border border-gold-primary text-gold-deep rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gold-pale transition-colors mb-4"
      >
        <Mail size={16} /> Contactar soporte
      </a>

      <p className="text-center text-[10px] text-text-secondary">MIDAS · Banca privada con agentes de IA · v6</p>
    </SectionShell>
  );
};
