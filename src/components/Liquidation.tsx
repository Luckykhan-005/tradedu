import { useCallback, useEffect, useRef, useState } from 'react'
import { Flame, RefreshCw, Activity, TrendingUp, TrendingDown, AlertCircle, Info } from 'lucide-react'
import {
  fetchLiquidationData,
  HEATMAP_SYMBOLS,
  type HeatmapData,
} from '@/lib/liquidation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/cn'

const PLOT_HEIGHT = 440
const REFRESH_MS = 60_000

const heat = (v: number): [number, number, number] => {
  const stops: Array<[number, number, number, number]> = [
    [0.0, 8, 12, 36],
    [0.3, 70, 20, 110],
    [0.55, 180, 40, 70],
    [0.75, 255, 130, 30],
    [1.0, 255, 240, 140],
  ]
  const t = Math.max(0, Math.min(1, v))
  for (let i = 1; i < stops.length; i++) {
    const [t0, r0, g0, b0] = stops[i - 1]
    const [t1, r1, g1, b1] = stops[i]
    if (t <= t1) {
      const f = t1 === t0 ? 0 : (t - t0) / (t1 - t0)
      return [Math.round(r0 + (r1 - r0) * f), Math.round(g0 + (g1 - g0) * f), Math.round(b0 + (b1 - b0) * f)]
    }
  }
  return [255, 240, 140]
}

const fmtPrice = (p: number): string => {
  if (p >= 1000) return p.toLocaleString('en-US', { maximumFractionDigits: 0 })
  if (p >= 1) return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return p.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })
}

