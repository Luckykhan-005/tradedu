import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { finalCta, masterCourse } from '@/data/masterCourse'
import { Reveal, SECTION, CONTAINER } from './shared'

export function FinalCta({
  onEnroll,
  onCurriculum,
}: {
  onEnroll: () => void
  onCurriculum: () => void
}) {
  return (
    <section id="final-cta" className={`${SECTION} py-14 sm:py-20`}>
      <div className={CONTAINER}>
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ab Faisla Aap Ka Hai
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {finalCta.closing}
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-border bg-card p-6 sm:p-7">
            <ul className="space-y-3">
              {finalCta.checklist.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-sm sm:text-base">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-foreground/90">{c}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
                onClick={onEnroll}
              >
                {masterCourse.ctaPrimary}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-7 py-3 text-sm font-semibold transition-colors hover:bg-secondary/50 sm:w-auto"
                onClick={onCurriculum}
              >
                Explore Full Curriculum
              </button>
            </div>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              {masterCourse.duration} • {masterCourse.classesPerWeek} • {masterCourse.classDuration} •{' '}
              Cancel anytime
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
