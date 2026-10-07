import { ArrowRight, Database, NotebookPen, Repeat2, CandlestickChart, Wallet } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { tools, tradeWorkflow } from '@/data/masterCourse'
import { Eyebrow, Reveal, SECTION, SectionTitle, CONTAINER } from './shared'

const toolIcons = [CandlestickChart, Wallet, NotebookPen, Repeat2, Database]

export function ToolsWorkflow() {
  return (
    <section id="tools" className={`${SECTION} scroll-mt-36 py-14 sm:py-20`}>
      <div className={CONTAINER}>
        {/* Tools */}
        <SectionHeadInline />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t, i) => {
            const Icon = toolIcons[i % toolIcons.length]
            return (
              <Reveal key={t.name} delay={(i % 3) * 70}>
                <Card className="h-full transition-colors hover:border-accent/50">
                  <CardContent className="p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="mt-3 font-semibold">{t.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
                  </CardContent>
                </Card>
              </Reveal>
            )
          })}
          <Reveal delay={140}>
            <Card className="h-full border-dashed">
              <CardContent className="flex h-full flex-col justify-center p-5 text-sm text-muted-foreground">
                Tools sirf interface nahi — har tool course ke practical workflow ka hissa hai. (Koi official
                partnership claim nahi — sirf sikhayi jane wali tools.)
              </CardContent>
            </Card>
          </Reveal>
        </div>

        {/* Theory → Chart workflow */}
        <Reveal>
          <div className="mt-12 rounded-xl border border-border bg-card p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Eyebrow>Real Practical Example</Eyebrow>
                <h3 className="mt-2 text-xl font-bold sm:text-2xl">Theory Se Chart Tak</h3>
              </div>
              <Badge variant="outline" className="border-accent/40 text-accent">
                Educational Example
              </Badge>
            </div>

            <ol className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {tradeWorkflow.map((step, i) => (
                <li
                  key={step}
                  className="flex items-center gap-3 rounded-lg border border-border/70 bg-secondary/50 px-3.5 py-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[10px] font-bold text-accent">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium">{step}</span>
                  {i < tradeWorkflow.length - 1 && (
                    <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground/50" />
                  )}
                </li>
              ))}
            </ol>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Ek hypothetical BTC example par pura workflow chalaya jayega — context se journal review tak. Ye
              educational example hai, live market data ya profit projection nahi.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function SectionHeadInline() {
  return (
    <div className="max-w-3xl">
      <Eyebrow>Tools Students Will Learn</Eyebrow>
      <SectionTitle className="mt-3">Professional Tools, Professional Workflow</SectionTitle>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        Trading ka kaam tool par hota hai — is liye course mein tools sirf naam se nahi, practical exercises ke
        sath sikhaye jate hain.
      </p>
    </div>
  )
}
