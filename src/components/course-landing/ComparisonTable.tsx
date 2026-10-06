import { Check, X } from 'lucide-react'
import { comparisonRows, comparisonFootnote } from '@/data/masterCourse'
import { Reveal, SECTION, SectionHead, CONTAINER } from './shared'

export function ComparisonTable() {
  const cols = [
    { key: 'youtube', label: 'Free YouTube', sub: '₨0' },
    { key: 'academy', label: 'Academy', sub: '₨50,000+' },
    { key: 'tradeed', label: 'TradeEd', sub: '₨1,499/mo' },
  ] as const

  const renderCell = (v: boolean, highlight: boolean) => {
    if (v)
      return (
        <span className="flex items-center justify-center">
          <Check className={`h-4 w-4 ${highlight ? 'text-accent' : 'text-emerald-500'}`} />
        </span>
      )
    return (
      <span className="flex items-center justify-center">
        <X className="h-4 w-4 text-muted-foreground/40" />
      </span>
    )
  }

  return (
    <section className={`${SECTION} py-14 sm:py-20`}>
      <div className={CONTAINER}>
        <Reveal>
          <SectionHead
            center
            eyebrow="The Difference"
            title="TradeEd vs YouTube vs Academy"
            lead="Side-by-side comparison — decide karne ke liye emotions nahi, facts chahiye."
          />
        </Reveal>

        <Reveal>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="w-2/5 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-4">
                    Feature
                  </th>
                  {cols.map((c) => {
                    const isUs = c.key === 'tradeed'
                    return (
                      <th
                        key={c.key}
                        className={`px-2 py-3 text-center sm:px-4 ${
                          isUs ? 'rounded-t-lg bg-accent/10' : ''
                        }`}
                      >
                        <div
                          className={`text-sm font-bold ${isUs ? 'text-accent' : 'text-foreground'}`}
                        >
                          {c.label}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{c.sub}</div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.feature} className="border-b border-border/60">
                    <td className="px-3 py-3 text-left text-sm text-foreground/90 sm:px-4">
                      {row.feature}
                    </td>
                    {cols.map((c, ci) => (
                      <td
                        key={c.key}
                        className={`px-2 py-3 sm:px-4 ${
                          ci === 2 ? 'bg-accent/[0.04]' : ''
                        }`}
                      >
                        {renderCell(row[c.key], ci === 2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal>
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
            {comparisonFootnote}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
