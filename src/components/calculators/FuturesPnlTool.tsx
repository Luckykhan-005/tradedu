import { useState } from 'react'
import { ArrowLeftRight, Calculator, TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/cn'
import { fmt, n } from './calcUtils'

type Dir = 'long' | 'short'
type SizeMode = 'coin' | 'usdt'
type Mode = 'normal' | 'open'

const fmtPrice = (v: number) => {
  if (!isFinite(v)) return '—'
  const abs = Math.abs(v)
  const d = abs < 1 ? 6 : abs < 10 ? 4 : abs < 100 ? 3 : 2
  return v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
}

function SizeToggle({ value, onChange }: { value: SizeMode; onChange: (m: SizeMode) => void }) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
      <button
        type="button"
        onClick={() => onChange('coin')}
        className={cn(
          'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
          value === 'coin' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Quantity (Coins)
      </button>
      <button
        type="button"
        onClick={() => onChange('usdt')}
        className={cn(
          'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
          value === 'usdt' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Position Size (USDT)
      </button>
    </div>
  )
}

function DirToggle({ value, onChange }: { value: Dir; onChange: (d: Dir) => void }) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as Dir)}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger
          value="long"
          className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Long (Buy)
        </TabsTrigger>
        <TabsTrigger
          value="short"
          className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
        >
          <TrendingDown className="mr-2 h-4 w-4" />
          Short (Sell)
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <Calculator className="mb-4 h-14 w-14 text-muted-foreground/30" />
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="max-w-sm text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  )
}

