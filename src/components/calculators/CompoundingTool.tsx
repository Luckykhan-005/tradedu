import { useState } from 'react'
import { Calculator, PiggyBank, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { fmt, n } from './calcUtils'

export function CompoundingTool() {
  const [initial, setInitial] = useState('')
  const [monthly, setMonthly] = useState('')
  const [annualPct, setAnnualPct] = useState('20')
  const [years, setYears] = useState('5')

  const init = n(initial)
  const mon = n(monthly)
  const rate = n(annualPct) / 100
  const yr = Math.min(40, Math.max(1, Math.round(n(years))))

  const ready = init >= 0 && rate > 0 && yr >= 1 && (init > 0 || mon > 0)

  interface YearRow {
    year: number
    balance: number
    contributed: number
  }
  const rows: YearRow[] = []
  let balance = init
  let contributed = init
  if (ready) {
    for (let y = 1; y <= yr; y++) {
      for (let m = 0; m < 12; m++) {
        balance += mon
        contributed += mon
        balance *= 1 + rate / 12
      }
      rows.push({ year: y, balance, contributed })
    }
  }

  const finalBalance = rows.length ? rows[rows.length - 1].balance : 0
  const totalContributed = rows.length ? rows[rows.length - 1].contributed : 0
  const interest = finalBalance - totalContributed

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="space-y-4 p-5">
              <div>
                <Label>Initial Deposit (USDT)</Label>
                <Input
                  type="number"
                  value={initial}
                  onChange={(e) => setInitial(e.target.value)}
                  className="mt-1 text-left"
                  placeholder="e.g. 500"
                />
              </div>
              <div>
                <Label>Monthly Deposit (USDT)</Label>
                <Input
                  type="number"
                  value={monthly}
                  onChange={(e) => setMonthly(e.target.value)}
                  className="mt-1 text-left"
                  placeholder="e.g. 100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Annual Return (%)</Label>
                  <Input
                    type="number"
                    value={annualPct}
                    onChange={(e) => setAnnualPct(e.target.value)}
                    className="mt-1 text-left"
                    step="1"
                    placeholder="e.g. 20"
                  />
                </div>
                <div>
                  <Label>Years</Label>
                  <Input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    className="mt-1 text-left"
                    min="1"
                    max="40"
                  />
                </div>
              </div>
              <div className="rounded-lg border border-border bg-secondary/20 p-3 text-xs text-muted-foreground">
                Monthly compounding assume kiya gaya hai — har mahine deposit + return
                balance mein add hota hai.
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {!ready ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Calculator className="mb-4 h-14 w-14 text-muted-foreground/30" />
                <h3 className="mb-2 text-xl font-semibold">Deposit daalein</h3>
                <p className="max-w-sm text-muted-foreground">
                  Initial ya monthly deposit aur return % ke sath compounding ka asar foran
                  dikhega.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-6 text-center">
                <div className="text-sm text-muted-foreground">
                  Final Balance After {yr} {yr === 1 ? 'Year' : 'Years'}
                </div>
                <div className="text-4xl font-bold text-emerald-700">
                  ${fmt(finalBalance)}
                </div>
                <div className="mt-1 text-sm text-emerald-700">
                  +${fmt(interest)} compounding profit
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card>
                  <CardContent className="p-5 text-center">
                    <div className="text-sm text-muted-foreground">Total Deposited</div>
                    <div className="text-3xl font-bold">${fmt(totalContributed)}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Aapki asli jeb se nikla paisa
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5 text-center">
                    <div className="text-sm text-muted-foreground">Interest Earned</div>
                    <div className="text-3xl font-bold text-emerald-600">
                      ${fmt(interest)}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {totalContributed > 0
                        ? `Deposit ka ${fmt((interest / totalContributed) * 100)}% extra`
                        : 'Compound interest se'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    Year-by-Year Growth
                  </h3>
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-background text-muted-foreground">
                        <tr>
                          <th className="pb-2 text-left font-medium">Year</th>
                          <th className="pb-2 text-right font-medium">Deposited</th>
                          <th className="pb-2 text-right font-medium">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((r) => (
                          <tr key={r.year} className="border-t border-border">
                            <td className="py-2">{r.year}</td>
                            <td className="py-2 text-right text-muted-foreground">
                              ${fmt(r.contributed)}
                            </td>
                            <td className="py-2 text-right font-semibold">
                              ${fmt(r.balance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <PiggyBank className="h-4 w-4" />
                    Real trading returns consistent nahi hote — losses ke saal bhi aate hain.
                    Conservative 10-15% return par plan karein.
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
