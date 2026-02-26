import React, { useState, useRef } from 'react';
import { 
  Home, 
  Bed, 
  Wallet, 
  Shield, 
  User, 
  Sparkles, 
  Send, 
  X, 
  MapPin, 
  Star, 
  QrCode, 
  AlertTriangle, 
  Navigation, 
  ChevronRight,
  Zap,
  Coffee,
  Utensils,
  Trophy,
  Globe,
  Camera,
  Search,
  ArrowRightLeft,
  Compass,
  CheckCircle2,
  Lock,
  MessageCircle,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Github
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';

// --- Types ---
type Tab = 'home' | 'hospedaje' | 'gamificacion' | 'seguridad' | 'perfil';

interface Destination {
  id: number;
  nombre: string;
  categoria: string;
  imagen: string;
  desc: string;
  paseos?: string[];
  hospedajes?: string[];
  restaurantes?: string[];
  guias?: string[];
}

interface Accommodation {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  fullResuelto: boolean;
  image: string;
  hasWhatsApp?: boolean;
}

// --- Constants ---
const IMAGENES = {
    canaima: "https://images.unsplash.com/photo-1611048267451-e6ed91dc97f8?auto=format&fit=crop&w=800&q=80", 
    losRoques: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80", 
    caracas: "https://images.unsplash.com/photo-1605548109944-9040d5976339?auto=format&fit=crop&w=800&q=80", 
    morrocoy: "https://images.unsplash.com/photo-1594916297801-1e9b252184d0?auto=format&fit=crop&w=800&q=80", 
    merida: "https://images.unsplash.com/photo-1589920216790-257c83f62804?auto=format&fit=crop&w=800&q=80", 
    venezuelaGeneral: "https://images.unsplash.com/photo-1566847438217-76e82d383f84?auto=format&fit=crop&w=800&q=80" 
};

// --- Mock Data ---
const DESTINOS_VIP: Destination[] = [
  {
    id: 1,
    nombre: "Los Roques",
    desc: "El archipiélago más exclusivo del Caribe.",
    imagen: "https://image.pollinations.ai/prompt/hyperrealistic%20photo%20of%20Los%20Roques%20Venezuela%20archipelago%20turquoise%20caribbean%20water%20white%20sand%20sunny%20day%20aerial%20view?width=800&height=600&nologo=true",
    categoria: "Playa",
    paseos: ["Cayo de Agua", "Madrisquí", "Francisquí"],
    hospedajes: ["Posada Natura Viva", "Posada Mediterráneo"],
    restaurantes: ["Awa Bar", "Bora del Mar"],
    guias: ["Capitán Pedro", "Guía local"]
  },
  {
    id: 2,
    nombre: "Salto Ángel",
    desc: "La caída de agua más alta del mundo (Kerepakupai Vená).",
    imagen: "https://image.pollinations.ai/prompt/hyperrealistic%20photo%20of%20Angel%20Falls%20Venezuela%20tallest%20waterfall%20tepuy%20mountain%20jungle%20mist%20cinematic?width=800&height=600&nologo=true",
    categoria: "Selva",
    paseos: ["Navegación río Churún", "Mirador Laime"],
    hospedajes: ["Campamento Ucaima", "Waku Lodge"],
    restaurantes: ["Comida típica"],
    guias: ["Guías Pemones"]
  },
  {
    id: 3,
    nombre: "Monte Roraima",
    desc: "El mundo perdido. Trekking ancestral.",
    imagen: "https://image.pollinations.ai/prompt/hyperrealistic%20photo%20of%20Mount%20Roraima%20Venezuela%20table%20top%20mountain%20above%20clouds%20prehistoric%20landscape?width=800&height=600&nologo=true",
    categoria: "Montaña",
    paseos: ["Trekking cima", "Jacuzzis de cuarzo"],
    hospedajes: ["Camping cima"],
    restaurantes: ["Comida expedición"],
    guias: ["Guías Paraitepuy"]
  },
  {
    id: 4,
    nombre: "Médanos de Coro",
    desc: "El desierto caribeño. Dunas mágicas.",
    imagen: "https://image.pollinations.ai/prompt/hyperrealistic%20photo%20of%20Medanos%20de%20Coro%20Venezuela%20orange%20sand%20dunes%20desert%20blue%20sky%20sunny?width=800&height=600&nologo=true",
    categoria: "Desierto",
    paseos: ["Caminata dunas", "Sandboarding"],
    hospedajes: ["Hoteles en Coro"],
    restaurantes: ["Comida falconiana"],
    guias: ["Guías locales"]
  },
  {
    id: 5,
    nombre: "Teleférico de Mérida",
    desc: "El techo de Venezuela en los Andes.",
    imagen: "https://image.pollinations.ai/prompt/hyperrealistic%20photo%20of%20Merida%20Venezuela%20cable%20car%20snowy%20mountains%20andes%20pico%20bolivar%20cold?width=800&height=600&nologo=true",
    categoria: "Nieve",
    paseos: ["Pico Espejo", "Laguna Mucubají"],
    hospedajes: ["Posadas andinas"],
    restaurantes: ["Truchas frescas"],
    guias: ["Guías de montaña"]
  },
  {
    id: 6,
    nombre: "Isla La Tortuga",
    desc: "Azul Virgen. Un paraíso deshabitado.",
    imagen: "https://image.pollinations.ai/prompt/hyperrealistic%20photo%20of%20La%20Tortuga%20Island%20Venezuela%20pristine%20beach%20crystal%20clear%20blue%20water%20yacht?width=800&height=600&nologo=true",
    categoria: "Playa",
    paseos: ["Cayo Herradura", "Punta Delgada"],
    hospedajes: ["Campamentos VIP"],
    restaurantes: ["Pescado fresco"],
    guias: ["Capitanes locales"]
  }
];

const ACCOMMODATIONS: Accommodation[] = [
  { id: '1', name: 'Posada Doña Carmen', location: 'Ocumare de la Costa', price: 25, rating: 4.8, fullResuelto: true, image: IMAGENES.venezuelaGeneral },
  { id: '2', name: 'Posada Sra. Mercedes', location: 'Morrocoy', price: 30, rating: 4.9, fullResuelto: true, image: IMAGENES.morrocoy, hasWhatsApp: true },
  { id: '3', name: 'Hospedaje El Samán', location: 'Choroní', price: 20, rating: 4.5, fullResuelto: false, image: IMAGENES.venezuelaGeneral },
  { id: '4', name: 'Posada Los Compadres', location: 'Margarita', price: 35, rating: 4.7, fullResuelto: true, image: IMAGENES.venezuelaGeneral },
];

// --- Components ---

const SafeImage = ({ src, alt, className, destinationName }: { src: string, alt: string, className?: string, destinationName?: string }) => {
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <img 
          src={IMAGENES.venezuelaGeneral} 
          alt="Fallback" 
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div className={`bg-gray-200 overflow-hidden ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover" 
        onError={() => setError(true)}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string, key?: React.Key }) => (
  <div className={`glass rounded-[2rem] overflow-hidden transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 px-2 py-1 rounded-2xl transition-all duration-300 ${active ? 'text-gray-900 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
  >
    <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-gray-100' : ''}`}>
      {icon}
    </div>
    <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

const PassportStamp = ({ text, color, rotation, active = true }: { text: string, color: string, rotation: number, active?: boolean }) => (
  <div 
    style={{ transform: `rotate(${rotation}deg)`, borderColor: active ? color : '#d1d5db', color: active ? color : '#9ca3af' }}
    className={`w-20 h-20 rounded-full border-4 border-double flex flex-col items-center justify-center p-2 text-center opacity-80 transition-all`}
  >
    <span className={`text-[7px] font-black uppercase leading-tight`}>{text}</span>
    <div className="w-8 h-0.5 my-1" style={{ backgroundColor: active ? color : '#d1d5db' }} />
    <span className="text-[5px] font-bold uppercase">VenezIA Official</span>
  </div>
);

// --- Screens ---

const OnboardingScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 sm:flex sm:items-center sm:justify-center sm:p-4">
      <div className="w-full h-[100dvh] sm:max-w-md sm:h-[90vh] sm:max-h-[932px] relative overflow-hidden bg-black sm:shadow-2xl">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beautiful-beach-1410-large.mp4" type="video/mp4" />
        </video>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        <div className="relative z-10 flex h-full flex-col items-center justify-between p-8 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 text-center space-y-2"
          >
            <h1 className="text-5xl font-black text-white tracking-tighter">VenezIA</h1>
            <p className="text-white/80 font-medium tracking-[0.3em] uppercase text-xs">Tu Puerta al Paraíso</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!showLogin ? (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full space-y-6"
              >
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-bold text-white">Descubre lo Inexplorado</h2>
                  <p className="text-white/60 text-xs">La primera plataforma de turismo impulsada por IA en Venezuela.</p>
                </div>
                <button 
                  onClick={() => setShowLogin(true)}
                  className="w-full bg-klarna text-gray-900 font-black py-4 rounded-[2rem] shadow-2xl shadow-klarna/20 hover:scale-[1.02] transition-transform"
                >
                  COMENZAR AVENTURA
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full space-y-4"
              >
                <div className="space-y-1 text-center mb-4">
                  <h2 className="text-xl font-bold text-white">Bienvenido de vuelta</h2>
                  <p className="text-white/40 text-[10px]">Elige tu forma de entrada</p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={onLogin}
                    className="w-full bg-white text-gray-900 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all text-sm"
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      <img 
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                        alt="Google" 
                        className="w-full h-full" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    Continuar con Google
                  </button>

                  <button 
                    onClick={onLogin}
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/20 transition-all text-sm"
                  >
                    <Mail size={18} />
                    Correo Electrónico
                  </button>

                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={onLogin} className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all">
                      <Facebook size={18} />
                    </button>
                    <button onClick={onLogin} className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all">
                      <Phone size={18} />
                    </button>
                    <button onClick={onLogin} className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all">
                      <Instagram size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-[9px] text-white/30 text-center pt-2 leading-tight">
                  Al continuar, aceptas nuestros <span className="underline">Términos</span> y <span className="underline">Privacidad</span>.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const DestinationDetailScreen = ({ destination, onBack }: { destination: Destination, onBack: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="absolute inset-0 z-50 bg-white overflow-y-auto no-scrollbar"
    >
      <div className="relative h-[400px]">
        <SafeImage 
          src={destination.imagen} 
          alt={destination.nombre} 
          destinationName={destination.nombre}
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/30" />
        <button 
          onClick={onBack}
          className="absolute top-12 left-6 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
        >
          <X size={24} className="text-gray-900" />
        </button>
      </div>

      <div className="p-8 -mt-12 relative z-10 bg-white rounded-t-[3rem] space-y-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-900 leading-none">{destination.nombre}</h2>
          <p className="text-klarna font-bold uppercase tracking-widest text-xs">{destination.categoria}</p>
        </div>

        <p className="text-gray-600 leading-relaxed font-medium">
          {destination.desc}
        </p>

        <div className="grid grid-cols-1 gap-6">
          {destination.paseos && destination.paseos.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900">
                <Navigation size={20} />
                <h3 className="font-black uppercase tracking-widest text-xs">Paseos e Imperdibles</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {destination.paseos.map((item, i) => (
                  <span key={i} className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-bold text-gray-700">{item}</span>
                ))}
              </div>
            </section>
          )}

          {destination.hospedajes && destination.hospedajes.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900">
                <Bed size={20} />
                <h3 className="font-black uppercase tracking-widest text-xs">Hospedajes Recomendados</h3>
              </div>
              <div className="space-y-2">
                {destination.hospedajes.map((item, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-800">{item}</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {destination.restaurantes && destination.restaurantes.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900">
                <Utensils size={20} />
                <h3 className="font-black uppercase tracking-widest text-xs">Gastronomía Local</h3>
              </div>
              <div className="space-y-2">
                {destination.restaurantes.map((item, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-800">{item}</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {destination.guias && destination.guias.length > 0 && (
            <section className="space-y-4 pb-12">
              <div className="flex items-center gap-2 text-gray-900">
                <User size={20} />
                <h3 className="font-black uppercase tracking-widest text-xs">Guías de Confianza</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {destination.guias.map((item, i) => (
                  <span key={i} className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600">{item}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const DestinationCard = ({ dest, index, onSelect }: { dest: Destination, index: number, onSelect: (d: Destination) => void, key?: React.Key }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Efecto parallax: la imagen se mueve un 10% en sentido contrario al scroll
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={() => onSelect(dest)}
      className="relative h-[450px] rounded-[2.5rem] overflow-hidden shadow-xl bg-gray-200 group cursor-pointer"
    >
      <motion.div style={{ y, height: "120%", top: "-10%" }} className="absolute inset-0 w-full">
        <SafeImage 
          src={dest.imagen} 
          alt={dest.nombre} 
          destinationName={dest.nombre}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
        <div className="space-y-1">
          <h3 className="text-3xl font-bold text-white leading-none">{dest.nombre}</h3>
          <p className="text-white/70 text-sm font-medium">{dest.categoria}</p>
        </div>
        <button className="w-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/40 transition-all">
          <Sparkles size={18} /> Ver Destinos
        </button>
      </div>
    </motion.div>
  );
};

const HomeScreen = ({ setActiveTab, activeTab, onSelectDestination }: { setActiveTab: (t: Tab) => void, activeTab: Tab, onSelectDestination: (d: Destination) => void, key?: React.Key }) => {
  const infiniteDestinations = [...DESTINOS_VIP, ...DESTINOS_VIP];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-40"
    >
      <header className="p-8 pt-16 border-b border-gray-100">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">VenezIA</h1>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.2em]">Turismo Mágico</p>
        </div>
      </header>

      <div className="p-6 space-y-8">
        {infiniteDestinations.map((dest, index) => (
          <DestinationCard 
            key={`${dest.id}-${index}`}
            dest={dest}
            index={index}
            onSelect={onSelectDestination}
          />
        ))}
      </div>
    </motion.div>
  );
};

const HospedajeScreen = ({ setActiveTab, activeTab }: { setActiveTab: (t: Tab) => void, activeTab: Tab, key?: React.Key }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-8 pb-40 space-y-8"
    >
      <header className="pt-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900">Tu Hogar Pasajero</h1>
          <p className="text-gray-500 font-medium">Hospedaje con alma local</p>
        </div>
      </header>

      <div className="space-y-6">
        {ACCOMMODATIONS.map((acc) => (
          <GlassCard key={acc.id}>
            <div className="h-56 overflow-hidden bg-gray-200">
              <SafeImage src={acc.image} alt={acc.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-900">{acc.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin size={14} /> {acc.location}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold">{acc.rating}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {acc.fullResuelto && (
                  <div className="bg-green-50 text-green-700 font-bold text-[10px] uppercase px-3 py-1.5 rounded-lg inline-flex items-center gap-1">
                    <Utensils size={10} /> Paquete Full Resuelto
                  </div>
                )}
                {acc.hasWhatsApp && (
                  <button 
                    onClick={() => alert('Abriendo chat de WhatsApp con Sra. Mercedes...')}
                    className="bg-green-500 text-white font-bold text-[10px] uppercase px-3 py-1.5 rounded-lg inline-flex items-center gap-1 hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle size={10} /> Chat WhatsApp
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Desde</span>
                  <span className="text-2xl font-black text-gray-900">${acc.price}</span>
                </div>
                <button className="bg-gray-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-800 transition-all">
                  Reservar
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </motion.div>
  );
};

const BilleteraScreen = () => {
  const [balanceUSD] = useState(125.50);
  const tasaOficial = 36.50;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 pb-40 space-y-8"
    >
      <header className="text-center space-y-2 pt-8">
        <h1 className="text-3xl font-black text-gray-900">Billetera</h1>
        <p className="text-gray-500 font-medium">Pagos inteligentes</p>
      </header>

      <div className="w-full aspect-[1.6/1] rounded-[2.5rem] p-8 relative overflow-hidden bg-gray-900 shadow-2xl">
        <div className="flex justify-between items-start h-full flex-col relative z-10">
          <div className="flex justify-between w-full items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Zap size={24} className="text-white" />
              </div>
              <span className="font-bold text-white tracking-widest">VENEZIA PAY</span>
            </div>
            <div className="w-12 h-8 bg-white/20 rounded-md" />
          </div>
          
          <div className="space-y-4 w-full">
            <p className="text-xl font-mono text-white tracking-[0.3em]">•••• •••• •••• 4412</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[8px] uppercase text-white/40 font-bold tracking-widest">Titular</p>
                <p className="text-sm font-bold text-white">JOHN DOE</p>
              </div>
              <p className="text-sm font-bold text-white">08/29</p>
            </div>
          </div>
        </div>
      </div>

      <GlassCard className="p-8 space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Saldo</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-gray-900">${balanceUSD.toFixed(2)}</span>
            <span className="text-gray-400 font-bold">USD</span>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase">En Bolívares (BCV)</p>
            <p className="text-2xl font-black text-gray-900">{(balanceUSD * tasaOficial).toLocaleString()} <span className="text-sm">VES</span></p>
          </div>
          <ArrowRightLeft size={20} className="text-gray-300" />
        </div>
      </GlassCard>

      <button className="w-full bg-gray-900 text-white font-black py-6 rounded-3xl shadow-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-800 transition-all">
        <QrCode size={32} />
        <span className="text-xl">PAGAR CON QR</span>
      </button>
    </motion.div>
  );
};

const SeguridadScreen = ({ setActiveTab, activeTab }: { setActiveTab: (t: Tab) => void, activeTab: Tab, key?: React.Key }) => {
  const emergencyNumbers = [
    { name: 'Emergencias Gral.', number: '911', icon: <Phone size={18} /> },
    { name: 'Bomberos', number: '102', icon: <Zap size={18} /> },
    { name: 'Protección Civil', number: '171', icon: <Shield size={18} /> },
  ];

  const alcabalas = [
    { name: 'Punto Control El Palito', dist: '2.4 km', status: 'Activo' },
    { name: 'Alcabala Los Roques', dist: '0.8 km', status: 'Activo' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 pb-40 space-y-8"
    >
      <header className="pt-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-black text-gray-900">Escudo Turístico</h1>
          <p className="text-gray-500 font-medium">Seguridad y Respuesta Inmediata</p>
        </div>
      </header>

      {/* Simulated Map with Checkpoints */}
      <div className="h-80 relative rounded-[2.5rem] overflow-hidden bg-gray-100 border border-gray-200 shadow-inner">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/800/600')] bg-cover opacity-30 grayscale" />
        
        {/* User Location */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg relative">
            <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-50" />
          </div>
        </div>

        {/* Alcabala Markers */}
        <div className="absolute top-1/4 right-1/4">
          <div className="flex flex-col items-center">
            <div className="p-2 bg-gray-900 text-white rounded-full shadow-lg">
              <Shield size={14} />
            </div>
            <span className="text-[8px] font-bold bg-white px-1 rounded mt-1 shadow-sm">Alcabala</span>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-4 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-between shadow-lg border border-white/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                <Navigation size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Tu Ubicación</p>
                <p className="text-[10px] text-gray-500">Los Roques, Dependencias Fed.</p>
              </div>
            </div>
            <button className="text-blue-600 font-bold text-xs">Compartir</button>
          </div>
        </div>
      </div>

      {/* Alcabalas Cercanas */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Alcabalas Cercanas</h3>
        <div className="grid grid-cols-1 gap-3">
          {alcabalas.map((alc, i) => (
            <div key={i} className="p-4 bg-white border border-gray-100 rounded-2xl flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Shield size={16} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{alc.name}</p>
                  <p className="text-[10px] text-gray-400">{alc.dist}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{alc.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Numbers */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Números de Emergencia</h3>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {emergencyNumbers.map((num, i) => (
            <button key={i} className="flex-shrink-0 p-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-3 shadow-sm hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                {num.icon}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-900">{num.name}</p>
                <p className="text-sm font-black text-red-600">{num.number}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Panic Button */}
      <motion.button 
        whileTap={{ scale: 0.95 }}
        className="w-full bg-red-600 text-white font-black py-8 rounded-[2.5rem] shadow-2xl shadow-red-600/30 flex flex-col items-center justify-center gap-2 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity" />
        <AlertTriangle size={40} className="animate-pulse" />
        <span className="text-2xl tracking-tighter">BOTÓN DE PÁNICO</span>
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Respuesta Inmediata • GPS Activo</span>
      </motion.button>
    </motion.div>
  );
};

const PerfilScreen = ({ }: { key?: React.Key }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 pb-40 space-y-10"
    >
      <header className="flex flex-col items-center space-y-4 pt-8">
        <div className="w-32 h-32 rounded-[2.5rem] bg-gray-100 p-1 shadow-inner">
          <img 
            src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80" 
            alt="Profile" 
            className="w-full h-full rounded-[2.3rem] object-cover" 
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900">Jorge Eduardo</h2>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Viajero Experto • Nivel 42</p>
        </div>
      </header>

      {/* Progress */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Progreso de Nivel</p>
          <span className="text-gray-900 font-bold">85%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '85%' }}
            transition={{ duration: 1 }}
            className="h-full bg-green-500" 
          />
        </div>
        <p className="text-[10px] text-gray-400 font-medium text-center">Faltan 150 pts para Nivel 43</p>
      </div>

      {/* Virtual Passport */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Globe size={20} className="text-gray-900" />
          <h3 className="text-lg font-black text-gray-900">Pasaporte Virtual</h3>
        </div>
        
        <div className="relative bg-amber-50 rounded-[2rem] p-10 shadow-inner border border-amber-100 overflow-hidden">
          {/* Passport Center Line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-amber-200/50 -translate-x-1/2" />
          
          <div className="grid grid-cols-2 gap-10 relative z-10">
            <div className="flex flex-col items-center justify-center gap-8">
              <PassportStamp text="Roraima - Aprobado" color="#1e40af" rotation={-12} />
              <PassportStamp text="Margarita - Visitado" color="#991b1b" rotation={6} />
            </div>
            <div className="flex flex-col items-center justify-center gap-8">
              <PassportStamp text="Mérida - Pendiente" color="#4b5563" rotation={15} active={false} />
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-200 flex items-center justify-center">
                <Lock size={20} className="text-amber-200" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Beneficios</h3>
        <div className="space-y-3">
          <div className="p-4 flex items-center gap-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <Trophy size={20} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">VIP Lounge Access</p>
              <p className="text-xs text-gray-500">Aeropuerto Maiquetía</p>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </div>
        </div>
      </section>
    </motion.div>
  );
};

const GamificacionScreen = ({ setActiveTab, activeTab }: { setActiveTab: (t: Tab) => void, activeTab: Tab, key?: React.Key }) => {
  const achievements = [
    { id: 1, title: 'Guardián de la Selva', desc: 'No dejaste basura en tu visita al Salto Ángel.', icon: <CheckCircle2 className="text-green-500" />, points: 500 },
    { id: 2, title: 'Respeto Animal', desc: 'Mantuviste distancia segura con la fauna local.', icon: <Sparkles className="text-klarna" />, points: 300 },
    { id: 3, title: 'Héroe del Agua', desc: 'Uso responsable del agua en Los Roques.', icon: <Zap className="text-blue-500" />, points: 450 },
    { id: 4, title: 'Socio Local', desc: 'Compraste artesanía directamente a comunidades.', icon: <Coffee className="text-amber-600" />, points: 600 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 pb-40 space-y-8"
    >
      <header className="pt-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-black text-gray-900">Eco-Turista</h1>
          <p className="text-gray-500 font-medium">Cuidando el paraíso</p>
        </div>
      </header>

      <div className="space-y-6 px-2">
        <div className="space-y-2">
          <h2 className="text-xl font-black text-gray-900">¡Tu Viaje Vale Oro! 🥇</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            En VenezIA, no solo visitas el país, ayudas a cuidarlo, te conviertes en el turista de ejemplo y ganas recompensas por ello.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">¿Cómo gano puntos?</h3>
          <div className="space-y-3">
            <p className="text-xs text-gray-600"><span className="font-bold text-gray-900">Cuida:</span> Reporta botes de basura llenos o participa en limpiezas de playa.</p>
            <p className="text-xs text-gray-600"><span className="font-bold text-gray-900">Apoya:</span> Come donde la Sra. Mercedes o hospédate con familias locales.</p>
            <p className="text-xs text-gray-600"><span className="font-bold text-gray-900">Gana:</span> Canjea tus puntos por descuentos en vuelos y noches gratis.</p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">¿Qué gano yo?</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Acumula <span className="font-bold text-gray-900">"Puntos Mágicos"</span> y canjéalos por descuentos en vuelos, noches gratis en posadas y experiencias VIP que el dinero no puede comprar.
          </p>
        </div>
      </div>

      <div className="bg-klarna/20 p-8 rounded-[2.5rem] border border-klarna/30 space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Puntos Totales</p>
            <p className="text-4xl font-black text-gray-900">12,450</p>
          </div>
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <Trophy size={32} className="text-klarna" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase text-gray-500">
            <span>Rango: Guardián</span>
            <span>Próximo: Protector</span>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden">
            <div className="h-full bg-klarna w-3/4" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Logros Recientes</h3>
        {achievements.map((ach) => (
          <GlassCard key={ach.id} className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
              {ach.icon}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">{ach.title}</p>
              <p className="text-xs text-gray-500">{ach.desc}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-green-600">+{ach.points}</p>
              <p className="text-[8px] font-bold text-gray-400 uppercase">PTS</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <button className="w-full bg-gray-900 text-white font-black py-6 rounded-3xl shadow-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
        <Camera size={20} />
        <span>REPORTAR ACCIÓN ECO</span>
      </button>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: '¡Hola! Soy VenezIA. ✨ ¿Cómo puedo ayudarte con tu viaje hoy?' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    setChatMessages([...chatMessages, { role: 'user', text: inputValue }]);
    setInputValue('');
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        text: '¡Excelente elección! Mérida tiene un clima perfecto ahora. ¿Te gustaría reservar una posada con descuento?' 
      }]);
    }, 1000);
  };

  if (!isLoggedIn) {
    return <OnboardingScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans sm:flex sm:items-center sm:justify-center sm:p-4">
      <main className="w-full h-[100dvh] sm:max-w-md sm:h-[90vh] sm:max-h-[932px] relative overflow-hidden bg-white sm:shadow-2xl flex flex-col">
        
        {/* Scrolling Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <HomeScreen 
                key="home" 
                setActiveTab={setActiveTab} 
                activeTab={activeTab} 
                onSelectDestination={(d) => setSelectedDestination(d)}
              />
            )}
            {activeTab === 'hospedaje' && <HospedajeScreen key="hospedaje" setActiveTab={setActiveTab} activeTab={activeTab} />}
            {activeTab === 'gamificacion' && <GamificacionScreen key="gamificacion" setActiveTab={setActiveTab} activeTab={activeTab} />}
            {activeTab === 'seguridad' && <SeguridadScreen key="seguridad" setActiveTab={setActiveTab} activeTab={activeTab} />}
            {activeTab === 'perfil' && <PerfilScreen key="perfil" />}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {selectedDestination && (
            <DestinationDetailScreen 
              destination={selectedDestination} 
              onBack={() => setSelectedDestination(null)} 
            />
          )}
        </AnimatePresence>

        {/* Floating AI Agent (Klarna Style) - Stays fixed relative to main */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-50">
          <AnimatePresence>
            {isChatOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[calc(100vw-4rem)] sm:w-80 h-[450px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100"
              >
                <div className="p-6 bg-klarna flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Sparkles size={24} className="text-gray-900" />
                    <p className="text-gray-900 font-bold">VenezIA</p>
                  </div>
                  <button onClick={() => setIsChatOpen(false)} className="text-gray-900/60 hover:text-gray-900">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto space-y-4 no-scrollbar">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-klarna text-gray-900 font-bold' : 'bg-gray-100 text-gray-700'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Pregúntame algo..."
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-klarna"
                  />
                  <button onClick={handleSendMessage} className="w-10 h-10 bg-klarna text-gray-900 rounded-xl flex items-center justify-center">
                    <Send size={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${isChatOpen ? 'bg-gray-900 text-white opacity-100' : 'bg-klarna text-gray-900 opacity-30 hover:opacity-100'}`}
          >
            {isChatOpen ? <X size={24} /> : <Sparkles size={24} />}
          </motion.button>
        </div>

        {/* Bottom Navigation - Stays fixed relative to main */}
        <nav className="absolute bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-2">
          <div className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-[2.5rem] p-2 flex justify-around items-center shadow-xl">
            <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={18} />} label="Destinos" />
            <NavButton active={activeTab === 'hospedaje'} onClick={() => setActiveTab('hospedaje')} icon={<Bed size={18} />} label="Hospedaje" />
            <NavButton active={activeTab === 'gamificacion'} onClick={() => setActiveTab('gamificacion')} icon={<Trophy size={18} />} label="Recompensas" />
            <NavButton active={activeTab === 'seguridad'} onClick={() => setActiveTab('seguridad')} icon={<Shield size={18} />} label="Seguridad" />
            
            {/* Profile Button with Photo */}
            <button 
              onClick={() => setActiveTab('perfil')}
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-2xl transition-all duration-300 ${activeTab === 'perfil' ? 'text-gray-900 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <div className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition-all ${activeTab === 'perfil' ? 'border-gray-900' : 'border-transparent'}`}>
                <img 
                  src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=80&q=80" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider">Perfil</span>
            </button>
          </div>
        </nav>
      </main>
    </div>
  );
}