const fmtOi = (v: number): string => {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`
  return `$${Math.round(v)}`
}

const niceStep = (raw: number): number => {
  const pow = Math.pow(10, Math.floor(Math.log10(raw)))
  const n = raw / pow
  const m = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10
  return m * pow
}

export function Liquidation() {
  const [symbol, setSymbol] = useState<string>('BTCUSDT')
  const [data, setData] = useState<HeatmapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tick, setTick] = useState(0)

  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef<{ x: number; y: number } | null>(null)

  const load = useCallback(async (sym: string) => {
    try {
      const result = await fetchLiquidationData(sym)
      setData(result)
      setError('')
    } catch (e) {
      setError(
        'Market data load nahi ho saka. Binance apne region me block kar sakta hai — thodi der baad retry karein ya doosra pair select karein.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    load(symbol)
    const id = setInterval(() => setTick((t) => t + 1), REFRESH_MS)
    return () => clearInterval(id)
  }, [symbol, load])

  useEffect(() => {
    if (tick > 0) load(symbol)
  }, [tick, symbol, load])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap || !data) return

    const draw = () => {
      const w = wrap.clientWidth
      const h = PLOT_HEIGHT
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const AXIS_W = w < 520 ? 54 : 68
      const TOP = 8
      const BOTTOM = 28
      const plotW = w - AXIS_W
      const plotH = h - TOP - BOTTOM

      // Offscreen low-res heatmap → smooth upscale
      const off = document.createElement('canvas')
      off.width = data.columns
      off.height = data.bins
      const octx = off.getContext('2d')
      if (!octx) return
      const img = octx.createImageData(data.columns, data.bins)
      for (let c = 0; c < data.columns; c++) {
        const col = data.matrix[c]
        for (let b = 0; b < data.bins; b++) {
          const [r, g, bl] = heat(col[b])
          const i = ((data.bins - 1 - b) * data.columns + c) * 4
          img.data[i] = r
          img.data[i + 1] = g
          img.data[i + 2] = bl
          img.data[i + 3] = 255
        }
      }
      octx.putImageData(img, 0, 0)
      ctx.imageSmoothingEnabled = true
      ctx.fillStyle = '#0a0e1f'
      ctx.fillRect(0, TOP, plotW, plotH)
      ctx.drawImage(off, 0, 0, plotW, plotH)

      const yFor = (price: number) =>
        TOP + plotH * (1 - (price - data.priceLow) / (data.priceHigh - data.priceLow))

      // Cluster lines (strongest zones)
      for (const cl of data.clusters) {
        const y = yFor(cl.price)
        ctx.save()
        ctx.strokeStyle = 'rgba(255,255,255,0.45)'
        ctx.setLineDash([4, 5])
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(plotW, y)
        ctx.stroke()
        ctx.restore()
      }

      // Current price line
      const yMark = yFor(data.stats.markPrice)
      ctx.save()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.4
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.moveTo(0, yMark)
      ctx.lineTo(plotW, yMark)
      ctx.stroke()
      ctx.restore()

      // Right price axis
      ctx.fillStyle = '#0a0e1f'
      ctx.fillRect(plotW, 0, AXIS_W, h)
      const step = niceStep((data.priceHigh - data.priceLow) / 6)
      const start = Math.ceil(data.priceLow / step) * step
      ctx.font = '11px system-ui, sans-serif'
      ctx.textBaseline = 'middle'
      for (let p = start; p <= data.priceHigh; p += step) {
        const y = yFor(p)
        ctx.fillStyle = '#8b93a7'
        ctx.textAlign = 'left'
        ctx.fillText(fmtPrice(p), plotW + 6, y)
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(plotW, y)
        ctx.stroke()
      }

      // Mark price pill on axis
      const pill = fmtPrice(data.stats.markPrice)
      ctx.fillStyle = '#ffffff'
      const tw = ctx.measureText(pill).width + 10
      ctx.fillRect(plotW + 2, Math.max(2, Math.min(h - 18, yMark - 9)), tw, 18)
      ctx.fillStyle = '#0a0e1f'
      ctx.textAlign = 'left'
      ctx.fillText(pill, plotW + 7, Math.max(11, Math.min(h - 9, yMark)))

      // Time axis (daily labels)
      ctx.fillStyle = '#8b93a7'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      for (let c = 24; c < data.columns; c += 24) {
        const x = (c / data.columns) * plotW
        const d = new Date(data.times[c])
        ctx.fillText(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), x, h - BOTTOM + 8)
      }

      // Hover crosshair + tooltip (interactive figures)
      const pos = mouseRef.current
      if (pos && pos.x >= 0 && pos.x <= plotW && pos.y >= TOP && pos.y <= TOP + plotH) {
        const col = Math.max(
          0,
          Math.min(data.columns - 1, Math.floor((pos.x / plotW) * data.columns))
        )
        const bin = Math.max(
          0,
          Math.min(data.bins - 1, Math.floor(((1 - (pos.y - TOP) / plotH) * data.bins)))
        )
        const value = data.matrix[col][bin]
        const price =
          data.priceLow + ((bin + 0.5) / data.bins) * (data.priceHigh - data.priceLow)
        const xLine = ((col + 0.5) / data.columns) * plotW
        const yLine = TOP + plotH * (1 - (bin + 0.5) / data.bins)

        // Crosshair lines
        ctx.save()
        ctx.strokeStyle = 'rgba(255,255,255,0.7)'
        ctx.setLineDash([3, 4])
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(xLine, TOP)
        ctx.lineTo(xLine, TOP + plotH)
        ctx.moveTo(0, yLine)
        ctx.lineTo(plotW, yLine)
        ctx.stroke()
        ctx.setLineDash([])
        // Dot at cell
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(xLine, yLine, 3, 0, Math.PI * 2)
        ctx.fill()
        // Highlight hovered price on axis
        ctx.fillStyle = '#ffffff'
        const pl = fmtPrice(price)
        const pw = ctx.measureText(pl).width + 10
        ctx.fillRect(plotW + 2, Math.max(2, Math.min(h - 18, yLine - 9)), pw, 18)
        ctx.fillStyle = '#0a0e1f'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        ctx.fillText(pl, plotW + 7, Math.max(11, Math.min(h - 9, yLine)))
        ctx.restore()

        // Tooltip box
        const timeStr = new Date(data.times[col]).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
        const dist = ((price - data.stats.markPrice) / data.stats.markPrice) * 100
        const intensityPct = Math.round(value * 100)
        const lines = [
          timeStr,
          `$${fmtPrice(price)}`,
          `Liquidation: ${intensityPct}%`,
          `Mark se ${dist >= 0 ? '+' : ''}${dist.toFixed(2)}%`,
        ]
        const boxW = 186
        const boxH = 84
        let bx = pos.x + 16
        let by = pos.y + 16
        if (bx + boxW > plotW) bx = pos.x - boxW - 16
        if (by + boxH > TOP + plotH) by = pos.y - boxH - 16
        bx = Math.max(4, bx)
        by = Math.max(TOP + 4, by)

        ctx.save()
        ctx.fillStyle = 'rgba(10,14,31,0.95)'
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'
        ctx.lineWidth = 1
        ctx.beginPath()
        const r = 8
        ctx.moveTo(bx + r, by)
        ctx.arcTo(bx + boxW, by, bx + boxW, by + boxH, r)
        ctx.arcTo(bx + boxW, by + boxH, bx, by + boxH, r)
        ctx.arcTo(bx, by + boxH, bx, by, r)
        ctx.arcTo(bx, by, bx + boxW, by, r)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        ctx.font = '11px system-ui, sans-serif'
        lines.forEach((line, i) => {
          if (i === 1) ctx.font = 'bold 13px system-ui, sans-serif'
          else if (i === 2) ctx.font = '600 12px system-ui, sans-serif'
          else ctx.font = '11px system-ui, sans-serif'
          ctx.fillStyle =
            i === 2
              ? intensityPct >= 66
                ? '#ffb020'
                : intensityPct >= 33
                  ? '#f97316'
                  : '#8b93a7'
              : i === 3
                ? dist >= 0
                  ? '#34d399'
                  : '#f87171'
                : '#e5e9f0'
          ctx.fillText(line, bx + 12, by + 10 + i * 18)
        })
        ctx.restore()
      }
    }

    draw()

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      draw()
    }
    const onLeave = () => {
      mouseRef.current = null
      draw()
    }
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)

    const ro = new ResizeObserver(draw)
    ro.observe(wrap)
    return () => {
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
      ro.disconnect()
    }
  }, [data])

  const s = data?.stats
  const shortTs = data?.clusters.filter((c) => c.side === 'above') || []
  const longTs = data?.clusters.filter((c) => c.side === 'below') || []

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Flame className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Liquidation Heatmap</h1>
              <p className="text-muted-foreground">
                Liquidation zones — free, live market data ke sath
              </p>
            </div>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => setTick((t) => t + 1)}>
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            Refresh
          </Button>
        </div>

        {/* Pair selector */}
        <div className="mb-4 flex flex-wrap gap-2">
          {HEATMAP_SYMBOLS.map((s2) => (
            <button
              key={s2.symbol}
              onClick={() => setSymbol(s2.symbol)}
              className={cn(
                'rounded-lg border px-4 py-1.5 text-sm font-semibold transition-colors',
                symbol === s2.symbol
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
              )}
            >
              {s2.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Mark Price</p>
              <p className="text-lg font-bold">{s ? `$${fmtPrice(s.markPrice)}` : '—'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Funding Rate</p>
              <p
                className={cn(
                  'text-lg font-bold',
                  s && s.funding >= 0 ? 'text-emerald-600' : 'text-destructive'
                )}
              >
                {s ? `${(s.funding * 100).toFixed(4)}%` : '—'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Open Interest</p>
              <p className="text-lg font-bold">{s ? fmtOi(s.openInterestUsd) : '—'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Long / Short Ratio</p>
              <p className="text-lg font-bold">{s ? `${s.longShortRatio.toFixed(2)}` : '—'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Heatmap */}
        <Card className="mb-4 overflow-hidden">
          <CardContent className="p-3 sm:p-4">
            {error ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <AlertCircle className="h-10 w-10 text-destructive" />
                <p className="max-w-md text-sm text-muted-foreground">{error}</p>
                <Button variant="outline" size="sm" onClick={() => setSymbol((x) => x)}>
                  Retry
                </Button>
              </div>
            ) : loading && !data ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Market data load ho rahi hai…</p>
              </div>
            ) : data ? (
              <div ref={wrapRef} className="relative w-full">
                <canvas ref={canvasRef} className="block w-full cursor-crosshair" />
                {loading && (
                  <div className="absolute right-3 top-3 rounded-md bg-background/80 px-2 py-1 text-xs text-muted-foreground">
                    Updating…
                  </div>
                )}
              </div>
            ) : null}

            {/* Legend */}
            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Kam</span>
                <div
                  className="h-2.5 w-32 rounded-full"
                  style={{
                    background:
                      'linear-gradient(to right, rgb(8,12,36), rgb(70,20,110), rgb(180,40,70), rgb(255,130,30), rgb(255,240,140))',
                  }}
                />
                <span>Zyada Liquidation</span>
              </div>
              {data && (
                <span>Updated: {new Date(data.updatedAt).toLocaleTimeString()}</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Strongest clusters */}
        {data && (
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  <h2 className="font-semibold">Neeche — Longs ki Liquidation Zones</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {longTs.length ? (
                    longTs.map((c) => (
                      <Badge key={c.price} variant="destructive" className="text-sm">
                        ${fmtPrice(c.price)}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Koi strong zone nahi mila</p>
                  )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Price yahan tak gir sakta hai (cascading long liquidations)
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  <h2 className="font-semibold">Oopar — Shorts ki Liquidation Zones</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {shortTs.length ? (
                    shortTs.map((c) => (
                      <Badge key={c.price} className="bg-emerald-600 text-sm hover:bg-emerald-700">
                        ${fmtPrice(c.price)}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Koi strong zone nahi mila</p>
                  )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Price yahan tak chadh sakta hai (cascading short liquidations)
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Educational content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 rounded-xl border border-border bg-card p-6">
          <section>
            <h2 className="mb-2 flex items-center gap-2 text-xl font-bold">
              <Info className="h-5 w-5 text-primary" /> Liquidation Heatmap Kya Hai?
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Futures market me har trader leverage ke sath trade karta hai. Jab price uss level tak
              pahunch jahan uski position ka margin khatam ho jaye, to exchange uski position
              <strong> force close (liquidate)</strong> kar deti hai. Heatmap in liquidation zones ko
              dikhata hai — bright raqam ka matlab hai wahan bohot sari positions liquidate hone wali
              hain.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold">Heatmap Kaise Parhein</h2>
            <ul className="ml-5 list-disc space-y-1.5 text-sm text-muted-foreground">
              <li>
                <strong>Neeche ki bright line:</strong> longs ki liquidation cluster — price aksar
                neeche khinchta hai (hunt) aur uske baad bounce karta hai.
              </li>
              <li>
                <strong>Oopar ki bright line:</strong> shorts ki liquidation cluster — price wahan
                tak chadh kar shorts ko liquidate karta hai.
              </li>
              <li>
                <strong>Zyada bright rang</strong> = zyada liquidity = wahan se trend shuru hone ya
                rukne ka khatra zyada.
              </li>
              <li>
                <strong>Safed line</strong> current price hai — iske qareeb clusters jaldi trigger
                hote hain.
              </li>
              <li>
                Heatmap ko <strong>support/resistance</strong> ke tor par dekhein — koi aur indicator
                lagane se pehle zones yaad rakhein.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold">Zaroori Note — Estimated Data</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Yeh heatmap <strong>Binance ka real Open Interest, Funding Rate aur Long/Short ratio</strong>{' '}
              par based hai — lekin liquidation levels <em>estimate</em> hain (common leverage tiers
              3x–100x se calculate hote hain). Exchange ke exact internal data (jaise Coinglass
              dikhata hai) alag hota hai. Sirf seekhne aur samajhne ke liye hai — trading decision
              sirf ispar na lein.
            </p>
          </section>
        </div>

        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className="h-3.5 w-3.5" /> Data source: Binance Futures public API · auto-refresh
          har 60 seconds
        </p>
      </div>
    </div>
  )
}
