import { ArrowRight, CheckCircle2, Crown, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { masterCourse } from '@/data/masterCourse'
import { Eyebrow, Reveal, SECTION, CONTAINER } from './shared'

interface EnrollCtaProps {
  onEnroll: () => void
  onCurriculum: () => void
}

export function EnrollCta({ onEnroll, onCurriculum }: EnrollCtaProps) {
  const included = [
    `${masterCourse.duration} structured program`,
    masterCourse.classesPerWeek,
    `TradingView + Binance practicals`,
    `Backtesting, paper trading & journal system`,
    `Final trader assessment + certificate`,
  ]

  return (
    <>
      {/* Pricing / Enrollment */}
      <section id="enroll" className={`${SECTION} scroll-mt-28 bg-secondary/30 py-14 sm:py-20`}>
        <div className={CONTAINER}>
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <Reveal>
              <div>
                <Eyebrow>Enrollment</Eyebrow>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Join The Master Program</h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Enrollment TradeEd ke Premium plan ke zariye hota hai — jis se Master Program ke saath saare
                  courses, live sessions aur premium tools bhi unlock ho jate hain.
                </p>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                  {included.map((inc) => (
                    <span key={inc} className="flex items-center gap-1.5 text-sm text-foreground/90">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                      {inc}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <Card className="border-accent/50 shadow-lg">
                <CardContent className="p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <Badge className="border-accent/40 bg-accent/10 text-accent" variant="outline">
                      <Crown className="mr-1 h-3 w-3" />
                      Premium Plan
                    </Badge>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-accent">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                      {masterCourse.enrollmentStatus === 'OPEN' ? 'Enrollment Open' : masterCourse.enrollmentStatus}
                    </span>
                  </div>

                  <div className="mt-5">
                    {masterCourse.price !== null ? (
                      <p className="text-3xl font-bold">
                        {masterCourse.currency} {masterCourse.price.toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-3xl font-bold">
                        PKR 2,999
                        <span className="text-base font-medium text-muted-foreground"> /month</span>
                      </p>
                    )}
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {masterCourse.price !== null
                        ? 'Course price — payment options enrollment page par.'
                        : 'Premium subscription — Master Program + saare courses & live sessions included.'}
                    </p>
                  </div>

                  <Button size="lg" className="mt-6 w-full gap-2" onClick={onEnroll}>
                    {masterCourse.ctaPrimary}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" className="mt-3 w-full" onClick={onCurriculum}>
                    {masterCourse.ctaSecondary}
                  </Button>

                  <p className="mt-4 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Educational purposes only. Trading involves risk. No profit or performance guarantees.
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={`${SECTION} relative overflow-hidden py-16 sm:py-24`}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <h2 className="text-2xl font-bold leading-snug tracking-tight sm:text-4xl">
              Agar Aap Crypto Ko Randomly Trade Karne Ke Bajaye Properly Samajhna Chahte Hain...
            </h2>
            <p className="mt-4 text-lg font-semibold text-accent">{masterCourse.title}</p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Ek structured learning journey jahan market understanding se lekar strategy development, risk
              management, backtesting aur paper trading tak complete process build kiya jata hai.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" className="gap-2 px-8" onClick={onEnroll}>
                {masterCourse.ctaPrimary}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="px-8" onClick={onCurriculum}>
                {masterCourse.ctaSecondary}
              </Button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Educational purposes only. Trading involves risk. No profit or performance guarantees.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
