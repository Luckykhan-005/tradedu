import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Search,
  FileText,
  BookOpen,
  Newspaper,
  BookMarked,
  Calculator,
  GraduationCap,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import type { Page } from './Navigation'
import { books } from './Books'
import { terms, termSlug } from './Glossary'
import { blogPosts, type BlogPost as BlogPostType } from '@/data/blog'

export interface SearchAction {
  page?: Page
  bookHref?: string
  blogSlug?: string
  external?: string
}

interface SearchResult {
  id: string
  title: string
  subtitle: string
  category: 'Page' | 'Book' | 'Blog' | 'Glossary' | 'Course' | 'Guide'
  icon: typeof FileText
  action: SearchAction
}

// Static index: site pages, books, blog posts and glossary terms — searched
// client-side so results appear instantly with no network round-trip.
const pageResults: SearchResult[] = [
  { id: 'p-home', title: 'Home', subtitle: 'TradeEd landing page', category: 'Page', icon: FileText, action: { page: 'landing' } },
  { id: 'p-courses', title: 'TradeEd Academy', subtitle: 'Urdu trading courses catalog', category: 'Page', icon: GraduationCap, action: { page: 'courses' } },
  { id: 'p-roadmap', title: 'Trading Roadmap', subtitle: 'Beginner se pro tak ka poora rasta', category: 'Page', icon: FileText, action: { page: 'roadmap' } },
  { id: 'p-books', title: 'Books', subtitle: '28+ free trading books in Urdu', category: 'Page', icon: BookOpen, action: { page: 'books' } },
  { id: 'p-blog', title: 'Blog', subtitle: 'Trading articles & guides in Roman Urdu', category: 'Page', icon: Newspaper, action: { page: 'blog' } },
  { id: 'p-mentor', title: 'AI Trading Mentor', subtitle: 'Sawal poochein — instant jawab', category: 'Page', icon: BookMarked, action: { page: 'mentor' } },
  { id: 'p-glossary', title: 'Trading Glossary', subtitle: '100+ trading terms (English + Urdu)', category: 'Page', icon: BookMarked, action: { page: 'glossary' } },
  { id: 'p-market', title: 'Market Overview', subtitle: 'Live prices, dominance aur fear & greed index', category: 'Page', icon: TrendingUp, action: { page: 'market' } },
  { id: 'p-calc', title: 'Free Trading Calculators', subtitle: 'Position size, risk, P&L & more', category: 'Page', icon: Calculator, action: { page: 'calculator' } },
  { id: 'p-journal', title: 'Trading Journal', subtitle: 'Track your trades', category: 'Page', icon: FileText, action: { page: 'journal' } },
  { id: 'p-certificates', title: 'Certificates', subtitle: 'Course completion certificates', category: 'Page', icon: GraduationCap, action: { page: 'certificates' } },
  { id: 'p-pricing', title: 'Plans & Pricing', subtitle: 'Free aur Premium plans', category: 'Page', icon: FileText, action: { page: 'pricing' } },
  { id: 'p-about', title: 'About Us', subtitle: 'TradeEd aur M. Aslam Khan ke bare mein', category: 'Page', icon: FileText, action: { page: 'about' } },
  { id: 'p-contact', title: 'Contact', subtitle: 'Reach the TradeEd team', category: 'Page', icon: FileText, action: { page: 'contact' } },
  { id: 'p-disclaimer', title: 'Risk Disclaimer', subtitle: 'Trading risk disclosure', category: 'Page', icon: FileText, action: { page: 'disclaimer' } },
  { id: 'p-ai', title: 'AI Tools', subtitle: 'AI-powered trading tools', category: 'Page', icon: FileText, action: { page: 'ai-tools' } },
  { id: 'p-sessions', title: 'Live Sessions', subtitle: 'Mentorship live classes', category: 'Page', icon: FileText, action: { page: 'live-sessions' } },
]

const bookResults: SearchResult[] = books.map((b) => ({
  id: `b-${b.id}`,
  title: b.title,
  subtitle: `${b.chapters} chapters · ${b.tags.join(', ')}`,
  category: 'Book' as const,
  icon: BookOpen,
  action: { bookHref: b.href },
}))

const blogResults: SearchResult[] = blogPosts.map((p) => ({
  id: `bl-${p.slug}`,
  title: p.title,
  subtitle: `${p.category} · ${p.readingTime}`,
  category: 'Blog' as const,
  icon: Newspaper,
  action: { blogSlug: p.slug },
}))

const glossaryResults: SearchResult[] = terms.map((t) => ({
  id: `g-${t.term}`,
  title: t.term,
  subtitle: t.definition,
  category: 'Glossary' as const,
  icon: BookMarked,
  action: { bookHref: `/glossary/${termSlug(t.term)}/` },
}))

