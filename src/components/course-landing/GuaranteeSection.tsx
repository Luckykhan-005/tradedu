import { ShieldCheck, CheckCircle2 } from 'lucide-react'
import { guarantee, masterCourse } from '@/data/masterCourse'
import { Reveal, SECTION, CONTAINER } from './shared'

export function GuaranteeSection({ onEnroll }: { onEnroll: () => void }) {
  return (
    <section className={`${SECTION} py-14 sm:py-20`}>
      <div className={CONTAINER}>
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent p-8 sm:p-12">
            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
                {guarantee.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {guarantee.body}
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-2.5">
                {guarantee.points.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {p}
                  </span>
                ))}
              </div>

              <div className="mt-8">
                <button
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  onClick={onEnroll}
                >
                  {masterCourse.ctaPrimary}
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
