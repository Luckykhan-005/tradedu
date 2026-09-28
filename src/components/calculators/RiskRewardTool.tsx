import { useState } from 'react'
import { Calculator, TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/cn'
import { fmt, n } from './calcUtils'

export function RiskRewardTool() {
  const [direction, setDirection] = useState<'long' | 'short'>('long')
  const [entry, setEntry] = useState('')
  const [sl, setSl] = useState('')
  const [tp, setTp] = useState('')

  const ent = n(entry)
  const slP = n(sl)
  const tpP = n(tp)

  const valid =
    ent > 0 &&
    slP > 0 &&
    tpP > 0 &&
    (direction === 'long' ? slP < ent && tpP > ent : slP > ent && tpP < ent)

  const risk = valid ? Math.abs(ent - slP) : 0
  const reward = valid ? Math.abs(tpP - ent) : 0
  const rr = risk > 0 ? reward / risk : 0
  const requiredWin = rr > 0 ? 100 / (1 + rr) : 0

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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-destructive">Stop Loss</Label>
                    <Input
                      type="number"
                      value={sl}
                      onChange={(e) => setSl(e.target.value)}
                      className="mt-1 text-left border-red-200"
                      placeholder={direction === 'long' ? 'below entry' : 'above entry'}
                    />
                  </div>
                  <div>
                    <Label className="text-emerald-600">Take Profit</Label>
                    <Input
                      type="number"
                      value={tp}
                      onChange={(e) => setTp(e.target.value)}
                      className="mt-1 text-left border-emerald-200"
                      placeholder={direction === 'long' ? 'above entry' : 'below entry'}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {!valid ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Calculator className="mb-4 h-14 w-14 text-muted-foreground/30" />
                <h3 className="mb-2 text-xl font-semibold">R:R calculate nahi hua</h3>
                <p className="max-w-sm text-muted-foreground">
                  {direction === 'long'
                    ? 'Long mein SL entry se neeche aur TP entry se ooper hona chahiye.'
                    : 'Short mein SL entry se ooper aur TP entry se neeche hona chahiye.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div
                className={cn(
                  'rounded-xl border-2 p-6 text-center',
                  rr >= 2
                    ? 'border-emerald-200 bg-emerald-50'
                    : rr >= 1
                      ? 'border-amber-200 bg-amber-50'
                      : 'border-red-200 bg-red-50'
                )}
              >
                <div className="text-sm text-muted-foreground">Risk : Reward</div>
                <div className="text-4xl font-bold">1 : {fmt(rr, 2)}</div>
                <div
                  className={cn(
                    'mt-1 text-sm font-medium',
                    rr >= 2
                      ? 'text-emerald-600'
                      : rr >= 1
                        ? 'text-amber-600'
                        : 'text-red-600'
                  )}
                >
                  {rr >= 2
                    ? 'Excellent — solid setup'
                    : rr >= 1
                      ? 'Fair — 1:1 se ooper hai'
                      : 'Poor — TP ko baraain ya SL qareeb karein'}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card>
                  <CardContent className="p-5 text-center">
                    <div className="text-sm text-muted-foreground">Required Win Rate</div>
                    <div className="text-3xl font-bold">{fmt(requiredWin, 1)}%</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Itni trades sahi hon to break-even ya profit
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5 text-center">
                    <div className="text-sm text-muted-foreground">Risk vs Reward</div>
                    <div className="text-3xl font-bold">
                      ${fmt(risk)} → ${fmt(reward)}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Per unit — SL hit par itna loss, TP par itna profit
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
                <strong className="text-foreground">Rule:</strong> minimum 1:2 R:R par
                kamaane wale trades loss wale se baray hote hain — isi liye 40% win rate se
                bhi account grow hota hai.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
