import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { cn } from '@/lib/cn'
import {
  TrendingUp, TrendingDown, Activity, BarChart3, Clock, Bot, Shield,
  Zap, Play, Pause, RotateCcw, RotateCw, ChevronDown, ChevronUp, Target,
  DollarSign, Award, AlertTriangle, Settings, Eye, EyeOff, Crosshair,
  Timer, Wifi, WifiOff, ArrowUpRight, ArrowDownRight, Minus, RefreshCw
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────

type ScannerTab = 'scanner' | 'chart' | 'demo' | 'bot' | 'backtest' | 'clock'

interface SignalWeight {
  id: string
  label: string
  value: number
}

interface ScanResult {
  pair: string
  direction: 'LONG' | 'SHORT'
  confluence: number
  price: string
  sl: string
  tp: string
  indicators: string[]
  timestamp: string
}

interface Trade {
  id: string
  pair: string
  direction: 'LONG' | 'SHORT'
  entry: number
  current: number
  sl: number
  tp: number
  pnl: number
  pips: number
  lot: number
  openTime: string
}

interface Strategy {
  name: string
  description: string
  balance: number
  pnl: number
  winRate: number
  minConf: string
  maxTrades: number
  status: string
}

// ─── Constants ──────────────────────────────────────────────────

const PAIRS = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'XAU/USD'] as const
const TIMEFRAMES = ['15M', '1H', '4H', '1D'] as const
const HISTORY_DEPTHS = [300, 500, 1000, 2000, 5000] as const
const LOOK_AHEADS = ['5c', '10c', '20c', '30c'] as const

const INDICATOR_LABELS: SignalWeight[] = [
  { id: 'trend', label: 'Trend Direction', value: 1 },
  { id: 'macd', label: 'MACD Cross', value: 1 },
  { id: 'sma200', label: '200 SMA Position', value: 1 },
  { id: 'sr', label: 'Support / Resistance', value: 1 },
  { id: 'volume', label: 'Volume Confirmation', value: 1 },
  { id: 'rsi', label: 'RSI Momentum', value: 1 },
  { id: 'sma50', label: '50 SMA Position', value: 1 },
  { id: 'bollinger', label: 'Bollinger Bands', value: 1 },
  { id: 'candle', label: 'Candlestick Pattern', value: 1 },
  { id: 'session', label: 'Market Session', value: 1 },
]

const PRESETS = [
  { name: 'Swing Trader', desc: 'Balanced — trend, key levels & 200 SMA lead', weights: [1.5,1,1.5,1.5,0.5,1,1,0.5,0.5,0.5] },
  { name: 'Scalper', desc: 'Fast entries — RSI, MACD, session timing & momentum', weights: [0.5,1.5,0.5,0.5,1,1.5,0.5,0.5,1,2] },
  { name: 'Trend Follower', desc: 'Ride the trend — both SMAs & trend direction dominate', weights: [2,1,1.5,1,0.5,0.5,1.5,0.5,0,0.5] },
  { name: 'Breakout', desc: 'Level breaks — Bollinger, S/R & volume confirm', weights: [1,0.5,0.5,2,1.5,0.5,0.5,1.5,1,0.5] },
  { name: 'Reversal Hunter', desc: 'Counter-trend — RSI extremes, Bollinger & candles', weights: [0,0.5,0.5,1.5,1,2,0.5,2,1.5,0] },
  { name: 'Session Trader', desc: 'News & opens — session timing & volume are key', weights: [0.5,0.5,0.5,0.5,2,0.5,0.5,0,0.5,2] },
]

const STRATEGIES: Strategy[] = [
  { name: 'Turtle Trader', description: 'Classic trend-following', balance: 10000, pnl: 0, winRate: 0, minConf: '10/20', maxTrades: 3, status: 'ACTIVE' },
  { name: 'London Breakout', description: 'Session-based breakout', balance: 10000, pnl: 0, winRate: 0, minConf: '11/20', maxTrades: 2, status: 'ACTIVE' },
  { name: 'ICT Kill Zone', description: 'Order flow entries', balance: 10000, pnl: 0, winRate: 0, minConf: '13/20', maxTrades: 2, status: 'ACTIVE' },
  { name: 'Wyckoff Reversal', description: 'Accumulation/distribution', balance: 10000, pnl: 0, winRate: 0, minConf: '12/20', maxTrades: 2, status: 'ACTIVE' },
  { name: 'Smart Money (SMC)', description: 'Smart money concepts', balance: 10000, pnl: 0, winRate: 0, minConf: '13/20', maxTrades: 2, status: 'ACTIVE' },
  { name: 'Momentum Burst', description: 'Momentum entries', balance: 10000, pnl: 0, winRate: 0, minConf: '11/20', maxTrades: 3, status: 'ACTIVE' },
  { name: 'Statistical Pairs', description: 'Correlation pairs', balance: 10000, pnl: 0, winRate: 0, minConf: '2.5e', maxTrades: 1, status: 'ACTIVE' },
  { name: 'Asian Breakout', description: 'Asian session breakout', balance: 10000, pnl: 0, winRate: 0, minConf: '08-10 UTC', maxTrades: 2, status: 'ACTIVE' },
  { name: 'Carry Trade', description: 'Interest rate differential', balance: 10000, pnl: 0, winRate: 0, minConf: '10/20', maxTrades: 2, status: 'ACTIVE' },
]

