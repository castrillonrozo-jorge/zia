import React, { useState } from 'react';
import { Icons } from '../components/Icons';

interface ProfileProps {
  balance: number;
  onOpenRecharge: () => void;
  onOpenTransfer: () => void;
  userData: {
    name: string;
    username: string;
    email: string;
    phone: string;
    cedula: string;
    location: string;
    accountType: string;
    photo: string;
  };
  setUserData: (data: any) => void;
}

export const Profile: React.FC<ProfileProps> = ({ balance, onOpenRecharge, onOpenTransfer, userData, setUserData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUserData({ ...userData, photo: event.target.result as string });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const sharedUrl = window.location.origin;

  const handleShare = () => {
    navigator.clipboard.writeText(sharedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const transactions = [
    { id: 1, title: 'Recarga Monedero Patria', amount: '+500,00', date: 'Hoy, 02:30 PM', type: 'in' },
    { id: 2, title: 'Pago Servicio Corpoelec', amount: '-150,50', date: 'Ayer', type: 'out' },
    { id: 3, title: 'Transferencia Recibida', amount: '+2.400,00', date: '12 Nov', type: 'in' },
    { id: 4, title: 'Pago Móvil Interbancario', amount: '-320,00', date: '10 Nov', type: 'out' },
  ];

  if (isEditing) {
    return (
      <div className="animate-in slide-in-from-right-4 duration-500 p-8 space-y-10 pt-12">
        <div className="flex items-center justify-between">
          <button onClick={() => setIsEditing(false)} className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
            <Icons.X size={20} className="text-slate-900 dark:text-white" />
          </button>
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">Perfil Ejecutivo</h2>
          <button onClick={() => setIsEditing(false)} className="text-[#4F84C4] font-black text-[10px] uppercase tracking-widest">Guardar</button>
        </div>

        <div className="flex flex-col items-center gap-6 py-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 dark:bg-white/5 border-4 border-white dark:border-black shadow-none">
               <img src={userData.photo} className="w-full h-full object-cover" alt="" />
            </div>
            <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#4F84C4] rounded-full flex items-center justify-center text-white shadow-none border-4 border-white dark:border-black active:scale-90 transition-transform cursor-pointer">
              <Icons.Camera size={20} />
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div 
            style={{
              background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
              boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
              borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            }}
            className="p-6 rounded-[2rem] border border-white/10"
          >
            <p className="text-[9px] text-[#FFFFFF] opacity-80 font-black uppercase tracking-[0.3em] mb-3">Nombre Completo</p>
            <input 
              value={userData.name}
              onChange={(e) => setUserData({...userData, name: e.target.value})}
              className="w-full bg-transparent font-black text-base outline-none text-[#FFFFFF]" 
            />
          </div>
          <div 
            style={{
              background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
              boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
              borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            }}
            className="p-6 rounded-[2rem] border border-white/10"
          >
            <p className="text-[9px] text-[#FFFFFF] opacity-80 font-black uppercase tracking-[0.3em] mb-3">Correo Corporativo</p>
            <input 
              value={userData.email}
              onChange={(e) => setUserData({...userData, email: e.target.value})}
              className="w-full bg-transparent font-black text-base outline-none text-[#FFFFFF]" 
            />
          </div>
          <div 
            style={{
              background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
              boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
              borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            }}
            className="p-6 rounded-[2rem] border border-white/10"
          >
            <p className="text-[9px] text-[#FFFFFF] opacity-80 font-black uppercase tracking-[0.3em] mb-3">Línea Móvil</p>
            <input 
              value={userData.phone}
              onChange={(e) => setUserData({...userData, phone: e.target.value})}
              className="w-full bg-transparent font-black text-base outline-none text-[#FFFFFF]" 
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 min-h-screen pb-32 pt-8">
      {/* Profile Header - Ultra Luxury */}
      <div className="px-8 flex flex-col items-center text-center mb-12">
        <div className="relative mb-8">
          <div className="w-40 h-40 rounded-full shadow-none ring-4 ring-[#4F84C4] ring-offset-2 ring-offset-white dark:ring-offset-[#05070A]">
            <img src={userData.photo} className="w-full h-full object-cover rounded-full" alt={userData.name} />
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">{userData.name}</h2>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{userData.username}</p>
          </div>
        </div>

        <div className="flex gap-3 w-full">
          <button 
            onClick={() => setIsEditing(true)}
            style={{
              background: 'rgba(240, 244, 248, 0.8)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              backdropFilter: 'blur(8px)',
            }}
            className="flex-[1] dark:bg-white/5 h-14 rounded-full flex flex-col items-center justify-center gap-1 active:scale-95 transition-all text-slate-900 dark:text-white"
          >
            <div className="flex flex-row items-center gap-2">
              <Icons.Settings size={14} className="text-slate-500 dark:text-[#4F84C4]" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-[#4F84C4]">Ajustes</span>
            </div>
          </button>
          <button 
            style={{
              background: 'linear-gradient(135deg, #4F84C4 0%, #315C91 100%)',
              boxShadow: '0 4px 12px rgba(79, 132, 196, 0.2)',
              borderTop: '1px solid rgba(255, 255, 255, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            className="flex-[1] h-14 rounded-full flex flex-col items-center justify-center gap-1 active:scale-95 transition-all"
          >
            <div className="flex flex-row items-center gap-2">
              <Icons.Fingerprint size={14} className="text-[#FFFFFF]" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#FFFFFF]">Identidad</span>
            </div>
          </button>
        </div>
      </div>

      {/* Featured Wallet - Mastercard Style Edition */}
      <div className="px-8">
        <button 
          onClick={() => setIsCardModalOpen(true)}
          style={{
            background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
            boxShadow: '0 12px 25px rgba(79, 132, 196, 0.25)',
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
          className="w-full text-left relative aspect-[1.58/1] rounded-[2.5rem] p-6 md:p-8 text-white overflow-hidden transition-all duration-700 active:scale-[0.98] group"
        >
          {/* Real card glare gradient cover */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)', pointerEvents: 'none' }} />
          
          {/* Mastercard Circles */}
          <div className="absolute top-6 right-6 md:top-8 md:right-8 flex">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#EB001B] opacity-90"></div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F79E1B] -ml-5 md:-ml-6 opacity-90 mix-blend-screen"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 opacity-80">
                <Icons.ShieldCheck size={14} strokeWidth={2.5} className="text-[#FFFFFF]" />
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#FFFFFF]">Agiliza Platinum</p>
              </div>
              <div className="flex items-baseline gap-2 pt-4 md:pt-6">
                <span className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-[#FFFFFF]">{balance.toLocaleString('es-VE')}</span>
                <span className="text-xs font-black opacity-80 tracking-[0.3em] text-[#FFFFFF]">BS</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-[#FFFFFF] uppercase tracking-widest drop-shadow-none">{userData.name.split(' ').slice(0, 2).join(' ')}</p>
                <p className="text-[12px] font-mono tracking-[0.2em] text-[#FFFFFF] drop-shadow-none">**** **** **** 8892</p>
              </div>
              <div className="flex gap-2.5">
                <div className="bg-white/10 text-white w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center border border-white/20 backdrop-blur-md">
                  <Icons.Plus size={16} strokeWidth={3} />
                </div>
                <div className="bg-white/10 text-white w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center border border-white/20 backdrop-blur-md">
                  <Icons.Send size={16} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Mastercard Full Modal */}
      {isCardModalOpen && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-[#05070A] rounded-[3rem] overflow-hidden shadow-none animate-in zoom-in-95 duration-500 border border-white/10">
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Tarjeta Digital</h3>
                <button onClick={() => setIsCardModalOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} className="w-10 h-10 rounded-full flex items-center justify-center">
                  <Icons.X size={18} className="text-white" />
                </button>
              </div>

              <div className="relative aspect-[1.58/1] bg-gradient-to-br from-[#1E3A8A] via-[#0033A0] to-[#01142F] rounded-[2.5rem] p-6 md:p-8 text-white overflow-hidden shadow-none border border-white/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_70%)]"></div>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)', pointerEvents: 'none' }} />
                <div className="absolute top-6 right-6 md:top-8 md:right-8 flex">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#EB001B] opacity-90"></div>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F79E1B] -ml-5 md:-ml-6 opacity-90 mix-blend-screen"></div>
                </div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 opacity-60">
                      <Icons.ShieldCheck size={14} strokeWidth={2.5} />
                      <p className="text-[9px] font-black uppercase tracking-[0.4em]">Agiliza Platinum</p>
                    </div>
                    <div className="flex items-baseline gap-2 pt-4">
                      <span className="text-3xl md:text-4xl font-black tracking-tighter">{balance.toLocaleString('es-VE')}</span>
                      <span className="text-[10px] font-black opacity-40">BS</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-white/70 uppercase tracking-widest drop-shadow-none">{userData.name}</p>
                    <p className="text-sm font-mono tracking-[0.2em] text-white/90 drop-shadow-none">4450 8892 1234 8892</p>
                    <div className="flex gap-4 pt-2">
                      <p className="text-[8px] font-black text-white/50 uppercase tracking-widest">Exp: 04/28</p>
                      <p className="text-[8px] font-black text-white/50 uppercase tracking-widest">CVV: ***</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    onOpenRecharge();
                    setIsCardModalOpen(false);
                  }}
                  className="bg-[#4F84C4] hover:bg-[#4F84C4] text-white h-16 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-none active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/10 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  <Icons.Plus size={16} strokeWidth={3} />
                  Recargar
                </button>
                <button 
                  onClick={() => {
                    onOpenTransfer();
                    setIsCardModalOpen(false);
                  }}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  className="text-white h-16 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Icons.Send size={16} strokeWidth={2.5} />
                  Transferir
                </button>
              </div>

              <button style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }} className="w-full h-16 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 active:scale-95 transition-all">
                Ver Datos Sensibles
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Silicon Valley Tech Stack Section */}
      <div className="px-8 mt-12">
        <div 
          style={{
            background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
            boxShadow: '0 12px 30px rgba(79, 132, 196, 0.25)',
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          className="rounded-[3rem] p-10 relative overflow-hidden"
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)', pointerEvents: 'none' }} />
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="text-[10px] font-black text-[#FFFFFF] uppercase tracking-[0.4em]">Digital Identity Stack</h3>
            <div className="w-2 h-2 rounded-full bg-[#FFFFFF] animate-pulse"></div>
          </div>
          <div className="flex flex-wrap gap-3 relative z-10">
            {['Biometric ID', 'Blockchain Verified', 'Quantum Encrypted', 'Cloud Native', 'AI Powered'].map((tech) => (
              <span key={tech} className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[8px] font-semibold text-[#FFFFFF] uppercase tracking-widest">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Personal Info Bento Card */}
      <div className="px-8 mt-12">
        <div 
          style={{
            background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
            boxShadow: '0 12px 30px rgba(79, 132, 196, 0.25)',
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          className="rounded-[3rem] p-10 space-y-8 relative overflow-hidden"
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)', pointerEvents: 'none' }} />
          <div className="flex items-center justify-between relative z-10 border-b border-white/[0.04] pb-4">
            <h3 className="text-[10px] font-black text-[#FFFFFF] uppercase tracking-[0.4em] flex items-center gap-3">
              <Icons.User size={16} className="text-white" /> Expediente Digital
            </h3>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Icons.ChevronRight size={16} className="text-white" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 relative z-10">
            <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="flex items-center gap-6 p-4 rounded-[2rem]">
              <div style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(255,255,255,0.15)' }} className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-none">
                <Icons.Fingerprint size={24} />
              </div>
              <div>
                <p className="text-[9px] font-semibold text-[#FFFFFF] uppercase tracking-[0.3em] mb-1">Identificación</p>
                <p className="text-base font-bold tracking-tight text-white">V-{userData.cedula}</p>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="flex items-center gap-6 p-4 rounded-[2rem]">
              <div style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(255,255,255,0.15)' }} className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-none">
                <Icons.PhoneCall size={24} />
              </div>
              <div>
                <p className="text-[9px] font-semibold text-[#FFFFFF] uppercase tracking-[0.3em] mb-1">Contacto Directo</p>
                <p className="text-base font-bold tracking-tight text-white">{userData.phone}</p>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }} className="flex items-center gap-6 p-4 rounded-[2rem]">
              <div style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(255,255,255,0.15)' }} className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-none">
                <Icons.MapPin size={24} />
              </div>
              <div>
                <p className="text-[9px] font-semibold text-[#FFFFFF] uppercase tracking-[0.3em] mb-1">Residencia Fiscal</p>
                <p className="text-base font-bold tracking-tight text-white">{userData.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Movements */}
      <div className="px-8 mt-12">
        <div className="flex items-center justify-between px-4 mb-8">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Historial Ejecutivo</h3>
          <button className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">Ver Reporte</button>
        </div>

        <div className="space-y-4">
          {transactions.map((tx) => (
            <div 
              key={tx.id} 
              style={{
                background: 'radial-gradient(circle at 14% 12%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.05) 36%, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 44%), radial-gradient(circle at 82% 100%, rgba(25,198,181,0.50) 0%, transparent 55%), radial-gradient(circle at 12% 90%, rgba(20,100,160,0.85) 0%, transparent 62%), radial-gradient(circle at 78% 12%, rgba(120,80,220,0.30) 0%, transparent 55%), linear-gradient(135deg, #0E2A52 0%, #1464A0 100%)',
                boxShadow: '0 14px 34px rgba(14, 42, 82, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.28)',
                borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                position: 'relative',
                overflow: 'hidden',
              }}
              className="p-6 rounded-[2rem] border border-white/10 flex items-center justify-between group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-5 relative z-10">
                <div 
                  style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.18)' }}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.type === 'in' ? 'text-emerald-300' : 'text-rose-300'}`}
                >
                  {tx.type === 'in' ? <Icons.ArrowLeft className="rotate-45" size={20} strokeWidth={2.5} /> : <Icons.ArrowLeft className="-rotate-[135deg]" size={20} strokeWidth={2.5} />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">{tx.title}</h4>
                  <p className="text-[10px] text-white/90 font-bold uppercase tracking-[0.15em] mt-1">{tx.date}</p>
                </div>
              </div>
              <div className="text-right relative z-10">
                <p className={`text-sm font-bold tracking-tight ${tx.type === 'in' ? 'text-emerald-400' : 'text-white'}`}>
                  {tx.amount}
                </p>
                <p className="text-[9px] font-black text-white/90 uppercase mt-0.5">Bs</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};