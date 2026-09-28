import { useState } from 'react'
import { Calculator, DollarSign, Percent, TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/cn'
import { fmt, n } from './calcUtils'

export function PositionSizeTool() {
  const [balance, setBalance] = useState('')
  const [riskPct, setRiskPct] = useState('1')
  const [entry, setEntry] = useState('')
  const [sl, setSl] = useState('')

  const bal = n(balance)
  const risk = n(riskPct)
  const ent = n(entry)
  const slP = n(sl)

  const distance = Math.abs(ent - slP)
  const ready = bal > 0 && risk > 0 && ent > 0 && slP > 0 && distance > 0

  const riskAmount = (bal * risk) / 100
  const qty = ready ? riskAmount / distance : 0
  const positionSize = qty * ent
  const slDistPct = ready ? (distance / ent) * 100 : 0

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="space-y-4 p-5">
              <div>
                <Label>Account Balance (USDT)</Label>
                <div className="relative mt-1">
                  <DollarSign className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    className="pr-10 text-left"
                    placeholder="e.g. 1000"
                  />
                </div>
              </div>
              <div>
                <Label>Risk Per Trade (%)</Label>
                <div className="relative mt-1">
                  <Percent className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={riskPct}
                    onChange={(e) => setRiskPct(e.target.value)}
                    className="pr-10 text-left"
                    step="0.1"
                    placeholder="e.g. 1"
                  />
                </div>
              </div>
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
              <div>
                <Label className="text-destructive">Stop Loss Price</Label>
                <Input
                  type="number"
                  value={sl}
                  onChange={(e) => setSl(e.target.value)}
                  className="mt-1 text-left border-red-200"
                  placeholder="e.g. 95"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {!ready ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Calculator className="mb-4 h-14 w-14 text-muted-foreground/30" />
                <h3 className="mb-2 text-xl font-semibold">Position size ready nahi</h3>
                <p className="max-w-sm text-muted-foreground">
                  Account balance, risk %, entry aur stop loss daalein — sahi trade size
                  foran nikal aayega.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div
                className={cn(
                  'rounded-xl border-2 p-5 text-center',
                  risk > 5
                    ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/60'
                    : 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/60'
                )}
              >
                <div className="text-sm text-muted-foreground">Trade Size (Position Value)</div>
                <div className="text-3xl font-bold">${fmt(positionSize)}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {fmt(qty, 4)} units × entry {fmt(ent)}
                </div>
              </div>

              <Card>
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Risk Amount</span>
                    <span className="font-bold text-destructive">−${fmt(riskAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Risk of Account</span>
                    <span
                      className={cn(
                        'font-bold',
                        risk > 5 ? 'text-destructive' : 'text-foreground'
                      )}
                    >
                      {fmt(risk, 2)}%
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Quantity</span>
                    <span className="font-bold">{fmt(qty, 4)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Stop Loss Distance</span>
                    <span className="font-bold">
                      {fmt(distance)} ({fmt(slDistPct)}%)
                    </span>
                  </div>
                </CardContent>
              </Card>

              {risk > 5 && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300">
                  <TrendingDown className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <strong>{fmt(risk)}% risk</strong> zyada hai — professional traders 1-2%
                    se upar nahi jaate. 3 losing streaks mein account aadha ho sakta hai.
                  </span>
                </div>
              )}
              {risk <= 2 && risk > 0 && (
                <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <TrendingUp className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Disciplined risk — 1% par agar 10 trades loss hon to sirf 10% gaya.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
