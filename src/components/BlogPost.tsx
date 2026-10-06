import { useState } from 'react'
import { ArrowLeft, Calendar, Check, Clock, Facebook, Link2, MessageCircle, Tag, Twitter, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { BlogPost as BlogPostType } from '@/data/blog'
import { blogPosts } from '@/data/blog'
import type { Page } from '@/components/Navigation'

interface BlogPostPageProps {
  post: BlogPostType
  onBack: () => void
  onOpenBlog: (post: BlogPostType) => void
  onNavigate: (page: Page) => void
}

// Step 9 — internal linking: category ke mutabiq hub page (static pages = full nav, sahi hai)
const CATEGORY_HUB: Record<string, { href: string; label: string }> = {
  'Crypto Regulation': { href: '/knowledge-base/crypto-kya-hai', label: 'Crypto Kya Hai — complete guide' },
  'Crypto Basics': { href: '/knowledge-base/crypto-kya-hai', label: 'Crypto Kya Hai — complete guide' },
  'Crypto Analysis': { href: '/knowledge-base/chart-kaise-padhein', label: 'Chart Kaise Padhein' },
  'Crypto Trading Guide': { href: '/knowledge-base/crypto-kya-hai', label: 'Crypto Kya Hai — complete guide' },
  Crypto: { href: '/knowledge-base/crypto-kya-hai', label: 'Crypto Kya Hai — complete guide' },
  'Solana Guide': { href: '/knowledge-base/crypto-kya-hai', label: 'Crypto Kya Hai — complete guide' },
  Forex: { href: '/knowledge-base/forex-trading-kya-hai', label: 'Forex Trading Kya Hai' },
  'Forex Basics': { href: '/knowledge-base/forex-trading-kya-hai', label: 'Forex Trading Kya Hai' },
  Gold: { href: '/knowledge-base/forex-trading-kya-hai', label: 'Forex Trading Kya Hai' },
  'AI Tools': { href: '/ai-kaise-seekhain/', label: 'AI Kaise Seekhein — hub' },
  'Technical Analysis': { href: '/knowledge-base/chart-kaise-padhein', label: 'Chart Kaise Padhein' },
  'Trading Basics': { href: '/knowledge-base/trading-kya-hai', label: 'Trading Kya Hai' },
  Learning: { href: '/knowledge-base/trading-kya-hai', label: 'Trading Kya Hai' },
  'Trading Psychology': { href: '/glossary/fomo/', label: 'FOMO kya hai — glossary' },
  Psychology: { href: '/glossary/fomo/', label: 'FOMO kya hai — glossary' },
  'Risk Management': { href: '/glossary/risk-management/', label: 'Risk Management — glossary' },
  'Personal Finance': { href: '/calculator/compounding/', label: 'Compound Interest Calculator' },
  'Macro Economics': { href: '/knowledge-base/stock-market-kya-hai', label: 'Stock Market Kya Hai' },
}

// SEO (title, description, canonical, Article schema) central hota hai
// src/lib/seo.ts me — wahan har route par apply hota hai.
export function BlogPost({ post, onBack, onOpenBlog, onNavigate }: BlogPostPageProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://tradeed.online'
  const shareTitle = `${post.title} | TradeEd`
  const sharePill =
    'inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary'
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked — kuch nahi */
    }
  }
  const related = blogPosts
    .filter(
      (p) => p.slug !== post.slug && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))),
    )
    .slice(0, 3)
  const hub = CATEGORY_HUB[post.category]

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-6 -ml-2 gap-2">
        <ArrowLeft className="h-4 w-4" /> Sab Posts
      </Button>

      <header className="mb-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{post.category}</Badge>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground"
            >
              <Tag className="h-3 w-3" /> {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            <span className="font-medium text-foreground">M. Aslam Khan</span>
            <span className="text-muted-foreground">· Author</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {post.readingTime}
          </span>
        </div>
      </header>

      <div className="space-y-8">
        {post.hero && (
          <figure className="overflow-hidden rounded-xl border border-border">
            <img
              src={post.hero}
              alt={post.heroAlt || post.title}
              className="w-full"
              loading="eager"
            />
          </figure>
        )}
        {post.html ? (
          <div className="blog-html" dangerouslySetInnerHTML={{ __html: post.html }} />
        ) : (
          (post.sections || []).map((section, i) => (
          <section key={i}>
            {section.heading && (
              <h2 className="mb-3 text-2xl font-bold tracking-tight">{section.heading}</h2>
            )}
            {(section.paragraphs || []).map((p, j) => (
              <p
                key={j}
                className="mb-4 leading-relaxed text-foreground/90"
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}
            {section.table && (
              <div className="my-4 overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary">
                      {section.table.headers.map((h, j) => (
                        <th key={j} className="border-b border-border px-3 py-2 text-left font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((r, i) => (
                      <tr key={i}>
                        {r.map((c, j) => (
                          <td key={j} className="border-b border-border px-3 py-2 text-foreground/90">
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {section.list && (
              <ul className="my-4 space-y-2">
                {section.list.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-foreground/90">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            )}
            {section.diagram && (
              <figure className="my-6 overflow-hidden rounded-xl border border-border bg-card">
                <img
                  src={section.diagram}
                  alt={section.diagramAlt || ''}
                  className="w-full"
                  loading="lazy"
                />
              </figure>
            )}
          </section>
          ))
        )}
      </div>

      <nav aria-label="Related articles" className="mt-10 rounded-xl border border-border bg-card p-5">
        <p className="mb-3 text-sm font-semibold">Aage kya parhein</p>
        <ul className="space-y-2">
          {related.map((p) => (
            <li key={p.slug}>
              <a
                href={`/blog/${p.slug}`}
                className="text-primary underline-offset-4 hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  onOpenBlog(p)
                }}
              >
                {p.title}
              </a>
              <span className="ml-2 text-xs text-muted-foreground">{p.category}</span>
            </li>
          ))}
          {hub ? (
            <li>
              <a href={hub.href} className="text-primary underline-offset-4 hover:underline">
                {hub.label}
              </a>
            </li>
          ) : (
            <li>
              <a
                href="/blog"
                className="text-primary underline-offset-4 hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  onNavigate('blog')
                }}
              >
                Sab trading articles
              </a>
            </li>
          )}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
          <button type="button" className={sharePill} onClick={() => onNavigate('courses')}>
            Course join karein
          </button>
          <button type="button" className={sharePill} onClick={() => onNavigate('calculator')}>
            Position size calculator
          </button>
        </div>
      </nav>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <p className="mb-3 text-sm font-semibold">
          Ye post pasand aayi? Apne doston ke sath share karein:
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            className={sharePill}
            href={`https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <a
            className={sharePill}
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook className="h-4 w-4" /> Facebook
          </a>
          <a
            className={sharePill}
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter className="h-4 w-4" /> X
          </a>
          <button type="button" className={sharePill} onClick={copyLink}>
            {copied ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Link2 className="h-4 w-4" />
            )}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
      </div>

      <footer className="mt-12 rounded-xl border border-primary/30 bg-primary/5 p-6">
        <p className="text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Risk Disclaimer:</strong> Yeh article sirf
          ta'leemi (educational) maqsad ke liye hai — yeh financial advice nahi. Trading mein
          significant risk hota hai. Hamesha apni research karein (DYOR).
        </p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">M. Aslam Khan</p>
            <p className="text-xs text-muted-foreground">
              Mentor, Author &amp; Content Creator — TradeEd founder
            </p>
          </div>
        </div>
      </footer>
    </article>
  )
}
