import type { Page } from '@/components/Navigation'
import { buildPageSeo, type SeoInput } from '@/lib/seo'
import { getBlogPost } from '@/data/blog'
import { getCalculator } from '@/data/calculators'

// App.tsx pageToPath ka mirror — sirf indexable SPA routes.
// (Glossary/book/knowledge-base pages public/ mein static HTML hain — unhe
// prerender ki zaroorat nahi.)
const STATIC: Record<string, Page> = {
  '/': 'landing',
  '/courses': 'courses',
  '/live-sessions': 'live-sessions',
  '/ai-tools': 'ai-tools',
  '/books': 'books',
  '/calculator': 'calculator',
  '/glossary': 'glossary',
  '/journal': 'journal',
  '/liquidation': 'liquidation',
  '/market-overview': 'market',
  '/certificates': 'certificates',
  '/pricing': 'pricing',
  '/about': 'about',
  '/hire': 'hire',
  '/contact': 'contact',
  '/privacy': 'privacy',
  '/terms': 'terms',
  '/disclaimer': 'disclaimer',
  '/blog': 'blog',
  '/mentor': 'mentor',
  '/roadmap': 'roadmap',
}

export function seoForPath(rawPath: string): SeoInput | null {
  const path = rawPath.replace(/\/+$/, '') || '/'
  const staticPage = STATIC[path]
  if (staticPage) return { page: staticPage, path }
  const blog = path.match(/^\/blog\/([^/]+)$/)
  if (blog) {
    const post = getBlogPost(decodeURIComponent(blog[1]))
    return post ? { page: 'blog-post', path, post } : null
  }
  const calc = path.match(/^\/calculator\/([a-z0-9-]+)$/)
  if (calc) {
    return getCalculator(calc[1]) ? { page: 'calculator-detail', path, calcSlug: calc[1] } : null
  }
  return null
}

export { buildPageSeo }
