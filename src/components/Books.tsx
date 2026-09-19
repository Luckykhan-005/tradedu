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
  cover?: string
}

interface BooksProps {
  onBack: () => void
  user?: { email: string; name?: string; plan?: string; role?: string } | null
  onUpgrade?: () => void
}

const books: BookItem[] = [
  {
    id: 'binance-complete',
    title: 'Binance Complete Training (Urdu)',
    titleUrdu: 'بائننس مکمل ٹریننگ اردو',
    description:
      'Complete Urdu guide to Binance — 9 parts and 60 chapters covering account setup, KYC, security (2FA, SAFU), the full interface, spot/margin/futures trading, wallets, deposits, P2P, Earn, Web3, Pay, Card, API and the whole ecosystem, with real Binance screenshots.',
    chapters: 60,
    pages: '60 chapters · 9 parts',
    icon: BookMarked,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    href: '/binance-complete/index.html',
    tags: ['Urdu', 'Binance', '60 Chapters'],
    cover: '/covers/binance-complete.jpg',
  },
  {
    id: 'forex-complete',
    title: 'Forex Trading Course (Urdu)',
    titleUrdu: 'فارکس ٹریڈنگ کورس',
    description:
      'Complete Urdu forex course from zero to expert — 9 parts and 57 chapters covering currency pairs, pips and lots, market structure, price action, indicators, chart patterns, fundamentals, risk management, psychology, brokers and advanced trading systems.',
    chapters: 57,
    pages: '57 chapters · 9 parts',
    icon: TrendingUp,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    href: '/forex-complete/index.html',
    tags: ['Urdu', 'Forex', '57 Chapters'],
    cover: '/covers/forex-complete.jpg',
  },
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
    href: '/crypto-beginner/index.html',
    tags: ['Urdu', 'Beginner', 'Fundamentals'],
    cover: '/covers/crypto-beginner.jpg',
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
    href: '/crypto-intermediate/index.html',
    tags: ['Urdu', 'Intermediate', 'Technical Analysis'],
    cover: '/covers/crypto-trading-intermidiate.jpg',
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
    href: '/crypto-advanced/index.html',
    tags: ['Urdu', 'Advanced', 'Professional'],
    cover: '/covers/crypto-trading-advanced.jpg',
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
    href: '/candlestick-book/index.html',
    tags: ['Urdu', 'Beginner to Advanced', 'SVG Diagrams'],
    cover: '/covers/Candlestick-Patterns-Book.jpg',
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
    href: '/smc-book/index.html',
    tags: ['Urdu', 'Advanced', 'SMC/ICT'],
    cover: '/covers/Smart-Money-Concepts-Book.jpg',
  },
  {
    id: 'fundednext',
    title: 'FundedNext Prop Trading Book (Urdu)',
    titleUrdu: 'فانڈڈ نیکسٹ پراپ ٹریڈنگ کتاب',
    description:
      'Complete Urdu guide to prop trading with FundedNext — 10 chapters covering prop firms, challenge types, rules, trading strategy, technical & fundamental analysis, psychology, withdrawal process, and common mistakes.',
    chapters: 10,
    pages: '10 chapters · 8 parts',
    icon: Rocket,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    href: '/crypto-fundnext/index.html',
    tags: ['Urdu', 'Prop Trading', 'FundedNext'],
    cover: '/crypto-fundnext/assets/images/cover.jpg',
  },
]

export function Books({ onBack, user, onUpgrade }: BooksProps) {
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <Card key={book.id} className="overflow-hidden">
              <CardContent className="p-0">
                {book.cover ? (
                  <button
                    className="relative block w-full cursor-pointer"
                    onClick={() => setOpenBook(book)}
                    aria-label={`Open ${book.title}`}
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="aspect-[3/4] w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-left">
                      <h2 className="text-xl font-bold text-white drop-shadow">{book.title}</h2>
                      <p className="text-lg text-white/90" dir="rtl">
                        {book.titleUrdu}
                      </p>
                    </div>
                  </button>
                ) : (
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
                )}
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
