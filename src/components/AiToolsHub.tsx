import { useState } from 'react'
import {
  Bot,
  ExternalLink,
  Lock,
  Shield,
  TrendingUp,
  Search,
  Zap,
  BarChart3,
  Brain,
  Crosshair,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Eye,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/cn'

interface AiTool {
  id: string
  name: string
  tagline: string
  url: string
  icon: typeof Bot
  color: string
  bgColor: string
  borderColor: string
  uniqueStrength: string
  description: string
  features: string[]
  indicators: string[]
  signalFormat: {
    example: string
    timeframe: string
    confidence: string
  }
  category: 'signals' | 'scanner' | 'analysis' | 'multi-asset' | 'intelligence' | 'setup'
}

const aiTools: AiTool[] = [
  {
    id: 'alphatrade',
    name: 'AlphaTrade AI',
    tagline: 'Institutional Crypto Intelligence',
    url: 'https://ai-crypto-trading-as-b49c.bolt.host/',
    icon: TrendingUp,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    uniqueStrength: 'All-in-one trading intelligence platform',
    description:
      'Complete crypto trading dashboard with AI-powered signals, sentiment analysis, news feed, portfolio tracking, risk management, and an AI assistant. Covers every aspect of crypto trading in one platform.',
    features: [
      'Smart Coin Scanner',
      'AI Trade Signals',
      'Technical Analysis Dashboard',
      'Fundamental News Feed with Sentiment',
      'Market Sentiment Gauge',
      'AI Chart Analysis',
      'Risk Management Tools',
      'Portfolio Tracking',
      'Performance Analytics',
      'AI Assistant',
    ],
    indicators: ['RSI', 'MACD', 'EMA', 'Bollinger Bands', 'Volume', 'Support/Resistance'],
    signalFormat: {
      example: 'BTCUSDT — LONG | Entry: $117,556 | TP: $120,405 | SL: $115,808 | R/R: 1:1.63 | Confidence: 53%',
      timeframe: '4H',
      confidence: '97%',
    },
    category: 'intelligence',
  },
  {
    id: 'alphahunter',
    name: 'AI Alpha Hunter',
    tagline: 'Opportunity Radar — Detect Before the Market Does',
    url: 'https://crypto-alpha-hunter-rbjv.bolt.host/',
    icon: Crosshair,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    uniqueStrength: 'Hidden gems & smart money detection',
    description:
      'Specialized in finding early opportunities — hidden gems, smart money movements, and breakout patterns before they happen. 24/7 high-priority alerts with confidence and risk assessment.',
    features: [
      'Opportunity Radar Dashboard',
      'Hidden Gems Scanner (low/mid-cap)',
      '24/7 Trade Alert System',
      'Market Intelligence (11+ categories)',
      'Risk Calculator',
      'Narrative Strength Analysis',
      'Smart Money Tracking',
      'Volume Surge Detection',
    ],
    indicators: ['EMA Alignment', 'RSI Divergence', 'Volume Profile', 'Momentum', 'Funding Rate'],
    signalFormat: {
      example: 'LISTA — LONG | Entry: 0.0699 | Exit: 0.1083 | R/R: 4.8:1 | Confidence: 65% | Strength: 78%',
      timeframe: '1H-4H',
      confidence: '65-80%',
    },
    category: 'scanner',
  },
  {
    id: 'tradesetup',
    name: 'Trade Setup Generator',
    tagline: 'No More Gambling — Data-Driven Setups',
    url: 'https://crypto-trade-setup-a-3zb6.bolt.host/',
    icon: Brain,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    uniqueStrength: 'Anti-gambling philosophy + backtesting',
    description:
      'Built on the principle that trading should never be gambling. Generates data-driven setups with full backtesting capability. Includes risk calculator and historical performance analysis.',
    features: [
      'AI Trade Setup Generator',
      'Backtest Engine (BTC/ETH/SOL/BNB/XRP/DOGE)',
      'Risk Calculator (position sizing)',
      'Live Trading Signals',
      'Market Summary & Sentiment',
      'Confidence Scoring System',
      'Signal Strength Assessment',
    ],
    indicators: ['EMA Crossovers', 'RSI', 'MACD', 'Volume Analysis', 'Trend Strength'],
    signalFormat: {
      example: 'BTCUSDT — LONG | Entry: $117,556 | TP: $120,405 | SL: $115,808 | Confidence: 53% | Hold: 7-14 days',
      timeframe: '1D',
      confidence: '53%',
    },
    category: 'setup',
  },
  {
    id: 'cryptopilot',
    name: 'CryptoPilot Lite',
    tagline: 'Multi-Asset AI Scanner — All Markets, One Platform',
    url: 'https://crypto-pilot-lite.vercel.app/',
    icon: Zap,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    uniqueStrength: 'Scans ALL 5 markets — Crypto, Stocks, Commodities, Forex, Indices',
    description:
      'The only app that scans across all major asset classes — Crypto Futures, US Stocks, Commodities, Forex, and Indices. Real-time pipeline diagnostics show exactly how signals are filtered.',
    features: [
      'Crypto Futures Scanner (OKX Perpetual)',
      'US Stock Market Scanner',
      'Commodities Futures (Gold, Silver, Oil)',
      'Forex Pairs Scanner',
      'Market Indices Scanner',
      'Auto/Manual Scan Modes',
      'Pipeline Transparency Metrics',
      'Confidence Threshold System',
      'Real-time Scanning (245+ symbols)',
    ],
    indicators: ['EMA Alignment', 'RSI', 'MACD', 'ADX Trend Strength', 'Volume Profile'],
    signalFormat: {
      example: 'SB=F — LONG | Entry: $17.56 | TP: $20.51 | SL: $16.38 | R/R: 1:2.5 | Confidence: 74%',
      timeframe: '15m-1H',
      confidence: '74%',
    },
    category: 'multi-asset',
  },
  {
    id: 'coiniq',
    name: 'CoinIQ',
    tagline: 'Crypto Intelligence Quotient — Breaking the 95% Barrier',
    url: 'https://coiniq-crypto-intell-n1qe.bolt.host/',
    icon: BarChart3,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    uniqueStrength: 'Built-in education + portfolio + news feed',
    description:
      'The most well-rounded platform combining AI analysis, portfolio management, news feed, backtesting, AND built-in education modules. Designed to break the "95% of traders lose" barrier.',
    features: [
      'AI Market Analysis Dashboard',
      'Trade Setup Generator',
      'Portfolio Management',
      'AI News Feed & Analysis',
      'Multi-timeframe Technical Analysis',
      'Sentiment Dashboard',
      'Strategy Backtesting',
      'Risk Management Tools',
      'Education Modules (6 courses)',
      'Personalized Settings',
    ],
    indicators: ['RSI', 'MACD', 'EMA', 'Bollinger Bands', 'Volume', 'Fibonacci'],
    signalFormat: {
      example: 'STXUSDT — LONG | Entry: 1.9850 | TP1: 2.35 | TP2: 2.68 | SL: 1.76 | R/R: 1:4.05 | Confidence: 70%',
      timeframe: '1D',
      confidence: '70%',
    },
    category: 'analysis',
  },
  {
    id: '6thapp',
    name: 'Crypto Signals Pro',
    tagline: 'Advanced AI Signal Generation',
    url: 'https://6da7ff6d-cb66-4cc5-ba60-bc81256a81ec.preview.shogo.ai/',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    uniqueStrength: 'Advanced crypto signal analysis',
    description:
      'Advanced crypto signal generation platform with AI-powered analysis. Provides comprehensive trade setups with entry/exit points, stop losses, and confidence levels.',
    features: [
      'AI Signal Generation',
      'Multi-timeframe Analysis',
      'Trade Setup Creation',
      'Risk Assessment',
      'Market Condition Analysis',
      'Confidence Scoring',
    ],
    indicators: ['Technical Indicators', 'Volume Analysis', 'Price Action', 'Momentum'],
    signalFormat: {
      example: 'BTCUSDT — Signal | Entry / TP / SL | R/R Ratio | Confidence Level',
      timeframe: 'Multiple',
      confidence: 'Variable',
    },
    category: 'signals',
  },
]

const categoryInfo: Record<string, { label: string; color: string }> = {
  signals: { label: 'Signals', color: 'bg-red-100 text-red-700' },
  scanner: { label: 'Scanner', color: 'bg-purple-100 text-purple-700' },
  analysis: { label: 'Analysis', color: 'bg-orange-100 text-orange-700' },
  'multi-asset': { label: 'Multi-Asset', color: 'bg-cyan-100 text-cyan-700' },
  intelligence: { label: 'Intelligence', color: 'bg-blue-100 text-blue-700' },
  setup: { label: 'Setup Generator', color: 'bg-emerald-100 text-emerald-700' },
}

interface AiToolsHubProps {
  user: { name?: string; email: string; role?: 'student' | 'admin' } | null
  onSignIn: () => void
}

export function AiToolsHub({ user, onSignIn }: AiToolsHubProps) {
  const [expandedTool, setExpandedTool] = useState<string | null>(null)
  const [activeApp, setActiveApp] = useState<AiTool | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const toggleExpand = (id: string) => {
    setExpandedTool(expandedTool === id ? null : id)
  }

  const openApp = (tool: AiTool) => {
    setActiveApp(tool)
  }

  if (activeApp) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-white border-b border-border sticky top-16 z-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setActiveApp(null)} className="gap-2">
                ← Back to AI Tools
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <activeApp.icon className={cn('h-5 w-5', activeApp.color)} />
                <span className="font-semibold">{activeApp.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-100 text-amber-700 gap-1">
                <Eye className="h-3 w-3" />
                Read-Only Access
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(activeApp.url, '_blank')}
                className="gap-1"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open Full Screen
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full" style={{ height: 'calc(100vh - 120px)' }}>
          <iframe
            src={activeApp.url}
            title={activeApp.name}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            loading="lazy"
          />
        </div>
      </div>
    )
  }

  const filteredTools = filter === 'all' ? aiTools : aiTools.filter((t) => t.category === filter)

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-white">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI Tools Hub</h1>
              <p className="text-muted-foreground">
                6 professional AI-powered crypto trading tools — learn, analyze, and earn
              </p>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 p-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Educational & Analytical Tools Only</p>
              <p className="text-sm text-amber-700 mt-1">
                These tools provide trade signals and analysis for learning purposes. Always do your own research (DYOR) before making any trades. Never invest more than you can afford to lose. Past performance does not guarantee future results.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
              filter === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-white text-muted-foreground hover:text-foreground border border-border'
            )}
          >
            All Tools ({aiTools.length})
          </button>
          {Object.entries(categoryInfo).map(([key, info]) => {
            const count = aiTools.filter((t) => t.category === key).length
            if (count === 0) return null
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
                  filter === key
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-white text-muted-foreground hover:text-foreground border border-border'
                )}
              >
                {info.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Tool Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const isExpanded = expandedTool === tool.id
            return (
              <Card
                key={tool.id}
                className={cn(
                  'overflow-hidden transition-all hover:shadow-lg cursor-pointer group',
                  isExpanded && 'ring-2 ring-primary/30'
                )}
              >
                <CardContent className="p-0">
                  {/* Card Header */}
                  <div className={cn('p-6', tool.bgColor)}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm',
                            tool.color
                          )}
                        >
                          <tool.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{tool.name}</h3>
                          <p className="text-sm text-muted-foreground">{tool.tagline}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge className={cn('text-xs', categoryInfo[tool.category]?.color)}>
                        {categoryInfo[tool.category]?.label}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-white/80">
                        <Clock className="h-3 w-3 mr-1" />
                        {tool.signalFormat.timeframe}
                      </Badge>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tool.description}</p>

                    {/* Unique Strength */}
                    <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-secondary/50">
                      <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                      <span className="text-sm font-medium">{tool.uniqueStrength}</span>
                    </div>

                    {/* Sample Signal */}
                    <div className="rounded-lg bg-slate-900 text-green-400 p-3 font-mono text-xs mb-4 overflow-x-auto">
                      {tool.signalFormat.example}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 gap-2"
                        onClick={() => openApp(tool)}
                      >
                        <Eye className="h-4 w-4" />
                        Use Tool
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleExpand(tool.id)
                        }}
                        className="gap-1"
                      >
                        Details
                        {isExpanded ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 space-y-4 border-t border-border pt-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Key Features</h4>
                          <div className="grid grid-cols-2 gap-1.5">
                            {tool.features.map((feature, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 text-xs text-muted-foreground"
                              >
                                <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold mb-2">Indicators Used</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {tool.indicators.map((ind, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {ind}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Read-only access — you can view signals and reports but cannot modify the tool
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 mb-8">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Master These Tools with Our Courses</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                These AI tools work best when combined with solid trading knowledge. Our courses teach you
                how to interpret signals, manage risk, and build profitable strategies.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="outline" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Technical Analysis Course
                </Button>
                <Button variant="outline" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Risk Management Course
                </Button>
                <Button variant="outline" className="gap-2">
                  <Brain className="h-4 w-4" />
                  Trading Psychology Course
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Clock(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}
