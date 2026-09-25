import { useEffect } from 'react'
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { BlogPost as BlogPostType } from '@/data/blog'

interface BlogPostPageProps {
  post: BlogPostType
  onBack: () => void
}

export function BlogPost({ post, onBack }: BlogPostPageProps) {
  // Per-post SEO: dynamic title/description/canonical + Article JSON-LD.
  // Restores homepage values when leaving the post.
  useEffect(() => {
    const prevTitle = document.title
    const prevDesc = document.querySelector('meta[name="description"]')?.getAttribute('content')

    document.title = `${post.title} | TradeEd`

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.head.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        const name = selector.match(/name="([^"]+)"/)?.[1]
        const prop = selector.match(/property="([^"]+)"/)?.[1]
        if (name) el.setAttribute('name', name)
        if (prop) el.setAttribute('property', prop)
        document.head.appendChild(el)
      }
      el.setAttribute(attr, value)
    }

    setMeta('meta[name="description"]', 'content', post.excerpt)
    setMeta('meta[property="og:title"]', 'content', post.title)
    setMeta('meta[property="og:description"]', 'content', post.excerpt)
    setMeta('meta[property="og:type"]', 'content', 'article')
    setMeta('meta[property="og:url"]', 'content', `https://tradeed.online/blog/${post.slug}`)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    let createdCanonical = false
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
      createdCanonical = true
    }
    const prevCanonicalHref = canonical.getAttribute('href')
    canonical.setAttribute('href', `https://tradeed.online/blog/${post.slug}`)

    const schema = document.createElement('script')
    schema.type = 'application/ld+json'
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      author: { '@type': 'Person', name: 'M. Aslam Khan' },
      publisher: { '@type': 'Organization', name: 'TradeEd' },
      mainEntityOfPage: `https://tradeed.online/blog/${post.slug}`,
      keywords: post.tags.join(', '),
      inLanguage: 'ur-PK',
    })
    document.head.appendChild(schema)

    window.scrollTo(0, 0)

    return () => {
      document.title = prevTitle
      if (prevDesc) setMeta('meta[name="description"]', 'content', prevDesc)
      if (prevCanonicalHref) canonical?.setAttribute('href', prevCanonicalHref)
      else if (createdCanonical) canonical?.remove()
      schema.remove()
    }
  }, [post])

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
            <User className="h-4 w-4" /> M. Aslam Khan
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
        {post.sections.map((section, i) => (
          <section key={i}>
            {section.heading && (
              <h2 className="mb-3 text-2xl font-bold tracking-tight">{section.heading}</h2>
            )}
            {section.paragraphs.map((p, j) => (
              <p key={j} className="mb-4 leading-relaxed text-foreground/90">
                {p}
              </p>
            ))}
            {section.list && (
              <ul className="my-4 space-y-2">
                {section.list.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-foreground/90">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
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
              Trading author & educator — TradeEd founder
            </p>
          </div>
        </div>
      </footer>
    </article>
  )
}
