import { useState } from 'react'
import { ChevronDown, Layers } from 'lucide-react'
import { cn } from '@/lib/cn'
import { curriculum, masterCourse } from '@/data/masterCourse'
import { Reveal, SECTION, SectionHead, CONTAINER } from './shared'

export function CurriculumTimeline() {
  // Pehla phase khula, mobile par bhi load halka rakhein
  const [open, setOpen] = useState<string | null>(curriculum[0]?.id ?? null)

  return (
    <section id="curriculum" className={`${SECTION} scroll-mt-28 py-14 sm:py-20`}>
      <div className={CONTAINER}>
        <SectionHead
          eyebrow="Complete Curriculum"
          title="Complete Crypto Trading Roadmap"
          lead={`${curriculum.length} phases — bunyad se advanced trader development tak, ek sequence mein. Phase par click kar ke topics dekhein.`}
        />

        <div className="mt-9 space-y-3">
          {curriculum.map((phase, idx) => {
            const isOpen = open === phase.id
            return (
              <Reveal key={phase.id} delay={Math.min(idx * 30, 180)}>
                <div
                  className={cn(
                    'overflow-hidden rounded-lg border transition-colors',
                    isOpen ? 'border-accent/50 bg-card' : 'border-border bg-card/60 hover:border-accent/30'
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left sm:px-5"
                    onClick={() => setOpen(isOpen ? null : phase.id)}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/10 text-xs font-bold text-accent">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {phase.phase}
                      </span>
                      <span className="block truncate text-sm font-semibold sm:text-base">{phase.title}</span>
                    </span>
                    <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                      {phase.topics.length} topics
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300',
                        isOpen && 'rotate-180 text-accent'
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-border/70 px-4 py-4 sm:px-5">
                      <div className="flex flex-wrap gap-2">
                        {phase.topics.map((t) => (
                          <span
                            key={t}
                            className="rounded-md border border-border bg-secondary/60 px-2.5 py-1 text-xs text-foreground/85"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      {phase.id === 'phase-10' && (
                        <p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
                          <Layers className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                          Har strategy isi sequence mein sikhayi jati hai: Rules → Conditions → Entry → SL → TP →
                          Risk → Backtest → Evaluation. Koi strategy universally profitable nahi batayi jati.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          Schedule: {masterCourse.duration} • {masterCourse.classesPerWeek} • {masterCourse.classDuration}
        </p>
      </div>
    </section>
  )
}
