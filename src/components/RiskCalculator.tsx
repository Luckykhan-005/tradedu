import { useState } from 'react'
import {
  Calculator,
  DollarSign,
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Gauge,
  Layers,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/cn'

export function RiskCalculator() {
  const [account, setAccount] = useState('')
  const [tradeSize, setTradeSize] = useState('')
  const [leverage, setLeverage] = useState('')
  const [entry, setEntry] = useState('')
  const [tp, setTp] = useState('')
  const [sl, setSl] = useState('')
  const [slippage, setSlippage] = useState('0.1')
  const [makerFee, setMakerFee] = useState('0.02')
  const [takerFee, setTakerFee] = useState('0.04')
  const [fundingRate, setFundingRate] = useState('0.01')
  const [direction, setDirection] = useState<'long' | 'short'>('long')
  const [calculated, setCalculated] = useState(false)

  const n = (v: string) => parseFloat(v) || 0
  const fmt = (v: number, d = 2) => d === 0 ? Math.round(v).toString() : v.toFixed(d)

  const calculate = () => {
    if (!account || !tradeSize || !leverage || !entry || !tp || !sl) {
      return
    }
    setCalculated(true)
  }

  const acc = n(account)
  const size = n(tradeSize)
  const lev = n(leverage)
  const ent = n(entry)
  const tpP = n(tp)
  const slP = n(sl)
  const slip = n(slippage) / 100
  const mFee = n(makerFee) / 100
  const tFee = n(takerFee) / 100
  const fund = n(fundingRate) / 100

  const posValue = size * lev
  const qty = ent > 0 ? posValue / ent : 0
  const margin = size

  let liqPrice: number
  if (direction === 'long') {
    liqPrice = ent * (1 - 1 / lev)
  } else {
    liqPrice = ent * (1 + 1 / lev)
  }

  const isDangerous =
    direction === 'long' ? slP <= liqPrice : slP >= liqPrice

  let tpPnl: number, tpPnlPct: number, slPnl: number, slPnlPct: number
  if (direction === 'long') {
    tpPnl = (tpP - ent) * qty
    tpPnlPct = margin > 0 ? (tpPnl / margin) * 100 : 0
    slPnl = (slP - ent) * qty
    slPnlPct = margin > 0 ? (slPnl / margin) * 100 : 0
  } else {
    tpPnl = (ent - tpP) * qty
    tpPnlPct = margin > 0 ? (tpPnl / margin) * 100 : 0
    slPnl = (ent - slP) * qty
    slPnlPct = margin > 0 ? (slPnl / margin) * 100 : 0
  }

  const entrySlippage = ent * slip
  const entryFee = posValue * tFee
  const exitFee = posValue * tFee
  const totalFees = entryFee + exitFee
  const fundingCost = posValue * fund

  const netTpPnl = tpPnl - totalFees - fundingCost
  const netSlPnl = slPnl - totalFees - fundingCost

  const rr = slPnl !== 0 ? Math.abs(tpPnl / slPnl) : 0
  const positionPct = acc > 0 ? (size / acc) * 100 : 0
  const riskPct = acc > 0 ? (Math.abs(slPnl) / acc) * 100 : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Gauge className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Futures Calculator</h1>
              <p className="text-muted-foreground">
                Position size, liquidation, P&L, and fees — all in one place
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Inputs */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-5">
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

                <div className="mt-4 space-y-4">
                  {/* Account */}
                  <div className="relative">
                    <Label>Account Balance (USDT)</Label>
                    <div className="relative mt-1">
                      <DollarSign className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        className="pl-3 pr-10 text-left"
                      />
                    </div>
                  </div>

                  {/* Trade Size + Leverage side by side */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Trade Size (USDT)</Label>
                      <div className="relative mt-1">
                        <DollarSign className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          value={tradeSize}
                          onChange={(e) => setTradeSize(e.target.value)}
                          className="pl-3 pr-10 text-left"
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
                          className="pl-3 pr-10 text-left"
                          min="1"
                          max="125"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Entry */}
                  <div>
                    <Label>Entry Price</Label>
                    <Input
                      type="number"
                      value={entry}
                      onChange={(e) => setEntry(e.target.value)}
                      className="mt-1 text-left"
                      placeholder="e.g. 100"
                    />
                  </div>

                  {/* TP + SL */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-emerald-600">Take Profit</Label>
                      <Input
                        type="number"
                        value={tp}
                        onChange={(e) => setTp(e.target.value)}
                        className="mt-1 text-left border-emerald-200"
                        placeholder="e.g. 110"
                      />
                    </div>
                    <div>
                      <Label className="text-destructive">Stop Loss</Label>
                      <Input
                        type="number"
                        value={sl}
                        onChange={(e) => setSl(e.target.value)}
                        className="mt-1 text-left border-red-200"
                        placeholder="e.g. 95"
                      />
                    </div>
                  </div>

                  {/* Fees accordion */}
                  <details className="rounded-lg border border-border bg-secondary/20">
                    <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-medium">
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                      Fees &amp; Slippage
                    </summary>
                    <div className="space-y-3 border-t border-border p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Slippage (%)</Label>
                          <Input
                            type="number"
                            value={slippage}
                            onChange={(e) => setSlippage(e.target.value)}
                            className="mt-1 text-left"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Funding Rate (h8)</Label>
                          <Input
                            type="number"
                            value={fundingRate}
                            onChange={(e) => setFundingRate(e.target.value)}
                            className="mt-1 text-left"
                            step="0.001"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Maker Fee (%)</Label>
                          <Input
                            type="number"
                            value={makerFee}
                            onChange={(e) => setMakerFee(e.target.value)}
                            className="mt-1 text-left"
                            step="0.001"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Taker Fee (%)</Label>
                          <Input
                            type="number"
                            value={takerFee}
                            onChange={(e) => setTakerFee(e.target.value)}
                            className="mt-1 text-left"
                            step="0.001"
                          />
                        </div>
                      </div>
                    </div>
                  </details>

                  <Button onClick={calculate} className="w-full gap-2" size="lg">
                    <Calculator className="h-4 w-4" />
                    Calculate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            {!calculated && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                  <Calculator className="mb-4 h-14 w-14 text-muted-foreground/30" />
                  <h3 className="mb-2 text-xl font-semibold">No calculation yet</h3>
                  <p className="max-w-sm text-muted-foreground">
                    Enter your trade details on the left (account, trade size, leverage,
                    entry, TP, SL) and click <strong>Calculate</strong> to see your
                    position size, liquidation price, P&amp;L, and fees.
                  </p>
                </CardContent>
              </Card>
            )}

            {calculated && (
              <>
            {/* Warning */}
            {isDangerous && (
              <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <div>
                  <strong className="font-semibold">Liquidation Risk!</strong>{' '}
                  Your stop loss is placed{' '}
                  <strong>behind the liquidation price</strong> (
                  {fmt(liqPrice)}). The exchange will close your position
                  before your SL is reached. Move your SL{' '}
                  {direction === 'long' ? 'above' : 'below'} {fmt(liqPrice)}.
                </div>
              </div>
            )}

            {/* Main results grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Position Summary */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                    Position Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Position Value</span>
                      <span className="font-bold">${fmt(posValue)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Quantity</span>
                      <span className="font-bold">{fmt(qty, 4)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Margin Used</span>
                      <span className="font-bold">${fmt(margin)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Leverage</span>
                      <span className="font-bold">{fmt(lev)}x</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Portfolio Used</span>
                      <span className="font-bold">{fmt(positionPct)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Account Risk</span>
                      <span className={cn('font-bold', riskPct > 5 ? 'text-destructive' : 'text-foreground')}>
                        {fmt(riskPct)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Liquidation */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                    <Gauge className="mr-1 inline h-4 w-4" />
                    Liquidation Price
                  </h3>
                  <div
                    className={cn(
                      'mb-3 rounded-xl p-4 text-center',
                      direction === 'long'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-emerald-50 text-emerald-700'
                    )}
                  >
                    <div className="text-2xl font-bold">{fmt(liqPrice)}</div>
                    <div className="text-xs">
                      {direction === 'long'
                        ? 'Price drops below this → liquidation'
                        : 'Price rises above this → liquidation'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Your SL</span>
                    <span className="font-bold">${fmt(slP)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Distance to Liq</span>
                    <span className={cn('font-bold', isDangerous ? 'text-destructive' : 'text-emerald-600')}>
                      {direction === 'long'
                        ? fmt(ent - liqPrice)
                        : fmt(liqPrice - ent)}{' '}
                      ({fmt(direction === 'long' ? ((ent - liqPrice) / ent) * 100 : ((liqPrice - ent) / ent) * 100)}%)
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* P&L at TP */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                    <Target className="mr-1 inline h-4 w-4" />
                    At Take Profit ($
                    {fmt(tpP)})
                  </h3>
                  <div className="mb-2">
                    <div className="text-2xl font-bold text-emerald-600">
                      +${fmt(tpPnl)}
                    </div>
                    <div className="text-sm text-emerald-600">
                      +{fmt(tpPnlPct)}% on margin
                    </div>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Fees</span>
                    <span className="text-destructive">-${fmt(totalFees)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Funding</span>
                    <span className="text-destructive">-${fmt(fundingCost)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Net Profit</span>
                    <span className="text-lg font-bold text-emerald-600">
                      +${fmt(netTpPnl)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* P&L at SL */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                    <Target className="mr-1 inline h-4 w-4" />
                    At Stop Loss ($
                    {fmt(slP)})
                  </h3>
                  <div className="mb-2">
                    <div className="text-2xl font-bold text-destructive">
                      {fmt(slPnl)}
                    </div>
                    <div className="text-sm text-destructive">
                      {fmt(slPnlPct)}% on margin
                    </div>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Fees</span>
                    <span className="text-destructive">-${fmt(totalFees)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Funding</span>
                    <span className="text-destructive">-${fmt(fundingCost)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Net Loss</span>
                    <span className="text-lg font-bold text-destructive">
                      ${fmt(Math.abs(netSlPnl))}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* R:R + Fees Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card
                className={cn(
                  'border-2',
                  rr >= 2
                    ? 'border-emerald-200 bg-emerald-50'
                    : rr >= 1
                      ? 'border-amber-200 bg-amber-50'
                      : 'border-red-200 bg-red-50'
                )}
              >
                <CardContent className="p-5 text-center">
                  <div className="text-sm text-muted-foreground">Risk : Reward</div>
                  <div className="text-3xl font-bold">
                    1 : {fmt(rr, 2)}
                  </div>
                  {rr >= 2 && (
                    <div className="mt-1 text-xs text-emerald-600">Excellent</div>
                  )}
                  {rr >= 1 && rr < 2 && (
                    <div className="mt-1 text-xs text-amber-600">Fair</div>
                  )}
                  {rr < 1 && (
                    <div className="mt-1 text-xs text-red-600">Poor — adjust TP/SL</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5 text-center">
                  <div className="text-sm text-muted-foreground">Total Fees</div>
                  <div className="text-2xl font-bold">${fmt(totalFees)}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Entry ${fmt(entryFee)} + Exit ${fmt(exitFee)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5 text-center">
                  <div className="text-sm text-muted-foreground">Funding Cost (8h)</div>
                  <div className="text-2xl font-bold">${fmt(fundingCost)}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {fund > 0
                      ? direction === 'long'
                        ? 'Long pays → Short'
                        : 'Short pays → Long'
                      : 'No funding cost'}
                  </div>
                </CardContent>
              </Card>
            </div>
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}