const kbArticles: SearchResult[] = [
  { id: 'kb-trading-kya-hai', title: 'Trading Kya Hai?', subtitle: 'Stock, forex aur crypto trading ki bunyad', category: 'Guide', icon: FileText, action: { bookHref: '/knowledge-base/trading-kya-hai/' } },
  { id: 'kb-trading-shuru', title: 'Trading Kaise Shuru Karein?', subtitle: '7 practical steps — beginner guide', category: 'Guide', icon: FileText, action: { bookHref: '/knowledge-base/trading-shuru-kaise-karein/' } },
  { id: 'kb-forex', title: 'Forex Trading Kya Hai?', subtitle: 'Pips, lot, leverage aur Pakistan se shuruat', category: 'Guide', icon: FileText, action: { bookHref: '/knowledge-base/forex-trading-kya-hai/' } },
  { id: 'kb-stock', title: 'Stock Market Kya Hai?', subtitle: 'Shares, brokers aur PSX ki bunyad', category: 'Guide', icon: FileText, action: { bookHref: '/knowledge-base/stock-market-kya-hai/' } },
  { id: 'kb-crypto', title: 'Cryptocurrency Kya Hai?', subtitle: 'Bitcoin, wallets aur exchanges ki wazahat', category: 'Guide', icon: FileText, action: { bookHref: '/knowledge-base/crypto-kya-hai/' } },
  { id: 'kb-capital', title: 'Trading Mein Kitna Pesa Lagana Chahiye?', subtitle: 'Start capital aur 1% risk rule', category: 'Guide', icon: FileText, action: { bookHref: '/knowledge-base/trading-mein-paisa-kaise-lagayein/' } },
  { id: 'kb-chart', title: 'Chart Kaise Padhein?', subtitle: 'Candlesticks, trend aur S/R ki bunyad', category: 'Guide', icon: FileText, action: { bookHref: '/knowledge-base/chart-kaise-padhein/' } },
  { id: 'kb-day-vs-invest', title: 'Day Trading vs Long Term Investing', subtitle: 'Konsa tarika aap ke liye sahi hai', category: 'Guide', icon: FileText, action: { bookHref: '/knowledge-base/day-trading-vs-investing/' } },
  { id: 'kb-income', title: 'Trading Se Kitni Kamai Hoti Hai?', subtitle: 'Realistic expectations aur scam wade', category: 'Guide', icon: FileText, action: { bookHref: '/knowledge-base/trading-se-kitni-kamai-hoti-hai/' } },
  { id: 'kb-scams', title: 'Trading Scams Se Kaise Bachein', subtitle: 'Red flags aur safety checklist', category: 'Guide', icon: FileText, action: { bookHref: '/knowledge-base/trading-scams-se-kaise-bachein/' } },
  { id: 'kb-hub', title: 'Knowledge Base', subtitle: 'Saare trading guides ek jagah (Roman Urdu)', category: 'Page', icon: BookOpen, action: { bookHref: '/knowledge-base/' } },
]

const allResults = [...pageResults, ...bookResults, ...blogResults, ...glossaryResults, ...kbArticles]

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
  onNavigate: (page: Page) => void
  onOpenBlog: (post: BlogPostType) => void
}

export function SearchOverlay({ open, onClose, onNavigate, onOpenBlog }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return pageResults.slice(0, 8)
    return allResults
      .filter(
        (r) => r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q)
      )
      .slice(0, 12)
  }, [query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      // Focus after paint so the dialog is mounted
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const selectResult = (result: SearchResult) => {
    const { action } = result
    onClose()
    if (action.bookHref) {
      window.location.href = action.bookHref
      return
    }
    if (action.blogSlug) {
      const post = blogPosts.find((p) => p.slug === action.blogSlug)
      if (post) onOpenBlog(post)
      return
    }
    if (action.page) onNavigate(action.page)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault()
      selectResult(results[activeIndex])
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Site search"
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Books, courses, blog, glossary search karein..."
            className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden shrink-0 rounded border border-border bg-secondary px-2 py-1 text-xs text-muted-foreground sm:block">
            Esc
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              "{query}" ke liye kuch nahi mila. Keywords badal kar dekhein.
            </div>
          )}
          {results.map((result, i) => (
            <button
              key={result.id}
              onClick={() => selectResult(result)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
                i === activeIndex ? 'bg-primary/15' : 'hover:bg-secondary'
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <result.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{result.title}</p>
                <p className="truncate text-xs text-muted-foreground">{result.subtitle}</p>
              </div>
              <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {result.category}
              </span>
              <ArrowRight
                className={`h-4 w-4 shrink-0 transition-opacity ${
                  i === activeIndex ? 'opacity-100 text-primary' : 'opacity-0'
                }`}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
          <span>↑↓ navigate · Enter select</span>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  )
}
