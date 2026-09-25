import { useEffect, useRef, useState } from 'react'
import {
  Bot,
  Send,
  User,
  Sparkles,
  MessageSquare,
  BookOpen,
  Link2,
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
}

const GREETING: ChatMessage = {
  id: 0,
  role: 'mentor',
  text: 'Assalam-o-Alaikum! Main aapka AI Trading Mentor hoon. Trading, risk, charts, psychology — kuch bhi poochein, Roman Urdu mein jawab milega. Neeche se sawal chunein ya apna likhein.',
}

let nextId = 1

export function Mentor() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const ask = (question: string) => {
    const q = question.trim()
    if (!q) return

    const matches = searchMentor(q)
    const userMsg: ChatMessage = { id: nextId++, role: 'user', text: q }

    let mentorMsg: ChatMessage
    if (matches.length > 0 && matches[0].score >= 4) {
      const best = matches[0].entry
      mentorMsg = {
        id: nextId++,
        role: 'mentor',
        entry: best,
        related: relatedEntries(best),
      }
    } else if (matches.length > 0) {
      const best = matches[0].entry
      mentorMsg = {
        id: nextId++,
        role: 'mentor',
        text: 'Seedha jawab mere paas nahi, lekin yeh sab se qareeb sawal hai — shayad aap yahi pooch rahe hain:',
        entry: best,
        related: relatedEntries(best),
      }
    } else {
      mentorMsg = {
        id: nextId++,
        role: 'mentor',
        text: 'Maazrat, is sawal ka jawab abhi mere knowledge base mein nahi hai. Aap Glossary (100+ terms) ya Blog (detailed guides) dekh sakte hain, ya Contact page se sawal bhej sakte hain — main is mein aur jawab add karunga.',
      }
    }

    setMessages((prev) => [...prev, userMsg, mentorMsg])
    setInput('')
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
              Kuch bhi poochein — Roman Urdu mein instant jawab
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

                  {msg.role === 'mentor' && !msg.entry && (
                    <div className="inline-block rounded-2xl rounded-tl-sm bg-secondary px-4 py-2.5 text-left text-sm text-foreground">
                      {msg.text}
                    </div>
                  )}

                  {msg.role === 'mentor' && msg.entry && (
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

                  {msg.role === 'mentor' && msg.related && msg.related.length > 0 && (
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

          {/* Suggested questions — sirf chat ki shuruaat mein ya kam messages par */}
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
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Apna sawal likhein... (jaise: leverage kya hota hai)"
              className="h-11 flex-1 rounded-xl border border-border bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              aria-label="Sawal likhein"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Stats + disclaimer */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" /> {mentorEntries.length} sawal-jawab knowledge base mein
          </span>
          <span>Instant jawab · Zero API cost</span>
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
