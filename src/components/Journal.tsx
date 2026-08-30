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
import { api } from '@/lib/api'
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
      const res = await fetch(api('/api/journal'), {
        headers: { 'x-user-email': user.email },
      })
      const data = await res.json()
      setEntries(data.entries || [])
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
    const url = editingId ? api(`/api/journal/${editingId}`) : api('/api/journal')
    const method = editingId ? 'PATCH' : 'POST'
    const body = {
      pair: form.pair,
      direction: form.direction,
      entry: form.entry,
      exit: form.exit,
      stopLoss: form.stopLoss,
      takeProfit: form.takeProfit,
      size: form.size,
      setup: form.setup,
      notes: form.notes,
      pnl: form.exit ? String((parseFloat(form.exit) - parseFloat(form.entry)) * (form.direction === 'long' ? 1 : -1)) : '',
    }
    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-user-email': user.email },
        body: JSON.stringify(body),
      })
      setShowForm(false)
      fetchEntries()
    } catch (err) {
      console.error(err)
    }
  }

  const remove = async (id: string) => {
    try {
      await fetch(api(`/api/journal/${id}`), { method: 'DELETE' })
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
