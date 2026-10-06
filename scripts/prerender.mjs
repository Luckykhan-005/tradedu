// Build-time prerender: har SPA route ke liye dist/<path>/index.html banao
// jismein us page ka apna <title>, meta description, canonical aur OG tags hon.
// Social crawlers (WhatsApp/Facebook/X) JS nahi chalate — unhe yahi static tags
// milte hain; Google ko bhi crawl karne mein aasani hoti hai.
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://tradeed.online'

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const bridgeOut = join(root, 'scripts', '.seo-bridge.mjs')
await build({
  entryPoints: [join(root, 'scripts', 'seo-bridge.ts')],
  outfile: bridgeOut,
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node18',
  jsx: 'automatic',
  tsconfig: join(root, 'tsconfig.json'),
  logLevel: 'warning',
  packages: 'external',
})
const { seoForPath, buildPageSeo } = await import(pathToFileURL(bridgeOut).href)

const sitemap = readFileSync(join(root, 'dist', 'sitemap.xml'), 'utf8')
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
const shell = readFileSync(join(root, 'dist', 'index.html'), 'utf8')

let written = 0
let skipped = 0

for (const rawPath of urls) {
  const input = await seoForPath(rawPath)
  if (!input) {
    skipped++
    continue
  }
  const seo = buildPageSeo(input)
  if (!seo.title || seo.index === false) {
    skipped++
    continue
  }

  const path = input.path
  const canonical = path === '/' ? `${SITE}/` : `${SITE}${path}`
  let html = shell

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(seo.title)}</title>`)

  const upsertMeta = (attr, key, content) => {
    const re = new RegExp(`<meta\\s+${attr}="${key}"[^>]*>`)
    const tag = `<meta ${attr}="${key}" content="${esc(content)}" />`
    if (re.test(html)) html = html.replace(re, tag)
    else html = html.replace('</head>', `    ${tag}\n  </head>`)
  }

  if (seo.description) upsertMeta('name', 'description', seo.description)
  upsertMeta('property', 'og:title', seo.title)
  if (seo.description) upsertMeta('property', 'og:description', seo.description)
  upsertMeta('property', 'og:url', canonical)
  upsertMeta('property', 'og:type', seo.ogType)
  upsertMeta('property', 'og:image', seo.ogImage)
  upsertMeta('name', 'twitter:title', seo.title)
  if (seo.description) upsertMeta('name', 'twitter:description', seo.description)
  upsertMeta('name', 'twitter:image', seo.ogImage)

  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${canonical}" />`
  )

  // JSON-LD structured data (Course/BlogPosting/etc.) — social crawlers ke liye
  // head tags kaafi hain, lekin Google rich results ke liye schema bhi dekhta hai.
  if (seo.jsonLd) {
    const ld = JSON.stringify(seo.jsonLd).replace(/</g, '\\u003c')
    html = html.replace('</head>', `    <script type="application/ld+json">${ld}</script>\n  </head>`)
  }

  const outFile = join(root, 'dist', path.replace(/^\//, ''), 'index.html')
  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(outFile, html, 'utf8')
  written++
}

if (existsSync(bridgeOut)) rmSync(bridgeOut)
console.log(`prerender: ${written} pages written, ${skipped} skipped (static/noindex)`)
