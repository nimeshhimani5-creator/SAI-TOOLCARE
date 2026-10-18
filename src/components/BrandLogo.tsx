import React from 'react';

interface BrandLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  lightText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  size = 44, 
  showText = true, 
  className = '',
  lightText = false
}) => {
  return (
    <div className={`brand-logo-container ${className}`}>
      <div 
        className="brand-logo-mark"
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="brand-svg">
          <defs>
            <linearGradient id="logo-amazon-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB800"/>
              <stop offset="50%" stopColor="#FF9900"/>
              <stop offset="100%" stopColor="#FF5500"/>
            </linearGradient>
            <linearGradient id="logo-navy-dark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#232f3e"/>
              <stop offset="100%" stopColor="#131921"/>
            </linearGradient>
            <filter id="logo-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#FF9900" floodOpacity="0.5"/>
            </filter>
          </defs>

          {/* Hexagonal Turbine Armor Frame */}
          <polygon points="32,3 58,18 58,46 32,61 6,46 6,18" fill="url(#logo-navy-dark)" stroke="#374151" strokeWidth="2"/>
          <polygon points="32,7 54,20 54,44 32,57 10,44 10,20" fill="#0d1117" stroke="url(#logo-amazon-gold)" strokeWidth="1.2" opacity="0.8"/>

          {/* Dynamic 'S' + Power Tool Bolt */}
          <g filter="url(#logo-glow-filter)">
            <path 
              d="M42 16 C36 12, 24 13, 20 19 C16 25, 20 30, 27 32 L36 34 C43 36, 46 41, 43 47 C40 53, 28 54, 21 49" 
              stroke="url(#logo-amazon-gold)" 
              strokeWidth="5" 
              strokeLinecap="round" 
              fill="none"
            />
            {/* High-Voltage Lightning Core */}
            <path d="M36 14 L23 33 L32 33 L27 50 L44 28 L35 28 Z" fill="#ffffff" opacity="0.95"/>
            <path d="M35 17 L25 32 L32 32 L28 47 L41 29 L34 29 Z" fill="url(#logo-amazon-gold)"/>
            <circle cx="32" cy="32" r="2.2" fill="#ffffff"/>
          </g>

          {/* Amazon-style Signature Smile Swoosh at Base */}
          <path d="M14 47 C24 55, 40 55, 50 47" stroke="url(#logo-amazon-gold)" strokeWidth="3" strokeLinecap="round"/>
          <polygon points="50,47 46,43 51,43" fill="url(#logo-amazon-gold)"/>
          <circle cx="51" cy="46" r="1.8" fill="#FF9900"/>
        </svg>
      </div>

      {showText && (
        <div className="brand-titles-group">
          <div className="brand-name-line">
            <span className={`brand-word-sai ${lightText ? 'light' : ''}`}>SAI</span>
            <span className="brand-word-toolcare">TOOLCARE</span>
            <span className="brand-domain-tag">.in</span>
          </div>
          <div className="brand-subtitle-line">
            <span className="brand-subtext">Om Sai Power Tools</span>
            <span className="brand-bullet">•</span>
            <span className="brand-highlight">Sales & Repairs</span>
          </div>
        </div>
      )}
    </div>
  );
};
