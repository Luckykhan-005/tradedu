import { Check, MoveRight, Target, ShieldOff } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { notPromised, outcomes, studentJourney } from '@/data/masterCourse'
import { Eyebrow, Reveal, SECTION, SectionTitle, CONTAINER } from './shared'

export function JourneyOutcomes() {
  return (
    <>
      {/* Student journey */}
      <section id="journey" className={`${SECTION} scroll-mt-36 bg-secondary/30 py-14 sm:py-20`}>
        <div className={CONTAINER}>
          <SectionTitle className="max-w-3xl">Aap Ka Learning Journey</SectionTitle>
          <div className="mt-8 overflow-x-auto pb-2">
            <ol className="flex min-w-max items-center gap-2">
              {studentJourney.map((j, i) => (
                <li key={j} className="flex items-center gap-2">
                  <span
                    className={`whitespace-nowrap rounded-lg border px-3.5 py-2 text-xs font-semibold sm:text-sm ${
                      i === 0
                        ? 'border-border bg-card text-muted-foreground'
                        : i === studentJourney.length - 1
                          ? 'border-accent/50 bg-accent/10 text-accent'
                          : 'border-border bg-card text-foreground/90'
                    }`}
                  >
                    {j}
                  </span>
                  {i < studentJourney.length - 1 && (
                    <MoveRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                  )}
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-5 flex items-start gap-2 text-sm text-muted-foreground">
            <Target className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span>
              <span className="font-medium text-foreground">Goal: independent, disciplined and data-driven
              trading capability.</span> Har student ke profitable hone ki guarantee nahi — process, skill aur
              risk control par focus hai.
            </span>
          </p>
        </div>
      </section>

      {/* Outcomes */}
      <section id="outcomes" className={`${SECTION} scroll-mt-36 py-14 sm:py-20`}>
        <div className={CONTAINER}>
          <SectionHeadInline />
          <div className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {outcomes.map((o, i) => (
              <Reveal key={o} delay={(i % 3) * 50}>
                <div className="flex items-start gap-2.5 rounded-lg border border-border bg-card px-3.5 py-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span className="text-sm leading-snug">{o}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What we don't promise */}
      <section className={`${SECTION} py-14 sm:py-20`}>
        <div className={CONTAINER}>
          <Reveal>
            <Card className="border-border bg-card">
              <CardContent className="p-6 sm:p-8">
                <div className="max-w-3xl">
                  <Eyebrow>Transparency</Eyebrow>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                    Important: Hum Kya Promise Nahi Karte
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Hum guaranteed profits, guaranteed win rates, guaranteed income ya successful trader banne ka
                    shortcut nahi promise karte. Iske bajaye hum ek structured process sikhate hain: markets
                    samajhna, risk manage karna, strategies develop karna, ideas test karna aur data ke sath
                    disciplined practice se improve karna.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {notPromised.map((n) => (
                    <span
                      key={n}
                      className="flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/5 px-3.5 py-1.5 text-xs font-medium text-destructive"
                    >
                      <ShieldOff className="h-3.5 w-3.5" />
                      No {n.charAt(0).toLowerCase() + n.slice(1)}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Educational purposes only. Not financial advice.
                </p>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>
    </>
  )
}

function SectionHeadInline() {
  return (
    <div className="max-w-3xl">
      <Eyebrow>After The Course</Eyebrow>
      <SectionTitle className="mt-3">Course Complete Karne Ke Baad Aap Kya Kar Sakte Hain?</SectionTitle>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Capability cards — ye skills course ke practical components (chart lab, backtest, paper trading, journal)
        ke through develop hoti hain.
      </p>
    </div>
  )
}
