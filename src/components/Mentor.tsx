import { useEffect, useRef, useState } from 'react'
import {
  Bot,
  Send,
  User,
  Sparkles,
  MessageSquare,
  BookOpen,
  Link2,
  Loader2,
  Crown,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import {
  mentorEntries,
  categoryLabels,
  relatedEntries,
  searchMentor,
  suggestedQuestions,
  type MentorEntry,
} from '@/data/mentor'

interface ChatMessage {
  id: number
  role: 'user' | 'mentor'
  text?: string
  entry?: MentorEntry
  related?: MentorEntry[]
  source?: 'kb' | 'ai' | 'error' | 'quota'
  pending?: boolean
  upgrade?: boolean
}

const GREETING: ChatMessage = {
  id: 0,
  role: 'mentor',
  text: 'Assalam-o-Alaikum! Main aapka AI Trading Mentor hoon. Trading, risk, charts, psychology — kuch bhi poochein, Roman Urdu mein jawab milega. Neeche se sawal chunein ya apna likhein.',
}

let nextId = 1

const QUOTA_KEY = 'tradeed-ai-quota'
const FREE_AI_LIMIT = 5

const todayStr = () => new Date().toISOString().slice(0, 10)

function aiQuotaLeft(): number {
  try {
    const raw = localStorage.getItem(QUOTA_KEY)
    const q = raw ? JSON.parse(raw) : null
    if (!q || q.d !== todayStr()) return FREE_AI_LIMIT
    return Math.max(0, FREE_AI_LIMIT - (q.n || 0))
  } catch {
    return FREE_AI_LIMIT
  }
}

function consumeAiQuota() {
  try {
    const raw = localStorage.getItem(QUOTA_KEY)
    const q = raw ? JSON.parse(raw) : null
    const n = q && q.d === todayStr() ? (q.n || 0) + 1 : 1
    localStorage.setItem(QUOTA_KEY, JSON.stringify({ d: todayStr(), n }))
  } catch {
    /* ignore */
  }
}

interface MentorProps {
  user?: { email: string; name?: string; plan?: string; role?: string } | null
  onUpgrade?: () => void
}

export function Mentor({ user, onUpgrade }: MentorProps) {
  const isPremium = !!user && (user.role === 'admin' || (user.plan && user.plan !== 'FREE'))
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const aiErrorText = (data: any): string => {
    if (data?.message) return String(data.message)
    return 'AI jawab nahi de paya. Dobara koshish karein.'
  }

  const postMentor = async (
    q: string,
    history: { role: 'user' | 'model'; text: string }[],
    isRetry = false
  ): Promise<{ ok: boolean; data: any; status: number }> => {
    const r = await fetch('/api/mentor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: q, history }),
    })
    const data = await r.json().catch(() => ({}))
    if (r.ok && data.answer) return { ok: true, data, status: r.status }
    const transient =
      r.status === 502 || r.status === 504 || r.status === 429 ||
      data.error === 'AI_ERROR' || data.error === 'AI_RATE_LIMIT'
    if (transient && !isRetry) {
      await new Promise((s) => setTimeout(s, 8000))
      return postMentor(q, history, true)
    }
    return { ok: false, data, status: r.status }
  }

  const ask = (question: string) => {
    const q = question.trim()
    if (!q || loading) return

    const matches = searchMentor(q)
    setMessages((prev) => [...prev, { id: nextId++, role: 'user', text: q }])
    setInput('')

    const history = messages
      .slice(-6)
      .map((m) => ({
        role: m.role === 'user' ? ('user' as const) : ('model' as const),
        text: (m.text || m.entry?.q || '').slice(0, 400),
      }))
      .filter((h) => h.text)

    if (matches.length > 0 && matches[0].score >= 4) {
      const best = matches[0].entry
      setMessages((prev) => [
        ...prev,
        {
          id: nextId++,
          role: 'mentor',
          entry: best,
          source: 'kb',
          related: relatedEntries(best),
        },
      ])
      return
    }

    if (!isPremium) {
      if (aiQuotaLeft() <= 0) {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId++,
            role: 'mentor',
            text: `Free plan par AI mentor ke sirf ${FREE_AI_LIMIT} jawab per din hain — aaj ke saare jawab istemal ho gaye. Kal dobara milenge, ya Premium lein aur AI mentor unlimited istemal karein (KB ke sawal hamesha free hain).`,
            source: 'quota',
            upgrade: true,
          },
        ])
        return
      }
      consumeAiQuota()
    }

    const aiId = nextId++
    setLoading(true)
    setMessages((prev) => [...prev, { id: aiId, role: 'mentor', pending: true }])

    const settle = (msg: ChatMessage) => {
      setMessages((prev) => prev.map((m) => (m.id === aiId ? msg : m)))
      setLoading(false)
    }

    postMentor(q, history)
      .then(({ ok, data }) => {
        if (ok && data.answer) {
          settle({ id: aiId, role: 'mentor', text: String(data.answer), source: 'ai' })
        } else {
          settle({
            id: aiId,
            role: 'mentor',
            text: aiErrorText(data),
            source: 'error',
            related: matches.slice(0, 3).map((m) => m.entry),
          })
        }
      })
      .catch(() =>
        settle({
          id: aiId,
          role: 'mentor',
          text: 'Network/AI masla — jawab nahi mil saka. Dobara koshish karein.',
          source: 'error',
          related: matches.slice(0, 3).map((m) => m.entry),
        })
      )
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    ask(input)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Trading Mentor</h1>
            <p className="text-muted-foreground">
              {isPremium
                ? 'Premium · AI unlimited — KB (instant) + Gemini · Roman Urdu jawab'
                : `Free plan · AI ke ${aiQuotaLeft()}/${FREE_AI_LIMIT} jawab bache aaj · KB hamesha free`}
            </p>
          </div>
        </div>

        {/* Chat window */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div
            ref={scrollRef}
            className="h-[55vh] space-y-4 overflow-y-auto p-4 sm:p-5"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    msg.role === 'mentor' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  )}
                >
                  {msg.role === 'mentor' ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>

                <div className={cn('max-w-[85%] space-y-2', msg.role === 'user' && 'text-right')}>
                  {msg.role === 'user' && (
                    <div className="inline-block rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-left text-sm text-primary-foreground">
                      {msg.text}
                    </div>
                  )}

                  {msg.role === 'mentor' && msg.pending && (
                    <div className="inline-flex items-center gap-2 rounded-2xl rounded-tl-sm bg-secondary px-4 py-2.5 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="flex gap-1">
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce [animation-delay:150ms]">.</span>
                        <span className="animate-bounce [animation-delay:300ms]">.</span>
                      </span>
                      <span className="text-xs">AI soch raha hai</span>
                    </div>
                  )}

                  {msg.role === 'mentor' && !msg.entry && !msg.pending && (
                    <div className="space-y-1.5 text-left">
                      {msg.source === 'ai' && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                          <Sparkles className="h-3 w-3" /> Gemini AI
                        </span>
                      )}
                      {msg.source === 'error' && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-destructive/40 bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-destructive">
                          AI unavailable
                        </span>
                      )}
                      {msg.source === 'quota' && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                          Free plan limit
                        </span>
                      )}
                      <div
                        className={cn(
                          'inline-block whitespace-pre-line rounded-2xl rounded-tl-sm px-4 py-2.5 text-left text-sm',
                          msg.source === 'error'
                            ? 'border border-dashed border-border bg-secondary text-muted-foreground'
                            : 'bg-secondary text-foreground'
                        )}
                      >
                        {msg.text}
                      </div>
                      {msg.upgrade && onUpgrade && (
                        <button
                          onClick={onUpgrade}
                          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                        >
                          <Crown className="h-3.5 w-3.5" />
                          Premium lein — AI unlimited
                        </button>
                      )}
                    </div>
                  )}

                  {msg.role === 'mentor' && msg.entry && !msg.pending && (
                    <div className="space-y-2 text-left">
                      {msg.text && (
                        <div className="inline-block rounded-2xl rounded-tl-sm bg-secondary px-4 py-2.5 text-sm text-foreground">
                          {msg.text}
                        </div>
                      )}
                      <div className="rounded-2xl rounded-tl-sm border border-primary/30 bg-primary/5 p-4">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                            <Sparkles className="h-3.5 w-3.5" />
                            {categoryLabels[msg.entry.category]}
                          </span>
                          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            Knowledge Base
                          </span>
                        </div>
                        <p className="mb-2 text-sm font-semibold text-foreground">
                          {msg.entry.q}
                        </p>
                        <p className="text-sm leading-relaxed text-foreground/90">
                          {msg.entry.a}
                        </p>
                      </div>
                    </div>
                  )}

                  {msg.role === 'mentor' && msg.related && msg.related.length > 0 && !msg.pending && (
                    <div className="space-y-1.5 pt-1 text-left">
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Link2 className="h-3 w-3" /> Related sawal:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.related.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => ask(r.q)}
                            className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                          >
                            {r.q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Suggested questions — sirf chat ki shuruaat mein */}
          {messages.length <= 1 && (
            <div className="border-t border-border px-4 pt-3 sm:px-5">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" /> Mashhoor sawal:
              </p>
              <div className="flex flex-wrap gap-2 pb-3">
                {suggestedQuestions.map((sq) => (
                  <button
                    key={sq}
                    onClick={() => ask(sq)}
                    className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {sq}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-border p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Apna sawal likhein... (jaise: leverage kya hota hai)"
              className="h-11 flex-1 rounded-xl border border-border bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              aria-label="Sawal likhein"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
              aria-label="Send"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </form>
        </div>

        {/* Stats + disclaimer */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" /> {mentorEntries.length} sawal-jawab Knowledge Base
            mein {isPremium ? '· AI unlimited (Premium)' : `· AI: ${aiQuotaLeft()}/${FREE_AI_LIMIT} bache aaj`}
          </span>
          <span>KB instant · AI fallback</span>
        </div>

        <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs leading-relaxed text-muted-foreground">
          <strong className="text-destructive">Disclaimer:</strong> Ye mentor sirf ta'leemi
          (educational) hidayat deta hai — financial advice nahi. Trading mein significant risk
          hota hai. Har trade se pehle apni research (DYOR) karein.
        </p>
      </div>
    </div>
  )
}
