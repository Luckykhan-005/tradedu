import { ArrowRight, GraduationCap, Map } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { calculators } from '@/data/calculators'
import type { Page } from '@/components/Navigation'

interface CalculatorHubProps {
  onOpen: (slug: string) => void
  onNavigate: (page: Page) => void
}

export function CalculatorHub({ onOpen, onNavigate }: CalculatorHubProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Free Trading Calculators
          </h1>
          <p className="mt-3 text-muted-foreground">
            Trade se pehle poora hisaab — position size, risk-reward, leverage, P&L aur
            compounding ke free calculators. Har calculator Roman Urdu explanation, formula
            aur example ke sath, taake galat trade se pehle aapko exactly pata ho ke risk
            kitna hai aur reward kitna milega.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((c) => (
            <button key={c.slug} onClick={() => onOpen(c.slug)} className="text-left group">
              <Card className="h-full transition-all hover:border-primary/60 hover:shadow-md">
                <CardContent className="flex h-full flex-col p-5">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <c.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="mb-1.5 text-lg font-semibold">{c.title}</h2>
                  <p className="mb-4 flex-1 text-sm text-muted-foreground">{c.shortDesc}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Calculate karein
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div>
                <h3 className="font-semibold">Naye trader hain?</h3>
                <p className="text-sm text-muted-foreground">
                  7-step roadmap se zero se professional tak ka poora rasta.
                </p>
              </div>
              <button
                onClick={() => onNavigate('roadmap')}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Map className="h-4 w-4" />
                Roadmap
              </button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div>
                <h3 className="font-semibold">Courses bhi dekhein</h3>
                <p className="text-sm text-muted-foreground">
                  TradeEd Academy — structured Urdu courses, pehla module free.
                </p>
              </div>
              <button
                onClick={() => onNavigate('courses')}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-secondary"
              >
                <GraduationCap className="h-4 w-4" />
                Academy
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
