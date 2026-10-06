import { BookOpen, Quote, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { mentor, whyTradeEd } from '@/data/masterCourse'
import { Eyebrow, Reveal, SECTION, SectionTitle, CONTAINER } from './shared'

export function MentorWhy() {
  return (
    <>
      {/* Mentor */}
      <section id="mentor" className={`${SECTION} scroll-mt-28 py-14 sm:py-20`}>
        <div className={CONTAINER}>
          <div className="grid items-start gap-8 lg:grid-cols-[320px,1fr]">
            <Reveal>
              <Card className="overflow-hidden">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
                  <img
                    src={mentor.image}
                    alt={`${mentor.name} — TradeEd instructor`}
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-5">
                  <p className="text-lg font-bold">{mentor.name}</p>
                  <p className="mt-0.5 text-sm text-accent">{mentor.role}</p>
                  <div className="mt-4 rounded-lg border border-border bg-secondary/60 p-3.5">
                    <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                      <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                      {mentor.philosophy}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={90}>
              <div>
                <Eyebrow>Mentor</Eyebrow>
                <SectionTitle className="mt-3">Learn From a Mentor, Not Just a Video Library</SectionTitle>
                <div className="mt-5 space-y-3.5">
                  {mentor.bio.map((b) => (
                    <p key={b} className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {b}
                    </p>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['Market Structure', 'Risk Management', 'Price Action', 'Trading Process'].map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-foreground/85"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why TradeEd */}
      <section id="why-tradeed" className={`${SECTION} scroll-mt-28 bg-secondary/30 py-14 sm:py-20`}>
        <div className={CONTAINER}>
          <SectionTitle className="max-w-3xl">TradeEd Ka Approach Different Kyun Hai?</SectionTitle>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Reveal>
              <Card className="h-full border-destructive/30">
                <CardContent className="p-6">
                  <div className="text-sm font-semibold text-destructive">Generic Learning</div>
                  <ol className="mt-4 space-y-2.5">
                    {whyTradeEd.generic.map((g, i) => (
                      <li key={g} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive/10 text-[10px] font-bold text-destructive">
                          {i + 1}
                        </span>
                        {g}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={90}>
              <Card className="h-full border-accent/40">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-accent">
                    <Sparkles className="h-4 w-4" /> TradeEd Approach
                  </div>
                  <ol className="mt-4 flex flex-wrap gap-2">
                    {whyTradeEd.tradeed.map((t, i) => (
                      <li key={t} className="flex items-center gap-2">
                        <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                          {t}
                        </span>
                        {i < whyTradeEd.tradeed.length - 1 && (
                          <span className="text-muted-foreground/50">→</span>
                        )}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </Reveal>
          </div>

          <Reveal>
            <p className="mt-7 flex items-center gap-2.5 text-lg font-semibold">
              <BookOpen className="h-5 w-5 text-accent" />
              Knowledge → Skill → Evidence → Discipline
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
