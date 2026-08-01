import React from 'react';

export const SaturnLogo = ({ size = 80, className = "" }: { size?: number | string, color?: string, className?: string }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="premiumGoldFlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF3B0" />
        <stop offset="25%" stopColor="#C9A227" />
        <stop offset="75%" stopColor="#D4A017" />
        <stop offset="100%" stopColor="#8A6300" />
      </linearGradient>
      <linearGradient id="premiumBgDark" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1C1C1A" />
        <stop offset="100%" stopColor="#0A0A09" />
      </linearGradient>
      <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <filter id="shadow">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.6"/>
      </filter>
    </defs>
    
    <rect width="100" height="100" rx="30" fill="url(#premiumBgDark)" filter="url(#shadow)"/>
    <rect width="96" height="96" x="2" y="2" rx="28" fill="none" stroke="url(#premiumGoldFlow)" strokeWidth="0.5" opacity="0.3"/>
    
    <g filter="url(#goldGlow)">
      <circle cx="50" cy="50" r="18" fill="none" stroke="url(#premiumGoldFlow)" strokeWidth="4" />
      <ellipse cx="50" cy="50" rx="36" ry="12" fill="none" stroke="url(#premiumGoldFlow)" strokeWidth="3" transform="rotate(-20 50 50)" />
    </g>
    
    {/* Inner decorative orbit */}
    <ellipse cx="50" cy="50" rx="42" ry="38" fill="none" stroke="url(#premiumGoldFlow)" strokeWidth="1" strokeDasharray="6 12" opacity="0.4" transform="rotate(45 50 50)"/>
  </svg>
);
