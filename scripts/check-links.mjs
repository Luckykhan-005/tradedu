// check-links — blog posts ke saare internal links dist/ ke against verify karo.
// Publish se pehle: npm run seo:links (pehle npm run build chalao).
// Broken link =0 warna exit1.
import { readFileSync, existsSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/ nahi mila — pehle npm run build chalao')
  process.exit(1)
}

const src = readFileSync(join(root, 'src', 'data', 'blog.ts'), 'utf8')
const hrefs = [...new Set([...src.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]))]

const exists = (p) => {
  const clean = p.split(/[?#]/)[0].replace(/\/+$/, '') || '/'
  const candidates = [
    join(dist, clean),
    join(dist, clean, 'index.html'),
    join(dist, clean.replace(/^\//, '')) + '.html',
    join(dist, clean === '/' ? 'index.html' : clean),
  ]
  return candidates.some((c) => existsSync(c))
}

const broken = hrefs.filter((h) => !exists(h))
const total = hrefs.length

if (broken.length) {
  console.error(`BROKEN ${broken.length}/${total} internal links:`)
  for (const b of broken) console.error('  ✗ ' + b)
  process.exit(1)
}
console.log(`all ${total} internal links OK (${new Set([...src.matchAll(/href="(\/blog\/[^"?#]+)/g)].map((m) => m[1])).size} blog cross-links checked)`)
