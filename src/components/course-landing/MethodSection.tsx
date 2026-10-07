import { MonitorPlay, Repeat } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { classWorkflow, teachingLoop } from '@/data/masterCourse'
import { Eyebrow, Reveal, SECTION, SectionTitle, CONTAINER } from './shared'

export function MethodSection() {
  const totalMin = classWorkflow.reduce((sum, s) => sum + parseInt(s.min, 10) || 0, 0)

  return (
    <section id="method" className={`${SECTION} scroll-mt-36 bg-secondary/30 py-14 sm:py-20`}>
      <div className={CONTAINER}>
        <Reveal>
          <div className="max-w-3xl">
            <Eyebrow>How The Mentor Teaches</Eyebrow>
            <SectionTitle className="mt-3">
              Mentor Sirf Lecture Nahi Dega. Mentor Aap Ko Process Practice Karwayega.
            </SectionTitle>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Har concept ek hi loop mein chalta hai — samjho, dekho, khud karo, test karo, review karo. Yehi
              repetition skill banti hai.
            </p>
          </div>
        </Reveal>

        {/* Teaching loop */}
        <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {teachingLoop.map((s, i) => (
            <Reveal key={s.step} delay={(i % 4) * 70}>
              <Card className="h-full transition-colors hover:border-accent/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-[0.18em] text-accent">{s.step}</span>
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-snug text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* Live class experience */}
        <Reveal>
          <div className="mt-10 rounded-xl border border-border bg-card p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Eyebrow>Live Class Experience</Eyebrow>
                <h3 className="mt-2 flex items-center gap-2 text-xl font-bold sm:text-2xl">
                  <MonitorPlay className="h-5 w-5 text-accent" />
                  Classroom Mein Sirf Slides Nahi Chalengi
                </h3>
              </div>
              <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                ≈ {totalMin} min class
              </span>
            </div>

            <div className="mt-5 space-y-2">
              {classWorkflow.map((c, i) => {
                const pct = (parseInt(c.min, 10) / totalMin) * 100
                return (
                  <div key={c.label} className="flex items-center gap-3">
                    <span className="w-16 shrink-0 text-right text-xs font-semibold text-accent">{c.min}</span>
                    <div className="h-8 min-w-0 flex-1 overflow-hidden rounded-md bg-secondary">
                      <div
                        className="flex h-full items-center bg-accent/15 px-3 transition-[width] duration-700"
                        style={{ width: `${Math.max(pct, 14)}%` }}
                      >
                        <span className="truncate text-xs font-medium text-foreground/90">
                          {i + 1}. {c.label}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <Repeat className="h-4 w-4 text-accent" />
              Learn → See → Practice → Test → Review — har class isi rhythm mein.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
