import { ArrowLeft, BookOpen, Library, Map } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { calculators, type CalculatorDef } from '@/data/calculators'
import type { Page } from '@/components/Navigation'

interface CalcEducationProps {
  def: CalculatorDef
  onBack: () => void
  onOpen: (slug: string) => void
  onNavigate: (page: Page) => void
}

export function CalcEducation({ def, onBack, onOpen, onNavigate }: CalcEducationProps) {
  const related = calculators.filter((c) => c.slug !== def.slug)

  return (
    <div className="border-t border-border bg-secondary/20">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Saare Calculators
          </button>
        </div>

        <h2 className="mb-4 text-2xl font-bold tracking-tight">{def.whatH2}</h2>
        <div className="space-y-4 text-muted-foreground">
          {def.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-border bg-background p-5">
          <h3 className="mb-3 text-lg font-semibold">Calculator Kaise Use Karein?</h3>
          <ol className="space-y-3">
            {def.howTo.map((step, i) => (
              <li key={i} className="flex gap-3 text-muted-foreground">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-background p-5">
          <h3 className="mb-3 text-lg font-semibold">Formula</h3>
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">
            {def.formula}
          </pre>
        </div>

        <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-5">
          <h3 className="mb-3 text-lg font-semibold">Example</h3>
          <p className="text-muted-foreground">{def.example}</p>
        </div>

        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold">Related Calculators</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <button key={c.slug} onClick={() => onOpen(c.slug)} className="text-left">
                <Card className="h-full transition-colors hover:border-primary/50">
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <c.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">{c.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{c.shortDesc}</p>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6 text-sm">
          <button
            onClick={() => onNavigate('glossary')}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <BookOpen className="h-4 w-4" />
            Trading Glossary
          </button>
          <button
            onClick={() => onNavigate('books')}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Library className="h-4 w-4" />
            Free Trading Books
          </button>
          <button
            onClick={() => onNavigate('roadmap')}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Map className="h-4 w-4" />
            Trading Roadmap
          </button>
        </div>
      </div>
    </div>
  )
}
