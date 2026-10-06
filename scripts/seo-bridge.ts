import type { Page } from '@/components/Navigation'
import { buildPageSeo, type SeoInput } from '@/lib/seo'
import { getBlogPost } from '@/data/blog'
import { getCalculator } from '@/data/calculators'
import { courseSlug } from '@/lib/courseSlug'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

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

// Build time par published courses Supabase se padho — course detail pages ke
// prerendered <title>/meta ke liye. Keys/ network na hon to course pages skip
// ho jate hain, build fail nahi hota.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const readEnvLocal = (): Record<string, string> => {
  try {
    const p = resolve(root, '.env.local')
    if (!existsSync(p)) return {}
    const out: Record<string, string> = {}
    for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/)
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
    return out
  } catch {
    return {}
  }
}

interface BuildCourse {
  id: string
  title: string
  description: string
  slug: string
}

let buildCourses: BuildCourse[] = []

async function loadBuildCourses(): Promise<void> {
  const envLocal = readEnvLocal()
  const url = (process.env.VITE_SUPABASE_URL || envLocal.VITE_SUPABASE_URL || '').replace(/^["']|["']$/g, '')
  const key = (process.env.VITE_SUPABASE_ANON_KEY || envLocal.VITE_SUPABASE_ANON_KEY || '').replace(
    /^["']|["']$/g,
    ''
  )
  if (!url || !key) return
  try {
    const res = await fetch(`${url}/rest/v1/courses?select=id,title,description&is_published=eq.true`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
    if (!res.ok) return
    const rows = (await res.json()) as { id: string; title: string; description?: string | null }[]
    buildCourses = rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description || '',
      slug: courseSlug(r.id, r.title),
    }))
  } catch {
    // offline / Supabase down — prerender course pages ko skip kar dega
  }
}

await loadBuildCourses()

export async function seoForPath(rawPath: string): Promise<SeoInput | null> {
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
  const coursePath = path.match(/^\/courses\/([a-z0-9-]+)$/)
  if (coursePath) {
    const c = buildCourses.find((x) => x.slug === coursePath[1])
    return c ? { page: 'course-detail', path, course: { title: c.title, description: c.description } } : null
  }
  return null
}

export { buildPageSeo }
