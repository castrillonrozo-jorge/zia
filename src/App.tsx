import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Bell, Mic, ArrowUp, X, Settings, LogOut, Shield, CreditCard, GraduationCap, Zap, Activity, Info, TrendingUp, ChevronLeft, Cpu, ChevronRight, Moon, Sun, Camera, Building, Lock, ShieldCheck, CheckCircle2, Briefcase } from 'lucide-react';
import { chatWithJarvisStream } from './services/claudeService';
import { Message, Agent, UserProfile, EmbeddedComponentType } from './types';
import { 
  BalanceCard, 
  AgentCard, 
  ScenarioCard, 
  QuickReplyChips, 
  TransactionConfirmCard,
  InsightCard,
  InvestmentCard,
  MoneyInput,
  ChipSelector,
  DebtInput,
  GoalInput,
  FinancialProfileCard,
  ActionPlanCard,
  BigActionButtons
} from './components/EmbeddedComponents';
import { SaturnLogo } from './components/SaturnLogo';
import { SplashScreen, OnboardingCarousel, LoginScreen, FacialKYCScreen, UserDataScreen } from './components/OnboardingScreens';
import { MonitoreoScreen, PagadorScreen, AhorradorScreen, InversorScreen, NegociadorScreen, AntiInflacionScreen, MetasScreen, RecordatorioScreen, AgentHubScreen } from './components/ServiceScreens';
import { SecuritySection, PaymentsSection, EducationSection, HelpSection, PIN_KEY, ProfileSectionId } from './components/ProfileSections';
import { BusinessScreen } from './components/BusinessScreen';
import { useBusinessStore } from './store/businessStore';
import { useUserProfileStore } from './store/userProfileStore';
import { useAgentAutonomyStore } from './store/agentAutonomyStore';
import { useNotificationsStore } from './store/notificationsStore';
import { applySavingsRule } from './services/rulesEngine';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function App() {
  const { profile, updateField, getProfile } = useUserProfileStore();
  const [currentScreen, setCurrentScreen] = useState<'splash'|'onboarding'|'login'|'kyc'|'userdata'|'chat'>('splash');
  const [serviceScreen, setServiceScreen] = useState<'none' | 'monitoreo' | 'pagador' | 'ahorrador' | 'inversor' | 'negociador' | 'anti_inflacion' | 'metas' | 'recordatorio' | 'agentes'>('none');
  const [lastServiceScreen, setLastServiceScreen] = useState<'none' | 'agentes'>('none');

  const handleServiceBack = () => {
    if (lastServiceScreen === 'agentes') {
      setServiceScreen('agentes');
      setLastServiceScreen('none');
    } else {
      setServiceScreen('none');
    }
  };
  // Tema: recordamos la elección del usuario; por defecto la app abre en
  // claro (lienzo blanco editorial), su cara de presentación.
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('midas_theme');
    if (saved === 'dark') return true;
    return false;
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [bankConnected, setBankConnected] = useState(() => localStorage.getItem('midas_bank') !== null);
  const [bankName, setBankName] = useState(() => localStorage.getItem('midas_bank') || 'Banesco');
  const [showBankModal, setShowBankModal] = useState(false);
  const [isConnectingBank, setIsConnectingBank] = useState(false);
  // Avatar: solo la foto que el usuario suba, persistida en el dispositivo.
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => localStorage.getItem('midas_avatar'));
  const [profileSection, setProfileSection] = useState<ProfileSectionId | null>(null);
  const [isListening, setIsListening] = useState(false);
  const speechRef = useRef<any>(null);
  // Bloqueo con PIN: si el usuario lo activó, la app abre bloqueada.
  const [appLocked, setAppLocked] = useState(() => !!localStorage.getItem(PIN_KEY));
  const [pinAttempt, setPinAttempt] = useState('');
  const [pinError, setPinError] = useState(false);
  const notify = useNotificationsStore((s) => s.add);
  const notifications = useNotificationsStore((s) => s.items);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  // Estado de los agentes: el encendido/apagado sobrevive a la recarga.
  const AGENT_DEFAULTS: Agent[] = [
    { id: '1', name: 'Agente Pagador', description: 'Ejecutor de Transferencias e Inteligencia enrutadora.', status: 'active', type: 'bill_payer', nextRun: '15 Mayo' },
    { id: '2', name: 'Agente Ahorrador', description: 'Optimizador de Flujo. Algoritmo de retención', status: 'active', type: 'saver', nextRun: 'Diario' },
    { id: '3', name: 'Agente Inversor', description: 'Motor de Crecimiento Algorítmico y Analista.', status: 'paused', type: 'investor', nextRun: '-' },
    { id: '4', name: 'Agente Vigilante', description: 'Categoriza transacciones mediante IA predictiva.', status: 'active', type: 'watcher', nextRun: 'Continuo' },
    { id: '5', name: 'Agente Negociador', description: 'Optimización de contratos y suscripciones.', status: 'paused', type: 'negotiator', nextRun: '-' },
    { id: '6', name: 'Anti-Inflación', description: 'Escudo Monetario Soberano.', status: 'active', type: 'anti_inflation', nextRun: 'Continuo' },
    { id: '7', name: 'Metas', description: 'Trazador de Trayectorias de Vida predictivo.', status: 'active', type: 'goals', nextRun: '1 Junio' },
    { id: '8', name: 'Recordatorio', description: 'Supervisa Fechas críticas de vida y financieras.', status: 'active', type: 'reminder', nextRun: 'Mañana' },
  ];
  const [agents, setAgents] = useState<Agent[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('midas_agents_status') || '{}');
      return AGENT_DEFAULTS.map(a => saved[a.id] ? { ...a, status: saved[a.id] } : a);
    } catch { return AGENT_DEFAULTS; }
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesInitialized = useRef(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('midas_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        updateField('name', parsed.name);
      } catch (e) {
        console.error("Error parsing savedUser", e);
        localStorage.removeItem('midas_user');
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('midas_messages', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSplashComplete = () => {
    const savedUser = localStorage.getItem('midas_user');
    if (savedUser) {
      setCurrentScreen('chat');
    } else {
      setCurrentScreen('onboarding');
    }
  };

  const handleUserDataComplete = (name: string, age?: number) => {
    localStorage.setItem('midas_user', JSON.stringify({ name }));
    updateField('name', name);
    if (age && age > 0) updateField('age', age);
    setCurrentScreen('chat');
  };

  useEffect(() => {
    if (currentScreen === 'chat' && !messagesInitialized.current) {
      const greeting: Message = {
        id: 'greeting',
        role: 'jarvis',
        content: `Bienvenido, ${profile.name || 'Señor'}. Soy Jarvis, tu asesor financiero personal. Para trabajar con datos reales necesito conocer tu situación. ¿Qué deseas hacer?`,
        timestamp: new Date(),
        embedded: {
          type: 'BigActionButtons',
          data: { buttons: ["Sí, hagamos el diagnóstico", "Opciones de inversión y perfil"] }
        }
      };

      // Si el diagnóstico no se completó, SIEMPRE reiniciamos el cuestionario
      // desde el saludo: los mensajes guardados no sirven porque el paso del
      // formulario (onboardingStep) no sobrevive a la recarga de la página.
      if (!getProfile().onboardingComplete) {
        setOnboardingStep(0);
        setMessages([greeting]);
        localStorage.removeItem('midas_messages');
      } else {
        const savedMessages = localStorage.getItem('midas_messages');
        let restored = false;
        if (savedMessages) {
          try {
            const parsed = JSON.parse(savedMessages);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setMessages(parsed);
              setOnboardingStep(13);
              restored = true;
            }
          } catch (e) {
            console.error("Error parsing savedMessages", e);
          }
        }
        if (!restored) {
          setOnboardingStep(13);
          setMessages([{
            ...greeting,
            content: `Bienvenido de vuelta, ${profile.name || 'Señor'}. Tu perfil está activo. ¿En qué trabajamos hoy?`,
            embedded: { type: 'QuickReplyChips', data: ["Ver mi balance", "Analizar mis gastos", "Activar mis agentes"] }
          }]);
        }
      }
      messagesInitialized.current = true;
    }
  }, [currentScreen, profile.name]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('midas_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages, isTyping]);

  const addJarvisMessage = (content: string, embedded?: any) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString() + Math.random().toString(),
      role: 'jarvis',
      content,
      timestamp: new Date(),
      embedded
    }]);
  };

  const handleOnboardingAnswer = (value: any, displayValue: string, nextStep: number, jarvisReply: string, embeddedData: any) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: displayValue,
      timestamp: new Date()
    }]);
    setOnboardingStep(nextStep);
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addJarvisMessage(jarvisReply, embeddedData);
    }, 800);
  };

  const handleActionPlanAccept = (planTitle?: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: 'Aceptar el Reto', timestamp: new Date() }]);
    // El reto aceptado queda persistido como meta activa del perfil.
    if (planTitle && !getProfile().goals.longTerm) {
      updateField('goals.longTerm', planTitle);
    }
    notify('Plan de acción', `Aceptaste el reto${planTitle ? `: ${planTitle}` : ''}. Quedó guardado en tus metas.`);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addJarvisMessage("¡Excelente decisión! Tu reto quedó guardado en el perfil. Empieza a registrar cada gasto o ingreso escribiéndolo aquí: 'Me pagaron $500 de un proyecto' o 'Gasté $20 en café'. Yo lo organizo todo en tu panel automáticamente. ¿Registramos algo ahora?");
    }, 1200);
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    if (text === "Sí, hagamos el diagnóstico" && onboardingStep === 0) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() }]);
      setInput('');
      setOnboardingStep(1);
      setTimeout(() => {
        addJarvisMessage("Empecemos por lo que entra. ¿Cuánto ganas al mes en promedio, en dólares?", {
          type: 'MoneyInput', data: {}
        });
      }, 500);
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history: any[] = [];
      for (const m of messages) {
        if (m.role === 'jarvis') {
          const parts: any[] = [];
          if (m.content) parts.push({ text: m.content });
          if (m.functionCall) {
            parts.push({ functionCall: m.functionCall });
            history.push({ role: 'model', parts });
            if (m.functionResponse) {
              history.push({ role: 'user', parts: [{ functionResponse: { name: m.functionCall.name, response: m.functionResponse } }] });
            }
          } else if (parts.length > 0) {
            history.push({ role: 'model', parts });
          } else {
            history.push({ role: 'model', parts: [{ text: "[Componente Visual]" }] });
          }
        } else {
          history.push({ role: 'user', parts: [{ text: m.content }] });
        }
      }
      history.push({ role: 'user', parts: [{ text }] });

      let currentHistory = history;
      let keepGoing = true;

      while (keepGoing) {
        keepGoing = false;
        let jarvisResponse = '';
        let jarvisMsgId: string | null = null;
        let functionCallFound: any = null;

        const stream = chatWithJarvisStream(currentHistory, {
          ...getProfile(),
          agentAutonomy: useAgentAutonomyStore.getState().getSummary(),
          // Si el usuario administra un emprendimiento en Mi Negocio, Jarvis
          // recibe sus números reales para asesorarlo también como negocio.
          miNegocio: (() => {
            const biz = useBusinessStore.getState();
            const s = biz.getSummary();
            if (!s.hasData) return undefined;
            return {
              nombre: biz.businessName || 'Mi Negocio',
              resumenDelMes: s,
              productos: biz.products.map(p => ({ nombre: p.name, costo: p.cost, precio: p.price, inventario: p.stock })),
              ultimasVentas: biz.sales.slice(0, 10).map(v => ({ producto: v.productName, cantidad: v.quantity, total: v.total, ganancia: v.profit, fecha: v.date.slice(0, 10) })),
            };
          })(),
        });

        for await (const chunk of stream) {
          const textChunk = chunk.text;
          if (textChunk) {
            if (!jarvisMsgId) {
              jarvisMsgId = (Date.now() + Math.random()).toString();
              setMessages(prev => [...prev, { id: jarvisMsgId!, role: 'jarvis', content: textChunk, timestamp: new Date() }]);
            } else {
              setMessages(prev => prev.map(m => m.id === jarvisMsgId ? { ...m, content: jarvisResponse + textChunk } : m));
            }
            jarvisResponse += textChunk;
          }

          if (chunk.functionCalls && chunk.functionCalls.length > 0) {
            functionCallFound = chunk.functionCalls[0];
          }
        }

        if (functionCallFound) {
          const name = functionCallFound.name;
          const args = functionCallFound.args || {};
          let embedded: { type: EmbeddedComponentType, data: any } | undefined;
          let funcResponse: any = { success: true };

          if (name === 'get_balance') {
            const profile = getProfile();
            const bal = profile.savings.currentTotal + profile.computed.availableToSave;
            embedded = { type: 'BalanceCard', data: { 
              balance: bal,
              available: profile.computed.availableToSave,
              vaults: profile.savings.currentTotal
            } };
            funcResponse = { balance: bal, available: profile.computed.availableToSave, vaults: profile.savings.currentTotal };
          } else if (name === 'record_transaction') {
            useUserProfileStore.getState().addTransaction({
              type: args.type,
              amount: args.amount,
              category: args.category,
              description: args.description || '',
            });
            const fresh = useUserProfileStore.getState().getProfile();
            funcResponse = {
              success: true,
              registered: { type: args.type, amount: args.amount, category: args.category },
              estadoActualizado: {
                saldoDisponible: Math.round(fresh.computed.availableToSave * 100) / 100,
                tasaAhorro: Math.round(fresh.computed.savingsRate * 10) / 10,
                saludFinanciera: fresh.computed.financialHealth,
                boveda: Math.round(fresh.savings.currentTotal * 100) / 100,
              },
            };
            if (args.type === 'income') {
              const outcome = applySavingsRule(args.amount);
              funcResponse.savingsRule = outcome;
              if (outcome.action === 'executed') {
                notify('Agente Ahorrador', `Aparté $${outcome.amount} a tu Bóveda automáticamente. Nuevo total: $${outcome.newVaultTotal}.`);
                embedded = { type: 'InsightCard', data: {
                  title: 'Agente Ahorrador · Ejecutado',
                  text: `Aparté $${outcome.amount} (${Math.round(outcome.rate * 100)}% de tu ingreso) a la Bóveda automáticamente. Nuevo total en Bóveda: $${outcome.newVaultTotal}.`
                } };
              } else if (outcome.action === 'propose') {
                embedded = { type: 'TransactionConfirmCard', data: {
                  amount: outcome.amount,
                  to: 'Bóveda de Ahorro'
                } };
              }
            }
          } else if (name === 'transfer_to_vault') {
            const result = useUserProfileStore.getState().transferToVault(args.amount, args.reason || 'Autorizado por el usuario');
            embedded = { type: 'InsightCard', data: {
              title: 'Transferencia ejecutada',
              text: `$${args.amount} enviados a la Bóveda. Nuevo total: $${result.newVaultTotal}. Saldo disponible: $${Math.round(result.available * 100) / 100}.`
            } };
            funcResponse = {
              success: true,
              nuevaBoveda: result.newVaultTotal,
              saldoDisponible: Math.round(result.available * 100) / 100,
              mensaje: 'Transferencia completada. Confirma al usuario con estas cifras exactas.'
            };
          } else if (name === 'model_scenarios') {
            embedded = { type: 'ScenarioCard', data: { 
              income: args.income || getProfile().computed.availableToSave || 500,
              goal: args.goal_amount || 5000
            } };
            funcResponse = { shown: true };
          } else if (name === 'list_agents') {
            embedded = { type: 'AgentCard', data: { name: 'Suite MIDAS', status: 'active', type: 'investor', nextRun: 'Activos' } };
            funcResponse = { shown: true };
          } else if (name === 'propose_investment') {
            embedded = { type: 'InvestmentCard', data: { 
              product: args.product || "Portafolio MIDAS", 
              apy: args.apy || "8%", 
              amount: args.amount || getProfile().computed.availableToSave 
            } };
            funcResponse = { shown: true };
          } else if (name === 'generate_action_plan') {
            embedded = { type: 'ActionPlanCard', data: { title: args.title || "Tu Camino al Éxito", steps: args.steps || ["Optimizar Gastos", "Crear Fondo de Emergencia"] } };
            funcResponse = { shown: true };
          } else if (name === 'open_service_screen') {
            const sn = args.screen_name;
            if (['monitoreo', 'pagador', 'ahorrador', 'inversor', 'negociador', 'anti_inflacion', 'metas', 'recordatorio', 'agentes'].includes(sn)) {
              setServiceScreen(sn as any);
              funcResponse = { success: true, message: `Pantalla ${sn} abierta al usuario.` };
            } else {
              funcResponse = { error: "Pantalla no encontrada." };
            }
          } else {
            funcResponse = { error: "Function implementation not found." };
          }

          if (embedded) {
            if (!jarvisMsgId) {
              jarvisMsgId = (Date.now() + Math.random()).toString();
              setMessages(prev => [...prev, { id: jarvisMsgId!, role: 'jarvis', content: '', timestamp: new Date(), embedded, functionCall: functionCallFound, functionResponse: funcResponse }]);
            } else {
              setMessages(prev => prev.map(m => m.id === jarvisMsgId ? { ...m, embedded, functionCall: functionCallFound, functionResponse: funcResponse } : m));
            }
          } else {
            if (!jarvisMsgId) {
              jarvisMsgId = (Date.now() + Math.random()).toString();
              setMessages(prev => [...prev, { id: jarvisMsgId!, role: 'jarvis', content: '', timestamp: new Date(), functionCall: functionCallFound, functionResponse: funcResponse }]);
            } else {
              setMessages(prev => prev.map(m => m.id === jarvisMsgId ? { ...m, functionCall: functionCallFound, functionResponse: funcResponse } : m));
            }
          }

          const modelParts: any[] = [];
          if (jarvisResponse) modelParts.push({ text: jarvisResponse });
          modelParts.push({ functionCall: functionCallFound });

          currentHistory = [
            ...currentHistory,
            { role: 'model', parts: modelParts },
            { role: 'user', parts: [{ functionResponse: { name, response: funcResponse } }] }
          ];

          keepGoing = true;
        } else {
          // If no function call and model didn't reply any text? Unlikely
        }
      }
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'jarvis', content: 'Lo siento, hubo un error de conexión con mi agente de inteligencia artificial (' + (error.message || 'Error Desconocido') + '). Por favor, verifica el API Key y vuelve a intentarlo.', timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const finishOnboarding = () => {
    setOnboardingStep(13); // finished
    const currentProfile = getProfile();
    let analysisMsg = "";
    if (currentProfile.computed.financialHealth === 'healthy') {
      analysisMsg = `Tu situación es sólida. Tienes $${currentProfile.computed.availableToSave} disponible cada mes, eso es un ${currentProfile.computed.savingsRate.toFixed(1)}% de tu ingreso. La pregunta no es si puedes ahorrar, es a qué velocidad quieres construir tu patrimonio. Te propongo tres caminos.`;
    } else if (currentProfile.computed.financialHealth === 'at-risk') {
      analysisMsg = `Tu margen es ajustado. Tienes $${currentProfile.computed.availableToSave} disponible, apenas un ${currentProfile.computed.savingsRate.toFixed(1)}% de tu ingreso. Antes de invertir, vamos a optimizar tus gastos para subir ese margen al 20%.`;
    } else {
      analysisMsg = `Hay que actuar. Tus gastos superan o igualan tus ingresos. No te preocupes, vamos paso a paso. Primero vamos a entender exactamente a dónde se va tu dinero.`;
    }

    addJarvisMessage("He procesado todos tus datos. Aquí tienes tu perfil financiero.", { type: 'FinancialProfileCard', data: { profile: currentProfile } });
    setTimeout(() => {
        addJarvisMessage(analysisMsg, { type: 'QuickReplyChips', data: ["Ver mi dashboard de gastos", "Quiero invertir mi disponible", "Activar mis agentes"]});
    }, 1500);
  };

  const handleEmbeddedConfirm = (data: any, stepIndex: number) => {
    switch (stepIndex) {
      case 1:
        updateField('income.monthly', data);
        handleOnboardingAnswer(data, `$${data}`, 2, "Anotado. ¿Tu ingreso es fijo cada mes o varía?", { type: 'ChipSelector', data: { options: ["Fijo cada mes", "Varía mucho", "Mezcla de ambos"] } });
        break;
      case 2:
        let incType = 'fixed';
        if(data === 'Varía mucho') incType = 'variable';
        if(data === 'Mezcla de ambos') incType = 'mixed';
        updateField('income.type', incType);
        handleOnboardingAnswer(data, data, 3, "¿Cuándo te suelen pagar?", { type: 'ChipSelector', data: { options: ["Quincenal", "Mensual", "Por proyecto"] } });
        break;
      case 3:
        let freq = 'monthly';
        if(data === 'Quincenal') freq = 'biweekly';
        if(data === 'Por proyecto') freq = 'project';
        updateField('income.frequency', freq);
        handleOnboardingAnswer(data, data, 4, "¿Tienes otros ingresos? (remesas, freelance, alquileres). Si no, déjalo en 0.", { type: 'MoneyInput', data: {} });
        break;
      case 4:
        updateField('income.otherIncome', data);
        handleOnboardingAnswer(data, `$${data}`, 5, "Ahora lo que sale fijo. ¿Cuánto pagas de vivienda al mes? (alquiler, hipoteca, o $0 si vives con familia)", { type: 'MoneyInput', data: {} });
        break;
      case 5:
        updateField('fixedExpenses.housing', data);
        handleOnboardingAnswer(data, `$${data}`, 6, "¿Cuánto se te va en servicios básicos? (luz, agua, internet, gas, teléfono)", { type: 'MoneyInput', data: {} });
        break;
      case 6:
        updateField('fixedExpenses.utilities', data);
        handleOnboardingAnswer(data, `$${data}`, 7, "¿Y en transporte mensual?", { type: 'MoneyInput', data: {} });
        break;
      case 7:
        updateField('fixedExpenses.transport', data);
        handleOnboardingAnswer(data, `$${data}`, 8, "Hablemos de comida. ¿Cuánto gastas al mes en mercado y comer en casa?", { type: 'MoneyInput', data: {} });
        break;
      case 8:
        updateField('variableExpenses.food', data);
        handleOnboardingAnswer(data, `$${data}`, 9, "¿Y en salidas, restaurantes y delivery?", { type: 'MoneyInput', data: {} });
        break;
      case 9:
        updateField('variableExpenses.entertainment', data);
        handleOnboardingAnswer(data, `$${data}`, 10, "¿Tienes deudas activas? (tarjetas, préstamos, cuotas)", { type: 'ChipSelector', data: { options: ["Sí, tengo deudas", "No, estoy limpio"] } });
        break;
      case 10:
        if (data === "Sí, tengo deudas") {
            updateField('debts.hasDebts', true);
            handleOnboardingAnswer(data, data, 10.5, "¿Cuánto debes en total y cuánto pagas cada mes?", { type: 'DebtInput', data: {} });
        } else {
            updateField('debts.hasDebts', false);
            handleOnboardingAnswer(data, data, 11, "Excelente. ¿Cuánto tienes ahorrado hoy en total?", { type: 'MoneyInput', data: {} });
        }
        break;
      case 10.5:
        updateField('debts.totalAmount', data.total);
        updateField('debts.monthlyPayment', data.monthly);
        handleOnboardingAnswer(data, `Total: $${data.total}, Pago: $${data.monthly}`, 11, "Entendido. ¿Cuánto tienes ahorrado hoy en total?", { type: 'MoneyInput', data: {} });
        break;
      case 11:
        updateField('savings.currentTotal', data);
        handleOnboardingAnswer(data, `$${data}`, 12, "Última. ¿Cuál es tu meta financiera principal para los próximos 12 meses?", { type: 'GoalInput', data: {} });
        break;
      case 12:
        updateField('goals.shortTerm', data.goal);
        updateField('goals.shortTermAmount', data.amount);
        updateField('onboardingComplete', true);
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: `${data.goal} ($${data.amount})`, timestamp: new Date() }]);
        setOnboardingStep(13); // Generating profile
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          finishOnboarding();
        }, 1500);
        break;
    }
  };

  const renderEmbedded = (embedded: Message['embedded']) => {
    if (!embedded) return null;
    switch (embedded.type) {
      case 'BalanceCard': return <BalanceCard {...embedded.data} />;
      case 'ScenarioCard': return <ScenarioCard {...embedded.data} onSelect={(label: string, monthly: number) => {
        handleSend(`Elijo el plan ${label}, con aporte de $${monthly} al mes. Ayúdame a ponerlo en marcha.`);
      }} />;
      case 'QuickReplyChips': return <QuickReplyChips chips={embedded.data} onSelect={(chip: string) => handleSend(chip)} />;
      case 'AgentCard': return <AgentCard {...embedded.data} />;
      case 'TransactionConfirmCard': return <TransactionConfirmCard {...embedded.data} onConfirm={() => {
        // Ejecución real e inmediata: el dinero se mueve en el store ANTES de
        // mostrar "Enviado"; no dependemos de que el modelo llame la función.
        const amount = Number(embedded.data.amount) || 0;
        const result = useUserProfileStore.getState().transferToVault(amount, 'Aprobado por el usuario');
        notify('Bóveda de Ahorro', `Recibiste $${amount}. Nuevo total: $${result.newVaultTotal}.`);
        addJarvisMessage(`Hecho. Transferí **$${amount}** a tu Bóveda. Nuevo total: **$${result.newVaultTotal}** · Disponible: $${Math.round(result.available * 100) / 100}.`);
      }} />;
      case 'InsightCard': return <InsightCard {...embedded.data} />;
      case 'InvestmentCard': return <InvestmentCard {...embedded.data} onInvest={() => {
        const amount = Number(embedded.data.amount) || 0;
        const product = embedded.data.product || 'Portafolio MIDAS';
        if (amount <= 0) return;
        const result = useUserProfileStore.getState().addInvestment(product, amount);
        notify('Agente Inversor', `Inversión de $${amount} en ${product} registrada.`);
        addJarvisMessage(`Inversión registrada: **$${amount}** en **${product}**. Total invertido: $${result.totalInvested} · Disponible: $${Math.round(result.available * 100) / 100}. Puedes verla en la pantalla del Inversor.`);
      }} />;
      case 'MoneyInput': return onboardingStep >= 1 && onboardingStep <= 11 ? <MoneyInput {...embedded.data} onConfirm={(val: number) => handleEmbeddedConfirm(val, onboardingStep)} /> : null;
      case 'ChipSelector': return onboardingStep >= 1 && onboardingStep <= 11 ? <ChipSelector {...embedded.data} onSelect={(val: string) => handleEmbeddedConfirm(val, onboardingStep)} /> : null;
      case 'DebtInput': return onboardingStep === 10.5 ? <DebtInput {...embedded.data} onConfirm={(val: any) => handleEmbeddedConfirm(val, 10.5)} /> : null;
      case 'GoalInput': return onboardingStep === 12 ? <GoalInput {...embedded.data} onConfirm={(val: any) => handleEmbeddedConfirm(val, 12)} /> : null;
      case 'FinancialProfileCard': return <FinancialProfileCard profile={getProfile()} />;
      case 'ActionPlanCard': return <ActionPlanCard {...embedded.data} onAccept={() => handleActionPlanAccept(embedded.data?.title)} />;
      case 'BigActionButtons': return <BigActionButtons {...embedded.data} onSelect={handleSend} />;
      default: return null;
    }
  };

  // Handlers for profile
  const handleToggleAgent = (id: string) => {
    setAgents(prev => {
      const next = prev.map(a => a.id === id ? { ...a, status: (a.status === 'active' ? 'paused' : 'active') as Agent['status'] } : a);
      const statusMap = Object.fromEntries(next.map(a => [a.id, a.status]));
      localStorage.setItem('midas_agents_status', JSON.stringify(statusMap));
      const toggled = next.find(a => a.id === id);
      if (toggled) {
        notify(toggled.name, toggled.status === 'active' ? 'Agente activado. Ya está trabajando para ti.' : 'Agente pausado. No ejecutará acciones hasta que lo reactives.');
      }
      return next;
    });
  };

  // La foto se comprime a 256px y se guarda en el dispositivo: sobrevive a
  // recargas y nunca sale del teléfono.
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, 256, 256);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setAvatarUrl(dataUrl);
        try { localStorage.setItem('midas_avatar', dataUrl); } catch { /* cuota llena: queda solo en memoria */ }
      }
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  };

  // Dictado por voz real (Web Speech API). Si el navegador no lo soporta,
  // Jarvis lo explica en el chat en lugar de fingir.
  const handleMic = () => {
    if (isListening) {
      speechRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      addJarvisMessage('Tu navegador no soporta dictado por voz todavía. En iPhone puedes usar el micrófono del teclado nativo: mantén presionada la tecla del micrófono y habla.');
      return;
    }
    const rec = new SR();
    speechRef.current = rec;
    rec.lang = 'es-ES';
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (event: any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) transcript += event.results[i][0].transcript;
      setInput(transcript);
    };
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    setIsListening(true);
    rec.start();
  };

  // --- Comandos de voz globales -------------------------------------------
  // El botón flotante escucha una orden y la enruta: pantallas directas por
  // palabra clave, o el chat de Jarvis para todo lo demás (que ya sabe
  // registrar transacciones, abrir pantallas y responder).
  const [isCommandListening, setIsCommandListening] = useState(false);
  const commandRef = useRef<any>(null);

  const closeAllOverlays = () => {
    setServiceScreen('none');
    setShowProfile(false);
    setProfileSection(null);
    setShowNotifications(false);
  };

  const routeVoiceCommand = (raw: string) => {
    const t = raw.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    if (!t.trim()) return;

    const wantsOpen = /(abre|abrir|muestra|muestrame|ensename|ve a|ir a|entra|llevame|quiero ver)/.test(t);
    const shortPhrase = t.trim().split(/\s+/).length <= 4;

    const screens: [RegExp, () => void][] = [
      [/negocio|mis productos|mis ventas|inventario/, () => { closeAllOverlays(); setShowProfile(true); setProfileSection('business'); }],
      [/inversor|inversion|invertir|portafolio/, () => { closeAllOverlays(); setServiceScreen('inversor'); }],
      [/pagador|pagos|pagar/, () => { closeAllOverlays(); setServiceScreen('pagador'); }],
      [/ahorrador|ahorro|boveda/, () => { closeAllOverlays(); setServiceScreen('ahorrador'); }],
      [/vigilante|monitoreo|movimientos/, () => { closeAllOverlays(); setServiceScreen('monitoreo'); }],
      [/negociador|suscripcion/, () => { closeAllOverlays(); setServiceScreen('negociador'); }],
      [/inflacion|escudo|dolar/, () => { closeAllOverlays(); setServiceScreen('anti_inflacion'); }],
      [/recordatorio|agenda|calendario/, () => { closeAllOverlays(); setServiceScreen('recordatorio'); }],
      [/\bmetas?\b/, () => { closeAllOverlays(); setServiceScreen('metas'); }],
      [/agentes|hub/, () => { closeAllOverlays(); setServiceScreen('agentes'); }],
      [/perfil|mi cuenta/, () => { closeAllOverlays(); setShowProfile(true); }],
    ];

    if (/(cierra|cerrar|volver|regresa|atras|salir)/.test(t)) { closeAllOverlays(); return; }
    if (/modo oscuro/.test(t)) { setIsDarkMode(true); return; }
    if (/modo claro/.test(t)) { setIsDarkMode(false); return; }

    if (wantsOpen || shortPhrase) {
      for (const [rx, action] of screens) {
        if (rx.test(t)) { action(); return; }
      }
    }

    // Todo lo demás va a Jarvis con la frase tal cual (registrar gastos,
    // preguntas, análisis): el chat es el cerebro universal de la app.
    closeAllOverlays();
    handleSend(raw);
  };

  const handleGlobalVoice = () => {
    if (isCommandListening) {
      commandRef.current?.stop();
      setIsCommandListening(false);
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      closeAllOverlays();
      addJarvisMessage('Tu navegador no soporta comandos de voz todavía. En iPhone puedes usar el micrófono del teclado nativo dentro del chat.');
      return;
    }
    const rec = new SR();
    commandRef.current = rec;
    rec.lang = 'es-ES';
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join(' ');
      routeVoiceCommand(transcript);
    };
    rec.onend = () => setIsCommandListening(false);
    rec.onerror = () => setIsCommandListening(false);
    setIsCommandListening(true);
    rec.start();
  };

  const handlePinSubmit = () => {
    if (pinAttempt === localStorage.getItem(PIN_KEY)) {
      setAppLocked(false);
      setPinAttempt('');
      setPinError(false);
    } else {
      setPinError(true);
      setPinAttempt('');
    }
  };

  const handleConnectBank = () => {
    setIsConnectingBank(true);
    setTimeout(() => {
      setIsConnectingBank(false);
      setBankConnected(true);
      // La vinculación persiste en el dispositivo y queda registrada.
      localStorage.setItem('midas_bank', bankName);
      notify('Conexión Bancaria', `${bankName} vinculado (modo demostración). Tus agentes ya pueden leer tus balances.`);
      setTimeout(() => setShowBankModal(false), 1000);
    }, 2500);
  };

  return (
    <div className="bg-bg-canvas min-h-[100dvh] flex items-center justify-center font-sans w-screen p-0 sm:py-8">
      <div className="flex flex-col h-[100dvh] sm:h-[850px] w-full max-w-[420px] rounded-[32px] mx-auto bg-bg-main relative premium-shadow sm:border border-border-subtle overflow-hidden shadow-2xl">
        {/* Candado de PIN: si el usuario lo activó en Seguridad, la app abre bloqueada */}
        {appLocked && (
          <div className="absolute inset-0 z-[200] crystal-bg flex flex-col items-center justify-center px-10">
            <SaturnLogo size={88} className="rounded-[24px] mb-8" />
            <p className="text-[#E9E4D4] text-sm font-semibold mb-1">MIDAS está bloqueada</p>
            <p className="text-[#8A8578] text-xs mb-6">Ingresa tu PIN de 4 dígitos</p>
            <input
              type="password" inputMode="numeric" maxLength={4} value={pinAttempt} autoFocus
              onChange={(e) => { setPinError(false); setPinAttempt(e.target.value.replace(/\D/g, '').slice(0, 4)); }}
              onKeyDown={(e) => e.key === 'Enter' && pinAttempt.length === 4 && handlePinSubmit()}
              className={`w-40 h-14 glass-panel rounded-2xl text-center text-2xl tracking-[10px] text-white outline-none ${pinError ? 'border-red-500' : ''}`}
              placeholder="••••"
              aria-label="PIN de desbloqueo"
            />
            {pinError && <p className="text-red-400 text-xs mt-3">PIN incorrecto, intenta de nuevo.</p>}
            <button
              onClick={handlePinSubmit}
              disabled={pinAttempt.length !== 4}
              className="mt-6 w-40 h-12 gold-gradient gold-glow rounded-2xl font-bold text-sm disabled:opacity-40"
            >
              Desbloquear
            </button>
          </div>
        )}
        {currentScreen !== 'chat' ? (
          <div className="flex-1 w-full h-full relative">
            <AnimatePresence mode="wait">
              {currentScreen === 'splash' && <SplashScreen key="splash" onComplete={handleSplashComplete} />}
              {currentScreen === 'onboarding' && <OnboardingCarousel key="onb" onSkip={() => setCurrentScreen('login')} />}
              {currentScreen === 'login' && <LoginScreen key="login" onComplete={() => setCurrentScreen('kyc')} />}
              {currentScreen === 'kyc' && <FacialKYCScreen key="kyc" onBack={() => setCurrentScreen('login')} onComplete={() => setCurrentScreen('userdata')} />}
              {currentScreen === 'userdata' && <UserDataScreen key="data" onComplete={handleUserDataComplete} />}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex-1 flex flex-col w-full h-full relative bg-bg-main overflow-hidden">
            {/* Top Bar */}
            <header className="h-14 flex flex-shrink-0 items-center justify-between px-6 bg-bg-main/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <SaturnLogo size={24} />
          <span className="font-black text-text-primary tracking-[0.2em] text-[15px] uppercase">MIDAS</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gold-deep" aria-label="Suite de agentes" onClick={() => setServiceScreen('agentes')}>
            <Cpu size={20} />
          </button>
          <div className="relative">
            <button className="text-gold-deep relative" aria-label="Notificaciones" onClick={() => {
              const opening = !showNotifications;
              setShowNotifications(opening);
              if (opening) useNotificationsStore.getState().markAllRead();
            }}>
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-0.5 bg-red-500 rounded-full text-[9px] font-black text-white flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-72 bg-bg-chat border border-border-subtle rounded-2xl shadow-xl p-3 z-50">
                <div className="text-[10px] uppercase font-bold text-text-secondary mb-2">
                  Notificaciones{notifications.length > 0 ? ` (${notifications.length})` : ''}
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.length > 0 ? notifications.map(n => (
                    <div key={n.id} className="p-2.5 bg-bg-bubble-jarvis rounded-xl text-xs">
                      <span className="font-bold">{n.title}</span>{' '}{n.text}
                      <div className="text-[9px] text-text-secondary mt-1">
                        {new Date(n.date).toLocaleString('es', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  )) : (
                    <div className="py-6 text-center text-xs text-text-secondary">
                      Sin novedades. Aquí verás lo que tus agentes hagan por ti.
                    </div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={() => useNotificationsStore.getState().clear()}
                    className="w-full mt-2 pt-2 border-t border-border-subtle text-[10px] font-bold text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Limpiar todo
                  </button>
                )}
              </div>
              </>
            )}
          </div>
          <button
            onClick={() => setShowProfile(true)}
            aria-label="Perfil"
            className="w-8 h-8 rounded-full bg-gold-pale border border-gold-primary overflow-hidden flex items-center justify-center relative"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={20} className="text-gold-deep" />
            )}
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto bg-bg-chat px-4 pt-4 pb-28 scrollbar-hide">
        <div className="space-y-6">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] min-w-0 break-words overflow-hidden rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                m.role === 'user' 
                  ? 'bg-gold-primary text-text-gold rounded-tr-none font-medium' 
                  : 'bg-bg-bubble-jarvis text-text-primary border border-gold-pale rounded-tl-none markdown-body'
              }`}>
                {m.role === 'user' ? (
                  m.content
                ) : (
                  <Markdown remarkPlugins={[remarkGfm]}>{m.content}</Markdown>
                )}
              </div>
              {renderEmbedded(m.embedded)}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-1 items-center px-4 py-2 bg-bg-bubble-jarvis border border-gold-pale rounded-full w-fit animate-pulse">
              <div className="w-1.5 h-1.5 bg-gold-primary rounded-full" />
              <div className="w-1.5 h-1.5 bg-gold-primary rounded-full delay-75" />
              <div className="w-1.5 h-1.5 bg-gold-primary rounded-full delay-150" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Bar */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pt-2 bg-gradient-to-t from-bg-main via-bg-main to-transparent z-10 w-full pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-3 bg-bg-chat border border-gold-pale rounded-full p-2 shadow-xl ring-1 ring-gold-pale/20">
          <button
            onClick={handleMic}
            className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gold-deep hover:bg-bg-main'}`}
            aria-label={isListening ? 'Detener dictado' : 'Dictar por voz'}
          >
            <Mic size={20} />
          </button>
          <input
            type="text"
            placeholder="¿En qué te ayudo hoy?"
            enterKeyHint="send"
            className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary px-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            aria-label="Enviar mensaje"
            className="w-10 h-10 gold-gradient gold-glow rounded-full flex items-center justify-center active:scale-95 transition-all disabled:opacity-50"
          >
            <ArrowUp size={20} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Profile Sidebar/Sheet */}
      <AnimatePresence>
        {showProfile && (
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 bg-bg-main z-40 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setShowProfile(false)} className="p-2 hover:bg-bg-bubble-jarvis rounded-full transition-colors bg-bg-chat shadow-sm border border-border-subtle">
                <ChevronLeft size={24} className="text-gold-deep" />
              </button>
              <h2 className="font-bold text-lg text-text-primary">Perfil</h2>
              <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="p-2 hover:bg-bg-bubble-jarvis rounded-full transition-colors bg-bg-chat shadow-sm border border-border-subtle">
                <Settings size={22} className="text-gold-deep" />
              </button>
            </div>

            {/* User Identity */}
            <div className="text-center mb-8 relative">
              <div className="w-24 h-24 rounded-full bg-gold-primary mx-auto mb-4 border-4 border-bg-main shadow-xl flex items-center justify-center relative overflow-hidden group">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-[#1A1A18]" />
                )}
                {isEditingProfile && (
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  </label>
                )}
              </div>
              {isEditingProfile ? (
                <input
                  value={profile.name}
                  onChange={e => updateField('name', e.target.value)}
                  className="text-2xl font-black bg-transparent border-b border-gold-primary text-center outline-none w-48 text-text-primary"
                />
              ) : (
                <h3 className="text-2xl font-black text-text-primary">{profile.name}</h3>
              )}
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="bg-gold-primary text-[#1A1A18] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm font-sans italic">
                  {profile.computed?.financialHealth === 'critical' ? 'AT RISK' : 'GOLD EDITION'}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-bg-chat rounded-3xl p-6 border border-border-subtle premium-shadow mb-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-gold-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              <div className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mb-1">Disponible p/Ahorro</div>
              <div className="text-4xl font-black text-gold-deep tracking-tight">${profile.computed?.availableToSave.toFixed(2) || '0.00'}</div>
              <div className="h-px bg-border-subtle my-5" />
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-[9px] text-text-secondary uppercase font-bold tracking-wider mb-1">Ahorro Actual</div>
                  <div className="text-sm font-bold text-text-primary">${profile.savings?.currentTotal || '0'}</div>
                </div>
                <div className="text-center border-x border-border-subtle">
                   <div className="text-[9px] text-text-secondary uppercase font-bold tracking-wider mb-1">Ingresos</div>
                  <div className="text-sm font-bold text-text-primary">${profile.computed?.totalIncome || '0'}</div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] text-text-secondary uppercase font-bold tracking-wider mb-1">Deuda Mensual</div>
                  <div className="text-sm font-bold text-text-primary">${profile.computed?.monthlyDebtPayment || '0'}</div>
                </div>
              </div>
            </div>

            {/* Transactions */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-5">
                <h4 className="font-black flex items-center gap-2 text-text-primary">
                  <CreditCard size={18} className="text-gold-primary" />
                  Últimos Movimientos
                </h4>
              </div>
              <div className="space-y-3">
                {profile.transactions?.length > 0 ? profile.transactions.slice().reverse().slice(0, 5).map(tx => (
                  <div key={tx.id} className="bg-bg-chat border border-border-subtle rounded-2xl p-4 flex items-center justify-between premium-shadow hover:border-gold-primary/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-text-primary ${tx.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        {tx.type === 'income' ? <ArrowUp size={20} className="text-green-500" /> : <ChevronRight size={20} className="text-red-500 rotate-90" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-text-primary">{tx.category}</div>
                        <div className="text-[10px] text-text-secondary mt-0.5">{tx.description || (tx.type === 'income' ? 'Ingreso registrado' : 'Gasto registrado')}</div>
                      </div>
                    </div>
                    <div className={`font-bold ${tx.type === 'income' ? 'text-green-500' : 'text-text-primary'}`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-6 border border-border-subtle rounded-2xl border-dashed">
                     <p className="text-sm text-text-secondary">No tienes movimientos recientes.</p>
                     <p className="text-[10px] text-text-secondary mt-1">Escríbelos en el chat para guardarlos.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bank Connection */}
            <div className="mb-8">
               <div className="bg-bg-chat border border-border-subtle rounded-2xl p-4 flex items-center justify-between premium-shadow">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-bg-bubble-jarvis flex items-center justify-center text-text-primary">
                        <Building size={20} />
                     </div>
                     <div>
                        <div className="text-sm font-bold text-text-primary">Conexión Bancaria</div>
                        <div className="text-[10px] text-text-secondary mt-0.5">{bankConnected ? `${bankName} · vinculado (demo)` : 'Acceso para los agentes'}</div>
                     </div>
                  </div>
                  <button 
                    onClick={() => { if(!bankConnected) setShowBankModal(true) }}
                    className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${bankConnected ? 'bg-bg-bubble-jarvis text-text-primary border border-border-subtle' : 'bg-gold-primary text-black'}`}
                  >
                     {bankConnected ? 'Conectado' : 'Conectar'}
                  </button>
               </div>
            </div>

            {/* Active Agents */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-5">
                <h4 className="font-black flex items-center gap-2 text-text-primary">
                  <Cpu size={18} className="text-gold-primary" />
                  Agentes de Inteligencia
                </h4>
                <button 
                  onClick={() => setServiceScreen('agentes')}
                  className="text-[10px] font-bold text-gold-deep border border-gold-primary px-3 py-1 rounded-full hover:bg-gold-primary hover:text-black transition-colors"
                >
                  Ver HUB de Agentes
                </button>
              </div>
              <div className="space-y-3">
                {agents.map(agent => (
                  <div key={agent.id} className="bg-bg-chat border border-border-subtle rounded-2xl p-4 flex items-center justify-between premium-shadow hover:border-gold-primary/30 transition-colors cursor-pointer" onClick={() => {
                    const typeMap: Record<string, any> = {
                      bill_payer: 'pagador', 
                      watcher: 'monitoreo', 
                      saver: 'ahorrador', 
                      investor: 'inversor', 
                      negotiator: 'negociador', 
                      anti_inflation: 'anti_inflacion',
                      goals: 'metas',
                      reminder: 'recordatorio'
                    };
                    if (typeMap[agent.type]) setServiceScreen(typeMap[agent.type]);
                  }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-bg-bubble-jarvis flex items-center justify-center text-gold-deep border border-gold-primary/10">
                        <Zap size={20} />
                      </div>
                      <div className="pr-2">
                        <div className="text-sm font-bold text-text-primary">{agent.name}</div>
                        <div className="text-[10px] text-text-secondary mt-0.5 leading-tight">{agent.description}</div>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleToggleAgent(agent.id); }}
                      className={`w-12 h-6 flex-shrink-0 rounded-full relative transition-colors ${agent.status === 'active' ? 'bg-gold-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                      <div className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${agent.status === 'active' ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

              {/* Menu Options */}
              <div className="space-y-2 pb-10">
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="w-full flex items-center justify-between p-4 bg-bg-chat border border-gold-pale rounded-2xl hover:bg-gold-pale transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isDarkMode ? <Moon size={20} className="text-gold-deep" /> : <Sun size={20} className="text-gold-deep" />}
                    <span className="text-sm font-bold text-text-primary">Apariencia (Oscuro / Claro)</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? 'bg-gold-primary' : 'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${isDarkMode ? 'right-0.5' : 'left-0.5'}`} />
                  </div>
                </button>
                <button onClick={() => setProfileSection('business')} className="w-full flex items-center justify-between p-4 gold-gradient gold-glow rounded-2xl transition-all">
                  <div className="flex items-center gap-3">
                    <Briefcase size={20} />
                    <div className="text-left">
                      <span className="text-sm font-bold block">Mi Negocio</span>
                      <span className="text-[10px] opacity-80">Productos, ventas, gastos y ganancia real</span>
                    </div>
                  </div>
                  <ChevronRight size={18} />
                </button>
                {([
                  { icon: Shield, label: 'Seguridad y Privacidad', section: 'security' },
                  { icon: CreditCard, label: 'Métodos de Pago', section: 'payments' },
                  { icon: GraduationCap, label: 'Educación Financiera', section: 'education' },
                  { icon: Info, label: 'Ayuda y Soporte', section: 'help' },
                ] as { icon: any; label: string; section: ProfileSectionId }[]).map((item, i) => (
                  <button key={i} onClick={() => setProfileSection(item.section)} className="w-full flex items-center justify-between p-4 bg-bg-chat border border-gold-pale rounded-2xl hover:bg-gold-pale transition-colors">
                    <div className="flex items-center gap-3">
                      <item.icon size={20} className="text-gold-deep" />
                      <span className="text-sm font-bold text-text-primary">{item.label}</span>
                    </div>
                    <ChevronRight size={18} className="text-text-secondary" />
                  </button>
                ))}
                <button
                  onClick={() => {
                    useUserProfileStore.getState().resetProfile();
                    localStorage.clear(); // Clears midas_user, midas_messages, etc
                    setMessages([]);
                    setShowProfile(false);
                    window.location.reload();
                  }}
                  className="w-full flex items-center gap-3 p-4 text-danger font-bold hover:bg-red-50 dark:hover:bg-red-950/30 rounded-2xl transition-colors mt-4"
                >
                  <LogOut size={20} />
                  <span className="text-sm">Restablecer App (Pruebas)</span>
                </button>
              </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Secciones del perfil (Seguridad, Pagos, Educación, Ayuda) */}
      <AnimatePresence>
        {profileSection === 'security' && <SecuritySection key="sec" onClose={() => setProfileSection(null)} />}
        {profileSection === 'payments' && <PaymentsSection key="pay" onClose={() => setProfileSection(null)} />}
        {profileSection === 'education' && (
          <EducationSection
            key="edu"
            onClose={() => setProfileSection(null)}
            onAskJarvis={(prompt) => {
              // Cierra el perfil y lleva la pregunta directo a Jarvis con los
              // datos reales del usuario.
              setProfileSection(null);
              setShowProfile(false);
              handleSend(prompt);
            }}
          />
        )}
        {profileSection === 'help' && <HelpSection key="help" onClose={() => setProfileSection(null)} />}
        {profileSection === 'business' && (
          <BusinessScreen
            key="biz"
            onClose={() => setProfileSection(null)}
            onAskJarvis={(prompt) => {
              setProfileSection(null);
              setShowProfile(false);
              handleSend(prompt);
            }}
          />
        )}
      </AnimatePresence>

      {/* Bank Integration Modal */}
      <AnimatePresence>
        {showBankModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-bg-main/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-bg-chat w-full max-w-sm rounded-3xl border border-border-subtle p-6 premium-shadow relative"
            >
              <button 
                onClick={() => setShowBankModal(false)}
                className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary transition-colors bg-bg-bubble-jarvis rounded-full"
              >
                <X size={20} />
              </button>
              
              <div className="text-center mb-6 mt-4">
                <div className="w-16 h-16 bg-bg-bubble-jarvis border border-border-subtle rounded-2xl mx-auto flex items-center justify-center mb-4">
                  <ShieldCheck size={32} className="text-gold-deep" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">Conexión Segura</h3>
                <p className="text-xs text-text-secondary leading-relaxed">MIDAS utiliza cifrado de nivel bancario (AES-256) para proteger tus credenciales. Nunca almacenamos tu contraseña.</p>
              </div>

              {!bankConnected ? (
                <>
                  <div className="space-y-4 mb-6">
                    <div className="bg-bg-bubble-jarvis p-3 rounded-xl border border-border-subtle">
                      <div className="text-[10px] uppercase font-bold text-text-secondary mb-1 tracking-wider">Institución Bancaria</div>
                      <select value={bankName} onChange={(e) => setBankName(e.target.value)} className="w-full bg-transparent text-sm font-semibold outline-none text-text-primary appearance-none cursor-pointer">
                        <option>Banesco</option>
                        <option>Mercantil</option>
                        <option>Provincial</option>
                        <option>Bank of America</option>
                        <option>Chase</option>
                      </select>
                    </div>
                    <div className="bg-bg-bubble-jarvis p-3 rounded-xl border border-border-subtle">
                      <div className="text-[10px] uppercase font-bold text-text-secondary mb-1 tracking-wider">Usuario / Cédula</div>
                      <input type="text" placeholder="Ingresa tu usuario" className="w-full bg-transparent text-sm font-semibold outline-none text-text-primary" />
                    </div>
                    <div className="bg-bg-bubble-jarvis p-3 rounded-xl border border-border-subtle">
                      <div className="text-[10px] uppercase font-bold text-text-secondary mb-1 tracking-wider">Contraseña</div>
                      <div className="flex items-center gap-2">
                        <Lock size={14} className="text-text-secondary" />
                        <input type="password" placeholder="••••••••" className="w-full bg-transparent text-sm font-semibold outline-none text-text-primary" />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleConnectBank}
                    disabled={isConnectingBank}
                    className="w-full py-4 bg-gold-primary text-black font-bold rounded-xl shadow-lg hover:bg-gold-bright transition-all flex justify-center items-center h-14 uppercase tracking-widest text-[13px]"
                  >
                    {isConnectingBank ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Vincular Cuenta"
                    )}
                  </button>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full mx-auto flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} className="text-green-500" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary mb-1">¡Cuenta Vinculada!</h4>
                  <p className="text-sm text-text-secondary">Tus agentes ahora tienen acceso a tus balances en tiempo real.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante de voz: disponible sobre cualquier pantalla de la app */}
      <button
        onClick={handleGlobalVoice}
        aria-label={isCommandListening ? 'Escuchando… toca para detener' : 'Dar una instrucción por voz'}
        className={`absolute bottom-28 right-4 z-[80] p-3.5 rounded-full shadow-xl transition-all active:scale-95 ${
          isCommandListening ? 'bg-red-500 text-white animate-pulse' : 'gold-gradient gold-glow'
        }`}
      >
        <Mic size={22} />
      </button>

      {/* Service Screens */}
      <AnimatePresence>
        {serviceScreen === 'monitoreo' && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="absolute inset-0 z-50">
            <MonitoreoScreen onBack={handleServiceBack} />
          </motion.div>
        )}
        {serviceScreen === 'pagador' && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="absolute inset-0 z-50">
            <PagadorScreen onBack={handleServiceBack} />
          </motion.div>
        )}
        {serviceScreen === 'ahorrador' && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="absolute inset-0 z-50">
            <AhorradorScreen onBack={handleServiceBack} />
          </motion.div>
        )}
        {serviceScreen === 'inversor' && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="absolute inset-0 z-50">
            <InversorScreen onBack={handleServiceBack} />
          </motion.div>
        )}
        {serviceScreen === 'negociador' && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="absolute inset-0 z-50">
            <NegociadorScreen onBack={handleServiceBack} />
          </motion.div>
        )}
        {serviceScreen === 'anti_inflacion' && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="absolute inset-0 z-50">
            <AntiInflacionScreen onBack={handleServiceBack} />
          </motion.div>
        )}
        {serviceScreen === 'metas' && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="absolute inset-0 z-50">
            <MetasScreen onBack={handleServiceBack} />
          </motion.div>
        )}
        {serviceScreen === 'recordatorio' && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="absolute inset-0 z-50">
            <RecordatorioScreen onBack={handleServiceBack} />
          </motion.div>
        )}
        {serviceScreen === 'agentes' && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="absolute inset-0 z-50">
            <AgentHubScreen 
              onBack={() => setServiceScreen('none')} 
              onOpenAgent={(type) => {
                setLastServiceScreen('agentes');
                setServiceScreen(type as any);
              }} 
            />
          </motion.div>
        )}
      </AnimatePresence>
          </div>
        )}

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  );
}
