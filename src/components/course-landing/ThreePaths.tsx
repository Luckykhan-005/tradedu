import { CheckCircle2, XCircle, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { threePaths } from '@/data/masterCourse'
import { Reveal, SECTION, SectionHead, CONTAINER } from './shared'

export function ThreePaths() {
  return (
    <section className={`${SECTION} py-14 sm:py-20`}>
      <div className={CONTAINER}>
        <Reveal>
          <SectionHead
            center
            eyebrow="The Choice"
            title="Trading Seekhne Ke 3 Raste"
            lead="Har naya trader inhi teen mein se ek rasta chunta. Doosra aur teesra rasta common hai — magar result nahi deta. Pehla rasta wo hai jo actual traders banata hai."
          />
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {threePaths.map((path, i) => {
            const isChoose = path.verdict === 'choose'
            return (
              <Reveal key={path.key} delay={i * 90}>
                <Card
                  className={`relative h-full transition-all ${
                    isChoose
                      ? 'border-accent/60 bg-accent/5 shadow-lg shadow-accent/10 lg:scale-[1.03]'
                      : 'border-border/70 opacity-90'
                  }`}
                >
                  {isChoose && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-background">
                        <Sparkles className="h-3 w-3" /> Recommended
                      </span>
                    </div>
                  )}
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-bold">{path.name}</h3>
                    </div>
                    <p
                      className={`mt-1 text-sm font-semibold ${
                        isChoose ? 'text-accent' : 'text-muted-foreground'
                      }`}
                    >
                      {path.tag}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {path.desc}
                    </p>

                    <div className="mt-5 grow border-t border-border pt-4">
                      <ul className="space-y-2.5">
                        {path.points.map((p) => (
                          <li key={p} className="flex items-start gap-2 text-sm">
                            {isChoose ? (
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                            ) : (
                              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive/70" />
                            )}
                            <span className={isChoose ? 'text-foreground/90' : 'text-muted-foreground'}>
                              {p}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