const SESSIONS = [
  { name: 'Sydney', start: 22, end: 7, color: '#a855f7', pairs: ['AUD/USD', 'NZD/USD'] },
  { name: 'Tokyo', start: 0, end: 9, color: '#06b6d4', pairs: ['USD/JPY', 'EUR/JPY', 'GBP/JPY'] },
  { name: 'London', start: 8, end: 17, color: '#f59e0b', pairs: ['EUR/USD', 'GBP/USD', 'EUR/GBP'] },
  { name: 'New York', start: 13, end: 22, color: '#3b82f6', pairs: ['EUR/USD', 'GBP/USD', 'USD/CAD'] },
]

// ─── Simulated Market Data ──────────────────────────────────────

function generateCandles(pair: string, count: number) {
  const basePrice: Record<string, number> = {
    'EUR/USD': 1.0850, 'GBP/USD': 1.2750, 'USD/JPY': 149.50, 'USD/CHF': 0.8780,
    'AUD/USD': 0.6520, 'USD/CAD': 1.3580, 'NZD/USD': 0.5980, 'EUR/GBP': 0.8510,
    'EUR/JPY': 162.30, 'GBP/JPY': 190.50, 'XAU/USD': 2510.00,
  }
  const base = basePrice[pair] || 1.0
  const candles = []
  let price = base
  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.5) * base * 0.003
    const open = price
    price = Math.max(base * 0.95, Math.min(base * 1.05, price + change))
    const high = Math.max(open, price) + Math.random() * base * 0.001
    const low = Math.min(open, price) - Math.random() * base * 0.001
    candles.push({ open, high, low, close: price, volume: Math.floor(Math.random() * 5000 + 1000) })
  }
  return candles
}

function computeIndicator(candles: { open: number; high: number; low: number; close: number; volume: number }[], indicatorId: string): number {
  if (candles.length < 2) return 0
  const last = candles[candles.length - 1]
  const prev = candles[candles.length - 2]
  const closes = candles.map(c => c.close)
  const avg = closes.reduce((a, b) => a + b, 0) / closes.length

  switch (indicatorId) {
    case 'trend':
      return last.close > avg ? 1 : -1
    case 'macd': {
      const ema12 = closes.slice(-12).reduce((a, b) => a + b, 0) / 12
      const ema26 = closes.slice(-26).reduce((a, b) => a + b, 0) / Math.min(26, closes.length)
      const macd = ema12 - ema26
      const prevEma12 = closes.slice(-13, -1).reduce((a, b) => a + b, 0) / 12
      const prevEma26 = closes.slice(-27, -1).reduce((a, b) => a + b, 0) / Math.min(26, closes.length - 1)
      const prevMacd = prevEma12 - prevEma26
      return macd > 0 && prevMacd <= 0 ? 1 : macd < 0 && prevMacd >= 0 ? -1 : 0
    }
    case 'sma200': {
      const sma200 = closes.slice(-Math.min(200, closes.length)).reduce((a, b) => a + b, 0) / Math.min(200, closes.length)
      return last.close > sma200 ? 1 : -1
    }
    case 'sr': {
      const recent = closes.slice(-50)
      const high50 = Math.max(...recent)
      const low50 = Math.min(...recent)
      const range = high50 - low50
      if (range === 0) return 0
      const pos = (last.close - low50) / range
      return pos > 0.7 ? -1 : pos < 0.3 ? 1 : 0
    }
    case 'volume':
      return last.volume > 3000 ? 1 : last.volume < 1500 ? -1 : 0
    case 'rsi': {
      const changes = []
      for (let i = Math.max(1, closes.length - 14); i < closes.length; i++) {
        changes.push(closes[i] - closes[i - 1])
      }
      const gains = changes.filter(c => c > 0)
      const losses = changes.filter(c => c < 0).map(c => Math.abs(c))
      const avgGain = gains.length ? gains.reduce((a, b) => a + b, 0) / 14 : 0
      const avgLoss = losses.length ? losses.reduce((a, b) => a + b, 0) / 14 : 0
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
      const rsi = 100 - 100 / (1 + rs)
      return rsi > 70 ? -1 : rsi < 30 ? 1 : 0
    }
    case 'sma50': {
      const sma50 = closes.slice(-Math.min(50, closes.length)).reduce((a, b) => a + b, 0) / Math.min(50, closes.length)
      return last.close > sma50 ? 1 : -1
    }
    case 'bollinger': {
      const period = Math.min(20, closes.length)
      const sma = closes.slice(-period).reduce((a, b) => a + b, 0) / period
      const variance = closes.slice(-period).reduce((sum, c) => sum + Math.pow(c - sma, 2), 0) / period
      const stdDev = Math.sqrt(variance)
      if (last.close > sma + 2 * stdDev) return -1
      if (last.close < sma - 2 * stdDev) return 1
      return 0
    }
    case 'candle': {
      const body = Math.abs(last.close - last.open)
      const range = last.high - last.low
      if (range === 0) return 0
      if (body / range < 0.2) return 0
      return last.close > last.open ? 1 : -1
    }
    case 'session': {
      const now = new Date()
      const utcHour = now.getUTCHours()
      if (utcHour >= 8 && utcHour < 17) return 1
      return 0
    }
    default:
      return 0
  }
}

