import React from 'react'

interface ToolBannerProps {
  toolId: string
  name: string
  tagline: string
}

const banners: Record<string, React.FC<{ name: string; tagline: string }>> = {
  // ─── 1. Crypto Signal Scanner ──────────────────────────
  'crypto-scanner': ({ name, tagline }) => (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <defs>
        <linearGradient id="cs-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d1117" />
          <stop offset="50%" stopColor="#0a1628" />
          <stop offset="100%" stopColor="#0d2818" />
        </linearGradient>
        <linearGradient id="cs-accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <rect width="800" height="280" fill="url(#cs-bg)" />
      {/* Grid pattern */}
      {Array.from({ length: 20 }, (_, i) => (
        <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="280" stroke="#22c55e" strokeOpacity="0.06" strokeWidth="1" />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 40} x2="800" y2={i * 40} stroke="#22c55e" strokeOpacity="0.06" strokeWidth="1" />
      ))}
      {/* Candlesticks */}
      {[120, 200, 280, 340, 420, 480, 540, 600].map((x, i) => {
        const isGreen = i % 3 !== 0
        const bodyH = 20 + Math.random() * 40
        const bodyY = 100 + (i % 2 === 0 ? -20 : 20) + Math.sin(i) * 30
        return (
          <g key={i}>
            <line x1={x + 8} y1={bodyY - 20} x2={x + 8} y2={bodyY + bodyH + 20} stroke={isGreen ? '#22c55e' : '#ef4444'} strokeWidth="1.5" />
            <rect x={x} y={bodyY} width="16" height={bodyH} fill={isGreen ? '#22c55e' : '#ef4444'} rx="2" opacity="0.85" />
          </g>
        )
      })}
      {/* Signal lines */}
      <path d="M 0 200 Q 100 160, 200 180 T 400 120 T 600 100 T 800 80" fill="none" stroke="#22c55e" strokeWidth="2" strokeOpacity="0.5" />
      <path d="M 0 220 Q 150 180, 300 200 T 500 140 T 700 130 T 800 110" fill="none" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.3" />
      {/* Glow */}
      <circle cx="600" cy="100" r="60" fill="#22c55e" opacity="0.05" />
      <circle cx="600" cy="100" r="30" fill="#22c55e" opacity="0.08" />
      {/* Text */}
      <text x="50" y="65" fontFamily="monospace" fontSize="32" fontWeight="bold" fill="white">{name}</text>
      <text x="50" y="90" fontFamily="monospace" fontSize="14" fill="#86efac">{tagline}</text>
      {/* Badge */}
      <rect x="50" y="220" width="100" height="28" rx="14" fill="#22c55e" fillOpacity="0.15" stroke="#22c55e" strokeOpacity="0.4" strokeWidth="1" />
      <text x="100" y="239" fontFamily="monospace" fontSize="11" fill="#86efac" textAnchor="middle">10 INDICATORS</text>
      <rect x="160" y="220" width="100" height="28" rx="14" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeOpacity="0.4" strokeWidth="1" />
      <text x="210" y="239" fontFamily="monospace" fontSize="11" fill="#6ee7b7" textAnchor="middle">24/7 SCANNER</text>
    </svg>
  ),

  // ─── 2. CoinMarketCap Scanner ──────────────────────────
  'coinmarketcap': ({ name, tagline }) => (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <defs>
        <linearGradient id="cmc-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f0f23" />
          <stop offset="50%" stopColor="#0c1a3a" />
          <stop offset="100%" stopColor="#1a0a2e" />
        </linearGradient>
      </defs>
      <rect width="800" height="280" fill="url(#cmc-bg)" />
      {/* Hexagonal grid */}
      {Array.from({ length: 6 }, (_, i) =>
        Array.from({ length: 3 }, (_, j) => (
          <polygon
            key={`${i}-${j}`}
            points={`${80 + i * 130 + (j % 2) * 65},${60 + j * 70} ${100 + i * 130 + (j % 2) * 65},${50 + j * 70} ${110 + i * 130 + (j % 2) * 65},${60 + j * 70} ${100 + i * 130 + (j % 2) * 65},${70 + j * 70} ${90 + i * 130 + (j % 2) * 65},${60 + j * 70}`}
            fill="none"
            stroke="#6366f1"
            strokeOpacity="0.08"
            strokeWidth="1"
          />
        ))
      )}
      {/* Price bars */}
      {[100, 180, 260, 340, 420, 500, 580, 660].map((x, i) => (
        <g key={i}>
          <rect x={x} y={180 - (i * 8 + Math.sin(i) * 15)} width="24" height={i * 8 + Math.sin(i) * 15 + 30} fill="#6366f1" opacity={0.15 + i * 0.08} rx="3" />
          <text x={x + 12} y={175 - (i * 8 + Math.sin(i) * 15)} fontFamily="monospace" fontSize="8" fill="#a5b4fc" textAnchor="middle" opacity="0.6">
            {(100 + i * 15 + Math.random() * 20).toFixed(0)}
          </text>
        </g>
      ))}
      {/* Glow orbs */}
      <circle cx="650" cy="120" r="80" fill="#6366f1" opacity="0.04" />
      <circle cx="650" cy="120" r="40" fill="#6366f1" opacity="0.06" />
      {/* Text */}
      <text x="50" y="65" fontFamily="monospace" fontSize="28" fontWeight="bold" fill="white">{name}</text>
      <text x="50" y="88" fontFamily="monospace" fontSize="13" fill="#c7d2fe">{tagline}</text>
      {/* Tags */}
      <rect x="50" y="220" width="120" height="28" rx="14" fill="#6366f1" fillOpacity="0.15" stroke="#6366f1" strokeOpacity="0.4" strokeWidth="1" />
      <text x="110" y="239" fontFamily="monospace" fontSize="11" fill="#a5b4fc" textAnchor="middle">TOP 100 CRYPTOS</text>
      <rect x="180" y="220" width="100" height="28" rx="14" fill="#8b5cf6" fillOpacity="0.15" stroke="#8b5cf6" strokeOpacity="0.4" strokeWidth="1" />
      <text x="230" y="239" fontFamily="monospace" fontSize="11" fill="#c4b5fd" textAnchor="middle">LIVE PRICES</text>
    </svg>
  ),

  // ─── 3. Market Intelligence ──────────────────────────
  'market-intelligence': ({ name, tagline }) => (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <defs>
        <linearGradient id="mi-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a0a2e" />
          <stop offset="50%" stopColor="#16082b" />
          <stop offset="100%" stopColor="#0a0e1a" />
        </linearGradient>
      </defs>
      <rect width="800" height="280" fill="url(#mi-bg)" />
      {/* Neural network nodes */}
      {[
        [120, 80], [200, 60], [280, 90], [160, 140], [240, 160],
        [320, 130], [380, 70], [440, 110], [500, 80], [360, 170],
        [420, 190], [520, 160], [560, 120], [600, 180], [680, 140],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={4 + (i % 3) * 2} fill="#d946ef" opacity={0.2 + (i % 4) * 0.1} />
          {i < 14 && (
            <line x1={cx} y1={cy} x2={[[120,80],[200,60],[280,90],[160,140],[240,160],[320,130],[380,70],[440,110],[500,80],[360,170],[420,190],[520,160],[560,120],[600,180],[680,140]][(i+3)%15][0]}
              y2={[[120,80],[200,60],[280,90],[160,140],[240,160],[320,130],[380,70],[440,110],[500,80],[360,170],[420,190],[520,160],[560,120],[600,180],[680,140]][(i+3)%15][1]}
              stroke="#d946ef" strokeOpacity="0.1" strokeWidth="1"
            />
          )}
        </g>
      ))}
      {/* AI brain glow */}
      <circle cx="400" cy="140" r="80" fill="#d946ef" opacity="0.03" />
      <circle cx="400" cy="140" r="50" fill="#a855f7" opacity="0.05" />
      <circle cx="400" cy="140" r="25" fill="#c084fc" opacity="0.08" />
      {/* Signal wave */}
      <path d="M 300 200 Q 350 180, 400 190 T 500 170 T 600 150 T 700 130" fill="none" stroke="#d946ef" strokeWidth="2" strokeOpacity="0.4" />
      {/* Text */}
      <text x="50" y="65" fontFamily="monospace" fontSize="28" fontWeight="bold" fill="white">{name}</text>
      <text x="50" y="88" fontFamily="monospace" fontSize="13" fill="#e9d5ff">{tagline}</text>
      {/* Tags */}
      <rect x="50" y="220" width="100" height="28" rx="14" fill="#d946ef" fillOpacity="0.15" stroke="#d946ef" strokeOpacity="0.4" strokeWidth="1" />
      <text x="100" y="239" fontFamily="monospace" fontSize="11" fill="#f0abfc" textAnchor="middle">AI POWERED</text>
      <rect x="160" y="220" width="110" height="28" rx="14" fill="#a855f7" fillOpacity="0.15" stroke="#a855f7" strokeOpacity="0.4" strokeWidth="1" />
      <text x="215" y="239" fontFamily="monospace" fontSize="11" fill="#d8b4fe" textAnchor="middle">MULTI-ASSET</text>
    </svg>
  ),

  // ─── 4. Smart Multi-Scanner ──────────────────────────
  'smart-multi-scanner': ({ name, tagline }) => (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <defs>
        <linearGradient id="sms-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a0f0a" />
          <stop offset="50%" stopColor="#1c1008" />
          <stop offset="100%" stopColor="#0f1a0a" />
        </linearGradient>
      </defs>
      <rect width="800" height="280" fill="url(#sms-bg)" />
      {/* Multi-asset lines (crypto, forex, stock) */}
      <path d="M 0 180 C 80 160, 160 200, 240 150 S 400 100, 480 120 S 640 80, 800 100" fill="none" stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.6" />
      <path d="M 0 200 C 100 180, 200 220, 300 170 S 450 130, 550 150 S 700 120, 800 130" fill="none" stroke="#fb923c" strokeWidth="1.5" strokeOpacity="0.4" />
      <path d="M 0 210 C 120 190, 240 230, 360 180 S 500 150, 600 160 S 720 140, 800 145" fill="none" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.3" />
      {/* Asset type indicators */}
      {[
        { x: 120, y: 100, label: '₿', color: '#f59e0b' },
        { x: 280, y: 80, label: '€', color: '#fb923c' },
        { x: 440, y: 65, label: '📊', color: '#fbbf24' },
        { x: 600, y: 75, label: '🥇', color: '#f59e0b' },
      ].map((item, i) => (
        <g key={i}>
          <circle cx={item.x} cy={item.y} r="18" fill={item.color} fillOpacity="0.1" stroke={item.color} strokeOpacity="0.3" strokeWidth="1" />
          <text x={item.x} y={item.y + 5} fontSize="14" fill={item.color} textAnchor="middle">{item.label}</text>
        </g>
      ))}
      {/* Scan line animation */}
      <rect x="0" y="0" width="800" height="1" fill="#f59e0b" opacity="0.1">
        <animate attributeName="y" values="0;280;0" dur="4s" repeatCount="indefinite" />
      </rect>
      {/* Text */}
      <text x="50" y="65" fontFamily="monospace" fontSize="28" fontWeight="bold" fill="white">{name}</text>
      <text x="50" y="88" fontFamily="monospace" fontSize="13" fill="#fde68a">{tagline}</text>
      {/* Tags */}
      <rect x="50" y="220" width="100" height="28" rx="14" fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeOpacity="0.4" strokeWidth="1" />
      <text x="100" y="239" fontFamily="monospace" fontSize="11" fill="#fcd34d" textAnchor="middle">MULTI-MARKET</text>
      <rect x="160" y="220" width="90" height="28" rx="14" fill="#fb923c" fillOpacity="0.15" stroke="#fb923c" strokeOpacity="0.4" strokeWidth="1" />
      <text x="205" y="239" fontFamily="monospace" fontSize="11" fill="#fdba74" textAnchor="middle">SMART AI</text>
    </svg>
  ),

  // ─── 5. Setup Generator ──────────────────────────
  'setup-generator': ({ name, tagline }) => (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <defs>
        <linearGradient id="sg-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a1a10" />
          <stop offset="50%" stopColor="#0d1f15" />
          <stop offset="100%" stopColor="#0a1a0f" />
        </linearGradient>
      </defs>
      <rect width="800" height="280" fill="url(#sg-bg)" />
      {/* Grid lines */}
      {Array.from({ length: 16 }, (_, i) => (
        <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="280" stroke="#22c55e" strokeOpacity="0.05" strokeWidth="1" />
      ))}
      {/* Trade setup visualization — entry, SL, TP */}
      <line x1="100" y1="180" x2="700" y2="180" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="5,5" />
      <text x="710" y="184" fontFamily="monospace" fontSize="10" fill="#86efac" opacity="0.7">ENTRY</text>
      <line x1="100" y1="120" x2="700" y2="120" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.3" />
      <text x="710" y="124" fontFamily="monospace" fontSize="10" fill="#86efac" opacity="0.5">TP</text>
      <line x1="100" y1="230" x2="700" y2="230" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.3" />
      <text x="710" y="234" fontFamily="monospace" fontSize="10" fill="#fca5a5" opacity="0.5">SL</text>
      {/* R:R ratio box */}
      <rect x="120" y="120" width="8" height="60" fill="#22c55e" opacity="0.15" rx="2" />
      <text x="124" y="155" fontFamily="monospace" fontSize="8" fill="#86efac" textAnchor="middle" transform="rotate(-90 124 155)">R:R 1:2</text>
      {/* Signal candle at entry */}
      <rect x="390" y="155" width="20" height="25" fill="#22c55e" rx="2" opacity="0.8" />
      <line x1="400" y1="140" x2="400" y2="155" stroke="#22c55e" strokeWidth="1.5" />
      <line x1="400" y1="180" x2="400" y2="210" stroke="#22c55e" strokeWidth="1.5" />
      {/* Zone highlight */}
      <rect x="350" y="115" width="100" height="120" fill="#22c55e" opacity="0.04" rx="4" stroke="#22c55e" strokeOpacity="0.1" strokeDasharray="3,3" />
      {/* Text */}
      <text x="50" y="65" fontFamily="monospace" fontSize="28" fontWeight="bold" fill="white">{name}</text>
      <text x="50" y="88" fontFamily="monospace" fontSize="13" fill="#86efac">{tagline}</text>
      {/* Tags */}
      <rect x="50" y="248" width="120" height="24" rx="12" fill="#22c55e" fillOpacity="0.12" stroke="#22c55e" strokeOpacity="0.3" strokeWidth="1" />
      <text x="110" y="265" fontFamily="monospace" fontSize="10" fill="#86efac" textAnchor="middle">AUTO SETUP GEN</text>
    </svg>
  ),

  // ─── 6. Trade Setup Pro ──────────────────────────
  'trade-setup-pro': ({ name, tagline }) => (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <defs>
        <linearGradient id="tsp-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a0a0f" />
          <stop offset="50%" stopColor="#1f0a14" />
          <stop offset="100%" stopColor="#0f0a1a" />
        </linearGradient>
      </defs>
      <rect width="800" height="280" fill="url(#tsp-bg)" />
      {/* Signal radar circles */}
      {[40, 70, 100, 130].map((r, i) => (
        <circle key={i} cx="600" cy="140" r={r} fill="none" stroke="#ec4899" strokeWidth="0.5" strokeOpacity={0.1 + i * 0.05} />
      ))}
      {/* Radar sweep */}
      <line x1="600" y1="140" x2="600" y2="10" stroke="#ec4899" strokeWidth="1" strokeOpacity="0.3">
        <animateTransform attributeName="transform" type="rotate" from="0 600 140" to="360 600 140" dur="6s" repeatCount="indefinite" />
      </line>
      {/* Signal dots on radar */}
      {[
        { cx: 560, cy: 100, r: 3 },
        { cx: 640, cy: 80, r: 4 },
        { cx: 580, cy: 160, r: 2.5 },
        { cx: 650, cy: 150, r: 3.5 },
        { cx: 550, cy: 130, r: 2 },
      ].map((dot, i) => (
        <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill="#ec4899" opacity={0.4 + i * 0.1} />
      ))}
      {/* Signal bars on left */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={80 + i * 50} y={200 - (i * 12 + Math.sin(i * 2) * 10)} width="30" height={i * 12 + Math.sin(i * 2) * 10 + 20}
          fill="#ec4899" opacity={0.1 + i * 0.05} rx="3" />
      ))}
      {/* Text */}
      <text x="50" y="65" fontFamily="monospace" fontSize="28" fontWeight="bold" fill="white">{name}</text>
      <text x="50" y="88" fontFamily="monospace" fontSize="13" fill="#fda4af">{tagline}</text>
      {/* Tags */}
      <rect x="50" y="248" width="90" height="24" rx="12" fill="#ec4899" fillOpacity="0.12" stroke="#ec4899" strokeOpacity="0.3" strokeWidth="1" />
      <text x="95" y="265" fontFamily="monospace" fontSize="10" fill="#f9a8d4" textAnchor="middle">PRO SIGNALS</text>
    </svg>
  ),

  // ─── 7. Forex Signal Scanner ──────────────────────────
  'forex-scanner': ({ name, tagline }) => (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <defs>
        <linearGradient id="fs-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a0e1a" />
          <stop offset="50%" stopColor="#0a1628" />
          <stop offset="100%" stopColor="#0a1a14" />
        </linearGradient>
        <linearGradient id="fs-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <rect width="800" height="280" fill="url(#fs-bg)" />
      {/* Currency pair indicators */}
      {['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD', 'AUD/USD'].map((pair, i) => (
        <g key={i}>
          <rect x={60 + i * 140} y={180} width={120} height={50} rx="6" fill="#10b981" fillOpacity={0.05 + i * 0.02} stroke="#10b981" strokeOpacity={0.1 + i * 0.05} strokeWidth="0.8" />
          <text x={120 + i * 140} y={200} fontFamily="monospace" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">{pair}</text>
          <text x={120 + i * 140} y={218} fontFamily="monospace" fontSize="10" fill={i % 2 === 0 ? '#34d399' : '#f87171'} textAnchor="middle">
            {i % 2 === 0 ? '▲' : '▼'} {(Math.random() * 0.5).toFixed(3)}
          </text>
        </g>
      ))}
      {/* Signal waves */}
      <path d="M 0 140 Q 100 110, 200 130 T 400 100 T 600 80 T 800 90" fill="none" stroke="#10b981" strokeWidth="2" strokeOpacity="0.4" />
      <path d="M 0 150 Q 100 120, 200 140 T 400 110 T 600 90 T 800 100" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.25" />
      {/* Globe accent */}
      <circle cx="700" cy="100" r="50" fill="none" stroke="#10b981" strokeWidth="0.8" strokeOpacity="0.15" />
      <ellipse cx="700" cy="100" rx="25" ry="50" fill="none" stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.1" />
      <line x1="650" y1="100" x2="750" y2="100" stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.1" />
      <line x1="700" y1="50" x2="700" y2="150" stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.1" />
      {/* Text */}
      <text x="50" y="65" fontFamily="monospace" fontSize="28" fontWeight="bold" fill="white">{name}</text>
      <text x="50" y="88" fontFamily="monospace" fontSize="13" fill="#6ee7b7">{tagline}</text>
      {/* Tags */}
      <rect x="50" y="248" width="100" height="24" rx="12" fill="#10b981" fillOpacity="0.12" stroke="#10b981" strokeOpacity="0.3" strokeWidth="1" />
      <text x="100" y="265" fontFamily="monospace" fontSize="10" fill="#6ee7b7" textAnchor="middle">11 PAIRS</text>
      <rect x="160" y="248" width="100" height="24" rx="12" fill="#06b6d4" fillOpacity="0.12" stroke="#06b6d4" strokeOpacity="0.3" strokeWidth="1" />
      <text x="210" y="265" fontFamily="monospace" fontSize="10" fill="#67e8f9" textAnchor="middle">10 INDICATORS</text>
    </svg>
  ),
}

