import {
  ArrowLeft,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  ListOrdered,
  StickyNote,
  Sparkles,
  Shield,
  Sparkle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/cn'
import type { AiToolPage } from '@/data/aiTools'

interface AiToolDetailProps {
  tool: AiToolPage
  onBack: () => void
}

export function AiToolDetail({ tool, onBack }: AiToolDetailProps) {
  const openTool = () => {
    window.open(tool.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky back bar */}
      <div className="bg-background/95 backdrop-blur border-b border-border sticky top-16 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 -ml-2 shrink-0">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Wapas AI Tools par</span>
            <span className="sm:hidden">Wapas</span>
          </Button>
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="h-4 w-4 text-primary shrink-0" />
            <span className="font-semibold text-sm truncate">{tool.name}</span>
            <Badge variant="secondary" className="hidden sm:inline-flex shrink-0">
              {tool.category}
            </Badge>
          </div>
          <Button size="sm" onClick={openTool} className="gap-1.5 shrink-0">
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Open Tool</span>
          </Button>
        </div>
      </div>

      {/* ===== Full-width hero banner — complete image, no cut ===== */}
      <section className="w-full bg-black">
        {tool.bannerImage ? (
          <img
            src={tool.bannerImage}
            alt={tool.name}
            className="w-full h-auto block"
            loading="eager"
          />
        ) : (
          <div
            className={cn(
              'w-full min-h-[240px] sm:min-h-[360px] lg:min-h-[440px] flex flex-col items-center justify-center text-center px-6',
              `bg-gradient-to-r ${tool.bannerGradient}`
            )}
          >
            <span className="text-white/75 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              AI Trading Tool
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3">
              {tool.name}
            </h1>
            <p className="text-white/85 text-base sm:text-lg max-w-2xl">{tool.tagline}</p>
          </div>
        )}
      </section>

      {/* Title band under banner */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 text-primary px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                  <Sparkle className="h-3.5 w-3.5" />
                  AI Powered
                </span>
                <Badge variant="outline">{tool.category}</Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
                {tool.name}
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl">{tool.tagline}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:shrink-0">
              <Button size="lg" onClick={openTool} className="h-14 text-base font-semibold gap-2.5 px-8">
                <ExternalLink className="h-5 w-5" />
                Open {tool.name}
              </Button>
              <Button size="lg" variant="outline" onClick={onBack} className="h-14 text-base gap-2">
                <ArrowLeft className="h-5 w-5" />
                Wapas Tools
              </Button>
            </div>
          </div>
          <p className="mt-6 text-muted-foreground leading-relaxed max-w-4xl">
            {tool.description}
          </p>
        </div>
      </section>

      {/* ===== Content — full width ===== */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Disclaimer */}
        <Card className="border-amber-400/70 bg-amber-50/80 dark:bg-amber-950/50 dark:border-amber-700 shadow-sm">
          <CardContent className="p-5 sm:p-6 flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/60">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base sm:text-lg text-amber-900 dark:text-amber-100 flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4" />
                Disclaimer / Zaroori Raay
              </h3>
              <p className="text-sm sm:text-[15px] text-amber-800 dark:text-amber-200/90 leading-relaxed">
                {tool.disclaimer}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features + How it works — full width side by side */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4 border-b border-border">
              <CardTitle className="text-xl flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </span>
                Tool ki Features
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <ul className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-3">
                {tool.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[15px]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-1 shrink-0" />
                    <span className="text-foreground leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4 border-b border-border">
              <CardTitle className="text-xl flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <ListOrdered className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </span>
                Ye Kaise Kaam Karta Hai
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <ol className="space-y-4">
                {tool.howItWorks.map((step, i) => (
                  <li key={i} className="flex items-start gap-3.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {i + 1}
                    </span>
                    <span className="text-[15px] text-foreground leading-relaxed pt-0.5">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Special Note — full width */}
        <Card className="relative overflow-hidden border-primary/40 bg-gradient-to-r from-primary/[0.07] to-highlight/[0.12] shadow-sm">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-primary via-highlight to-primary" />
          <CardContent className="p-5 sm:p-7 pl-6 sm:pl-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-highlight/25">
                <StickyNote className="h-5 w-5 text-highlight-foreground dark:text-highlight" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-lg mb-2 flex flex-wrap items-center gap-2.5">
                  Special Note
                  <Badge className="bg-primary text-primary-foreground text-[11px] font-semibold px-2.5 py-0.5">
                    M. Aslam Khan
                  </Badge>
                </h3>
                <p className="text-[15px] sm:text-base text-foreground/90 leading-relaxed">
                  {tool.specialNote}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom CTA — full width */}
        <div className="rounded-2xl border border-border bg-gradient-to-r from-card via-secondary/40 to-card p-6 sm:p-10 text-center shadow-sm">
          <Sparkles className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Ready? {tool.name} use karein
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Tool naye tab me khulega — poori screen par signals, analysis aur dashboard dekh sakein.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button size="lg" onClick={openTool} className="h-14 text-base font-semibold gap-2.5 px-10">
              <ExternalLink className="h-5 w-5" />
              Open {tool.name}
            </Button>
            <Button size="lg" variant="outline" onClick={onBack} className="h-14 text-base gap-2">
              <ArrowLeft className="h-5 w-5" />
              Wapas AI Tools Hub
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
