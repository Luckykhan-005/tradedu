import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { BlogPost as BlogPostType } from '@/data/blog'

interface BlogPostPageProps {
  post: BlogPostType
  onBack: () => void
}

// SEO (title, description, canonical, Article schema) central hota hai
// src/lib/seo.ts me — wahan har route par apply hota hai.
export function BlogPost({ post, onBack }: BlogPostPageProps) {
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
        {post.sections.map((section, i) => (
          <section key={i}>
            {section.heading && (
              <h2 className="mb-3 text-2xl font-bold tracking-tight">{section.heading}</h2>
            )}
            {(section.paragraphs || []).map((p, j) => (
              <p key={j} className="mb-4 leading-relaxed text-foreground/90">
                {p}
              </p>
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
                    {item}
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
              Mentor, Author &amp; Content Creator — TradeEd founder
            </p>
          </div>
        </div>
      </footer>
    </article>
  )
}
