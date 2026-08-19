import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';
import { AppView } from '../types';
import { formatMessageText } from '../utils/formatMessage';
import { useVibration } from '../hooks/useVibration';
import { useAgentChat } from '../../arreglos/useAgentChat';

interface AgentChatProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  showStatus: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  promptInicial?: string | null;
  onPromptConsumido?: () => void;
}

export const AgentChat: React.FC<AgentChatProps> = ({ isOpen, onClose, userName, currentView, onNavigate, showStatus, promptInicial, onPromptConsumido }) => {
  const { vibrate } = useVibration();
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [selectedModel, setSelectedModel] = useState(() => {
    if (typeof localStorage !== 'undefined') return localStorage.getItem('venia_selected_model') || 'gemini-3.1-flash-lite';
    return 'gemini-3.1-flash-lite';
  });
  const [useSearch, setUseSearch] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('venia_use_search');
      return stored !== null ? stored === 'true' : true;
    }
    return true;
  });

  const handleModelChange = (model: string) => {
    vibrate('medium');
    setSelectedModel(model);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('venia_selected_model', model);
    }
    showStatus(`Modelo cambiado a ${model === 'gemini-3.1-flash-lite' ? 'Gemini Ultra Rápido' : model === 'gemini-3.5-flash' ? 'Gemini Equilibrado' : 'Gemini Estándar'}`, 'success');
  };

  const handleSearchToggle = (enabled: boolean) => {
    vibrate('medium');
    setUseSearch(enabled);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('venia_use_search', String(enabled));
    }
    showStatus(enabled ? 'Búsqueda en Google activada' : 'Búsqueda desactivada. ¡Modo Súper Veloz activado! ⚡', 'info');
  };

  const [aiInput, setAiInput] = useState('');
  const saludoInicial = `¡Hola, ${userName}! Soy VenIA, tu Asistente de IA Oficial y Especializado en trámites de Venezuela para Agilizarte todo. Estoy aquí para guiarte de forma directa y fácil en tus gestiones del SAIME, SENIAT, INTT, SAREN y más. ¿Qué trámite deseas consultar o agilizar hoy?`;
  const {
    messages: aiMessages,
    loading: isAiLoading,
    error: aiError,
    send: sendAiMessage,
  } = useAgentChat({ onNavigate: (view) => onNavigate(view as AppView) });
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, isAiLoading]);

  const allProcedures = [
    "¿Cómo renuevo mi cédula?",
    "Pasaporte nuevo SAIME",
    "Prórroga de pasaporte",
    "Actualizar RIF digital",
    "Declarar Impuesto ISLR",
    "Registrar empresa SAREN",
    "Licencia de conducir INTT",
    "Traspaso de vehículo INTT",
    "Cuenta Individual del IVSS",
    "Constancia de jubilación IVSS",
    "Apostilla electrónica MPPRE",
    "Legalizar partida de nacimiento",
    "Consultar tasa Dólar BCV",
    "Pagar Borrón y Cuenta Nueva",
    "Buscar vacantes de empleo",
    "Auditar presupuesto general",
    "Registro electoral en el CNE",
    "Reporte de línea CANTV",
    "Pago de servicios CANTV"
  ];

  const [quickSuggestions, setQuickSuggestions] = useState<string[]>([
    "¿Cómo renuevo mi cédula?",
    "Declarar Impuesto ISLR",
    "Registrar empresa SAREN",
    "Licencia de conducir INTT",
    "Consultar tasa Dólar BCV"
  ]);

  useEffect(() => {
    if (isOpen) {
      if (currentView === 'payments') {
        const paymentSuggestions = [
          "Consultar mi saldo BDV",
          "Declarar Impuesto ISLR",
          "Pagar servicio CANTV",
          "Pagar Borrón y Cuenta Nueva",
          "Revisar deudas pendientes"
        ];
        setQuickSuggestions(paymentSuggestions);
      } else {
        const shuffled = [...allProcedures].sort(() => 0.5 - Math.random());
        setQuickSuggestions(shuffled.slice(0, 5));
      }
    }
  }, [isOpen, currentView]);

  // Consulta prellenada desde otra pantalla (p. ej. currículo en Empleo):
  // se envía sola al abrir el chat, una sola vez.
  useEffect(() => {
    if (isOpen && promptInicial && !isAiLoading) {
      sendAiMessage(promptInicial, { useSearch });
      onPromptConsumido?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, promptInicial]);

  const handleSendAiMessage = (text?: string | any) => {
    const messageToSend = (typeof text === 'string' ? text : '') || aiInput;
    if (!messageToSend || !messageToSend.trim() || isAiLoading) return;

    // Vibración haptica al enviar mensaje o seleccionar sugerencia
    vibrate('heavy');

    setAiInput('');
    sendAiMessage(messageToSend, { useSearch });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] top-16 z-[200] bg-black/60 dark:bg-black/80 flex items-end justify-center animate-in fade-in duration-300" style={{ borderRadius: '24px 24px 0 0' }}>
      <div
        style={{
          boxShadow: 'none',
          borderTop: '1px solid rgba(255,255,255,0.15)',
        }}
        className="w-full max-w-md rounded-t-[2.5rem] h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full duration-500 bg-[#F2F2F7] dark:bg-[#1C1C1E]"
      >
        <div className="px-6 py-5 flex items-center justify-between border-b border-white/[0.04] relative ai-chat-header">
          <div className="flex items-center gap-3">
            <div
              style={{
                background: 'radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
                boxShadow: 'none',
                border: '1px solid rgba(129, 140, 248, 0.4)',
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center relative overflow-hidden group chip-aurora"
            >
              <Icons.Sparkles size={14} className="text-white drop-shadow-none" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight text-white flex items-center gap-2 [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">
                VenIA
                <span className="flex items-center gap-1 bg-emerald-400 text-black px-2.5 py-0.5 rounded-full border border-emerald-500 shadow-[0_0_12px_rgba(52,211,153,0.3)] backdrop-blur-md [text-shadow:none]">
                  <Icons.CircuitBoard size={10} className="animate-pulse text-black" />
                  <span className="text-[8px] font-black text-black uppercase tracking-widest relative top-[0.5px]">EN VIVO</span>
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1 shadow-none [text-shadow:none]">Asistente Inteligente</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowApiSettings(!showApiSettings)}
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                boxShadow: 'none',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              title="Ajustes de Velocidad e IA"
            >
              <Icons.Settings size={15} />
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                boxShadow: 'none',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <Icons.X size={15} />
            </button>
          </div>
        </div>

        {showApiSettings && (
          <div className="p-5 bg-slate-50 dark:bg-[#111] border-b border-black/5 dark:border-white/5 text-sm space-y-4 max-h-[50vh] overflow-y-auto no-scrollbar">
            {/* Selector de Modelos */}
            <div>
              <label className="block text-xs font-bold mb-1.5 text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Icons.Cpu size={12} className="text-[#4F84C4] dark:text-[#ffcc00]" />
                Motor de Inteligencia (Modelo):
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  onClick={() => handleModelChange('gemini-3.1-flash-lite')}
                  className={`flex flex-col text-left px-3 py-2 rounded-xl border text-xs transition-colors ${
                    selectedModel === 'gemini-3.1-flash-lite'
                      ? 'bg-[#4F84C4]/5 dark:bg-[#ffcc00]/5 border-[#4F84C4] dark:border-[#ffcc00]'
                      : 'bg-white dark:bg-black border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between w-full font-bold">
                    <span className="text-slate-900 dark:text-white">⚡ Gemini 3.1 Flash-Lite</span>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-semibold">El más rápido</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5">Respuestas optimizadas e instantáneas para consultas diarias.</span>
                </button>

                <button
                  onClick={() => handleModelChange('gemini-3.5-flash')}
                  className={`flex flex-col text-left px-3 py-2 rounded-xl border text-xs transition-colors ${
                    selectedModel === 'gemini-3.5-flash'
                      ? 'bg-[#4F84C4]/5 dark:bg-[#ffcc00]/5 border-[#4F84C4] dark:border-[#ffcc00]'
                      : 'bg-white dark:bg-black border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between w-full font-bold">
                    <span className="text-slate-900 dark:text-white">🧠 Gemini 3.5 Flash (Recomendado)</span>
                    <span className="text-[9px] bg-blue-500/10 text-[#4F84C4] dark:text-blue-400 px-1.5 py-0.5 rounded-full font-semibold">Equilibrado</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5">Máximo razonamiento con excelente tiempo de respuesta.</span>
                </button>

                <button
                  onClick={() => handleModelChange('gemini-flash-latest')}
                  className={`flex flex-col text-left px-3 py-2 rounded-xl border text-xs transition-colors ${
                    selectedModel === 'gemini-flash-latest'
                      ? 'bg-[#4F84C4]/5 dark:bg-[#ffcc00]/5 border-[#4F84C4] dark:border-[#ffcc00]'
                      : 'bg-white dark:bg-black border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between w-full font-bold">
                    <span className="text-slate-900 dark:text-white">🛠️ Gemini Flash Estándar</span>
                    <span className="text-[9px] bg-slate-500/10 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded-full font-semibold">Respaldo</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5">Modelo clásico de alta estabilidad para consultas generales.</span>
                </button>
              </div>
            </div>

            {/* Switch de Búsqueda de Google (Grounding) */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-black border border-black/10 dark:border-white/10">
              <div className="pr-4">
                <label className="text-xs font-bold leading-tight flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                  <Icons.Globe size={13} className="text-[#4F84C4] dark:text-[#ffcc00]" />
                  Búsqueda en Google (Grounding)
                </label>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                  Desactívalo para obtener respuestas ultra rápidas pre-cargadas (Velocidad Súper). Actívalo si requieres noticias de hoy o gacetas recientes.
                </p>
              </div>
              <button
                onClick={() => handleSearchToggle(!useSearch)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  useSearch ? 'bg-[#4F84C4] dark:bg-[#ffcc00]' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-205 ease-in-out ${
                    useSearch ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>


          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          <div className="flex justify-start">
            <div
              className="max-w-[85%] p-4 text-sm leading-relaxed rounded-2xl rounded-tl-none border border-black/5 dark:border-white/5"
              style={{ backgroundColor: '#F4F6F9', color: '#1A2B49' }}
            >
              {formatMessageText(saludoInicial)}
            </div>
          </div>
          {aiMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] p-4 text-sm leading-relaxed ${
                  msg.role === 'user'
                  ? 'bg-[#4F84C4] text-white rounded-3xl rounded-br-sm shadow-none'
                  : 'rounded-2xl rounded-tl-none border border-black/5 dark:border-white/5'
                }`}
                style={msg.role === 'ai' ? { backgroundColor: '#F4F6F9', color: '#1A2B49' } : {}}
              >
                {msg.role === 'ai' ? formatMessageText(msg.text) : msg.text}
                {msg.role === 'ai' && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-black/10 space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Fuentes</p>
                    {msg.sources.map((fuente, j) => (
                      <a
                        key={j}
                        href={fuente.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-[11px] underline break-all opacity-80 hover:opacity-100"
                      >
                        {fuente.titulo}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isAiLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] p-4 rounded-2xl rounded-tl-none bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-2 w-full">
                <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full w-3/4 animate-pulse"></div>
                <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full w-1/2 animate-pulse"></div>
              </div>
            </div>
          )}

          {aiError && !isAiLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] p-4 text-sm leading-relaxed rounded-2xl rounded-tl-none border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300">
                {aiError}
              </div>
            </div>
          )}

          {/* Quick Suggestions Chips */}
          {!isAiLoading && aiMessages.length === 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {quickSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendAiMessage(suggestion)}
                  className="px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-bold text-slate-600 dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all active:scale-95"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-6 bg-white/50 dark:bg-black/20 border-t border-black/5 dark:border-white/5">
          <div className="flex gap-2 bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl border border-black/5 dark:border-white/5">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendAiMessage()}
              placeholder="Pregunta lo que necesites..."
              className="flex-1 h-11 bg-transparent px-4 text-sm font-medium outline-none placeholder:text-slate-400"
            />
            <button
              onClick={() => handleSendAiMessage()}
              className="w-11 h-11 rounded-xl bg-[#4F84C4] hover:bg-[#4F84C4] text-white flex items-center justify-center hover:scale-95 transition-all chip-aurora"
            >
              <Icons.Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
