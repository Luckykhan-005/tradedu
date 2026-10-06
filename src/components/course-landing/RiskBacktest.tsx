import { Calculator, FlaskConical, ShieldAlert } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { backtestFlow, backtestMetrics, riskExample } from '@/data/masterCourse'
import { Eyebrow, Reveal, SECTION, SectionTitle, CONTAINER } from './shared'

export function RiskBacktest() {
  return (
    <>
      {/* Risk Management */}
      <section id="risk" className={`${SECTION} scroll-mt-28 bg-secondary/30 py-14 sm:py-20`}>
        <div className={CONTAINER}>
          <Reveal>
            <div className="max-w-3xl">
              <Eyebrow>Risk Management</Eyebrow>
              <SectionTitle className="mt-3">Profit Se Pehle Risk Ko Samjho</SectionTitle>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Professional trader pehle ye poochta hai: <span className="text-foreground">“Kitna khone ka
                option hai?”</span> — ye nahi ke <span className="text-foreground">“Kitna kama sakte hain?”</span>
              </p>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-4 lg:grid-cols-5">
            {/* Example card */}
            <Reveal className="lg:col-span-2">
              <Card className="h-full border-accent/40">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold text-accent">
                    <ShieldAlert className="h-4 w-4" /> Planned Trade Example
                  </div>
                  <dl className="mt-4 space-y-2.5 text-sm">
                    {[
                      ['Account', riskExample.account],
                      ['Risk per trade', riskExample.risk],
                      ['Maximum planned loss', riskExample.maxLoss],
                      ['Potential target', riskExample.target],
                      ['Risk : Reward', riskExample.rr],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between border-b border-border/60 pb-2">
                        <dt className="text-muted-foreground">{k}</dt>
                        <dd className={`font-semibold ${k === 'Maximum planned loss' ? 'text-destructive' : k === 'Potential target' || k === 'Risk : Reward' ? 'text-accent' : 'text-foreground'}`}>
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    Position size emotion se nahi — risk se calculate hoti hai.
                  </p>
                </CardContent>
              </Card>
            </Reveal>

            {/* Formula */}
            <Reveal delay={100} className="lg:col-span-3">
              <Card className="h-full">
                <CardContent className="flex h-full flex-col justify-center p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Calculator className="h-4 w-4 text-accent" /> Position Sizing Formula
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-border bg-secondary/60 p-4 text-center">
                      <div className="space-y-1 text-sm font-medium">
                        <div>Account Size</div>
                        <div className="text-accent">×</div>
                        <div>Risk %</div>
                      </div>
                      <div className="my-2 border-t border-border" />
                      <div className="text-sm font-bold text-accent">Risk Amount</div>
                    </div>
                    <div className="rounded-lg border border-border bg-secondary/60 p-4 text-center">
                      <div className="space-y-1 text-sm font-medium">
                        <div>Risk Amount</div>
                        <div className="text-accent">÷</div>
                        <div>Stop Distance</div>
                      </div>
                      <div className="my-2 border-t border-border" />
                      <div className="text-sm font-bold text-accent">Position Size</div>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Math simple rakha jata hai — calculation practice mein har exercise mein hoti hai.
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Backtesting + Paper Trading */}
      <section id="backtest" className={`${SECTION} scroll-mt-28 py-14 sm:py-20`}>
        <div className={CONTAINER}>
          <Reveal>
            <div className="max-w-3xl">
              <Eyebrow>Backtesting + Paper Trading</Eyebrow>
              <SectionTitle className="mt-3">Strategy Ko Real Money Se Pehle Test Karo</SectionTitle>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Ek chart par strategy achi lagna kaafi nahi — data par test honi chahiye, phir paper trading mein
                execution. Students yehi sequence seekhte hain.
              </p>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <Reveal>
              <Card className="h-full">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <FlaskConical className="h-4 w-4 text-accent" /> Testing Pipeline
                  </div>
                  <ol className="mt-4 space-y-2">
                    {backtestFlow.map((s, i) => (
                      <li key={s} className="flex items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[10px] font-bold text-accent">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium">{s}</span>
                        {i < backtestFlow.length - 1 && <span className="ml-auto text-xs text-muted-foreground/60">↓</span>}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={100}>
              <Card className="h-full">
                <CardContent className="p-5 sm:p-6">
                  <div className="text-sm font-semibold">Performance Evaluation Metrics</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {backtestMetrics.map((m) => (
                      <span
                        key={m}
                        className="rounded-md border border-border bg-secondary/60 px-3 py-1.5 text-xs font-medium"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    Sample size aur expectancy ke baghair koi strategy “kaam karti hai” nahi maani jati. Data
                    pehle, capital baad mein.
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
