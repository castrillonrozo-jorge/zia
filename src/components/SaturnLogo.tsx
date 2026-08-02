import React from 'react';

// Sello de MIDAS: un bloque de obsidiana cristalizada con un Saturno de oro
// pulido. El anillo pasa POR DELANTE del planeta en su arco inferior (oculto
// detrás en el superior), como en una fotografía real, y un reflejo especular
// recorre la esquina superior izquierda del cristal.
export const SaturnLogo = ({ size = 80, className = "" }: { size?: number | string, color?: string, className?: string }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Oro de joyería: luz cálida arriba, sombra ámbar abajo */}
      <linearGradient id="mGold" x1="0%" y1="0%" x2="70%" y2="100%">
        <stop offset="0%" stopColor="#FFF1BE" />
        <stop offset="35%" stopColor="#F3C95C" />
        <stop offset="70%" stopColor="#DEA935" />
        <stop offset="100%" stopColor="#8F6A16" />
      </linearGradient>
      <linearGradient id="mGoldRing" x1="0%" y1="20%" x2="100%" y2="80%">
        <stop offset="0%" stopColor="#FFF6D9" />
        <stop offset="45%" stopColor="#EFC152" />
        <stop offset="100%" stopColor="#A87E1F" />
      </linearGradient>
      {/* Esfera con volumen: highlight desplazado al noroeste */}
      <radialGradient id="mSphere" cx="38%" cy="32%" r="75%">
        <stop offset="0%" stopColor="#FFEFB2" />
        <stop offset="45%" stopColor="#EDBE4E" />
        <stop offset="80%" stopColor="#C08E2B" />
        <stop offset="100%" stopColor="#7D5C12" />
      </radialGradient>
      {/* Obsidiana: negro azulado profundo con luz fría arriba */}
      <linearGradient id="mCrystal" x1="15%" y1="0%" x2="85%" y2="100%">
        <stop offset="0%" stopColor="#23252E" />
        <stop offset="45%" stopColor="#0C0D12" />
        <stop offset="100%" stopColor="#060709" />
      </linearGradient>
      <linearGradient id="mFacet" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.16" />
        <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.02" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <filter id="mGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <filter id="mDrop">
        <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#000000" floodOpacity="0.55"/>
      </filter>
    </defs>

    {/* Bloque de cristal */}
    <rect width="100" height="100" rx="26" fill="url(#mCrystal)" filter="url(#mDrop)"/>
    {/* Faceta de luz: reflejo diagonal del vidrio */}
    <path d="M 0 38 L 62 0 L 20 0 Q 0 0 0 20 Z" fill="url(#mFacet)" opacity="0.9" transform="translate(2,2) scale(0.96)" />
    {/* Filo interior del cristal */}
    <rect width="95" height="95" x="2.5" y="2.5" rx="24" fill="none" stroke="url(#mGoldRing)" strokeWidth="0.6" opacity="0.35"/>

    {/* Arco trasero del anillo (detrás del planeta, pasa por arriba) */}
    <g opacity="0.55">
      <path
        d="M 18.1 61.6 A 34 11.5 -20 0 1 81.9 38.4"
        fill="none" stroke="#8F6A16" strokeWidth="3.1" strokeLinecap="round"
      />
    </g>

    {/* Planeta */}
    <g filter="url(#mGlow)">
      <circle cx="50" cy="50" r="17.5" fill="url(#mSphere)" />
    </g>
    {/* Brillo especular de la esfera */}
    <ellipse cx="43.5" cy="42" rx="7.5" ry="5.5" fill="#FFFFFF" opacity="0.32" transform="rotate(-24 43.5 42)" />

    {/* Arco delantero del anillo (por delante del planeta, pasa por abajo) */}
    <g filter="url(#mGlow)">
      <path
        d="M 81.9 38.4 A 34 11.5 -20 0 1 18.1 61.6"
        fill="none" stroke="url(#mGoldRing)" strokeWidth="3.4" strokeLinecap="round"
      />
    </g>

    {/* Destellos: polvo de estrellas alrededor */}
    <g fill="#FFF6D9">
      <path d="M 76 24 l 1.1 2.6 2.6 1.1 -2.6 1.1 -1.1 2.6 -1.1 -2.6 -2.6 -1.1 2.6 -1.1 Z" opacity="0.95"/>
      <circle cx="27" cy="72" r="1.1" opacity="0.7"/>
      <circle cx="70" cy="79" r="0.8" opacity="0.5"/>
      <circle cx="22" cy="27" r="0.7" opacity="0.4"/>
    </g>
  </svg>
);