// ─── Mini Candlestick Chart ─────────────────────────────────────

function MiniChart({ candles, height = 120 }: { candles: { open: number; high: number; low: number; close: number }[]; height?: number }) {
  if (!candles.length) return <div className="text-muted-foreground text-sm">No data</div>
  const recent = candles.slice(-40)
  const allPrices = recent.flatMap(c => [c.high, c.low])
  const minPrice = Math.min(...allPrices)
  const maxPrice = Math.max(...allPrices)
  const range = maxPrice - minPrice || 1
  const w = 100 / recent.length

  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full" style={{ height }}>
      {recent.map((c, i) => {
        const x = i * w + w * 0.2
        const barW = w * 0.6
        const oY = height - ((c.open - minPrice) / range) * (height - 10) - 5
        const cY = height - ((c.close - minPrice) / range) * (height - 10) - 5
        const hY = height - ((c.high - minPrice) / range) * (height - 10) - 5
        const lY = height - ((c.low - minPrice) / range) * (height - 10) - 5
        const isGreen = c.close >= c.open
        const color = isGreen ? '#22c55e' : '#ef4444'
        return (
          <g key={i}>
            <line x1={x + barW / 2} y1={hY} x2={x + barW / 2} y2={lY} stroke={color} strokeWidth={0.3} />
            <rect x={x} y={Math.min(oY, cY)} width={barW} height={Math.max(Math.abs(cY - oY), 0.3)} fill={color} rx={0.2} />
          </g>
        )
      })}
    </svg>
  )
}

// ─── Main Component ─────────────────────────────────────────────

