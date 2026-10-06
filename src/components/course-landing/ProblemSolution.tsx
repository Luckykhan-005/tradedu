import { Fragment } from 'react'
import { ArrowDown, CheckCircle2, Shuffle, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { masterCourse, problems, solutionLoop } from '@/data/masterCourse'
import { Eyebrow, Reveal, SECTION, SectionTitle, CONTAINER } from './shared'

export function ProblemSolution({ onEnroll }: { onEnroll: () => void }) {
  return (
    <section className={`${SECTION} py-14 sm:py-20`}>
      <div className={CONTAINER}>
        <Reveal>
          <div className="max-w-3xl">
            <Eyebrow>The Problem</Eyebrow>
            <SectionTitle className="mt-3">Sirf Videos Dekhne Se Trader Nahi Banta</SectionTitle>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Information bohat hai. Structured skill development kam hai. Aam naya trader in exactly wahi
              problems se guzarta hai jo is course ka point hain.
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p, i) => (
            <Reveal key={p} delay={(i % 3) * 70}>
              <Card className="h-full border-border/70 transition-colors hover:border-destructive/40">
                <CardContent className="flex items-start gap-2.5 p-4">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <span className="text-sm leading-snug text-foreground/90">{p}</span>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* Random vs Structured */}
        <Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
                  <Shuffle className="h-4 w-4" /> Random Learning
                </div>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {['Video dekha', 'Bhool gaya', 'Doosra video dekha', 'Random strategy try ki'].map((s) => (
                    <li key={s} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive/60" />
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-accent/40 bg-accent/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-accent">
                  <CheckCircle2 className="h-4 w-4" /> Structured Trader Development
                </div>
                <ul className="mt-4 space-y-2 text-sm text-foreground/90">
                  {['Concept samjha', 'Chart par dekha', 'Khud practice ki', 'Data se test ki', 'Journal review ki'].map(
                    (s) => (
                      <li key={s} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {s}
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </Reveal>

        {/* Solution loop */}
        <Reveal>
          <div className="mt-12 rounded-xl border border-border bg-card p-6 sm:p-8">
            <Eyebrow>The TradeEd Solution</Eyebrow>
            <SectionTitle className="mt-3 text-2xl sm:text-3xl">
              Ye Course Sirf Aap Ko Trade Karna Nahi Sikhata. Ye Aap Ko Trader Banane Ka Process Sikhata Hai.
            </SectionTitle>
            <div className="mt-7 flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-2.5">
              {solutionLoop.map((s, i) => (
                <Fragment key={s}>
                  <span className="rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent sm:text-sm">
                    {s}
                  </span>
                  {i < solutionLoop.length - 1 && (
                    <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/60 sm:-rotate-90" />
                  )}
                </Fragment>
              ))}
            </div>
            <div className="mt-7 text-center">
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                onClick={onEnroll}
              >
                {masterCourse.ctaPrimary}
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
