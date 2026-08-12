
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Login } from './views/Login';
import { SplashScreen } from './components/SplashScreen';
import { Home } from './views/Home';
import { Wallet } from './views/Wallet';
import { IDRenewal } from './views/IDRenewal';
import { Payments } from './views/Payments';
import { Transparency } from './views/Transparency';
import { Health } from './views/Health';
import { Seniat } from './views/Seniat';
import { BusinessRegistration } from './views/BusinessRegistration';
import { INTT } from './views/INTT';
import { Employment } from './views/Employment';
import { Profile } from './views/Profile';
import { Notifications } from './views/Notifications';
import { MyProcedures } from './views/MyProcedures';
import { Economy } from './views/Economy';
import { NationalPride } from './views/NationalPride';
import SecurityView from './views/Security';
import { Icons } from './components/Icons';
import { ExchangeCalculator } from './components/ExchangeCalculator';
import { RechargeModal } from './components/RechargeModal';
import { TransferModal } from './components/TransferModal';
import { QRScannerModal } from './components/QRScannerModal';
import { SearchModal } from './components/SearchModal';
import { GlobalBackground } from './components/GlobalBackground';
import { DynamicIsland } from './components/DynamicIsland';
import { formatMessageText } from './utils/formatMessage';
import { useVibration } from './hooks/useVibration';

