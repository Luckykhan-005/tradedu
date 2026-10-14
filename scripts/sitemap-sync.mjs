// sitemap-sync — src/data/blog.ts se /blog/* URLs sitemap.xml mein auto-sync karo.
// Manual edit bhoolne ki guarantee: npm run seo:sitemap (publish checklist ka hissa).
// Non-blog URLs (courses, glossary, knowledge-base...) untouched rehte hain.
import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const blogFile = join(root, 'src', 'data', 'blog.ts')
const sitemapFile = join(root, 'public', 'sitemap.xml')
const SITE = 'https://tradeed.online'

const src = readFileSync(blogFile, 'utf8')
const posts = [...src.matchAll(/slug: '([^']+)',[\s\S]*?date: '(\d{4}-\d{2}-\d{2})'/g)].map((m) => ({
  slug: m[1],
  date: m[2],
}))

if (posts.length === 0) {
  console.error('blog.ts se koi post nahi mili — ruk jao')
  process.exit(1)
}
const dupes = posts.filter((p, i) => posts.findIndex((q) => q.slug === p.slug) !== i)
if (dupes.length) {
  console.error('Duplicate slugs: ' + dupes.map((d) => d.slug).join(', '))
  process.exit(1)
}

const sm = readFileSync(sitemapFile, 'utf8')
const lines = sm.split('\n')
const head = lines.slice(0, lines.findIndex((l) => l.includes('<url>')))
const tail = lines.slice(lines.findIndex((l) => l.includes('</urlset>')))
const urlLines = lines.slice(head.length, lines.length - tail.length)

const nonBlog = urlLines.filter((l) => !l.includes('/blog/'))
const oldBlogSlugs = urlLines
  .filter((l) => l.includes('/blog/'))
  .map((l) => (l.match(/\/blog\/([^<]+)</) || [])[1])
  .filter(Boolean)

const newBlogLines = posts.map(
  (p) =>
    `  <url><loc>${SITE}/blog/${p.slug}</loc><lastmod>${p.date}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`
)

const added = posts.map((p) => p.slug).filter((s) => !oldBlogSlugs.includes(s))
const removed = oldBlogSlugs.filter((s) => !posts.some((p) => p.slug === s))

writeFileSync(sitemapFile, [...head, ...nonBlog, ...newBlogLines, ...tail].join('\n'), 'utf8')

console.log(`sitemap synced: ${posts.length} blog URLs (${added.length} added, ${removed.length} removed)`)
if (added.length) console.log('  + ' + added.join('\n  + '))
if (removed.length) console.log('  - ' + removed.join('\n  - '))