export function FuturesPnlTool() {
  const [mode, setMode] = useState<Mode>('normal')

  // ---- Normal PnL state ----
  const [nDir, setNDir] = useState<Dir>('long')
  const [nSize, setNSize] = useState<SizeMode>('coin')
  const [nEntry, setNEntry] = useState('')
  const [nExit, setNExit] = useState('')
  const [nQty, setNQty] = useState('')
  const [nPosSize, setNPosSize] = useState('')
  const [nLev, setNLev] = useState('10')
  const [nFee, setNFee] = useState('0.04')

  // ---- Open Price (reverse) state ----
  const [oDir, setODir] = useState<Dir>('long')
  const [oSize, setOSize] = useState<SizeMode>('coin')
  const [oPnl, setOPnl] = useState('')
  const [oExit, setOExit] = useState('')
  const [oQty, setOQty] = useState('')
  const [oPosSize, setOPosSize] = useState('')
  const [oLev, setOLev] = useState('10')
  const [OFee, setOFee] = useState('0.04')

  // ================= NORMAL CALC =================
  const nEnt = n(nEntry)
  const nExt = n(nExit)
  const nLevNum = n(nLev) || 1
  const nFeePct = n(nFee)

  let nQtyVal = 0
  let nPosVal = 0
  let nReady = nEnt > 0 && nExt > 0
  if (nReady) {
    if (nSize === 'coin') {
      const q = n(nQty)
      if (q <= 0) nReady = false
      else {
        nQtyVal = q
        nPosVal = nEnt * q
      }
    } else {
      const pv = n(nPosSize)
      if (pv <= 0) nReady = false
      else {
        nPosVal = pv
        nQtyVal = pv / nEnt
      }
    }
  }

  const nMargin = nReady ? nPosVal / nLevNum : 0
  const nGross = nReady
    ? nDir === 'long'
      ? (nExt - nEnt) * nQtyVal
      : (nEnt - nExt) * nQtyVal
    : 0
  const nFees = nReady
    ? nPosVal * (nFeePct / 100) + nExt * nQtyVal * (nFeePct / 100)
    : 0
  const nNet = nGross - nFees
  const nRoi = nReady && nMargin > 0 ? (nNet / nMargin) * 100 : 0

  // ================= OPEN PRICE (REVERSE) =================
  const oPnlNum = oPnl.trim() === '' ? NaN : n(oPnl)
  const oExt = n(oExit)
  const oLevNum = n(oLev) || 1
  const oFeePct = n(OFee)

  let oReady = isFinite(oPnlNum) && oExt > 0
  let oEntryPrice = 0
  let oPosVal = 0
  let oFees = 0
  let oInvalid = false

  if (oReady) {
    if (oSize === 'coin') {
      const q = n(oQty)
      if (q <= 0) oReady = false
      else {
        let entry = oDir === 'long' ? oExt - oPnlNum / q : oExt + oPnlNum / q
        for (let i = 0; i < 3; i++) {
          if (entry <= 0) break
          const posVal = entry * q
          const fees = posVal * (oFeePct / 100) + oExt * q * (oFeePct / 100)
          entry =
            oDir === 'long' ? oExt - (oPnlNum + fees) / q : oExt + (oPnlNum + fees) / q
        }
        if (entry <= 0 || !isFinite(entry)) {
          oInvalid = true
        } else {
          oEntryPrice = entry
          oPosVal = entry * q
          oFees = oPosVal * (oFeePct / 100) + oExt * q * (oFeePct / 100)
        }
      }
    } else {
      const ps = n(oPosSize)
      if (ps <= 0) oReady = false
      else {
        const r = oPnlNum / ps
        let guess = oDir === 'long' ? oExt / (1 + r) : oExt / (1 - r)
        if (!isFinite(guess)) guess = -1
        for (let i = 0; i < 5; i++) {
          if (guess <= 0) break
          const q = ps / guess
          const fees = ps * (oFeePct / 100) + oExt * q * (oFeePct / 100)
          const needed = oPnlNum + fees
          if (oDir === 'long') {
            guess = (oExt * ps) / (needed + ps)
          } else {
            if (ps - needed <= 0) {
              guess = -1
              break
            }
            guess = (oExt * ps) / (ps - needed)
          }
        }
        if (guess <= 0 || !isFinite(guess)) {
          oInvalid = true
        } else {
          oEntryPrice = guess
          oPosVal = ps
          const q = ps / guess
          oFees = ps * (oFeePct / 100) + oExt * q * (oFeePct / 100)
        }
      }
    }
  }

  const oMargin = oPosVal / oLevNum
  const oRoi = oMargin > 0 ? (oPnlNum / oMargin) * 100 : 0

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
        <TabsList className="mb-6 grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="normal">Normal PnL</TabsTrigger>
          <TabsTrigger value="open">
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Open Price (Reverse)
          </TabsTrigger>
        </TabsList>

        {/* ==================== NORMAL TAB ==================== */}
        <TabsContent value="normal">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="space-y-4 p-5">
                  <div>
                    <Label className="mb-2 block">Position Type</Label>
                    <DirToggle value={nDir} onChange={setNDir} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Open / Entry Price (USDT)</Label>
                      <Input
                        type="number"
                        value={nEntry}
                        onChange={(e) => setNEntry(e.target.value)}
                        className="mt-1 text-left"
                        placeholder="e.g. 65000"
                      />
                    </div>
                    <div>
                      <Label>Exit / Close Price (USDT)</Label>
                      <Input
                        type="number"
                        value={nExit}
                        onChange={(e) => setNExit(e.target.value)}
                        className="mt-1 text-left"
                        placeholder="e.g. 68000"
                      />
                    </div>
                  </div>
                  <SizeToggle value={nSize} onChange={setNSize} />
                  <div className="grid grid-cols-2 gap-3">
                    {nSize === 'coin' ? (
                      <div>
                        <Label>Quantity (Coins)</Label>
                        <Input
                          type="number"
                          value={nQty}
                          onChange={(e) => setNQty(e.target.value)}
                          className="mt-1 text-left"
                          placeholder="e.g. 0.1"
                        />
                      </div>
                    ) : (
                      <div>
                        <Label>Position Size (USDT)</Label>
                        <Input
                          type="number"
                          value={nPosSize}
                          onChange={(e) => setNPosSize(e.target.value)}
                          className="mt-1 text-left"
                          placeholder="e.g. 500"
                        />
                      </div>
                    )}
                    <div>
                      <Label>Leverage (x)</Label>
                      <Input
                        type="number"
                        value={nLev}
                        onChange={(e) => setNLev(e.target.value)}
                        className="mt-1 text-left"
                        placeholder="10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Fee Rate (%) — optional</Label>
                    <Input
                      type="number"
                      value={nFee}
                      onChange={(e) => setNFee(e.target.value)}
                      className="mt-1 text-left"
                      placeholder="0.04"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              {!nReady ? (
                <EmptyState
                  title="PnL ready nahi"
                  text="Entry, exit aur quantity (ya position size) daalein — net PnL, ROI aur fees foran nikal aayenge."
                />
              ) : (
                <div className="space-y-4">
                  <div
                    className={cn(
                      'rounded-xl border-2 p-6 text-center',
                      nNet >= 0
                        ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/60'
                        : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/60'
                    )}
                  >
                    <div className="text-sm text-muted-foreground">Net PnL (USDT)</div>
                    <div
                      className={cn(
                        'text-4xl font-bold',
                        nNet >= 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-red-600 dark:text-red-400'
                      )}
                    >
                      {nNet >= 0 ? '+' : '−'}${fmt(Math.abs(nNet))}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {nDir === 'long' ? 'Long' : 'Short'} · {nEnt} → {nExt} ×{' '}
                      {fmt(nQtyVal, 4)} qty
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-5 text-center">
                        <div className="text-sm text-muted-foreground">ROI %</div>
                        <div
                          className={cn(
                            'text-3xl font-bold',
                            nNet >= 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-red-600 dark:text-red-400'
                          )}
                        >
                          {nRoi >= 0 ? '+' : '−'}
                          {fmt(Math.abs(nRoi))}%
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Net PnL ÷ Margin
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-5 text-center">
                        <div className="text-sm text-muted-foreground">Initial Margin</div>
                        <div className="text-3xl font-bold">${fmt(nMargin)}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {nLevNum}x leverage par
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-5 text-center">
                        <div className="text-sm text-muted-foreground">Position Value</div>
                        <div className="text-3xl font-bold">${fmt(nPosVal)}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Entry × quantity
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-5 text-center">
                        <div className="text-sm text-muted-foreground">Total Fees</div>
                        <div className="text-3xl font-bold">${fmt(nFees)}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Entry + exit @ {nFeePct}%
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="rounded-xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
                    <strong className="text-foreground">Long</strong> → profit jab Exit &gt;
                    Entry · <strong className="text-foreground">Short</strong> → profit jab
                    Exit &lt; Entry. ROI = (Net PnL ÷ Margin) × 100.
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ==================== OPEN PRICE TAB ==================== */}
        <TabsContent value="open">
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <strong>Reverse Calculator:</strong> Desired PnL + Exit Price + Position Size se
            suitable <strong>Open / Entry Price</strong> nikalta hai — fees adjust karke
            approximate entry milti hai.
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="space-y-4 p-5">
                  <div>
                    <Label className="mb-2 block">Position Type</Label>
                    <DirToggle value={oDir} onChange={setODir} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Desired PnL (USDT)</Label>
                      <Input
                        type="number"
                        value={oPnl}
                        onChange={(e) => setOPnl(e.target.value)}
                        className="mt-1 text-left"
                        placeholder="e.g. 50"
                      />
                    </div>
                    <div>
                      <Label>Exit / Target Price (USDT)</Label>
                      <Input
                        type="number"
                        value={oExit}
                        onChange={(e) => setOExit(e.target.value)}
                        className="mt-1 text-left"
                        placeholder="e.g. 68000"
                      />
                    </div>
                  </div>
                  <SizeToggle value={oSize} onChange={setOSize} />
                  <div className="grid grid-cols-2 gap-3">
                    {oSize === 'coin' ? (
                      <div>
                        <Label>Quantity (Coins)</Label>
                        <Input
                          type="number"
                          value={oQty}
                          onChange={(e) => setOQty(e.target.value)}
                          className="mt-1 text-left"
                          placeholder="e.g. 0.1"
                        />
                      </div>
                    ) : (
                      <div>
                        <Label>Position Size (USDT)</Label>
                        <Input
                          type="number"
                          value={oPosSize}
                          onChange={(e) => setOPosSize(e.target.value)}
                          className="mt-1 text-left"
                          placeholder="e.g. 500"
                        />
                      </div>
                    )}
                    <div>
                      <Label>Leverage (x)</Label>
                      <Input
                        type="number"
                        value={oLev}
                        onChange={(e) => setOLev(e.target.value)}
                        className="mt-1 text-left"
                        placeholder="10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Fee Rate (%) — optional</Label>
                    <Input
                      type="number"
                      value={OFee}
                      onChange={(e) => setOFee(e.target.value)}
                      className="mt-1 text-left"
                      placeholder="0.04"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              {!oReady ? (
                <EmptyState
                  title="Entry price ready nahi"
                  text="Desired PnL, exit price aur quantity (ya position size) daalein — required entry price nikal aayega."
                />
              ) : oInvalid ? (
                <EmptyState
                  title="Invalid"
                  text="PnL itna zyada hai ke entry price 0 se neeche chali jaye — desired PnL kam karein."
                />
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border-2 border-primary/40 bg-primary/5 p-6 text-center">
                    <div className="text-sm text-muted-foreground">
                      Required Open / Entry Price
                    </div>
                    <div className="text-4xl font-bold text-primary">
                      ${fmtPrice(oEntryPrice)}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {oDir === 'long' ? 'Long' : 'Short'} · target ${fmt(oPnlNum)} profit
                      par
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-5 text-center">
                        <div className="text-sm text-muted-foreground">Initial Margin</div>
                        <div className="text-3xl font-bold">${fmt(oMargin)}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {oLevNum}x leverage par
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-5 text-center">
                        <div className="text-sm text-muted-foreground">ROI %</div>
                        <div
                          className={cn(
                            'text-3xl font-bold',
                            oRoi >= 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-red-600 dark:text-red-400'
                          )}
                        >
                          {oRoi >= 0 ? '+' : '−'}
                          {fmt(Math.abs(oRoi))}%
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Desired PnL ÷ Margin
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-5 text-center">
                        <div className="text-sm text-muted-foreground">Position Value</div>
                        <div className="text-3xl font-bold">${fmt(oPosVal)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-5 text-center">
                        <div className="text-sm text-muted-foreground">Est. Fees</div>
                        <div className="text-3xl font-bold">${fmt(oFees)}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="rounded-xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
                    Desired profit ke liye aapko kis price par position open karni chahiye —
                    fees adjust karke approximate entry dikhai gayi hai.
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