const App: React.FC = () => {
  const { vibrate } = useVibration();
  const [currentView, setCurrentView] = useState<AppView>('splash');
  const [selectedNewsId, setSelectedNewsId] = useState<string | number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [balance, setBalance] = useState(12450);
  const defaultPhoto = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400';
  const oldPhoto = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=400';
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('agiliza_user_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.photo === oldPhoto) {
          parsed.photo = defaultPhoto;
        }
        return parsed;
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    return {
      name: 'Jorge Eduardo Pérez Rodríguez',
      username: 'jorge_eduardo_ven',
      email: 'j.eduardo@portal.ve',
      phone: '+58 412 123 4567',
      cedula: '12.345.678',
      location: 'Caracas, Distrito Capital',
      accountType: 'Cuenta Corriente VIP',
      photo: defaultPhoto
    };
  });

  useEffect(() => {
    localStorage.setItem('agiliza_user_data', JSON.stringify(userData));
  }, [userData]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dynamicIsland, setDynamicIsland] = useState<{message: string, type: 'success' | 'info' | 'warning' | 'error'} | null>(null);
  const userName = userData.name.split(' ')[0] + " " + (userData.name.split(' ')[1] || '');

  const showStatus = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setDynamicIsland({ message, type });
  };

  const handleRechargeSuccess = (amount: number) => {
    setBalance(prev => prev + amount);
    showStatus(`Recarga de $${amount} Exitosa`, 'success');
  };

  const handleTransferSuccess = (amount: number) => {
    setBalance(prev => prev - amount);
    showStatus(`Transferencia Exitosa`, 'success');
  };

  const handleQRSuccess = (amount: number) => {
    setBalance(prev => prev - amount);
    showStatus(`Pago QR Exitoso`, 'success');
  };
  
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(() => {
    if (typeof localStorage !== 'undefined') return localStorage.getItem('custom_gemini_api_key') || '';
    return '';
  });
  const [selectedModel, setSelectedModel] = useState(() => {
    if (typeof localStorage !== 'undefined') return localStorage.getItem('venia_selected_model') || 'gemini-3.1-flash-lite';
    return 'gemini-3.1-flash-lite';
  });
  const [useSearch, setUseSearch] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('venia_use_search');
      return stored !== null ? stored === 'true' : false;
    }
    return false;
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
  const [aiMessages, setAiMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: `¡Hola, ${userName}! Soy VenIA, tu Asistente de IA Oficial y Especializado en trámites de Venezuela para Agilizarte todo. Estoy aquí para guiarte de forma directa y fácil en tus gestiones del SAIME, SENIAT, INTT, SAREN y más. ¿Qué trámite deseas consultar o agilizar hoy?` }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, isAiLoading]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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
    if (isAIChatOpen) {
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
  }, [isAIChatOpen, currentView]);

  const handleNavigate = useCallback((view: AppView, params?: { newsId?: string | number }) => {
    if (view === 'transparency' && params?.newsId) {
      setSelectedNewsId(params.newsId);
    } else {
      setSelectedNewsId(null);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0 });
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('home');
  };

  const handleSendAiMessage = async (text?: string | any) => {
    const messageToSend = (typeof text === 'string' ? text : '') || aiInput;
    if (!messageToSend || !messageToSend.trim() || isAiLoading) return;

    // Vibración haptica al enviar mensaje o seleccionar sugerencia
    vibrate('heavy');

    setAiInput('');
    setAiMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
    setIsAiLoading(true);

    // Bypass específico para pruebas de Currículum como Consultor Élite
    const lowerMessage = messageToSend.toLowerCase();
    if (lowerMessage.includes('curriculo') || lowerMessage.includes('currículum') || lowerMessage.includes('cv') || lowerMessage.includes('hoja de vida')) {
      setTimeout(() => {
        setAiMessages(prev => [...prev, { role: 'ai', text: "¡Excelente, Jorge Eduardo! Vamos a estructurar tu Currículum Vitae con un enfoque premium y de alto impacto para el mercado actual. Para empezar, desarrollemos tu Perfil Profesional. Como especialista en desarrollo web y diseño UI/UX con experiencia gestionando portales institucionales y e-commerce, tu gancho inicial debe ser contundente. ¿Prefieres que armemos primero tu resumen ejecutivo o pasamos directamente a estructurar tu experiencia con logros clave?" }]);
        setIsAiLoading(false);
      }, 800);
      return;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: messageToSend, 
          userName, 
          apiKey: customApiKey,
          model: selectedModel,
          useSearch: useSearch
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error) {
          throw new Error(errorData.error);
        }
        throw new Error('Server error');
      }

      const data = await response.json();

      if (data.functionCall) {
        const call = data.functionCall;
        if (call.name === 'navigateApp') {
          const view = call.args.view as AppView;
          handleNavigate(view);
          
          let linkText = "";
          if (view === 'id-renewal') {
            linkText = "\n\n🔗 **Enlace oficial de este organismo:** [Canal de Citas SAIME](https://www.saime.gob.ve/)";
          } else if (view === 'seniat') {
            linkText = "\n\n🔗 **Enlace oficial de este organismo:** [Portal del SENIAT](https://www.seniat.gob.ve/) o [Declaraciones SENIAT](http://declaraciones.seniat.gob.ve/)";
          } else if (view === 'payments') {
            linkText = "\n\n🔗 **Enlace oficial de este organismo:** [Acceso Plataforma Patria](https://persona.patria.org.ve/) o [Portal Patria](https://portada.patria.org.ve/)";
          } else if (view === 'business-reg') {
            linkText = "\n\n🔗 **Enlace oficial de este organismo:** [Trámites SAREN](https://tramites.saren.gob.ve/) o [Página del SAREN](https://www.saren.gob.ve/)";
          } else if (view === 'intt') {
            linkText = "\n\n🔗 **Enlace oficial de este organismo:** [INTT en Línea](http://www.intt.gob.ve/)";
          } else if (view === 'employment') {
            linkText = "\n\n🔗 **Enlace oficial de este organismo:** [Sistema IVSS](http://www.ivss.gov.ve/)";
          } else if (view === 'health') {
            linkText = "\n\n🔗 **Enlace oficial de este organismo:** [Sistema IVSS](http://www.ivss.gov.ve/)";
          } else if (view === 'economy') {
            linkText = "\n\n🔗 **Enlace oficial de este organismo:** [Banco Central de Venezuela (BCV)](http://www.bcv.org.ve/)";
          } else if (view === 'transparency') {
            linkText = "\n\n🔗 **Enlace oficial de este organismo:** [Portal Legislativo de la Asamblea Nacional](http://www.asambleanacional.gob.ve/)";
          } else if (view === 'national-pride') {
            linkText = "\n\n🔗 **Enlace oficial de este organismo:** [Ministerio de Cultura](http://www.mincultura.gob.ve/)";
          }

          setAiMessages(prev => [...prev, { role: 'ai', text: `¡Perfecto! Te he llevado de inmediato a la sección de **${view === 'id-renewal' ? 'SAIME (Identidad)' : view === 'seniat' ? 'SENIAT (Tributos)' : view === 'payments' ? 'Pagos y Servicios' : view === 'transparency' ? 'Transparencia Ciudadana' : view === 'health' ? 'Salud' : view === 'business-reg' ? 'SAREN (Empresas/Apostilla)' : view === 'intt' ? 'INTT (Vehículos)' : view === 'employment' ? 'Empleo e IVSS' : view === 'economy' ? 'Economía' : view === 'national-pride' ? 'Cultura' : view}** en el fondo del portal para que lo tengas listo.${linkText}
          
Como tu asistente oficial VenIA, puedo seguir orientándote desde aquí. ¿Tienes alguna pregunta sobre los requisitos o pasos a seguir?` }]);
          setIsAiLoading(false);
          return;
        }
        
        if (call.name === 'getExchangeRate') {
          setAiMessages(prev => [...prev, { role: 'ai', text: `La tasa de cambio oficial de hoy publicada por el Banco Central de Venezuela es de **554.42 VED/USD** para el Dólar y de **645.67 VED/EUR** para el Euro, ${userName}.` }]);
          setIsAiLoading(false);
          return;
        }

        if (call.name === 'getProcedureStatus') {
          setAiMessages(prev => [...prev, { role: 'ai', text: `Tu trámite está en revisión final. Se estima aprobación en 48 horas, ${userName}.` }]);
          setIsAiLoading(false);
          return;
        }

        if (call.name === 'calculateTax') {
          const amount = call.args.amount as number;
          const taxType = call.args.taxType as string;
          const tax = taxType === 'IVA' ? amount * 0.16 : amount * 0.34;
          setAiMessages(prev => [...prev, { role: 'ai', text: `El impuesto (${taxType}) para ${amount} es de ${tax.toFixed(2)}. Total a pagar: ${(amount + tax).toFixed(2)}, ${userName}.` }]);
          setIsAiLoading(false);
          return;
        }
      }

      setAiMessages(prev => [...prev, { role: 'ai', text: data.text || "Entendido." }]);
    } catch (error: any) {
      setAiMessages(prev => [...prev, { role: 'ai', text: error.message && error.message !== 'Server error' ? error.message : 'Error de conexión con VenIA. Intenta más tarde.' }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const saveApiKey = (key: string) => {
    localStorage.setItem('custom_gemini_api_key', key);
    setCustomApiKey(key);
    setShowApiSettings(false);
  };

  if (currentView === 'splash') {
    return <SplashScreen onComplete={() => setCurrentView('login')} />;
  }

  if (currentView === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'home': return (
        <Home 
          onNavigate={handleNavigate} 
        />
      );
      case 'id-renewal': return <IDRenewal />;
      case 'wallet': return <Wallet balance={balance} onOpenRecharge={() => setIsRechargeOpen(true)} onOpenTransfer={() => setIsTransferOpen(true)} onOpenQR={() => setIsQRScannerOpen(true)} />;
      case 'seniat': return <Seniat />;
      case 'payments': return <Payments onNavigate={handleNavigate} />;
      case 'transparency': return <Transparency selectedNewsId={selectedNewsId} onBack={() => handleNavigate('home')} />;
      case 'health': return <Health />;
      case 'business-reg': return <BusinessRegistration />;
      case 'intt': return <INTT />;
      case 'employment': return <Employment />;
      case 'profile': return <Profile balance={balance} onOpenRecharge={() => setIsRechargeOpen(true)} onOpenTransfer={() => setIsTransferOpen(true)} userData={userData} setUserData={setUserData} />;
      case 'notifications': return <Notifications />;
      case 'my-procedures': return <MyProcedures />;
      case 'economy': return <Economy />;
      case 'national-pride': return <NationalPride />;
      case 'security': return <SecurityView />;
      default: return <Home onNavigate={handleNavigate} />;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'home': return 'Agiliza';
      case 'wallet': return 'Billetera';
      case 'id-renewal': return 'Saime';
      case 'seniat': return 'Seniat';
      case 'payments': return 'Pagos';
      case 'transparency': return 'Transparencia';
      case 'health': return 'Salud';
      case 'business-reg': return 'Saren';
      case 'intt': return 'INTT';
      case 'economy': return 'Economía';
      case 'national-pride': return 'Lo Nuestro';
      case 'profile': return '';
      default: return 'Agiliza';
    }
  };

  return (
    <div className={`max-w-md mx-auto min-h-screen relative flex flex-col transition-all duration-500 shadow-none md:my-8 md:border md:border-black/5 overflow-hidden ${isDarkMode ? 'bg-[#05070A] text-slate-100' : 'bg-[#FAFAFA] text-slate-900'}`}>
      <GlobalBackground />
      <DynamicIsland 
        message={dynamicIsland?.message || null} 
        type={dynamicIsland?.type} 
        onClear={() => setDynamicIsland(null)} 
      />
      <Header 
        title={getTitle()} 
        showBack={currentView !== 'home' && currentView !== 'profile'} 
        onBack={() => {
          if (currentView === 'wallet') {
            handleNavigate('payments');
          } else {
            handleNavigate('home');
          }
        }} 
        onNotifications={() => handleNavigate('notifications')}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenAI={() => setIsAIChatOpen(true)}
        onSearch={() => setIsSearchOpen(true)}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
      
      <AnimatePresence mode="wait">
        <motion.main 
          key={currentView}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          className="flex-grow pb-24 px-4"
        >
          <div style={{ maxWidth: '430px', margin: '0 auto', overflowX: 'hidden' }}>
            {renderView()}
          </div>
        </motion.main>
      </AnimatePresence>

      <ExchangeCalculator 
        isOpen={isCalculatorOpen} 
        onClose={() => setIsCalculatorOpen(false)} 
      />

      <RechargeModal 
        isOpen={isRechargeOpen} 
        onClose={() => setIsRechargeOpen(false)} 
        onSuccess={handleRechargeSuccess}
      />

      <TransferModal 
        isOpen={isTransferOpen} 
        onClose={() => setIsTransferOpen(false)} 
        onSuccess={handleTransferSuccess}
        balance={balance}
      />

      <QRScannerModal 
        isOpen={isQRScannerOpen} 
        onClose={() => setIsQRScannerOpen(false)} 
        onSuccess={handleQRSuccess}
      />

      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} onNavigate={handleNavigate} />}

      {/* AI Chat Overlay - Redesigned */}
      {isAIChatOpen && (
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
                    background: 'linear-gradient(135deg, #3A69A3 0%, #4F84C4 100%)',
                    boxShadow: 'none',
                    border: '1px solid rgba(129, 140, 248, 0.4)',
                  }}
                  className="w-9 h-9 rounded-full flex items-center justify-center relative overflow-hidden group"
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
                  onClick={() => setIsAIChatOpen(false)}
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
              
              {/* Quick Suggestions Chips */}
              {!isAiLoading && aiMessages.length === 1 && (
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
                  className="w-11 h-11 rounded-xl bg-[#4F84C4] hover:bg-[#4F84C4] text-white flex items-center justify-center hover:scale-95 transition-all"
                >
                  <Icons.Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fade-out Mask */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F2F2F7] dark:from-[#1C1C1E] via-[#F2F2F7]/80 dark:via-[#1C1C1E]/80 to-transparent pointer-events-none z-[90]" />

      <BottomNav currentView={currentView} setView={handleNavigate} />
    </div>
  );
};

export default App;
