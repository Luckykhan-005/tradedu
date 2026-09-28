import { useState } from 'react'
import { Calculator, TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/cn'
import { fmt, n } from './calcUtils'

export function ProfitLossTool() {
  const [direction, setDirection] = useState<'long' | 'short'>('long')
  const [entry, setEntry] = useState('')
  const [exit, setExit] = useState('')
  const [qty, setQty] = useState('')
  const [capital, setCapital] = useState('')

  const ent = n(entry)
  const ext = n(exit)
  const quantity = n(qty)
  const cap = n(capital)

  const ready = ent > 0 && ext > 0 && quantity > 0 && ext !== ent

  const pnl = ready
    ? (direction === 'long' ? ext - ent : ent - ext) * quantity
    : 0
  const roi = ready && cap > 0 ? (pnl / cap) * 100 : 0
  const notional = ready ? ent * quantity : 0
  const isProfit = pnl >= 0

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="space-y-4 p-5">
              <Tabs
                value={direction}
                onValueChange={(v) => setDirection(v as 'long' | 'short')}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="long"
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Long
                  </TabsTrigger>
                  <TabsTrigger
                    value="short"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
                  >
                    <TrendingDown className="mr-2 h-4 w-4" />
                    Short
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="long" className="mt-4 space-y-4" />
                <TabsContent value="short" className="mt-4 space-y-4" />
              </Tabs>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Entry Price</Label>
                    <Input
                      type="number"
                      value={entry}
                      onChange={(e) => setEntry(e.target.value)}
                      className="mt-1 text-left"
                      placeholder="e.g. 60000"
                    />
                  </div>
                  <div>
                    <Label>Exit Price</Label>
                    <Input
                      type="number"
                      value={exit}
                      onChange={(e) => setExit(e.target.value)}
                      className="mt-1 text-left"
                      placeholder="e.g. 62000"
                    />
                  </div>
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="mt-1 text-left"
                    placeholder="e.g. 5"
                  />
                </div>
                <div>
                  <Label>Capital Deployed (USDT) — ROI ke liye</Label>
                  <Input
                    type="number"
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    className="mt-1 text-left"
                    placeholder="optional — e.g. 20000"
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
                <h3 className="mb-2 text-xl font-semibold">P&L ready nahi</h3>
                <p className="max-w-sm text-muted-foreground">
                  Entry, exit aur quantity daalein — profit ya loss foran nikal aayega.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div
                className={cn(
                  'rounded-xl border-2 p-6 text-center',
                  isProfit
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-red-200 bg-red-50'
                )}
              >
                <div className="text-sm text-muted-foreground">
                  {isProfit ? 'Net Profit' : 'Net Loss'} ({direction.toUpperCase()})
                </div>
                <div
                  className={cn(
                    'text-4xl font-bold',
                    isProfit ? 'text-emerald-600' : 'text-red-600'
                  )}
                >
                  {isProfit ? '+' : '−'}${fmt(Math.abs(pnl))}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {entry} → {exit} × {fmt(quantity, 4)} qty
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card>
                  <CardContent className="p-5 text-center">
                    <div className="text-sm text-muted-foreground">Position (Notional)</div>
                    <div className="text-3xl font-bold">${fmt(notional)}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Entry × quantity
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5 text-center">
                    <div className="text-sm text-muted-foreground">ROI</div>
                    <div
                      className={cn(
                        'text-3xl font-bold',
                        isProfit ? 'text-emerald-600' : 'text-red-600'
                      )}
                    >
                      {cap > 0 ? `${roi >= 0 ? '+' : '−'}${fmt(Math.abs(roi))}%` : '—'}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {cap > 0
                        ? `Capital $${fmt(cap)} par`
                        : 'ROI ke liye capital daalein'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Gross Move</span>
                    <span className="font-bold">
                      {fmt(Math.abs(ext - ent))} ({fmt((Math.abs(ext - ent) / ent) * 100)}%)
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Direction</span>
                    <span className="font-bold">{direction === 'long' ? 'Long (buy)' : 'Short (sell)'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Per Unit</span>
                    <span className={cn('font-bold', isProfit ? 'text-emerald-600' : 'text-red-600')}>
                      {isProfit ? '+' : '−'}${fmt(Math.abs(ext - ent))}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
                <strong className="text-foreground">Note:</strong> Yeh gross P&L hai —
                exchange fees, funding aur slippage ke baad net thora kam hota hai. Poora
                hisaab (fees ke sath) <strong className="text-foreground">Futures Calculator</strong> par dekhein.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
