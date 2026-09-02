import { useState } from 'react'
import {
  BookOpen,
  CandlestickChart,
  Brain,
  FileText,
  GraduationCap,
  Layers,
  ArrowLeft,
  LayoutDashboard,
  X,
  Rocket,
  LineChart,
  ShieldCheck,
  TrendingUp,
  BookMarked,
  Target,
  Trophy,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface BookItem {
  id: string
  title: string
  titleUrdu: string
  description: string
  chapters: number
  pages: string
  icon: typeof BookOpen
  color: string
  bgColor: string
  href: string
  tags: string[]
}

interface BooksProps {
  onBack: () => void
}

const books: BookItem[] = [
  {
    id: 'crypto-beginner',
    title: 'Crypto Trading — Phase 1 (Beginner)',
    titleUrdu: 'کریپٹو ٹریڈنگ — فیز ۱ (بیگنر)',
    description:
      'Start your crypto journey from zero. Learn what crypto is, blockchain, wallets, exchanges, and how to stay safe from scams.',
    chapters: 10,
    pages: '10 lessons',
    icon: Rocket,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    href: './crypto-beginner/index.html',
    tags: ['Urdu', 'Beginner', 'Fundamentals'],
  },
  {
    id: 'crypto-intermediate',
    title: 'Crypto Trading — Phase 2 (Intermediate)',
    titleUrdu: 'کریپٹو ٹریڈنگ — فیز ۲ (انٹرمیڈیٹ)',
    description:
      'Master technical analysis — support/resistance, indicators (RSI, MACD, Bollinger), chart patterns, volume, and building a trading plan.',
    chapters: 12,
    pages: '12 lessons',
    icon: LineChart,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    href: './crypto-intermediate/index.html',
    tags: ['Urdu', 'Intermediate', 'Technical Analysis'],
  },
  {
    id: 'crypto-advanced',
    title: 'Crypto Trading — Phase 3 (Advanced)',
    titleUrdu: 'کریپٹو ٹریڈنگ — فیز ۳ (ایڈوانسڈ)',
    description:
      'Professional trading — risk management, psychology, futures, leverage, smart money concepts, and advanced strategies.',
    chapters: 15,
    pages: '15 lessons',
    icon: ShieldCheck,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    href: './crypto-advanced/index.html',
    tags: ['Urdu', 'Advanced', 'Professional'],
  },
  {
    id: 'candlestick',
    title: 'Candlestick Patterns Book',
    titleUrdu: 'کینڈل سٹک پیٹرنز کی کتاب',
    description:
      'Complete guide to candlestick patterns in Urdu. Learn single, double, and triple candle patterns with detailed diagrams and trading rules.',
    chapters: 6,
    pages: '21+ patterns',
    icon: CandlestickChart,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    href: './candlestick-book/index.html',
    tags: ['Urdu', 'Beginner to Advanced', 'SVG Diagrams'],
  },
  {
    id: 'smc',
    title: 'Smart Money Concepts Book',
    titleUrdu: 'سمارٹ منی کانسپٹس کی کتاب',
    description:
      'Advanced price action concepts in Urdu. Learn Market Structure, Order Blocks, FVG, Liquidity, and professional SMC trading strategies.',
    chapters: 5,
    pages: '12+ concepts',
    icon: Brain,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    href: './smc-book/index.html',
    tags: ['Urdu', 'Advanced', 'SMC/ICT'],
  },
  {
    id: 'forex',
    title: 'Forex Trading Course',
    titleUrdu: 'فاریکس ٹریڈنگ کورس',
    description:
      'Complete forex trading education in Urdu — Beginner to Advanced. Learn currency pairs, pips, trends, indicators, risk management, and professional strategies.',
    chapters: 24,
    pages: '3 phases',
    icon: TrendingUp,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    href: './forex-book/index.html',
    tags: ['Urdu', 'Beginner to Advanced', 'Professional'],
  },
  {
    id: 'glossary',
    title: 'Trading Glossary Book',
    titleUrdu: 'ٹریڈنگ گلوسری کی کتاب',
    description:
      'A complete reference of trading terms in Urdu & English. Crypto and Forex specific terms with symbols, diagrams, and detailed explanations for every concept.',
    chapters: 4,
    pages: '120+ terms',
    icon: BookMarked,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    href: './glossary-book/index.html',
    tags: ['Urdu + English', 'Reference', 'Crypto & Forex'],
  },
  {
    id: 'price-action',
    title: 'Price Action & Market Structure',
    titleUrdu: 'پرائس ایکشن اور مارکیٹ اسٹرکچر',
    description:
      'Professional chart reading in Urdu. Learn market structure, candlestick price action, supply & demand zones, break & retest, liquidity, order blocks, and a complete price action strategy.',
    chapters: 8,
    pages: '8 lessons',
    icon: CandlestickChart,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    href: './price-action/index.html',
    tags: ['Urdu', 'Professional', 'Smart Money'],
  },
  {
    id: 'trading-strategies',
    title: 'Trading Strategies & Setups',
    titleUrdu: 'ٹریڈنگ اسٹریٹجیز اور سیٹ اپس',
    description:
      'Practical entry/exit systems in Urdu. Learn trend following, breakout, reversal, sniper, pullback, scalping, swing, supply & demand, and risk-reward strategies with clear rules.',
    chapters: 10,
    pages: '10 strategies',
    icon: Target,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    href: './trading-strategies/index.html',
    tags: ['Urdu', 'Practical', 'Entry/Exit Systems'],
  },
  {
    id: 'professional-trading',
    title: 'Professional Trading System',
    titleUrdu: 'پیشہ ورانہ ٹریڈنگ سسٹم',
    description:
      'The complete professional trading system in Urdu — 28 lessons covering trading plan, rules, models, routines, journaling, backtesting, performance metrics, and the professional checklist.',
    chapters: 28,
    pages: '6 sections',
    icon: Trophy,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    href: './professional-trading/index.html',
    tags: ['Urdu', 'Professional', 'Complete System'],
  },
  {
    id: 'technical-analysis',
    title: 'Technical Analysis Course',
    titleUrdu: 'ٹیکنیکل اینالسس کورس',
    description:
      'Technical analysis in Urdu — support/resistance, trendlines, moving averages, RSI, MACD, Bollinger Bands, Fibonacci, chart patterns, and volume. Learn to read charts like a pro.',
    chapters: 10,
    pages: '10 lessons',
    icon: LineChart,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    href: './technical-analysis/index.html',
    tags: ['Urdu', 'Beginner to Advanced', 'Charts & Indicators'],
  },
  {
    id: 'risk-management',
    title: 'Risk Management Course',
    titleUrdu: 'رسک مینجمنٹ کورس',
    description:
      'The most important trading skill — position sizing, stop loss, risk-reward ratio, money management, drawdown, and a complete risk management plan. Protect your capital.',
    chapters: 8,
    pages: '8 lessons',
    icon: ShieldCheck,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    href: './risk-management/index.html',
    tags: ['Urdu', 'Essential', 'Capital Protection'],
  },
  {
    id: 'trading-psychology',
    title: 'Trading Psychology Course',
    titleUrdu: 'ٹریڈنگ نفسیات کورس',
    description:
      'Master your emotions — FOMO, fear, greed, revenge trading, discipline, patience, journaling, and the mindset of a successful trader. The 90% that fails is emotional.',
    chapters: 7,
    pages: '7 lessons',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    href: './trading-psychology/index.html',
    tags: ['Urdu', 'Essential', 'Mindset & Discipline'],
  },
]

export function Books({ onBack }: BooksProps) {
  const [openBook, setOpenBook] = useState<BookItem | null>(null)

  if (openBook) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <div className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setOpenBook(null)} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                All Books
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${openBook.bgColor}`}>
                <openBook.icon className={`h-4 w-4 ${openBook.color}`} />
              </div>
              <span className="hidden font-semibold sm:inline">{openBook.title}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
              <X className="h-4 w-4" />
              Close
            </Button>
          </div>
        </div>
        <iframe
          src={openBook.href}
          title={openBook.title}
          className="min-h-[calc(100vh-57px)] w-full flex-1 border-0"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Trading Books</h1>
              <p className="text-muted-foreground">
                Detailed trading guides in Urdu — with visual diagrams for every concept
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <Card key={book.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className={`flex items-start gap-4 p-6 ${book.bgColor}`}>
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                    <book.icon className={`h-7 w-7 ${book.color}`} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold">{book.title}</h2>
                    <p className="text-lg text-muted-foreground" dir="rtl">
                      {book.titleUrdu}
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-4">
                  <p className="text-muted-foreground">{book.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {book.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Layers className="h-4 w-4" />
                      {book.chapters} Chapters
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-4 w-4" />
                      {book.pages}
                    </span>
                  </div>

                  <Separator className="my-4" />

                  <Button className="w-full gap-2" onClick={() => setOpenBook(book)}>
                    <GraduationCap className="h-4 w-4" />
                    Open Book
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">More books coming soon</h3>
                <p className="text-muted-foreground">
                  We are building more educational resources including indicator guides,
                  strategy handbooks, and forex-specific books. Check back regularly for updates.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
