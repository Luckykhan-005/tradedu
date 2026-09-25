import { useState } from 'react'
import { Newspaper, Clock, ArrowRight, Tag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { blogPosts, type BlogPost } from '@/data/blog'

interface BlogProps {
  onSelectPost: (post: BlogPost) => void
}

export function Blog({ onSelectPost }: BlogProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const categories = ['all', ...Array.from(new Set(blogPosts.map((p) => p.category)))]

  const filtered =
    activeCategory === 'all' ? blogPosts : blogPosts.filter((p) => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Newspaper className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Trading Blog</h1>
              <p className="text-muted-foreground">
                Roman Urdu mein trading guides, psychology aur market analysis — {blogPosts.length} articles
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={
                activeCategory === cat
                  ? 'rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors'
                  : 'rounded-full bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/70'
              }
            >
              {cat === 'all' ? 'Sab' : cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <Card
              key={post.slug}
              className="group h-full cursor-pointer transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
              onClick={() => onSelectPost(post)}
            >
              <CardContent className="flex h-full flex-col p-0">
                {post.hero && (
                  <img
                    src={post.hero}
                    alt={post.heroAlt || post.title}
                    className="aspect-[16/9] w-full border-b border-border object-cover"
                    loading="lazy"
                  />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readingTime}
                    </span>
                  </div>
                  <h2 className="mb-2 text-lg font-bold leading-snug group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="mb-4 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                    <span className="flex items-center gap-1 text-sm font-medium text-primary">
                      Parhein <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            <Newspaper className="mx-auto mb-4 h-10 w-10 opacity-40" />
            <p>Is category mein abhi post nahi hai.</p>
          </div>
        )}
      </div>
    </div>
  )
}
