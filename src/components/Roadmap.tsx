import {
  Map,
  BookOpen,
  BarChart3,
  Shield,
  Brain,
  Target,
  FlaskConical,
  TrendingUp,
  GraduationCap,
  ArrowRight,
  ArrowUpRight,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Page } from './Navigation'

interface RoadmapProps {
  onNavigate: (page: Page) => void
}

const steps = [
  {
    n: 1,
    icon: BookOpen,
    duration: '2–3 hafte',
    title: 'Trading Basics & Market Samajh',
    desc: 'Market kaise chalta hai, orders, candlesticks, currency pairs aur exchange account setup (Binance) — security aur 2FA ke saath. Pehla qadam: concepts samajhna, paise kamana nahi.',
    resources: [
      { label: 'Beginner Course (Free)', page: 'courses' as Page },
      { label: 'Forex Course Part 1', page: 'books' as Page },
    ],
  },
  {
    n: 2,
    icon: BarChart3,
    duration: '3–4 hafte',
    title: 'Technical Analysis Seekhein',
    desc: 'Support & resistance, trendlines, candlestick patterns, indicators (RSI, MACD, EMA) aur price action. Chart par kya ho raha hai — yeh samajhna trading ki aankh hai.',
    resources: [
      { label: 'Technical Analysis Books', page: 'books' as Page },
      { label: 'Trading Glossary', page: 'glossary' as Page },
    ],
  },
  {
    n: 3,
    icon: Shield,
    duration: '2 hafte',
    title: 'Risk Management — Sabse Ahem Step',
    desc: 'Position sizing, stop loss, risk:reward ratio aur leverage se bachna. Rule: per trade sirf 1% risk. Yeh step skip kiya to baqi sab bekaar — yehi professional aur gambler mein farq hai.',
    resources: [
      { label: 'Risk Management Book', page: 'books' as Page },
      { label: 'Risk Calculator (Free)', page: 'calculator' as Page },
    ],
  },
  {
    n: 4,
    icon: Brain,
    duration: '1–2 hafte',
    title: 'Trading Psychology',
    desc: 'FOMO, revenge trading, overtrading aur greed se bachna. Discipline, patience aur likha hua trading plan — asal mein 90% losses strategy ki nahi, emotions ki wajah se hoti hain.',
    resources: [
      { label: 'Psychology Book', page: 'books' as Page },
      { label: 'Psychology Articles', page: 'blog' as Page },
    ],
  },
  {
    n: 5,
    icon: Target,
    duration: '3–4 hafte',
    title: 'Strategy Banao & Backtest Karo',
    desc: 'Apni strategy likho — entry, exit, stop loss ke clear rules. Phir historical data par test karo (backtesting) ke wo actually kaam karti hai. Bin test kiye kabhi live mat chalao.',
    resources: [
      { label: 'Backtesting Guide', page: 'blog' as Page },
      { label: 'Strategy Books', page: 'books' as Page },
    ],
  },
  {
    n: 6,
    icon: FlaskConical,
    duration: '1–2 mahine',
    title: 'Demo / Paper Trading',
    desc: 'Real paise nahi — demo account par apni strategy practice karo. Har trade Journal mein log karo: entry, stop loss, result, setup aur us waqt kya feel kar rahe the. Pattern dhundo.',
    resources: [
      { label: 'Trading Journal', page: 'journal' as Page },
      { label: 'Live Sessions', page: 'live-sessions' as Page },
    ],
  },
  {
    n: 7,
    icon: TrendingUp,
    duration: 'Ongoing',
    title: 'Live Trading — Chhote Capital Se',
    desc: 'Sirf utna paisa lagao jitna khone ka achanak nahi lagega. 1% risk rule, journal ka win rate aur R:R review — aur gradually size barhao. Premium plan, AI tools aur mentorship yahan saath aate hain.',
    resources: [
      { label: 'Plans & Pricing', page: 'pricing' as Page },
      { label: 'AI Tools', page: 'ai-tools' as Page },
    ],
  },
]

export function Roadmap({ onNavigate }: RoadmapProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Map className="h-8 w-8 text-primary" />
            </div>
            <Badge variant="secondary" className="mb-4">
              Free • Koi shortcut nahi — sahi rasta
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Trading Roadmap — <span className="text-highlight">Beginner se Pro tak</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Trading seekhne mein sab se bara masla: "ab kya karun?" — Ye 7 steps us confusion
              ko khatam karte hain. Har step ke saath free resources links hain. Sequence mein
              karein, jaldi mat karein.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="space-y-0">
          {steps.map((step, idx) => (
            <div key={step.n} className="relative flex gap-4 sm:gap-6">
              {/* Timeline rail */}
              <div className="flex flex-col items-center">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {step.n}
                </div>
                {idx < steps.length - 1 && <div className="w-px flex-1 bg-border" />}
              </div>

              {/* Step card */}
              <Card className={`mb-6 flex-1 ${idx < steps.length - 1 ? '' : ''}`}>
                <CardContent className="p-5 sm:p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="flex-1 text-lg font-bold sm:text-xl">{step.title}</h2>
                    <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {step.resources.map((r) => (
                      <Button
                        key={r.label}
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => onNavigate(r.page)}
                      >
                        {r.label}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <Card className="mt-4 border-primary/30 bg-primary/5">
          <CardContent className="p-6 text-center sm:p-8">
            <GraduationCap className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h2 className="text-2xl font-bold">Ab Step 1 se shuru karein</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Pehla module bilkul free hai — koi credit card nahi chahiye. Roadmap ko bookmark
              kar lein aur har hafte ek step aage barhte rahein.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="gap-2" onClick={() => onNavigate('courses')}>
                <GraduationCap className="h-5 w-5" />
                Academy Kholein
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2" onClick={() => onNavigate('books')}>
                <BookOpen className="h-5 w-5" />
                40+ Books Dekhein
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
