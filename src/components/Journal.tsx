import { useState, useEffect, useCallback } from 'react'
import {
  NotebookPen,
  Plus,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  X,
  Save,
  Search,
  BarChart3,
} from 'lucide-react'
import { journalList, journalCreate, journalUpdate, journalDelete } from '@/lib/journal'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/cn'

interface JournalEntry {
  id: string
  pair: string
  direction: 'long' | 'short'
  entry: number
  exit: number | null
  stopLoss: number | null
  takeProfit: number | null
  size: number | null
  setup: string
  notes: string
  pnl: number | null
  date: string
}

interface JournalProps {
  user: { email: string; name?: string } | null
  onSignIn: () => void
}

const emptyForm = {
  pair: 'BTC/USDT',
  direction: 'long' as 'long' | 'short',
  entry: '',
  exit: '',
  stopLoss: '',
  takeProfit: '',
  size: '',
  setup: '',
  notes: '',
}

export function Journal({ user, onSignIn }: JournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState('')

  const fetchEntries = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { entries: list, error } = await journalList()
      setEntries(error ? [] : list || [])
    } catch {
      setEntries([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <NotebookPen className="mb-4 h-14 w-14 text-primary" />
        <h1 className="mb-2 text-2xl font-bold">Trading Journal</h1>
        <p className="mb-6 text-muted-foreground">
          Track your trades, learn from your mistakes, and improve your trading. Sign in to start journaling.
        </p>
        <Button onClick={onSignIn}>Sign In</Button>
      </div>
    )
  }

  const filtered = entries.filter(
    (e) =>
      e.pair.toLowerCase().includes(search.toLowerCase()) ||
      (e.setup || '').toLowerCase().includes(search.toLowerCase())
  )

  const totalPnl = entries.reduce((acc, e) => acc + (e.pnl || 0), 0)
  const winCount = entries.filter((e) => (e.pnl || 0) > 0).length
  const winRate = entries.length > 0 ? Math.round((winCount / entries.length) * 100) : 0

  // ---- Analytics (sirf closed trades par) ----
  const closed = entries.filter((e) => e.pnl != null)
  const wins = closed.filter((e) => (e.pnl as number) > 0)
  const losses = closed.filter((e) => (e.pnl as number) < 0)
  const winSum = wins.reduce((a, e) => a + (e.pnl as number), 0)
  const lossSum = losses.reduce((a, e) => a + (e.pnl as number), 0)
  const avgWin = wins.length ? winSum / wins.length : 0
  const avgLoss = losses.length ? lossSum / losses.length : 0
  const profitFactor =
    closed.length === 0 || (lossSum === 0 && winSum === 0)
      ? null
      : lossSum === 0
        ? Infinity
        : winSum === 0
          ? 0
          : winSum / Math.abs(lossSum)
  const bestTrade = closed.length ? Math.max(...closed.map((e) => e.pnl as number)) : 0
  const worstTrade = closed.length ? Math.min(...closed.map((e) => e.pnl as number)) : 0

  const byDate = [...closed].sort((a, b) => (a.date || '').localeCompare(b.date || ''))
  let streak = 0
  let streakKind: 'win' | 'loss' | 'flat' | null = null
  for (let i = byDate.length - 1; i >= 0; i--) {
    const p = byDate[i].pnl as number
    const kind = p > 0 ? 'win' : p < 0 ? 'loss' : 'flat'
    if (streakKind === null) {
      streakKind = kind
      streak = 1
    } else if (kind === streakKind && kind !== 'flat') {
      streak++
    } else break
  }

  // Equity curve: cumulative P&L trade-by-trade
  const equity: number[] = []
  byDate.reduce((acc, e) => {
    const next = acc + (e.pnl as number)
    equity.push(next)
    return next
  }, 0)
  const eqMin = Math.min(0, ...equity)
  const eqMax = Math.max(0, ...equity)
  const eqRange = eqMax - eqMin || 1
  const EQ_W = 600
  const EQ_H = 150
  const eqPoints = equity
    .map((v, i) => {
      const x = equity.length > 1 ? (i / (equity.length - 1)) * EQ_W : EQ_W / 2
      const y = EQ_H - ((v - eqMin) / eqRange) * EQ_H
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  const zeroY = (0 - eqMin) / eqRange * EQ_H
  const finalEquity = equity.length ? equity[equity.length - 1] : 0

  // Direction breakdown
  const dirs = (['long', 'short'] as const).map((d) => {
    const list = entries.filter((e) => e.direction === d && e.pnl != null)
    return {
      d,
      count: list.length,
      pnl: list.reduce((a, e) => a + (e.pnl as number), 0),
      winRate: list.length ? Math.round((list.filter((e) => (e.pnl as number) > 0).length / list.length) * 100) : null,
    }
  })

  // Setup breakdown (top 5 by trade count)
  const setupMap = new Map<string, { count: number; pnl: number; wins: number }>()
  for (const e of closed) {
    const key = (e.setup || '').trim() || 'No setup'
    const s = setupMap.get(key) ?? { count: 0, pnl: 0, wins: 0 }
    s.count++
    s.pnl += e.pnl as number
    if ((e.pnl as number) > 0) s.wins++
    setupMap.set(key, s)
  }
  const setups = [...setupMap.entries()]
    .map(([name, s]) => ({ name, ...s, winRate: Math.round((s.wins / s.count) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  const setupMaxPnl = Math.max(1, ...setups.map((s) => Math.abs(s.pnl)))

  const openForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (entry: JournalEntry) => {
    setEditingId(entry.id)
    setForm({
      pair: entry.pair,
      direction: entry.direction,
      entry: String(entry.entry),
      exit: entry.exit != null ? String(entry.exit) : '',
      stopLoss: entry.stopLoss != null ? String(entry.stopLoss) : '',
      takeProfit: entry.takeProfit != null ? String(entry.takeProfit) : '',
      size: entry.size != null ? String(entry.size) : '',
      setup: entry.setup || '',
      notes: entry.notes || '',
    })
    setShowForm(true)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    const input = {
      pair: form.pair,
      direction: form.direction,
      entry: form.entry,
      exit: form.exit,
      stopLoss: form.stopLoss,
      takeProfit: form.takeProfit,
      size: form.size,
      setup: form.setup,
      notes: form.notes,
      pnl: form.exit
        ? String(
            (parseFloat(form.exit) - parseFloat(form.entry)) *
              (form.direction === 'long' ? 1 : -1)
          )
        : '',
    }
    try {
      const { error } = editingId ? await journalUpdate(editingId, input) : await journalCreate(input)
      if (error) {
        console.error(error)
        return
      }
      setShowForm(false)
      fetchEntries()
    } catch (err) {
      console.error(err)
    }
  }

  const remove = async (id: string) => {
    if (!user) return
    try {
      await journalDelete(id)
      fetchEntries()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <NotebookPen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Trading Journal</h1>
              <p className="text-muted-foreground">
                Record every trade — the fastest way to become a better trader
              </p>
            </div>
          </div>
          <Button onClick={openForm} className="gap-2">
            <Plus className="h-4 w-4" />
            New Entry
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">{entries.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">{winRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">Total P&amp;L</p>
                <p className={cn('text-2xl font-bold', totalPnl >= 0 ? 'text-emerald-600' : 'text-destructive')}>
                  {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-destructive" />
            </CardContent>
          </Card>
        </div>

        {/* Analytics */}
        {closed.length >= 1 && (
          <div className="mb-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Performance Analytics</h2>
              <p className="text-sm text-muted-foreground">
                Closed trades ke basis par — kamai, galtiyan aur konsa setup chala
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Avg Win</p>
                  <p className="text-lg font-bold text-emerald-600">+${avgWin.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Avg Loss</p>
                  <p className="text-lg font-bold text-destructive">${avgLoss.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Profit Factor</p>
                  <p
                    className={cn(
                      'text-lg font-bold',
                      profitFactor === null || profitFactor >= 1 ? 'text-emerald-600' : 'text-destructive'
                    )}
                  >
                    {profitFactor === null ? '—' : profitFactor === Infinity ? '∞' : profitFactor.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Best / Worst</p>
                  <p className="text-lg font-bold">
                    <span className="text-emerald-600">+${bestTrade.toFixed(0)}</span>
                    <span className="mx-1 text-muted-foreground">/</span>
                    <span className="text-destructive">${worstTrade.toFixed(0)}</span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Streak</p>
                  <p
                    className={cn(
                      'text-lg font-bold',
                      streakKind === 'win' ? 'text-emerald-600' : streakKind === 'loss' ? 'text-destructive' : ''
                    )}
                  >
                    {streak > 0 && streakKind !== 'flat' && streakKind !== null
                      ? `${streak}${streakKind === 'win' ? 'W' : 'L'}`
                      : '—'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Closed / Open</p>
                  <p className="text-lg font-bold">
                    {closed.length}
                    <span className="mx-1 text-muted-foreground">/</span>
                    {entries.length - closed.length}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {/* Equity curve */}
              <Card className="lg:col-span-2">
                <CardContent className="p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Equity Curve — Cumulative P&amp;L</h3>
                    <span
                      className={cn('text-sm font-bold', finalEquity >= 0 ? 'text-emerald-600' : 'text-destructive')}
                    >
                      {finalEquity >= 0 ? '+' : ''}${finalEquity.toFixed(2)}
                    </span>
                  </div>
                  {equity.length >= 2 ? (
                    <svg viewBox={`0 0 ${EQ_W} ${EQ_H}`} className="h-40 w-full" preserveAspectRatio="none">
                      <line
                        x1="0"
                        y1={zeroY}
                        x2={EQ_W}
                        y2={zeroY}
                        stroke="currentColor"
                        className="text-muted-foreground/40"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                      <polyline
                        points={eqPoints}
                        fill="none"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        className={finalEquity >= 0 ? 'stroke-emerald-500' : 'stroke-red-500'}
                      />
                    </svg>
                  ) : (
                    <p className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                      Kam se kam 2 closed trades par equity curve banega
                    </p>
                  )}
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>First trade</span>
                    <span>{equity.length} trades</span>
                  </div>
                </CardContent>
              </Card>

              {/* Direction + setups */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="mb-3 text-sm font-semibold">Long vs Short</h3>
                  <div className="space-y-3">
                    {dirs.map((d) => (
                      <div key={d.d} className="flex items-center justify-between">
                        <div>
                          <Badge variant={d.d === 'long' ? 'default' : 'destructive'} className="capitalize">
                            {d.d}
                          </Badge>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {d.count} trades{d.winRate !== null && ` · ${d.winRate}% win`}
                          </span>
                        </div>
                        <span
                          className={cn(
                            'text-sm font-bold',
                            d.pnl >= 0 ? 'text-emerald-600' : 'text-destructive'
                          )}
                        >
                          {d.pnl >= 0 ? '+' : ''}${d.pnl.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <h3 className="mb-3 text-sm font-semibold">Setup Performance</h3>
                  <div className="space-y-3">
                    {setups.length === 0 && (
                      <p className="text-sm text-muted-foreground">Setup likh kar trades log karein.</p>
                    )}
                    {setups.map((s) => (
                      <div key={s.name}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="truncate pr-2">{s.name}</span>
                          <span
                            className={cn('shrink-0 font-medium', s.pnl >= 0 ? 'text-emerald-600' : 'text-destructive')}
                          >
                            {s.pnl >= 0 ? '+' : ''}${s.pnl.toFixed(2)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn('h-full rounded-full', s.pnl >= 0 ? 'bg-emerald-500' : 'bg-red-500')}
                              style={{ width: `${Math.max(6, (Math.abs(s.pnl) / setupMaxPnl) * 100)}%` }}
                            />
                          </div>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {s.count} · {s.winRate}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {editingId ? 'Edit Entry' : 'New Journal Entry'}
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Pair</Label>
                  <Input
                    value={form.pair}
                    onChange={(e) => setForm({ ...form, pair: e.target.value })}
                    placeholder="BTC/USDT"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Direction</Label>
                  <Select
                    value={form.direction}
                    onValueChange={(v) => setForm({ ...form, direction: v as 'long' | 'short' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="long">Long (Buy)</SelectItem>
                      <SelectItem value="short">Short (Sell)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Setup Type</Label>
                  <Input
                    value={form.setup}
                    onChange={(e) => setForm({ ...form, setup: e.target.value })}
                    placeholder="e.g. Support + Engulfing"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Entry Price</Label>
                  <Input
                    type="number"
                    step="any"
                    value={form.entry}
                    onChange={(e) => setForm({ ...form, entry: e.target.value })}
                    placeholder="60000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Exit Price</Label>
                  <Input
                    type="number"
                    step="any"
                    value={form.exit}
                    onChange={(e) => setForm({ ...form, exit: e.target.value })}
                    placeholder="62000 (optional)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stop Loss</Label>
                  <Input
                    type="number"
                    step="any"
                    value={form.stopLoss}
                    onChange={(e) => setForm({ ...form, stopLoss: e.target.value })}
                    placeholder="59000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Take Profit</Label>
                  <Input
                    type="number"
                    step="any"
                    value={form.takeProfit}
                    onChange={(e) => setForm({ ...form, takeProfit: e.target.value })}
                    placeholder="64000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Position Size</Label>
                  <Input
                    type="number"
                    step="any"
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    placeholder="0.1"
                  />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label>Notes</Label>
                  <Input
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="What did you learn?"
                  />
                </div>
                <div className="flex gap-3 md:col-span-3">
                  <Button type="submit" className="gap-2">
                    <Save className="h-4 w-4" />
                    {editingId ? 'Save Changes' : 'Add Entry'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by pair or setup..."
            className="pl-3 pr-10"
          />
        </div>

        {/* Entries list */}
        {loading ? (
          <p className="py-16 text-center text-muted-foreground">Loading journal...</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <NotebookPen className="mb-4 h-12 w-12 opacity-40" />
            <p className="mb-2 text-lg">
              {entries.length === 0 ? 'No journal entries yet' : 'No matching entries'}
            </p>
            {entries.length === 0 && (
              <Button variant="outline" onClick={openForm} className="mt-2">
                Add your first trade
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((entry) => (
              <Card key={entry.id}>
                <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg',
                        entry.direction === 'long' ? 'bg-emerald-50' : 'bg-red-50'
                      )}
                    >
                      {entry.direction === 'long' ? (
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{entry.pair}</h3>
                        <Badge
                          variant={entry.direction === 'long' ? 'default' : 'destructive'}
                          className="capitalize"
                        >
                          {entry.direction}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Entry: ${entry.entry}
                        {entry.exit != null && ` → Exit: $${entry.exit}`}
                        {entry.setup && ` | Setup: ${entry.setup}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {entry.pnl != null && (
                      <span
                        className={cn(
                          'text-lg font-bold',
                          entry.pnl >= 0 ? 'text-emerald-600' : 'text-destructive'
                        )}
                      >
                        {entry.pnl >= 0 ? '+' : ''}${entry.pnl.toFixed(2)}
                      </span>
                    )}
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(entry)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(entry.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
