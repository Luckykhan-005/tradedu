import {
  ArrowLeft,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  ListOrdered,
  StickyNote,
  Sparkles,
  Shield,
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
    <div className="min-h-screen bg-secondary/30">
      {/* Back bar */}
      <div className="bg-background border-b border-border sticky top-16 z-40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Wapas AI Tools par
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-6">
        {/* ===== Professional Banner ===== */}
        <div
          className={cn(
            'relative overflow-hidden rounded-2xl',
            tool.bannerImage ? '' : `bg-gradient-to-r ${tool.bannerGradient}`
          )}
        >
          {tool.bannerImage ? (
            <img
              src={tool.bannerImage}
              alt={tool.name}
              className="w-full h-48 sm:h-64 object-cover"
            />
          ) : (
            <div className="h-48 sm:h-64 flex flex-col items-center justify-center text-center px-6">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-4 left-6 h-20 w-20 border border-white/30 rounded-full" />
                <div className="absolute bottom-4 right-8 h-14 w-14 border border-white/30 rounded-full" />
                <div className="absolute top-8 right-16 h-6 w-28 bg-white/20 rounded" />
                <div className="absolute bottom-10 left-12 h-4 w-20 bg-white/20 rounded" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-white/80" />
                  <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">
                    AI Powered Tool
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{tool.name}</h1>
                <p className="text-white/85 text-sm sm:text-base max-w-xl mx-auto">{tool.tagline}</p>
                <div className="mt-4">
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    {tool.category}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          {/* Overlay heading if banner image is used */}
          {tool.bannerImage && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-white/80" />
                <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">
                  AI Trading Tool
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">{tool.name}</h1>
              <p className="text-white/85 text-sm sm:text-base">{tool.tagline}</p>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-center max-w-2xl mx-auto">{tool.description}</p>

        {/* ===== Disclaimer Box ===== */}
        <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800">
          <CardContent className="p-5 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-2 mb-1.5">
                <Shield className="h-4 w-4" />
                Disclaimer / Zaroori Raay
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                {tool.disclaimer}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* ===== Features Box ===== */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Tool ki Features
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2.5">
                {tool.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* ===== How It Works Box ===== */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ListOrdered className="h-5 w-5 text-blue-600" />
                Ye Kaise Kaam Karta Hai
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ol className="space-y-3">
                {tool.howItWorks.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-foreground leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* ===== Special Note Box ===== */}
        <Card className="border-highlight/50 bg-highlight/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-highlight" />
          <CardContent className="p-5 flex items-start gap-3">
            <StickyNote className="h-5 w-5 text-highlight mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold mb-1.5 flex items-center gap-2">
                Special Note
                <Badge className="bg-highlight/20 text-highlight-foreground text-[10px] font-medium">
                  M. Aslam Khan
                </Badge>
              </h3>
              <p className="text-sm text-foreground/90 leading-relaxed">{tool.specialNote}</p>
            </div>
          </CardContent>
        </Card>

        {/* ===== Open Tool Button ===== */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-8">
          <Button
            size="lg"
            onClick={openTool}
            className="flex-1 h-14 text-base font-semibold gap-2.5"
          >
            <ExternalLink className="h-5 w-5" />
            Open {tool.name}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onBack}
            className="h-14 text-base gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Wapas Tools List par
          </Button>
        </div>
      </div>
    </div>
  )
}
