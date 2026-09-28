import { useState } from 'react'
import { Calculator, DollarSign, Layers, Percent } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/cn'
import { fmt, n } from './calcUtils'

export function LeverageTool() {
  const [capital, setCapital] = useState('')
  const [leverage, setLeverage] = useState('10')
  const [position, setPosition] = useState('')

  const cap = n(capital)
  const lev = Math.max(1, n(leverage))
  const pos = n(position)

  const ready = cap > 0 && lev >= 1
  const buyingPower = cap * lev
  const margin = pos > 0 ? pos / lev : 0
  const marginPct = cap > 0 && pos > 0 ? (margin / cap) * 100 : 0
  const remaining = cap > 0 && pos > 0 ? cap - margin : 0
  const liqDistance = 100 / lev
  const maxPosition = buyingPower
  const overLimit = pos > 0 && pos > buyingPower

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="space-y-4 p-5">
              <div>
                <Label>Capital / Balance (USDT)</Label>
                <div className="relative mt-1">
                  <DollarSign className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    className="pr-10 text-left"
                    placeholder="e.g. 500"
                  />
                </div>
              </div>
              <div>
                <Label>Leverage (x)</Label>
                <div className="relative mt-1">
                  <Layers className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={leverage}
                    onChange={(e) => setLeverage(e.target.value)}
                    className="pr-10 text-left"
                    min="1"
                    max="125"
                  />
                </div>
              </div>
              <div>
                <Label>Position Size (notional USDT)</Label>
                <div className="relative mt-1">
                  <DollarSign className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="pr-10 text-left"
                    placeholder="optional — e.g. 2000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {!ready ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Calculator className="mb-4 h-14 w-14 text-muted-foreground/30" />
                <h3 className="mb-2 text-xl font-semibold">Capital daalein</h3>
                <p className="max-w-sm text-muted-foreground">
                  Capital aur leverage se buying power, margin aur liquidation distance
                  nikal aayega.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border-2 border-sky-200 bg-sky-50 p-5 text-center dark:border-sky-800 dark:bg-sky-950/60">
                <div className="text-sm text-muted-foreground">Max Buying Power ({lev}x)</div>
                <div className="text-3xl font-bold text-sky-700 dark:text-sky-300">${fmt(buyingPower)}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  ${fmt(cap)} capital × {fmt(lev)}x leverage
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card>
                  <CardContent className="p-5">
                    <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                      Margin Required
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Position Size</span>
                        <span className="font-bold">{pos > 0 ? `$${fmt(pos)}` : '—'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Margin Locked</span>
                        <span className="font-bold text-sky-700 dark:text-sky-300">
                          {pos > 0 ? `$${fmt(margin)}` : '—'}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Of Capital</span>
                        <span className="font-bold">{pos > 0 ? `${fmt(marginPct)}%` : '—'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Free Balance</span>
                        <span className="font-bold">
                          {pos > 0 ? `$${fmt(remaining)}` : `$${fmt(cap)}`}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                      <Percent className="mr-1 inline h-4 w-4" />
                      Liquidation Distance
                    </h3>
                    <div
                      className={cn(
                        'mb-3 rounded-xl p-4 text-center',
                        liqDistance <= 5
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      )}
                    >
                      <div className="text-2xl font-bold">≈ {fmt(liqDistance)}%</div>
                      <div className="text-xs">
                        {liqDistance <= 5
                          ? 'Bohot qareeb — 1 candle mein liquidation ho sakti hai'
                          : 'Entry se itne % ki ulti move par liquidation'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Max Position</span>
                      <span className="font-bold">${fmt(maxPosition)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {overLimit && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300">
                  <strong>Over-leveraged:</strong> ${fmt(pos)} buying power ({'$'}
                  {fmt(maxPosition)}) se bara hai — exchange yeh position accept nahi karega.
                </div>
              )}

              <div className="rounded-xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
                <strong className="text-foreground">Yaad rakhein:</strong> {lev}x par{' '}
                {fmt(liqDistance)}% ki choti si ulti move poora margin khatam kar sakti hai.
                Leverage barhana sirf tab jab stop loss already ho.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
