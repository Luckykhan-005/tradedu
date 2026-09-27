import { supabase } from './supabase'

// Trading Journal — Supabase-backed CRUD (replaces dead Shogo /api/journal).

export interface JournalEntry {
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

export interface JournalInput {
  pair: string
  direction: 'long' | 'short'
  entry: string
  exit: string
  stopLoss: string
  takeProfit: string
  size: string
  setup: string
  notes: string
  pnl: string
}

const num = (v: string): number | null => {
  if (!v) return null
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : null
}

const toRow = (input: JournalInput) => ({
  pair: input.pair,
  direction: input.direction,
  entry: num(input.entry) ?? 0,
  exit: num(input.exit),
  stop_loss: num(input.stopLoss),
  take_profit: num(input.takeProfit),
  size: num(input.size),
  setup: input.setup || '',
  notes: input.notes || '',
  pnl: num(input.pnl),
})

const toEntry = (r: any): JournalEntry => ({
  id: r.id,
  pair: r.pair,
  direction: r.direction === 'short' ? 'short' : 'long',
  entry: Number(r.entry) || 0,
  exit: r.exit != null ? Number(r.exit) : null,
  stopLoss: r.stop_loss != null ? Number(r.stop_loss) : null,
  takeProfit: r.take_profit != null ? Number(r.take_profit) : null,
  size: r.size != null ? Number(r.size) : null,
  setup: r.setup || '',
  notes: r.notes || '',
  pnl: r.pnl != null ? Number(r.pnl) : null,
  date: r.created_at || '',
})

export async function journalList(): Promise<{ entries?: JournalEntry[]; error?: string }> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('id,pair,direction,entry,exit,stop_loss,take_profit,size,setup,notes,pnl,created_at')
    .order('created_at', { ascending: false })
  if (error) return { error: error.message }
  return { entries: (data || []).map(toEntry) }
}

export async function journalCreate(input: JournalInput): Promise<{ error?: string }> {
  const { error } = await supabase.from('journal_entries').insert(toRow(input))
  return { error: error?.message }
}

export async function journalUpdate(id: string, input: JournalInput): Promise<{ error?: string }> {
  const { error } = await supabase
    .from('journal_entries')
    .update({ ...toRow(input), updated_at: new Date().toISOString() })
    .eq('id', id)
  return { error: error?.message }
}

export async function journalDelete(id: string): Promise<{ error?: string }> {
  const { error } = await supabase.from('journal_entries').delete().eq('id', id)
  return { error: error?.message }
}
