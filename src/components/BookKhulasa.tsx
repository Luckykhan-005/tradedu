import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { BookOpen, Loader2, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Msg {
  role: 'ai' | 'user'
  text: string
}

async function extractBookText(href: string): Promise<string> {
  const res = await fetch(href)
  if (!res.ok) throw new Error('book-fetch')
  const html = await res.text()
  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.querySelectorAll('script, style, noscript, svg, iframe').forEach((el) => el.remove())
  return (doc.body?.textContent || '').replace(/\s+/g, ' ').trim()
}

function mdToHtml(md: string): string {
  const esc = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return (
    esc
      .replace(/^### (.*$)/gim, '<h3 class="mt-3 mb-1 text-sm font-bold text-primary">$1</h3>')
      .replace(/^## (.*$)/gim, '<h3 class="mt-3 mb-1 text-sm font-bold text-primary">$1</h3>')
      .replace(/^# (.*$)/gim, '<h3 class="mt-3 mb-1 text-sm font-bold text-primary">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc marker:text-primary">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-2">')
      .replace(/\n/g, '<br/>')
  )
}

export function BookKhulasa({ href, title }: { href: string; title: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [asking, setAsking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const bookTextRef = useRef<string | null>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(false)
    setMessages([])
    setError(null)
    bookTextRef.current = null
  }, [href])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [messages, loading, asking])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  async function callApi(question?: string): Promise<string> {
    if (!bookTextRef.current) {
      bookTextRef.current = await extractBookText(href)
    }
    const r = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: bookTextRef.current, question: question || '' }),
      signal: AbortSignal.timeout(35000),
    })
    const data = await r.json().catch(() => ({}))
    if (!r.ok || !data.answer) throw new Error(data.message || 'ai-fail')
    return String(data.answer)
  }

  async function loadSummary() {
    setLoading(true)
    setError(null)
    try {
      const answer = await callApi()
      setMessages([{ role: 'ai', text: answer }])
    } catch {
      setError('Khulasa nahi mil saka (temporary masla). Dobara koshish karein.')
    } finally {
      setLoading(false)
    }
  }

  function handleOpen() {
    setOpen(true)
    if (messages.length === 0 && !error && !loading) loadSummary()
  }

  async function sendQuestion() {
    const q = input.trim()
    if (!q || asking) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: q }])
    setAsking(true)
    setError(null)
    try {
      const answer = await callApi(q)
      setMessages((prev) => [...prev, { role: 'ai', text: answer }])
    } catch {
      setError('Jawab nahi mil saka. Dobara koshish karein.')
    } finally {
      setAsking(false)
    }
  }

  return (
    <>
      <Button variant="secondary" size="sm" className="gap-1.5" onClick={handleOpen}>
        <BookOpen className="h-4 w-4" />
        <span className="hidden md:inline">Khulasa</span>
      </Button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-end justify-center bg-black/55 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false)
            }}
          >
            <div className="flex max-h-[88vh] w-full max-w-2xl flex-col rounded-t-2xl border bg-background shadow-2xl sm:max-h-[80vh] sm:rounded-2xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">📚 {title}</p>
                  <p className="text-[11px] text-muted-foreground">AI khulasa + is kitaab se sawal</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Kitaab parh raha hoon… (10-30 sec)
                </div>
              )}
              {messages.map((m, i) =>
                m.role === 'ai' ? (
                  <div
                    key={i}
                    className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm leading-relaxed [&_li]:my-0.5 [&_p]:text-[13px]"
                    dangerouslySetInnerHTML={{ __html: mdToHtml(m.text) }}
                  />
                ) : (
                  <div key={i} className="ml-auto max-w-[85%] rounded-lg bg-secondary px-3 py-2 text-sm">
                    {m.text}
                  </div>
                )
              )}
              {asking && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Jawab dhoond raha hoon…
                </div>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <div className="flex gap-2 border-t px-4 py-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing) sendQuestion()
                }}
                placeholder="Is kitaab se aur poochein… (e.g. Chapter 5 ka khulasa)"
                className="h-9 flex-1 rounded-md border bg-background px-3 text-sm outline-none ring-primary/40 focus:ring-1"
                disabled={loading || asking}
              />
              <Button size="sm" className="gap-1.5" onClick={sendQuestion} disabled={loading || asking || !input.trim()}>
                {asking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Bhejein
              </Button>
            </div>
          </div>
          </div>,
          document.body
        )}
    </>
  )
}
