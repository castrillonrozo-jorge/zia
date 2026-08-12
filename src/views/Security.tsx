import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useVibration } from '../hooks/useVibration';

const SecurityView: React.FC = () => {
  const { vibrate } = useVibration();
  const [sent, setSent] = useState<string | null>(null);
  const [panic, setPanic] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const trigger = (msg: string) => {
    setSent(msg);
    setTimeout(() => setSent(null), 3500);
  };

  const startPanicHold = () => {
    if (panic) return;
    setHoldProgress(0);
    let progress = 0;
    
    // Vibrate lightly on start
    vibrate('medium');
    
    timerRef.current = setInterval(() => {
      progress += 2; // reaches 100 in 50 ticks * 30ms = 1.5 seconds
      setHoldProgress(progress);
      
      // Haptic buildup while holding
      if (progress % 20 === 0) {
        vibrate('medium');
      }
      
      if (progress >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        executePanic();
      }
    }, 30);
  };

  const stopPanicHold = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!panic) {
      setHoldProgress(0);
    }
  };

  const executePanic = () => {
    setPanic(true);
    setHoldProgress(100);
    vibrate('alert');

    setSent('🔴 Abriendo llamada al 911...');

    setTimeout(() => {
      window.open('tel:911', '_blank');
      setPanic(false);
      setHoldProgress(0);
      setSent(null);
    }, 1200);
  };

  const actions = [
    { id: 'mp', icon: '⚖️', title: 'Ministerio Público', subtitle: 'Línea gratuita 24/7: 0800-535-3000', bg: 'linear-gradient(135deg, #1a3a6e, #2a5aae)', action: () => { window.open('tel:08005353000', '_blank'); } },
    { id: 'conas', icon: '🚔', title: 'CONAS — Extorsión', subtitle: 'Línea antiextorsión: 0800-266-2700', bg: 'linear-gradient(135deg, #6e1a1a, #9e3a3a)', action: () => { window.open('tel:08002662700', '_blank'); } },
    { id: 'cicpc', icon: '🛡️', title: 'CICPC — Denuncia Policial', subtitle: 'Línea directa: 171', bg: 'linear-gradient(135deg, #1a4a2a, #2a6a3a)', action: () => { window.open('tel:171', '_blank'); } },
    { id: 'agresion', icon: '🆘', title: 'Violencia y Agresión', subtitle: 'INAMUJER: 0800-462-6683', bg: 'linear-gradient(135deg, #4a1a6e, #6a3a9e)', action: () => { window.open('https://minmujer.gob.ve/instituto-nacional-de-la-mujer/', '_blank'); } },
    { id: 'bomberos', icon: '🚒', title: 'Bomberos', subtitle: 'Emergencias de incendio: 166', bg: 'linear-gradient(135deg, #7a3a1a, #9a5a2a)', action: () => { window.open('tel:166', '_blank'); } },
    { id: 'denuncia', icon: '📋', title: 'Denuncia en línea — MP', subtitle: 'Portal oficial del Ministerio Público', bg: 'linear-gradient(135deg, #1a3a4a, #2a5a6a)', action: () => { window.open('http://www.mp.gob.ve/index.php/denuncia/', '_blank'); } },
  ];

  return (
    <div className="w-full flex flex-col gap-5 pt-4 pb-12">
      <div style={{ margin: '16px 16px 0', borderRadius: 28, overflow: 'hidden', background: 'linear-gradient(145deg, #161B22, #0D1117)', padding: 28, position: 'relative', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'none' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, rgba(200,16,46,0.1) 0%, transparent 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: 'radial-gradient(circle, rgba(200,16,46,0.15) 0%, transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
        
        <div style={{ fontSize: 28, marginBottom: 8, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>🛡️</div>
        <div style={{ color: 'white', fontWeight: 800, fontSize: 24, marginBottom: 6, letterSpacing: '-0.02em' }}>Protección Ciudadana</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13.5, lineHeight: 1.6 }}>Acceso directo a los organismos de seguridad del Estado. <span style={{ color: '#E53935' }}>Tu denuncia es confidencial.</span></div>
      </div>

      {sent && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'rgba(52,199,89,0.15)', border: '1px solid rgba(52,199,89,0.3)', borderRadius: 16, padding: '12px 16px', color: '#1a7a3a', fontSize: 13, fontWeight: 500 }}
          className="dark:text-green-400">
          ✓ {sent}
        </motion.div>
      )}

      <div>
        <motion.button 
          onPointerDown={startPanicHold}
          onPointerUp={stopPanicHold}
          onPointerLeave={stopPanicHold}
          onContextMenu={(e) => e.preventDefault()}
          whileTap={{ scale: 0.96 }}
          animate={panic ? { scale: [1, 1.02, 1] } : { y: [0, -3, 0] }}
          transition={{ duration: panic ? 0.5 : 3, repeat: Infinity, ease: 'easeInOut' }}
          className="rounded-[28px] focus:outline-none outline-none appearance-none"
          style={{
            width: '100%', padding: '24px 28px', cursor: 'pointer',
            background: panic ? 'linear-gradient(135deg, #FF3B30, #D32F2F)' : 'linear-gradient(135deg, #DF2020, #B71C1C)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: panic ? '0 0 0 8px rgba(255,59,48,0.2), 0 20px 40px rgba(255,59,48,0.4), inset 0 1px 0 rgba(255,255,255,0.3)' : '0 15px 35px rgba(223, 32, 32, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', gap: 18, position: 'relative', touchAction: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '28px', overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)' }} />
            
            {/* Progress fill */}
            {!panic && holdProgress > 0 && (
              <div style={{ position: 'absolute', bottom: 0, left: 0, height: '100%', background: 'rgba(0,0,0,0.2)', width: `${holdProgress}%`, transition: 'width 0.05s linear' }} />
            )}
          </div>

          <motion.div animate={panic ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.8, repeat: Infinity }} style={{ fontSize: 36, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))', zIndex: 10 }}>🚨</motion.div>
          <div style={{ textAlign: 'left', zIndex: 10 }}>
            <div style={{ color: 'white', fontWeight: 900, fontSize: 19, letterSpacing: '-0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              {panic ? '🔴 ALERTA EN CURSO...' : 'BOTÓN DE PÁNICO'}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 3, fontWeight: 500 }}>
              {panic ? 'Llamando al 911 en instantes...' : (holdProgress > 0 ? 'Mantén presionado para alertar...' : 'Mantén presionado por 1.5s')}
            </div>
          </div>
        </motion.button>
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8E8E93', marginBottom: 16, marginLeft: 8 }}>DENUNCIAS Y REPORTES</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {actions.map((a, i) => (
            <motion.button key={a.id} whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 + 0.1 }}
              onClick={() => { 
                vibrate('medium');
                a.action(); 
                trigger('Conectando con ' + a.title); 
              }}
              className="rounded-[24px] focus:outline-none outline-none appearance-none"
              style={{
                width: '100%', padding: '18px 20px', cursor: 'pointer',
                background: a.bg, border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: 'none',
                display: 'flex', alignItems: 'center', gap: 16, position: 'relative', textAlign: 'left',
                WebkitTapHighlightColor: 'transparent',
              }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '24px', overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)' }} />
              </div>
              
              <div style={{ fontSize: 28, flexShrink: 0, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))', zIndex: 1 }}>{a.icon}</div>
              <div style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', letterSpacing: '-0.01em' }}>{a.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 500, fontSize: 12.5, marginTop: 3, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{a.subtitle}</div>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }}>›</div>
            </motion.button>
          ))}
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.05)', borderRadius: 16, padding: '14px 16px' }} className="dark:bg-white/5">
        <p style={{ fontSize: 11, color: '#8E8E93', lineHeight: 1.6, textAlign: 'center', margin: 0 }}>
          🔒 Todas las denuncias son confidenciales y están protegidas por la Ley Orgánica contra la Delincuencia Organizada.
        </p>
      </div>
    </div>
  );
};

export default SecurityView;