// ─── Fallback banner ──────────────────────────────────
function FallbackBanner({ name, tagline }: { name: string; tagline: string }) {
  return (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <defs>
        <linearGradient id="fb-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <rect width="800" height="280" fill="url(#fb-bg)" rx="0" />
      {Array.from({ length: 10 }, (_, i) => (
        <circle key={i} cx={80 + i * 75} cy={140 + Math.sin(i * 1.2) * 40} r={3 + (i % 3) * 2} fill="#94a3b8" opacity={0.1 + i * 0.03} />
      ))}
      <path d="M 0 200 Q 200 160, 400 180 T 800 150" fill="none" stroke="#94a3b8" strokeWidth="1" strokeOpacity="0.2" />
      <text x="50" y="65" fontFamily="monospace" fontSize="28" fontWeight="bold" fill="white">{name}</text>
      <text x="50" y="88" fontFamily="monospace" fontSize="13" fill="#94a3b8">{tagline}</text>
    </svg>
  )
}

export function ToolBanner({ toolId, name, tagline }: ToolBannerProps) {
  const BannerComponent = banners[toolId]
  return (
    <div className="w-full overflow-hidden rounded-t-lg">
      {BannerComponent ? (
        <BannerComponent name={name} tagline={tagline} />
      ) : (
        <FallbackBanner name={name} tagline={tagline} />
      )}
    </div>
  )
}
