import { useState } from 'react'
import {
  Calculator,
  DollarSign,
  Percent,
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/cn'

export function RiskCalculator() {
  const [accountSize, setAccountSize] = useState('10000')
  const [riskPercent, setRiskPercent] = useState('1')
  const [entryPrice, setEntryPrice] = useState('')
  const [stopPrice, setStopPrice] = useState('')
  const [positionSize, setPositionSize] = useState('')
  const [result, setResult] = useState<null | {
    riskAmount: number
    positionUnits: number
    positionValue: number
    stopDistance: number
    riskReward: number
  }>(null)
  const [error, setError] = useState('')

  const calculate = () => {
    setError('')
    const acct = parseFloat(accountSize)
    const riskPct = parseFloat(riskPercent)
    const entry = parseFloat(entryPrice)
    const stop = parseFloat(stopPrice)

    if (!acct || acct <= 0) return setError('Enter a valid account size')
    if (!riskPct || riskPct <= 0) return setError('Enter a valid risk percentage')
    if (!entry || entry <= 0) return setError('Enter a valid entry price')
    if (!stop || stop <= 0) return setError('Enter a valid stop loss price')
    if (entry === stop) return setError('Entry and stop loss cannot be equal')

    const riskAmount = (acct * riskPct) / 100
    const stopDistance = Math.abs(entry - stop)
    const units = riskAmount / stopDistance
    const positionValue = units * entry

    setResult({
      riskAmount,
      positionUnits: units,
      positionValue,
      stopDistance,
      riskReward: 0,
    })
  }

  const calculateRR = () => {
    const entry = parseFloat(entryPrice)
    const stop = parseFloat(stopPrice)
    const target = parseFloat(positionSize)
    if (!entry || !stop || !target) return
    const risk = Math.abs(entry - stop)
    const reward = Math.abs(target - entry)
    if (risk === 0) return
    setResult((prev) =>
      prev
        ? { ...prev, riskReward: Number((reward / risk).toFixed(2)) }
        : prev
    )
  }

  const isLong = entryPrice && stopPrice ? parseFloat(entryPrice) > parseFloat(stopPrice) : true

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Risk Calculator</h1>
              <p className="text-muted-foreground">
                Position sizing &amp; risk-reward calculator — protect your capital with proper position sizing
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="space-y-5 p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="account">Account Size (USD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="account"
                      type="number"
                      value={accountSize}
                      onChange={(e) => setAccountSize(e.target.value)}
                      className="pl-3 pr-10 text-left"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="risk">Risk per Trade (%)</Label>
                  <div className="relative">
                    <Percent className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="risk"
                      type="number"
                      value={riskPercent}
                      onChange={(e) => setRiskPercent(e.target.value)}
                      className="pl-3 pr-10 text-left"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="entry">Entry Price</Label>
                  <Input
                    id="entry"
                    type="number"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(e.target.value)}
                    placeholder="e.g. 60000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stop">Stop Loss Price</Label>
                  <Input
                    id="stop"
                    type="number"
                    value={stopPrice}
                    onChange={(e) => setStopPrice(e.target.value)}
                    placeholder="e.g. 59000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">
                  Take Profit Price <span className="text-muted-foreground">(for R:R)</span>
                </Label>
                <Input
                  id="target"
                  type="number"
                  value={positionSize}
                  onChange={(e) => setPositionSize(e.target.value)}
                  placeholder="e.g. 62000"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button onClick={calculate} className="flex-1 gap-2">
                  <Calculator className="h-4 w-4" />
                  Calculate
                </Button>
                <Button variant="outline" onClick={calculateRR} className="gap-2">
                  <Target className="h-4 w-4" />
                  R:R
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Position Size Results</h2>

              {result ? (
                <div className="space-y-4">
                  <div
                    className={cn(
                      'flex items-center gap-3 rounded-xl border p-4',
                      isLong
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-red-200 bg-red-50'
                    )}
                  >
                    {isLong ? (
                      <TrendingUp className="h-8 w-8 text-emerald-600" />
                    ) : (
                      <TrendingDown className="h-8 w-8 text-red-600" />
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isLong ? 'Long Position (Buy)' : 'Short Position (Sell)'}
                      </p>
                      <p className="text-lg font-bold">
                        Stop Distance: {result.stopDistance.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-secondary/50 p-4">
                      <p className="text-sm text-muted-foreground">Risk Amount</p>
                      <p className="text-xl font-bold text-destructive">
                        ${result.riskAmount.toFixed(2)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-4">
                      <p className="text-sm text-muted-foreground">Position Value</p>
                      <p className="text-xl font-bold">${result.positionValue.toFixed(2)}</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-4">
                      <p className="text-sm text-muted-foreground">Units / Quantity</p>
                      <p className="text-xl font-bold">{result.positionUnits.toFixed(6)}</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-4">
                      <p className="text-sm text-muted-foreground">Risk : Reward</p>
                      <p
                        className={cn(
                          'text-xl font-bold',
                          result.riskReward >= 2
                            ? 'text-emerald-600'
                            : result.riskReward >= 1
                              ? 'text-amber-600'
                              : 'text-destructive'
                        )}
                      >
                        {result.riskReward > 0 ? `1 : ${result.riskReward}` : '—'}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-primary/5 p-4 text-sm text-muted-foreground">
                    <strong className="text-foreground">Formula:</strong> Position Size =
                    (Account × Risk%) ÷ (Entry − Stop). If stop loss hits, you lose exactly{' '}
                    <strong className="text-destructive">${result.riskAmount.toFixed(2)}</strong>.
                  </div>
                </div>
              ) : (
                <div className="flex h-64 flex-col items-center justify-center text-center text-muted-foreground">
                  <Calculator className="mb-4 h-12 w-12 opacity-40" />
                  <p className="max-w-xs">
                    Enter your account size, risk percentage, entry, and stop loss to calculate
                    the correct position size.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="mb-3 font-semibold">Risk Management Rules</h3>
            <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
              <li>Risk only <strong className="text-foreground">1-2%</strong> of your account per trade</li>
              <li>Always use a stop loss — never remove it once placed</li>
              <li>Aim for a minimum <strong className="text-foreground">1:2 risk-reward ratio</strong></li>
              <li>Stop daily losses at 3% — take a break</li>
              <li>Never revenge trade after a loss</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
