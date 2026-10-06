import { BookOpen, Calculator, Sparkles, ClipboardList, MessagesSquare, Video, Gift } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { bonuses, type Bonus } from '@/data/masterCourse'
import { Reveal, SECTION, SectionHead, CONTAINER } from './shared'

const ICONS: Record<Bonus['icon'], typeof BookOpen> = {
  journal: ClipboardList,
  ai: Sparkles,
  calculator: Calculator,
  books: BookOpen,
  glossary: MessagesSquare,
  sessions: Video,
}

export function BonusStack() {
  return (
    <section className={`${SECTION} py-14 sm:py-20`}>
      <div className={CONTAINER}>
        <Reveal>
          <SectionHead
            center
            eyebrow="Included Bonuses"
            title="Course Ke Sath, Ye Sab Bhi Milta Hai"
            lead="Sirf live classes nahi — TradeEd ka poora trading ecosystem aap ke disposal par. Ye tools separate mein bhi hazaron ke kharche hote hain; yahan sab included."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bonuses.map((b, i) => {
            const Icon = ICONS[b.icon]
            return (
              <Reveal key={b.title} delay={(i % 3) * 70}>
                <Card className="h-full border-border/70 transition-colors hover:border-accent/40">
                  <CardContent className="flex h-full items-start gap-3.5 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">{b.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            )
          })}
        </div>

        <Reveal>
          <div className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/5 px-5 py-4 text-center">
            <Gift className="h-5 w-5 shrink-0 text-accent" />
            <p className="text-sm font-medium text-foreground/90">
              Yeh sab bonuses course enrollment ke sath included hain — koi alag payment nahi.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