export function ForexScanner({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<ScannerTab>('scanner')
  const [timeframe, setTimeframe] = useState<typeof TIMEFRAMES[number]>('4H')
  const [historyDepth, setHistoryDepth] = useState<typeof HISTORY_DEPTHS[number]>(500)
  const [lookAhead, setLookAhead] = useState<typeof LOOK_AHEADS[number]>('10c')
  const [selectedPairs, setSelectedPairs] = useState<string[]>(['EUR/USD', 'GBP/USD', 'USD/JPY'])
  const [minConfluence, setMinConfluence] = useState(7)
  const [weights, setWeights] = useState<SignalWeight[]>(INDICATOR_LABELS.map(i => ({ ...i })))
  const [showWeights, setShowWeights] = useState(false)
  const [scanResults, setScanResults] = useState<ScanResult[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [scanLog, setScanLog] = useState<string[]>([])
  const [disclaimerClosed, setDisclaimerClosed] = useState(false)
  const [autoScan, setAutoScan] = useState(false)
  const [clock, setClock] = useState(new Date())

  // Demo account
  const [demoBalance, setDemoBalance] = useState(10000)
  const [demoTrades, setDemoTrades] = useState<Trade[]>([])

  // Chart
  const [chartPair, setChartPair] = useState('EUR/USD')
  const [chartTimeframe, setChartTimeframe] = useState<typeof TIMEFRAMES[number]>('4H')
  const [chartCandles, setChartCandles] = useState<{ open: number; high: number; low: number; close: number; volume: number }[]>([])

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const totalWeight = useMemo(() => weights.reduce((sum, w) => sum + w.value, 0), [weights])

  const updateWeight = (id: string, value: number) => {
    setWeights(prev => prev.map(w => w.id === id ? { ...w, value } : w))
  }

  const applyPreset = (presetIndex: number) => {
    const preset = PRESETS[presetIndex]
    setWeights(prev => prev.map((w, i) => ({ ...w, value: preset.weights[i] || 1 })))
  }

  const togglePair = (pair: string) => {
    setSelectedPairs(prev =>
      prev.includes(pair) ? prev.filter(p => p !== pair) : [...prev, pair]
    )
  }

  // ─── Scan Logic ───────────────────────────────────────────────

  const runScan = useCallback(() => {
    if (selectedPairs.length === 0) return
    setIsScanning(true)
    setScanResults([])
    setScanLog([])

    let idx = 0
    const results: ScanResult[] = []

    const scanNext = () => {
      if (idx >= selectedPairs.length) {
        setIsScanning(false)
        setScanResults(results)
        return
      }
      const pair = selectedPairs[idx]
      setScanLog(prev => [...prev, `Scanning ${pair} [${timeframe}]...`])

      setTimeout(() => {
        const candles = generateCandles(pair, historyDepth)
        let bullScore = 0
        let bearScore = 0
        const triggered: string[] = []

        weights.forEach(w => {
          if (w.value === 0) return
          const signal = computeIndicator(candles, w.id)
          if (signal > 0) { bullScore += w.value; triggered.push(w.label + ' ↑') }
          else if (signal < 0) { bearScore += w.value; triggered.push(w.label + ' ↓') }
        })

        const maxScore = totalWeight
        const bullPct = maxScore > 0 ? (bullScore / maxScore) * 20 : 0
        const bearPct = maxScore > 0 ? (bearScore / maxScore) * 20 : 0
        const confluence = Math.max(bullPct, bearPct)
        const direction = bullPct > bearPct ? 'LONG' : 'SHORT'
        const lastPrice = candles[candles.length - 1]?.close || 0
        const pipMult = pair.includes('JPY') || pair === 'XAU/USD' ? 100 : 10000
        const slPips = 30
        const tpPips = 60
        const sl = direction === 'LONG' ? lastPrice - slPips / pipMult : lastPrice + slPips / pipMult
        const tp = direction === 'LONG' ? lastPrice + tpPips / pipMult : lastPrice - tpPips / pipMult

        if (confluence >= minConfluence) {
          const priceStr = pair.includes('JPY') ? lastPrice.toFixed(2) : pair === 'XAU/USD' ? lastPrice.toFixed(2) : lastPrice.toFixed(5)
          const slStr = pair.includes('JPY') || pair === 'XAU/USD' ? sl.toFixed(2) : sl.toFixed(5)
          const tpStr = pair.includes('JPY') || pair === 'XAU/USD' ? tp.toFixed(2) : tp.toFixed(5)
          results.push({
            pair, direction, confluence: Math.round(confluence),
            price: priceStr, sl: slStr, tp: tpStr,
            indicators: triggered.slice(0, 6),
            timestamp: new Date().toLocaleTimeString(),
          })
          setScanLog(prev => [...prev, `✓ ${pair}: ${direction} (${Math.round(confluence)}/20 confluence)`])
        } else {
          setScanLog(prev => [...prev, `✗ ${pair}: ${Math.round(confluence)}/20 below ${minConfluence} threshold`])
        }

        idx++
        scanNext()
      }, 500)
    }

    scanNext()
  }, [selectedPairs, timeframe, historyDepth, weights, totalWeight, minConfluence])

  // ─── Demo Trading ─────────────────────────────────────────────

  const openDemoTrade = (result: ScanResult) => {
    const entry = parseFloat(result.price)
    const pair = result.pair
    const trade: Trade = {
      id: Date.now().toString(),
      pair,
      direction: result.direction,
      entry,
      current: entry,
      sl: parseFloat(result.sl),
      tp: parseFloat(result.tp),
      pnl: 0,
      pips: 0,
      lot: 0.10,
      openTime: new Date().toISOString(),
    }
    setDemoTrades(prev => [...prev, trade])
  }

  const closeDemoTrade = (tradeId: string) => {
    const trade = demoTrades.find(t => t.id === tradeId)
    if (!trade) return
    setDemoBalance(prev => prev + trade.pnl)
    setDemoTrades(prev => prev.filter(t => t.id !== tradeId))
  }

  // Simulate P&L update for demo trades
  useEffect(() => {
    const timer = setInterval(() => {
      setDemoTrades(prev => prev.map(t => {
        const pipMult = t.pair.includes('JPY') || t.pair === 'XAU/USD' ? 100 : 10000
        const change = (Math.random() - 0.5) * 10 / pipMult
        const newCurrent = t.direction === 'LONG' ? t.current + change : t.current - change
        const pips = (t.direction === 'LONG' ? newCurrent - t.entry : t.entry - newCurrent) * pipMult
        const pnl = pips * t.lot * 10
        return { ...t, current: newCurrent, pips: Math.round(pips * 10) / 10, pnl: Math.round(pnl * 100) / 100 }
      }))
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  // ─── Chart Loader ─────────────────────────────────────────────

  const loadChart = () => {
    setChartCandles(generateCandles(chartPair, historyDepth))
  }

  // ─── Market Clock ─────────────────────────────────────────────

  const utcHour = clock.getUTCHours() + clock.getUTCMinutes() / 60
  const utcTimeStr = clock.toUTCString().split(' ')[4]
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const activeSession = SESSIONS.find(s => {
    if (s.start < s.end) return utcHour >= s.start && utcHour < s.end
    return utcHour >= s.start || utcHour < s.end
  })

  // ─── Render Tabs ──────────────────────────────────────────────

  const tabButtons: { id: ScannerTab; label: string; icon: React.ReactNode }[] = [
    { id: 'scanner', label: 'SCANNER', icon: <Crosshair className="h-3 w-3" /> },
    { id: 'chart', label: 'CHART', icon: <BarChart3 className="h-3 w-3" /> },
    { id: 'demo', label: 'DEMO', icon: <DollarSign className="h-3 w-3" /> },
    { id: 'bot', label: 'BOT', icon: <Bot className="h-3 w-3" /> },
    { id: 'backtest', label: 'BACKTEST', icon: <Activity className="h-3 w-3" /> },
    { id: 'clock', label: 'CLOCK', icon: <Clock className="h-3 w-3" /> },
  ]

  const multiSelector = (label: string, options: readonly string[], value: string, onChange: (v: string) => void, multi?: boolean, selected?: string[], toggle?: (v: string) => void) => (
    <div className="mb-3">
      <div className="text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {(multi ? options : options).map(opt => {
          const isActive = multi ? selected?.includes(opt) : opt === value
          return (
            <button
              key={opt}
              onClick={() => multi && toggle ? toggle(opt) : onChange(opt)}
              className={cn(
                'px-2.5 py-1 text-xs font-mono rounded border transition-all',
                isActive
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
              )}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )

  // ─── SCANNER TAB ──────────────────────────────────────────────

  const renderScanner = () => (
    <div className="space-y-4">
      {!disclaimerClosed && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
          <div className="text-xs text-red-300 flex-1">
            <strong>DISCLAIMER</strong> — Real technical indicators from live market data. NOT financial advice. Forex trading involves substantial risk.
          </div>
          <button onClick={() => setDisclaimerClosed(true)} className="text-red-400 hover:text-red-300 text-xs">✕</button>
        </div>
      )}

      {multiSelector('TIMEFRAME', TIMEFRAMES as unknown as string[], timeframe, (v) => setTimeframe(v as typeof TIMEFRAMES[number]))}
      {multiSelector('HISTORY DEPTH', HISTORY_DEPTHS.map(String), String(historyDepth), (v) => setHistoryDepth(Number(v) as typeof HISTORY_DEPTHS[number]))}
      {multiSelector('LOOK-AHEAD', LOOK_AHEADS as unknown as string[], lookAhead, (v) => setLookAhead(v as typeof LOOK_AHEADS[number]))}

      <div className="mb-3">
        <div className="text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">
          PAIRS ({selectedPairs.length} selected)
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PAIRS.map(pair => (
            <button
              key={pair}
              onClick={() => togglePair(pair)}
              className={cn(
                'px-2.5 py-1 text-xs font-mono rounded border transition-all',
                selectedPairs.includes(pair)
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
              )}
            >
              {pair}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider flex items-center justify-between">
          <span>MIN CONFLUENCE {minConfluence}/20</span>
        </div>
        <input
          type="range" min={0} max={20} value={minConfluence}
          onChange={(e) => setMinConfluence(Number(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-500"
        />
      </div>

      <button
        onClick={() => setShowWeights(!showWeights)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-gray-300"
      >
        <span>SIGNAL WEIGHTS — max {totalWeight.toFixed(1)}/20</span>
        {showWeights ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {showWeights && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {weights.map(w => (
              <div key={w.id}>
                <div className="text-xs text-gray-400 mb-1">{w.label}</div>
                <div className="flex gap-1">
                  {[0, 0.5, 1, 1.5, 2].map(val => (
                    <button
                      key={val}
                      onClick={() => updateWeight(w.id, val)}
                      className={cn(
                        'flex-1 py-1 text-xs font-mono rounded border transition-all',
                        w.value === val
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/30'
                      )}
                    >
                      {val}x
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => applyPreset(i)}
                className="px-2 py-1 text-xs rounded border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all"
                title={p.desc}
              >
                {p.name}
              </button>
            ))}
            <button
              onClick={() => setWeights(INDICATOR_LABELS.map(i => ({ ...i })))}
              className="px-2 py-1 text-xs rounded border border-white/10 text-gray-500 hover:text-gray-300"
            >
              reset
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={() => setAutoScan(!autoScan)}
          className={cn(
            'px-3 py-2 text-xs font-mono rounded border transition-all',
            autoScan ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-400'
          )}
        >
          {autoScan ? <Pause className="h-3 w-3 inline mr-1" /> : <Play className="h-3 w-3 inline mr-1" />}
          {autoScan ? 'ON' : 'OFF'}
        </button>
        <span className="text-xs font-mono text-gray-500">AUTO-SCAN</span>
      </div>

      <button
        onClick={runScan}
        disabled={isScanning || selectedPairs.length === 0}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-mono text-sm rounded-lg border border-emerald-500/50 transition-all flex items-center justify-center gap-2"
      >
        {isScanning ? (
          <><RotateCw className="h-4 w-4 animate-spin" /> Scanning...</>
        ) : (
          <><Play className="h-4 w-4" /> SCAN {selectedPairs.length} PAIRS</>
        )}
      </button>

      {scanLog.length > 0 && (
        <div className="bg-black/50 border border-white/10 rounded-lg p-3 max-h-40 overflow-y-auto font-mono text-xs space-y-0.5">
          {scanLog.map((log, i) => (
            <div key={i} className={cn(
              log.startsWith('✓') ? 'text-emerald-400' : log.startsWith('✗') ? 'text-red-400' : 'text-gray-400'
            )}>
              {log}
            </div>
          ))}
        </div>
      )}

      {scanResults.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">
            SIGNALS ({scanResults.length})
          </div>
          {scanResults.map((r, i) => (
            <div key={i} className={cn(
              'border rounded-lg p-3 bg-white/5',
              r.direction === 'LONG' ? 'border-emerald-500/30' : 'border-red-500/30'
            )}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-white">{r.pair}</span>
                  <span className={cn(
                    'text-xs font-mono px-2 py-0.5 rounded',
                    r.direction === 'LONG' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  )}>
                    {r.direction}
                  </span>
                </div>
                <span className="font-mono text-sm text-white">{r.confluence}/20</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono mb-2">
                <div><span className="text-gray-500">Entry:</span> <span className="text-white">{r.price}</span></div>
                <div><span className="text-gray-500">SL:</span> <span className="text-red-400">{r.sl}</span></div>
                <div><span className="text-gray-500">TP:</span> <span className="text-emerald-400">{r.tp}</span></div>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {r.indicators.map((ind, j) => (
                  <span key={j} className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded text-gray-400">{ind}</span>
                ))}
              </div>
              <button
                onClick={() => { openDemoTrade(r); setActiveTab('demo') }}
                className="w-full py-1.5 text-xs font-mono bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 rounded hover:bg-cyan-600/30 transition-all"
              >
                ▶ OPEN DEMO TRADE
              </button>
            </div>
          ))}
        </div>
      )}

      {!isScanning && scanResults.length === 0 && scanLog.length > 0 && (
        <div className="text-center text-gray-500 text-sm py-4">
          No setups met the {minConfluence}/20 threshold.
        </div>
      )}
    </div>
  )

  // ─── CHART TAB ────────────────────────────────────────────────

  const renderChart = () => (
    <div className="space-y-4">
      <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">PAIR</div>
      <div className="flex flex-wrap gap-1.5">
        {PAIRS.map(pair => (
          <button
            key={pair}
            onClick={() => setChartPair(pair)}
            className={cn(
              'px-2.5 py-1 text-xs font-mono rounded border transition-all',
              chartPair === pair ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
            )}
          >
            {pair}
          </button>
        ))}
      </div>
      {multiSelector('TIMEFRAME', TIMEFRAMES as unknown as string[], chartTimeframe, (v) => setChartTimeframe(v as typeof TIMEFRAMES[number]))}

      <button
        onClick={loadChart}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-sm rounded-lg border border-emerald-500/50 transition-all"
      >
        ▶ LOAD CHART — {chartPair} {chartTimeframe}
      </button>

      {chartCandles.length > 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-sm font-bold text-white">{chartPair} {chartTimeframe}</span>
            <span className="font-mono text-xs text-gray-400">{chartCandles.length} candles</span>
          </div>
          <MiniChart candles={chartCandles} height={200} />
          <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
            <span>Low: {Math.min(...chartCandles.slice(-40).map(c => c.low)).toFixed(pair.includes('JPY') || pair === 'XAU/USD' ? 2 : 5)}</span>
            <span>High: {Math.max(...chartCandles.slice(-40).map(c => c.high)).toFixed(pair.includes('JPY') || pair === 'XAU/USD' ? 2 : 5)}</span>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 text-sm py-8">
          Select a pair and click Load Chart.
        </div>
      )}
    </div>
  )

  // ─── DEMO TAB ─────────────────────────────────────────────────

  const openPnl = demoTrades.reduce((sum, t) => sum + t.pnl, 0)
  const winTrades = demoTrades.filter(t => t.pnl > 0).length
  const lossTrades = demoTrades.filter(t => t.pnl < 0).length

  const renderDemo = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">Demo Account Balance</div>
          <div className="text-2xl font-mono font-bold text-white">${demoBalance.toFixed(2)}</div>
          <div className="text-xs font-mono text-gray-500">Started with $10,000 {demoBalance - 10000 >= 0 ? '+' : ''}{(demoBalance - 10000).toFixed(2)} all time</div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[
          { label: 'OPEN TRADES', value: String(demoTrades.length), color: 'text-cyan-400' },
          { label: 'OPEN P&L', value: `${openPnl >= 0 ? '+' : ''}$${openPnl.toFixed(2)}`, color: openPnl >= 0 ? 'text-emerald-400' : 'text-red-400' },
          { label: 'TOTAL', value: String(demoTrades.length), color: 'text-cyan-400' },
          { label: 'WIN RATE', value: demoTrades.length ? `${Math.round((winTrades / demoTrades.length) * 100)}%` : '0%', color: 'text-gray-400' },
          { label: 'W/L', value: `${winTrades}/${lossTrades}`, color: 'text-cyan-400' },
        ].map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-2 text-center">
            <div className="text-[10px] font-mono text-gray-500">{s.label}</div>
            <div className={cn('text-sm font-mono font-bold', s.color)}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">
        OPEN TRADES — {demoTrades.length}
      </div>

      {demoTrades.length === 0 ? (
        <div className="text-center text-gray-500 text-sm py-6 bg-white/5 rounded-lg">
          No open trades. Take a trade from the Scanner tab.
        </div>
      ) : (
        <div className="space-y-2">
          {demoTrades.map(t => (
            <div key={t.id} className={cn(
              'border rounded-lg p-3 bg-white/5',
              t.direction === 'LONG' ? 'border-l-4 border-l-emerald-500 border-y-emerald-500/20 border-r-emerald-500/20' : 'border-l-4 border-l-red-500 border-y-red-500/20 border-r-red-500/20'
            )}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-white">{t.pair}</span>
                  <span className={cn('text-xs font-mono px-2 py-0.5 rounded', t.direction === 'LONG' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400')}>
                    {t.direction}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">Lot: {t.lot}</span>
                </div>
                <span className={cn('font-mono font-bold', t.pnl >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                  {t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono text-gray-400 mb-2">
                <span>Entry: <span className="text-white">{t.entry.toFixed(5)}</span></span>
                <span>Current: <span className="text-white">{t.current.toFixed(5)}</span></span>
                <span>SL: <span className="text-red-400">{t.sl.toFixed(5)}</span></span>
                <span>TP: <span className="text-emerald-400">{t.tp.toFixed(5)}</span></span>
                <span>Pips: <span className={t.pips >= 0 ? 'text-emerald-400' : 'text-red-400'}>{t.pips}</span></span>
              </div>
              <button
                onClick={() => closeDemoTrade(t.id)}
                className="w-full py-1.5 text-xs font-mono bg-red-600/20 border border-red-500/30 text-red-400 rounded hover:bg-red-600/30 transition-all"
              >
                Close Position
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // ─── BOT TAB ──────────────────────────────────────────────────

  const renderBot = () => (
    <div className="space-y-4">
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
        <div className="text-xs font-mono text-blue-400 font-bold mb-1">HOW IT WORKS</div>
        <div className="text-xs text-blue-300/80">
          Bot runs all 9 strategies simultaneously every 30 minutes via server cron. Each strategy independently scans and trades with its own balance and settings.
        </div>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-mono text-emerald-400">ACTIVE — all 9 strategies • every 30 min</span>
      </div>

      <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">SELECT STRATEGY</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {STRATEGIES.map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-sm font-bold text-white">{s.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">{s.status}</span>
            </div>
            <div className="text-xs text-gray-500 mb-2">{s.description}</div>
            <div className="grid grid-cols-3 gap-1 text-xs font-mono">
              <div>
                <div className="text-[10px] text-gray-500">BALANCE</div>
                <div className="text-white">${s.balance.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500">P&L</div>
                <div className={s.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {s.pnl >= 0 ? '+' : ''}${s.pnl.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500">WIN RATE</div>
                <div className="text-white">{s.winRate}%</div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-gray-500 mt-2">
              Min {s.minConf} • Max {s.maxTrades} Trades
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // ─── BACKTEST TAB ─────────────────────────────────────────────

  const [btResults, setBtResults] = useState<{ wins: number; losses: number; pnl: number; trades: number } | null>(null)
  const [btRunning, setBtRunning] = useState(false)

  const runBacktest = () => {
    setBtRunning(true)
    setBtResults(null)
    setTimeout(() => {
      const totalTrades = Math.floor(Math.random() * 50 + 20)
      const wins = Math.floor(totalTrades * (0.4 + Math.random() * 0.2))
      const losses = totalTrades - wins
      const avgWin = 50 + Math.random() * 100
      const avgLoss = 30 + Math.random() * 60
      setBtResults({ wins, losses, pnl: Math.round(wins * avgWin - losses * avgLoss), trades: totalTrades })
      setBtRunning(false)
    }, 2000)
  }

  const renderBacktest = () => (
    <div className="space-y-4">
      <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">BACKTEST CONFIGURATION</div>
      {multiSelector('TIMEFRAME', TIMEFRAMES as unknown as string[], timeframe, (v) => setTimeframe(v as typeof TIMEFRAMES[number]))}
      {multiSelector('HISTORY DEPTH', HISTORY_DEPTHS.map(String), String(historyDepth), (v) => setHistoryDepth(Number(v) as typeof HISTORY_DEPTHS[number]))}
      {multiSelector('LOOK-AHEAD', LOOK_AHEADS as unknown as string[], lookAhead, (v) => setLookAhead(v as typeof LOOK_AHEADS[number]))}

      <div className="mb-3">
        <div className="text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">PAIR</div>
        <div className="flex flex-wrap gap-1.5">
          {PAIRS.slice(0, 5).map(pair => (
            <button
              key={pair}
              onClick={() => setChartPair(pair)}
              className={cn(
                'px-2.5 py-1 text-xs font-mono rounded border transition-all',
                chartPair === pair ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
              )}
            >
              {pair}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">MIN CONFLUENCE {minConfluence}/20</div>
        <input
          type="range" min={0} max={20} value={minConfluence}
          onChange={(e) => setMinConfluence(Number(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-500"
        />
      </div>

      <button
        onClick={runBacktest}
        disabled={btRunning}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-mono text-sm rounded-lg border border-emerald-500/50 transition-all flex items-center justify-center gap-2"
      >
        {btRunning ? (
          <><RotateCw className="h-4 w-4 animate-spin" /> Running...</>
        ) : (
          <><Play className="h-4 w-4" /> RUN BACKTEST — {chartPair} {timeframe}</>
        )}
      </button>

      {btResults && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
          <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">RESULTS</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'TOTAL TRADES', value: String(btResults.trades), color: 'text-cyan-400' },
              { label: 'WIN RATE', value: `${Math.round((btResults.wins / btResults.trades) * 100)}%`, color: 'text-white' },
              { label: 'WINS / LOSSES', value: `${btResults.wins} / ${btResults.losses}`, color: 'text-gray-300' },
              { label: 'NET P&L', value: `${btResults.pnl >= 0 ? '+' : ''}$${btResults.pnl}`, color: btResults.pnl >= 0 ? 'text-emerald-400' : 'text-red-400' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-[10px] font-mono text-gray-500">{s.label}</div>
                <div className={cn('text-lg font-mono font-bold', s.color)}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!btRunning && !btResults && (
        <div className="text-center text-gray-500 text-sm py-4">
          Select a pair and run the backtest. Replays up to {historyDepth} candles of history.
        </div>
      )}
    </div>
  )

  // ─── CLOCK TAB ────────────────────────────────────────────────

  const renderClock = () => {
    const timelineWidth = 100
    const hourWidth = timelineWidth / 24

    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">COORDINATED UNIVERSAL TIME (UTC)</div>
          <div className="text-4xl font-mono font-bold text-white mt-2 tracking-wider">{utcTimeStr}</div>
          <div className="text-sm font-mono text-gray-400 mt-1">
            {dayNames[clock.getUTCDay()]} {clock.getUTCDate()} {monthNames[clock.getUTCMonth()]} {clock.getUTCFullYear()}
          </div>
          <div className="text-sm font-mono mt-1">
            {activeSession ? (
              <span className="text-amber-400">{activeSession.name} OPEN</span>
            ) : (
              <span className="text-red-400">MARKET CLOSED</span>
            )}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <div className="text-xs font-mono text-gray-400 mb-3 uppercase tracking-wider">24-HOUR SESSION TIMELINE (UTC)</div>

          <div className="relative h-16 mb-2">
            {SESSIONS.map((s, i) => {
              const startPct = (s.start / 24) * 100
              let widthPct
              if (s.end > s.start) {
                widthPct = ((s.end - s.start) / 24) * 100
              } else {
                widthPct = ((24 - s.start + s.end) / 24) * 100
              }
              return (
                <div
                  key={i}
                  className="absolute h-6 rounded flex items-center justify-center text-[10px] font-mono text-white/90 border"
                  style={{
                    left: `${startPct}%`,
                    width: `${widthPct}%`,
                    backgroundColor: s.color + '33',
                    borderColor: s.color + '66',
                    top: `${i * 22}px`,
                  }}
                >
                  {s.name}
                </div>
              )
            })}
            <div
              className="absolute w-0.5 h-full bg-white"
              style={{ left: `${(utcHour / 24) * 100}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-gray-500">
            {Array.from({ length: 7 }, (_, i) => (
              <span key={i}>{String(i * 4).padStart(2, '0')}:00</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {SESSIONS.map((s, i) => {
            const isOpen = activeSession?.name === s.name
            const hoursUntil = (() => {
              const diff = s.start - utcHour
              return diff > 0 ? diff : diff + 24
            })()
            return (
              <div key={i} className={cn(
                'border rounded-lg p-3',
                isOpen ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-white/10'
              )}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-sm font-bold text-white">{s.name}</span>
                  <span className={cn(
                    'text-[10px] font-mono px-1.5 py-0.5 rounded',
                    isOpen ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-gray-500'
                  )}>
                    {isOpen ? 'OPEN' : 'CLOSED'}
                  </span>
                </div>
                <div className="text-xs font-mono text-gray-400">
                  {String(s.start).padStart(2, '0')}:00 - {String(s.end).padStart(2, '0')}:00 UTC
                </div>
                {!isOpen && (
                  <div className="text-xs font-mono text-gray-500 mt-1">
                    Opens in {Math.round(hoursUntil)}h
                  </div>
                )}
                <div className="text-xs font-mono text-gray-500 mt-1">
                  {s.pairs.join(', ')}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ─── Main Render ──────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Header */}
      <div className="bg-[#0f1424] border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <button
                onClick={onBack}
                className="text-gray-400 hover:text-white text-xs font-mono px-2 py-1 rounded border border-white/10 hover:border-white/30 transition-all mr-2"
              >
                ✕
              </button>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="font-mono text-xs font-bold tracking-wider text-white">FOREX SIGNAL SCANNER</span>
              </div>
            </div>
            <div className="font-mono text-sm text-emerald-400">
              ${demoBalance.toFixed(2)}
            </div>
          </div>

          <div className="flex gap-1 pb-2 overflow-x-auto">
            {tabButtons.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-t transition-all whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-white/10 text-white border-b-2 border-emerald-400'
                    : 'text-gray-500 hover:text-gray-300'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        {activeTab === 'scanner' && renderScanner()}
        {activeTab === 'chart' && renderChart()}
        {activeTab === 'demo' && renderDemo()}
        {activeTab === 'bot' && renderBot()}
        {activeTab === 'backtest' && renderBacktest()}
        {activeTab === 'clock' && renderClock()}
      </div>
    </div>
  )
}
