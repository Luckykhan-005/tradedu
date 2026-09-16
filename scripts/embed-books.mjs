// Generates server/book-content.ts — a deploy-bundled copy of the PAID book HTML.
//
// Why this exists: the paid books used to live in public/, where any visitor
// (or curl, or Google) could download every chapter without signing in. Static
// files cannot be access-controlled, so paid content now lives outside the
// static root and is served by the API only after a server-side plan check.
//
// Free books (crypto-beginner, candlestick-book, glossary-book) intentionally
// stay in public/ so they need no auth and no bundling.
//
// Run: npm run books:embed   (after editing anything under books/)

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'fs'
import { join, relative } from 'path'

const PAID_BOOKS = [
    'crypto-intermediate',
    'crypto-advanced',
    'smc-book',
    'forex-book',
    'price-action',
    'trading-strategies',
    'professional-trading',
    'technical-analysis',
    'risk-management',
    'trading-psychology',
]

const SRC_DIR = 'books'
const OUT_FILE = 'server/book-content.ts'

function walk(dir) {
    const out = []
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry)
        if (statSync(full).isDirectory()) out.push(...walk(full))
        else out.push(full)
    }
    return out
}

const books = {}
let totalBytes = 0

for (const slug of PAID_BOOKS) {
    const root = join(SRC_DIR, slug)
    if (!existsSync(root)) {
        console.error(`!! Missing source directory: ${root}`)
        console.error('   Move the book HTML out of public/ into books/ before embedding.')
        process.exit(1)
    }
    const files = {}
    for (const full of walk(root)) {
        // Normalise to forward slashes so the same keys work on Windows and Linux.
        const rel = relative(root, full).split('\\').join('/')
        const html = readFileSync(full, 'utf8')
        files[rel] = html
        totalBytes += Buffer.byteLength(html)
    }
    books[slug] = { files }
    console.log(`  ${slug.padEnd(22)} ${Object.keys(files).length} file(s)`)
}

const payload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    books,
}

// Double-encode so the payload becomes a single safe TS string literal
// (no template-literal or quote escaping hazards).
const literal = JSON.stringify(JSON.stringify(payload))

const out = `// AUTO-GENERATED FILE — DO NOT EDIT BY HAND.
// Produced by scripts/embed-books.mjs (npm run books:embed).
//
// Contains the full HTML of the PAID books so the API can serve them from a
// serverless bundle. These files are deliberately NOT in public/ — static files
// cannot be access-controlled, which is what made the paywall bypassable.
/* eslint-disable */
export const BOOK_CONTENT_JSON = ${literal}
export default JSON.parse(BOOK_CONTENT_JSON) as {
  version: number
  generatedAt: string
  books: Record<string, { files: Record<string, string> }>
}
`

mkdirSync('server', { recursive: true })
writeFileSync(OUT_FILE, out)

const mb = (totalBytes / 1024 / 1024).toFixed(2)
console.log(`\nWrote ${OUT_FILE} — ${PAID_BOOKS.length} paid book(s), ${mb} MB of HTML embedded.`)
console.log('Remember to commit both books/ and server/book-content.ts — the deploy needs them.')
