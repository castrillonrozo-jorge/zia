
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
import { Renacer } from './views/Renacer';
import { ExchangeCalculator } from './components/ExchangeCalculator';
import { RechargeModal } from './components/RechargeModal';
import { TransferModal } from './components/TransferModal';
import { QRScannerModal } from './components/QRScannerModal';
import { SearchModal } from './components/SearchModal';
import { GlobalBackground } from './components/GlobalBackground';
import { DynamicIsland } from './components/DynamicIsland';
import { AgentChat } from './components/AgentChat';
import { WelcomeTour } from './components/WelcomeTour';

const App: React.FC = () => {
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
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleNavigate = useCallback((view: AppView, params?: { newsId?: string | number }) => {
    if (view === 'transparency' && params?.newsId) {
      setSelectedNewsId(params.newsId);
    } else {
      setSelectedNewsId(null);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0 });
  }, []);

  const [showTour, setShowTour] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('home');
    setShowTour(true);
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
      case 'renacer': return <Renacer onNavigate={handleNavigate} />;
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
      case 'renacer': return 'Renacer 2026';
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

      <AgentChat
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        userName={userName}
        currentView={currentView}
        onNavigate={handleNavigate}
        showStatus={showStatus}
      />

      {showTour && currentView === 'home' && (
        <WelcomeTour onFinish={() => setShowTour(false)} />
      )}

      {/* Fade-out Mask */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F2F2F7] dark:from-[#1C1C1E] via-[#F2F2F7]/80 dark:via-[#1C1C1E]/80 to-transparent pointer-events-none z-[90]" />

      <BottomNav currentView={currentView} setView={handleNavigate} />
    </div>
  );
};

export default App;
