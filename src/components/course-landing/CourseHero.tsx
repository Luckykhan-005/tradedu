import { ArrowRight, BarChart3, PlayCircle, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { masterCourse, mentor, trustStrip } from '@/data/masterCourse'
import { Reveal } from './shared'

function HeroChart() {
  const candles = [
    { x: 18, open: 128, close: 108, high: 96, low: 140, up: true },
    { x: 44, open: 108, close: 92, high: 82, low: 118, up: true },
    { x: 70, open: 94, close: 112, high: 88, low: 126, up: false },
    { x: 96, open: 110, close: 124, high: 102, low: 136, up: false },
    { x: 122, open: 122, close: 98, high: 86, low: 132, up: true },
    { x: 148, open: 98, close: 74, high: 62, low: 108, up: true },
    { x: 174, open: 76, close: 88, high: 66, low: 100, up: false },
    { x: 200, open: 86, close: 64, high: 52, low: 96, up: true },
    { x: 226, open: 66, close: 48, high: 38, low: 76, up: true },
    { x: 252, open: 50, close: 62, high: 42, low: 74, up: false },
    { x: 278, open: 60, close: 40, high: 30, low: 70, up: true },
    { x: 304, open: 42, close: 30, high: 20, low: 52, up: true },
  ]
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <BarChart3 className="h-3.5 w-3.5 text-accent" />
          BTC/USDT — Structure &amp; Risk
        </div>
        <div className="flex items-center gap-3 text-[10px] font-medium text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> BOS
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-highlight" /> Zone
          </span>
        </div>
      </div>
      <svg viewBox="0 0 340 210" className="w-full" role="img" aria-label="Market structure aur risk reward ka educational chart example">
        <defs>
          <linearGradient id="heroZone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ecb81" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#0ecb81" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <g stroke="currentColor" className="text-border" strokeWidth="1">
          {[30, 70, 110, 150, 190].map((y) => (
            <line key={y} x1="8" y1={y} x2="332" y2={y} />
          ))}
        </g>
        <rect x="8" y="118" width="324" height="34" fill="url(#heroZone)" />
        <line x1="8" y1="118" x2="332" y2="118" stroke="#BAFF29" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.85" />
        <text x="12" y="114" className="fill-highlight" fontSize="8.5" fontWeight="700">
          DEMAND ZONE
        </text>
        {candles.map((c) => {
          const top = Math.min(c.open, c.close)
          const h = Math.max(Math.abs(c.close - c.open), 4)
          const color = c.up ? '#0ecb81' : '#f6465d'
          return (
            <g key={c.x}>
              <line x1={c.x + 6} y1={c.high} x2={c.x + 6} y2={c.low} stroke={color} strokeWidth="1.4" />
              <rect x={c.x} y={top} width="12" height={h} fill={color} rx="1" />
            </g>
          )
        })}
        <polyline
          points="24,100 50,84 76,98 102,110 128,96 154,72 180,84 206,62 232,54 258,66 284,56 310,36"
          fill="none"
          stroke="#4f9fff"
          strokeWidth="1.6"
          strokeDasharray="3 3"
          opacity="0.75"
        />
        <g fontSize="8" fontWeight="600">
          <rect x="228" y="120" width="46" height="14" rx="3" fill="#f6465d" fillOpacity="0.9" />
          <text x="234" y="130" fill="#fff">
            SL
          </text>
          <rect x="286" y="34" width="46" height="14" rx="3" fill="#0ecb81" fillOpacity="0.9" />
          <text x="292" y="44" fill="#fff">
            TP 2R
          </text>
          <rect x="252" y="72" width="52" height="14" rx="3" fill="#4f7a1f" />
          <text x="257" y="82" fill="#fff">
            ENTRY
          </text>
        </g>
      </svg>
      <div className="grid grid-cols-3 divide-x divide-border border-t border-border text-center">
        {[
          ['Risk', '1% = $10'],
          ['Target', '2R = $20'],
          ['Plan', 'Rule-based'],
        ].map(([k, v]) => (
          <div key={k} className="px-2 py-2.5">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{k}</p>
            <p className="text-xs font-semibold text-foreground">{v}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CourseHero({ onEnroll }: { onEnroll: () => void }) {
  return (
    <section id="overview" className="relative overflow-hidden bg-secondary/40 scroll-mt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <div>
              <Badge className="border-accent/40 bg-accent/10 text-accent" variant="outline">
                {masterCourse.badge}
              </Badge>
              <h1 className="mt-5 text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.75rem]">
                {masterCourse.title}
              </h1>
              <p className="mt-3 text-lg font-semibold text-accent sm:text-xl">{masterCourse.tagline}</p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {masterCourse.description}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="gap-2 px-7" onClick={onEnroll}>
                  {masterCourse.ctaPrimary}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2 px-7" onClick={() => document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })}>
                  <PlayCircle className="h-4 w-4" />
                  {masterCourse.ctaSecondary}
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" /> No profit guarantees — skill &amp; process par focus
                </span>
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5 text-accent" /> {masterCourse.duration} • {masterCourse.classesPerWeek}
                </span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <HeroChart />
          </Reveal>
        </div>

        {/* Trust strip */}
        <div className="mt-10 overflow-x-auto rounded-lg border border-border bg-card">
          <ul className="flex min-w-max items-center divide-x divide-border">
            {trustStrip.map((t) => (
              <li key={t} className="px-4 py-3 text-xs font-medium text-muted-foreground sm:text-sm">
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Mentor: <span className="font-medium text-foreground">{mentor.name}</span> • Live teaching + practical
          assignments
        </p>
      </div>
    </section>
  )
}
