#!/usr/bin/env node
/**
 * TradeEd — Long-form manuscript book builder
 * ============================================================
 * Converts the two source manuscripts (Binance Complete Training
 * Urdu, Forex Trading Course) into the TradeEd book-hub format:
 *
 *   public/<book-id>/index.html          → cover + grouped TOC
 *   public/<book-id>/chapter-<n>.html    → chapters
 *   public/<book-id>/part-<n>.html       → part intros
 *   public/<book-id>/front-<slug>.html   → front matter pages
 *   public/<book-id>/back-<slug>.html    → back matter / appendices
 *   public/<book-id>/assets/img/*        → copied & renamed images
 *
 * The generated pages only link the shared stylesheets:
 *   /books/book.css      (tokens, cover, TOC, nav, notice, footer)
 *   /books/manuscript.css (tables, callouts, figures, grouped TOC)
 *
 * Usage:
 *   node scripts/embed-books.mjs            # build both books
 *   node scripts/embed-books.mjs binance    # build one (id substring)
 *
 * Source root defaults to ../../New Books relative to the repo root
 * and can be overridden with the NEW_BOOKS_DIR env variable.
 * ============================================================
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..')
const SRC_ROOT = process.env.NEW_BOOKS_DIR
    ? path.resolve(process.env.NEW_BOOKS_DIR)
    : path.resolve(REPO_ROOT, '../../New Books')
const PUBLIC_DIR = path.resolve(REPO_ROOT, 'public')

/* ---------------------------------------------------------------
 * Book configuration
 * --------------------------------------------------------------- */
const BOOKS = [
    {
        id: 'binance-complete',
        sourceDir: 'Binance Complete Training Urdu',
        title: 'Binance Complete Training (Urdu)',
        titleUrdu: 'بائننس مکمل ٹریننگ اردو',
        tagline: 'دنیا کی سب سے بڑی کرپٹو ایکسچینج — مکمل اردو گائیڈ',
        theme: 'navy',
        coverSource: 'Binance Book.jpg',
        coverOut: 'binance-complete.jpg',
        footer: 'بائننس مکمل ٹریننگ اردو — 2026 ایڈیشن',
    },
    {
        id: 'forex-complete',
        sourceDir: 'Forex-Trading-Course',
        title: 'Forex Trading Course (Urdu)',
        titleUrdu: 'فارکس ٹریڈنگ کورس',
        tagline: 'مکمل اردو کورس — صفر سے ایکسپرٹ تک',
        theme: 'navy-cyan',
        coverSource: 'Forex Trading Course (part-2).jpg',
        coverOut: 'forex-complete.jpg',
        footer: 'فارکس ٹریڈنگ کورس — 2026 ایڈیشن',
    },
]

/** Where images referenced by the manuscripts may live. */
const IMAGE_DIRS = ['assets/images', 'screenshots for book']

/** Section headings that become coloured callout blocks. */
const CALLOUTS = [
    { match: '🎯', cls: 'learn' },
    { match: '⚠', cls: 'warn' },
    { match: '✅', cls: 'summary' },
    { match: '📝', cls: 'practice' },
    { match: '🧠', cls: 'remember' },
]

const PROTECT_SCRIPT = `<script>
    document.addEventListener('keydown', function (e) {
        var k = (e.key || '').toLowerCase();
        if (e.ctrlKey && (k === 's' || k === 'p' || k === 'c' || k === 'u')) e.preventDefault();
    });
</script>`

/* ---------------------------------------------------------------
 * Small utilities
 * --------------------------------------------------------------- */
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
}

function decodeSafe(str) {
    try {
        return decodeURIComponent(str)
    } catch {
        return str
    }
}

function ensureDir(dir) {
    fs.mkdirSync(dir, { recursive: true })
}

function readText(file) {
    return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '')
}

function stripOrderPrefix(base) {
    return base
        .replace(/\.md$/i, '')
        .replace(/^(?:\d+|[a-z]\d+)[-_]/i, '')
}

/* ---------------------------------------------------------------
 * Inline markdown
 * --------------------------------------------------------------- */
function inline(raw) {
    let s = escapeHtml(raw)
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>')
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>')
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    s = s.replace(/ {2,}$/gm, '<br>')
    return s
}

/* ---------------------------------------------------------------
 * Tables
 * --------------------------------------------------------------- */
function isTableStart(lines, i) {
    if (i + 1 >= lines.length) return false
    const head = lines[i]
    const sep = lines[i + 1]
    if (!head.includes('|')) return false
    if (!sep.includes('-')) return false
    return /^\s*\|?[\s:\-|]+\|?\s*$/.test(sep)
}

function splitRow(row) {
    let s = row.trim()
    if (s.startsWith('|')) s = s.slice(1)
    if (s.endsWith('|')) s = s.slice(0, -1)
    return s.split('|').map((c) => c.trim())
}

function parseTable(lines, i) {
    const header = splitRow(lines[i])
    let j = i + 2
    const rows = []
    while (j < lines.length && lines[j].includes('|') && lines[j].trim()) {
        rows.push(splitRow(lines[j]))
        j++
    }
    const cols = header.length
    let html = '<div class="table-wrap"><table>\n<thead><tr>'
    for (let c = 0; c < cols; c++) {
        html += `<th>${inline(header[c] || '')}</th>`
    }
    html += '</tr></thead>\n<tbody>\n'
    for (const row of rows) {
        html += '<tr>'
        for (let c = 0; c < cols; c++) {
            html += `<td>${inline(row[c] || '')}</td>`
        }
        html += '</tr>\n'
    }
    html += '</tbody></table></div>'
    return { html, next: j }
}

/* ---------------------------------------------------------------
 * Lists (with one or more nesting levels)
 * --------------------------------------------------------------- */
const RE_UL = /^(\s*)[-*+]\s+(.*)$/
const RE_OL = /^(\s*)\d+[.)]\s+(.*)$/

function listInfo(line) {
    let m = line.match(RE_UL)
    if (m) return { indent: m[1].replace(/\t/g, '  ').length, ordered: false, text: m[2] }
    m = line.match(RE_OL)
    if (m) return { indent: m[1].replace(/\t/g, '  ').length, ordered: true, text: m[2] }
    return null
}

function indentOf(line) {
    const m = line.match(/^(\s*)/)
    return m ? m[1].replace(/\t/g, '  ').length : 0
}

function parseList(lines, start, baseIndent) {
    const first = listInfo(lines[start])
    const ordered = first.ordered
    const base = baseIndent === undefined ? first.indent : baseIndent
    const items = []
    let i = start

    while (i < lines.length) {
        const line = lines[i]

        if (!line.trim()) {
            let j = i + 1
            while (j < lines.length && !lines[j].trim()) j++
            const info = j < lines.length ? listInfo(lines[j]) : null
            if (info && info.indent >= base) {
                i = j
                continue
            }
            break
        }

        const info = listInfo(line)
        if (info && info.indent === base && info.ordered === ordered) {
            items.push({ text: [info.text], nested: [] })
            i++
            continue
        }
        if (info && info.indent > base) {
            const sub = parseList(lines, i, info.indent)
            if (items.length) items[items.length - 1].nested.push(sub.html)
            else items.push({ text: [], nested: [sub.html] })
            i = sub.next
            continue
        }
        if (!info && indentOf(line) > base && items.length) {
            items[items.length - 1].text.push(line.trim())
            i++
            continue
        }
        break
    }

    const tag = ordered ? 'ol' : 'ul'
    let html = `<${tag}>\n`
    for (const item of items) {
        const body = item.text
            .filter((t) => t !== '')
            .map((t) => inline(t))
            .join('<br>')
        html += `<li>${body}${item.nested.join('')}</li>\n`
    }
    html += `</${tag}>`
    return { html, next: i }
}

/* ---------------------------------------------------------------
 * Images
 * --------------------------------------------------------------- */
function buildImageIndex(bookRoot) {
    const index = new Map()
    for (const dir of IMAGE_DIRS) {
        const abs = path.join(bookRoot, dir)
        if (!fs.existsSync(abs)) continue
        for (const file of fs.readdirSync(abs)) {
            const key = decodeSafe(file).toLowerCase()
            const full = path.join(abs, file)
            if (fs.statSync(full).isFile() && !index.has(key)) index.set(key, full)
        }
    }
    return index
}

function safeImageName(src) {
    const base = decodeSafe(String(src).split('/').pop() || 'image')
    const cleaned = base.replace(/\s+/g, '-').replace(/[^A-Za-z0-9._-]/g, '_')
    return cleaned || 'image'
}

function makeImageResolver(ctx) {
    return function resolve(src) {
        const base = decodeSafe(String(src).split('/').pop() || '').trim()
        if (!base) return null
        const lower = base.toLowerCase()

        let found = null
        for (const dir of IMAGE_DIRS) {
            const candidate = path.join(ctx.bookRoot, dir, base)
            if (fs.existsSync(candidate)) {
                found = candidate
                break
            }
        }
        if (!found) {
            const direct = path.join(ctx.bookRoot, decodeSafe(String(src)))
            if (fs.existsSync(direct)) found = direct
        }
        if (!found && ctx.imageIndex.has(lower)) found = ctx.imageIndex.get(lower)
        if (!found) {
            ctx.missing.push(base)
            return null
        }

        if (ctx.copied.has(found)) return ctx.copied.get(found)

        const outName = safeImageName(base)
        let target = path.join(ctx.imgOutDir, outName)
        if (fs.existsSync(target) && ctx.usedNames.get(outName) !== found) {
            const ext = path.extname(outName)
            const stem = path.basename(outName, ext)
            let n = 2
            while (fs.existsSync(path.join(ctx.imgOutDir, `${stem}-${n}${ext}`))) n++
            target = path.join(ctx.imgOutDir, `${stem}-${n}${ext}`)
        }
        ensureDir(ctx.imgOutDir)
        fs.copyFileSync(found, target)
        const rel = `assets/img/${path.basename(target)}`
        ctx.copied.set(found, rel)
        ctx.usedNames.set(path.basename(target), found)
        ctx.copiedCount++
        return rel
    }
}

/* ---------------------------------------------------------------
 * Markdown → HTML blocks
 * --------------------------------------------------------------- */
function mdToBlocks(md, ctx, depth = 0) {
    const lines = md.replace(/\r\n?/g, '\n').split('\n')
    const out = []
    let i = 0
    let h1Seen = false
    let h2Seen = false
    let summaryUsed = false

    const resolveImage = ctx.resolveImage

    while (i < lines.length) {
        const line = lines[i]

        if (!line.trim()) {
            i++
            continue
        }

        // ---- fenced code (ASCII diagrams) ----
        const fence = line.match(/^\s*(```+|~~~+)/)
        if (fence) {
            const marker = fence[1]
            const buf = []
            i++
            while (i < lines.length && !lines[i].trim().startsWith(marker)) {
                buf.push(lines[i])
                i++
            }
            i++
            out.push(`<pre><code>${escapeHtml(buf.join('\n'))}</code></pre>`)
            continue
        }

        // ---- horizontal rule ----
        if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
            out.push('<hr class="divider">')
            i++
            continue
        }

        // ---- image on its own line ----
        const img = line.match(/^\s*!\[([^\]]*)\]\(([^)]+)\)\s*$/)
        if (img) {
            const alt = img[1].trim()
            const rel = resolveImage(img[2].trim())
            i++
            let caption = ''
            let j = i
            while (j < lines.length && !lines[j].trim()) j++
            if (j < lines.length && /^\*[^*].*\*$/.test(lines[j].trim())) {
                caption = lines[j].trim().replace(/^\*/, '').replace(/\*$/, '')
                i = j + 1
            }
            if (rel) {
                out.push(
                    `<figure>\n  <img src="${rel}" alt="${escapeHtml(alt)}">\n` +
                    (caption ? `  <figcaption>${inline(caption)}</figcaption>\n` : '') +
                    `</figure>`
                )
            } else {
                out.push(
                    `<figure class="missing">⚠️ تصویر دستیاب نہیں: ${escapeHtml(alt || img[2])}</figure>`
                )
            }
            continue
        }

        // ---- headings ----
        const h = line.match(/^(#{1,6})\s+(.*)$/)
        if (h) {
            const level = h[1].length
            const text = h[2].trim()

            // "### (Part 1: Basics)" right under an H1 → English subtitle
            if (level === 3 && /^\(.*\)$/.test(text) && out.length && out[out.length - 1].startsWith('<h1')) {
                out.push(`<p class="en-subtitle">${inline(text.replace(/^\(|\)$/g, ''))}</p>`)
                i++
                continue
            }

            const tag = `h${Math.min(level, 4)}`
            if (level === 1) {
                h1Seen = true
                out.push(`<${tag} class="chapter-title">${inline(text)}</${tag}>`)
            } else {
                if (level === 2) h2Seen = true
                out.push(`<${tag}>${inline(text)}</${tag}>`)
            }
            i++
            continue
        }

        // ---- table ----
        if (isTableStart(lines, i)) {
            const res = parseTable(lines, i)
            out.push(res.html)
            i = res.next
            continue
        }

        // ---- blockquote ----
        if (/^\s*>/.test(line)) {
            const buf = []
            while (i < lines.length && /^\s*>/.test(lines[i])) {
                buf.push(lines[i].replace(/^\s*>\s?/, ''))
                i++
            }
            const inner = depth < 3 ? mdToBlocks(buf.join('\n'), ctx, depth + 1) : ''
            const isSummary = h1Seen && !h2Seen && !summaryUsed
            if (isSummary) summaryUsed = true
            out.push(
                `<blockquote${isSummary ? ' class="chapter-summary"' : ''}>\n${inner}\n</blockquote>`
            )
            continue
        }

        // ---- lists ----
        if (listInfo(line)) {
            const res = parseList(lines, i)
            out.push(res.html)
            i = res.next
            continue
        }

        // ---- paragraph ----
        const buf = []
        while (
            i < lines.length &&
            lines[i].trim() &&
            !/^\s*>/.test(lines[i]) &&
            !/^#{1,6}\s/.test(lines[i]) &&
            !listInfo(lines[i]) &&
            !/^\s*(```+|~~~+)/.test(lines[i]) &&
            !/^\s*!\[[^\]]*\]\([^)]+\)\s*$/.test(lines[i]) &&
            !/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i]) &&
            !isTableStart(lines, i)
        ) {
            buf.push(lines[i].trim())
            i++
        }
        if (buf.length) out.push(`<p>${inline(buf.join(' '))}</p>`)
        else i++
    }

    return out.join('\n')
}

/** Wrap 🎯 / ⚠️ / ✅ / 📝 / 🧠 sections into coloured callout blocks. */
function wrapCallouts(html) {
    const chunks = html.split(/(?=^<h2)/m)
    return chunks
        .map((chunk) => {
            const m = chunk.match(/^<h2[^>]*>([\s\S]*?)<\/h2>/)
            if (!m) return chunk
            const title = m[1]
            let cls = null
            for (const c of CALLOUTS) {
                if (title.includes(c.match)) {
                    cls = c.cls
                    break
                }
            }
            if (!cls) return chunk

            // Keep section-separating rules outside the callout box.
            let inner = chunk.trimEnd()
            let trailing = ''
            while (/<hr class="divider">$/.test(inner)) {
                inner = inner.replace(/<hr class="divider">$/, '').trimEnd()
                trailing = `<hr class="divider">\n${trailing}`
            }
            return `<section class="callout ${cls}">\n${inner}\n</section>\n${trailing}`
        })
        .join('\n')
}

function markdownToHtml(md, ctx) {
    return wrapCallouts(mdToBlocks(md, ctx))
}

/* ---------------------------------------------------------------
 * Page rendering
 * --------------------------------------------------------------- */
function navBar(prev, next) {
    const left = prev
        ? `<a href="${prev.href}">← پچھلا</a>`
        : `<span>← پچھلا</span>`
    const right = next
        ? `<a href="${next.href}">اگلا →</a>`
        : `<span>اگلا →</span>`
    return `    <div class="nav">\n        ${left}\n        <a href="index.html">🏠 فہرست</a>\n        ${right}\n    </div>`
}

function renderPage({ book, pageTitle, bodyHtml, prev, next }) {
    return `<!DOCTYPE html>
<html lang="ur" dir="rtl" data-theme="${book.theme}" data-mode="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(pageTitle)} — ${escapeHtml(book.titleUrdu)}</title>
    <link rel="stylesheet" href="/books/book.css">
    <link rel="stylesheet" href="/books/manuscript.css">
</head>
<body oncontextmenu="return false;">

    <div class="toolbar">
        <a href="index.html">🏠 فہرست</a>
        <span class="book-name">${escapeHtml(book.titleUrdu)}</span>
    </div>

${navBar(prev, next)}

${bodyHtml}

    <hr class="divider">

${navBar(prev, next)}

    <div class="back">
        <a href="index.html">🏠 فہرست پر واپس</a>
    </div>

    <div class="footer">${escapeHtml(book.footer)}</div>

${PROTECT_SCRIPT}
</body>
</html>
`
}

function renderIndex({ book, entries }) {
    let toc = ''
    for (const group of entries) {
        toc += '        <div class="toc-group">\n'
        if (group.title) toc += `            <h4 class="toc-subhead">${inline(group.title)}</h4>\n`
        if (group.href) {
            toc += `            <a class="toc-part" href="${group.href}">${inline(group.label)}</a>\n`
        }
        for (const item of group.items || []) {
            const num = item.num ? `<span class="num">${item.num}</span>` : ''
            toc += `            <a class="toc-ch" href="${item.href}">${num}${inline(item.label)}</a>\n`
        }
        toc += '        </div>\n'
    }

    const coverImg = book.coverOut
        ? `        <img src="/covers/${book.coverOut}" alt="${escapeHtml(book.titleUrdu)}" style="max-width:280px;width:70%;border-radius:15px;border:3px solid var(--accent);margin:0 auto 24px auto;display:block;">\n`
        : ''

    return `<!DOCTYPE html>
<html lang="ur" dir="rtl" data-theme="${book.theme}" data-mode="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(book.titleUrdu)} — ${escapeHtml(book.title)}</title>
    <link rel="stylesheet" href="/books/book.css">
    <link rel="stylesheet" href="/books/manuscript.css">
</head>
<body oncontextmenu="return false;">

    <div class="cover">
${coverImg}        <h1>${escapeHtml(book.titleUrdu)}</h1>
        <h2>${escapeHtml(book.title)}</h2>
        <p>${inline(book.tagline)}</p>
        <p class="cover-sub">${escapeHtml(book.stats || '')}</p>
    </div>

    <div class="toc">
        <h3>📚 فہرست مضامین</h3>
${toc}    </div>

    <div class="notice">
        <strong>⚠️ اہم نوٹ:</strong> اس کتاب کا تمام مواد صرف تعلیمی مقاصد کے لیے ہے۔ ٹریڈنگ اور
        سرمایہ کاری میں سرمائے کے مکمل نقصان کا خطرہ موجود ہے۔ کوئی بھی کتاب منافع کی گارنٹی نہیں دیتی —
        ہر فیصلے سے پہلے اپنی تحقیق کریں اور صرف اتنی رقم لگائیں جو گم ہو جانے کی گنجائش ہو۔
    </div>

    <div class="footer">${escapeHtml(book.footer)}</div>

${PROTECT_SCRIPT}
</body>
</html>
`
}

/* ---------------------------------------------------------------
 * Manuscript discovery
 * --------------------------------------------------------------- */
function readTitle(file) {
    const md = readText(file)
    const m = md.match(/^#\s+(.+)$/m)
    return m ? m[1].trim() : path.basename(file, '.md')
}

function chapterNumberOf(title) {
    const m = title.match(/باب\s*(\d+)/) || title.match(/Chapter\s*(\d+)/i)
    return m ? parseInt(m[1], 10) : null
}

function chapterLabel(title) {
    return title.replace(/^باب\s*\d+\s*[:：]\s*/, '').trim()
}

function discoverBook(bookRoot) {
    const manuscript = path.join(bookRoot, 'manuscript')
    if (!fs.existsSync(manuscript)) {
        throw new Error(`Manuscript folder not found: ${manuscript}`)
    }

    const front = []
    const frontDir = path.join(manuscript, 'front-matter')
    if (fs.existsSync(frontDir)) {
        for (const file of fs.readdirSync(frontDir).filter((f) => f.endsWith('.md')).sort()) {
            if (/^00-cover\.md$/i.test(file)) continue // becomes index.html
            const abs = path.join(frontDir, file)
            front.push({
                file: abs,
                out: `front-${stripOrderPrefix(file)}.html`,
                title: readTitle(abs),
            })
        }
    }

    const parts = []
    for (const dir of fs
        .readdirSync(manuscript)
        .filter((d) => /^part-\d+/i.test(d))
        .sort()) {
        const partNum = parseInt(dir.match(/^part-(\d+)/i)[1], 10)
        const partDir = path.join(manuscript, dir)
        const files = fs.readdirSync(partDir).filter((f) => f.endsWith('.md')).sort()

        const introFile = files.find((f) => /^0*-?part-intro\.md$/i.test(f))
        const chapters = []
        for (const file of files) {
            if (introFile && file === introFile) continue
            if (!/^ch-/i.test(file)) continue
            const abs = path.join(partDir, file)
            const title = readTitle(abs)
            chapters.push({
                file: abs,
                out: `chapter-${chapterNumberOf(title) ?? chapters.length + 1}.html`,
                num: chapterNumberOf(title),
                title,
                label: chapterLabel(title),
            })
        }
        chapters.sort((a, b) => (a.num ?? 0) - (b.num ?? 0))

        let intro = null
        if (introFile) {
            const abs = path.join(partDir, introFile)
            intro = {
                file: abs,
                out: `part-${partNum}.html`,
                title: readTitle(abs),
            }
        }

        parts.push({ num: partNum, dir, title: intro ? intro.title : `حصہ ${partNum}`, intro, chapters })
    }

    const back = []
    const backDir = path.join(manuscript, 'back-matter')
    if (fs.existsSync(backDir)) {
        for (const file of fs.readdirSync(backDir).filter((f) => f.endsWith('.md')).sort()) {
            const abs = path.join(backDir, file)
            back.push({
                file: abs,
                out: `back-${stripOrderPrefix(file)}.html`,
                title: readTitle(abs),
            })
        }
    }

    return { front, parts, back }
}

/* ---------------------------------------------------------------
 * Book build
 * --------------------------------------------------------------- */
function buildBook(cfg) {
    const bookRoot = path.join(SRC_ROOT, cfg.sourceDir)
    if (!fs.existsSync(bookRoot)) {
        throw new Error(`Source folder not found: ${bookRoot}`)
    }

    const outDir = path.join(PUBLIC_DIR, cfg.id)
    const imgOutDir = path.join(outDir, 'assets', 'img')

    fs.rmSync(outDir, { recursive: true, force: true })
    ensureDir(outDir)
    ensureDir(imgOutDir)

    const ctx = {
        bookRoot,
        imgOutDir,
        imageIndex: buildImageIndex(bookRoot),
        copied: new Map(),
        usedNames: new Map(),
        missing: [],
        copiedCount: 0,
        resolveImage: null,
    }
    ctx.resolveImage = makeImageResolver(ctx)

    const book = { ...cfg }
    const structure = discoverBook(bookRoot)

    // --- ordered reading sequence (drives prev/next navigation) ---
    const pages = []
    const pushPage = (p) => pages.push(p)

    for (const f of structure.front) {
        pushPage({ out: f.out, title: f.title, file: f.file, label: f.title })
    }
    for (const part of structure.parts) {
        if (part.intro) {
            pushPage({ out: part.intro.out, title: part.intro.title, file: part.intro.file, label: part.title })
        }
        for (const ch of part.chapters) {
            pushPage({ out: ch.out, title: ch.title, file: ch.file, label: ch.label, num: ch.num })
        }
    }
    for (const b of structure.back) {
        pushPage({ out: b.out, title: b.title, file: b.file, label: b.title })
    }

    if (!pages.length) throw new Error(`No pages discovered in ${bookRoot}`)

    const totalChapters = structure.parts.reduce((n, p) => n + p.chapters.length, 0)
    book.stats = `${structure.parts.length} حصے · ${totalChapters} ابواب`

    // --- write pages ---
    let written = 0
    for (let idx = 0; idx < pages.length; idx++) {
        const page = pages[idx]
        const prev = idx === 0 ? null : { href: pages[idx - 1].out }
        const next = idx === pages.length - 1 ? null : { href: pages[idx + 1].out }
        const body = markdownToHtml(readText(page.file), ctx)
        const html = renderPage({
            book,
            pageTitle: page.title,
            bodyHtml: body,
            prev,
            next,
        })
        fs.writeFileSync(path.join(outDir, page.out), html, 'utf8')
        written++
    }

    // --- index.html (cover + grouped TOC) ---
    const entries = []

    if (structure.front.length) {
        entries.push({
            title: 'ابتدائی صفحات',
            items: structure.front.map((f) => ({ href: f.out, label: f.title })),
        })
    }

    for (const part of structure.parts) {
        entries.push({
            title: `حصہ ${part.num}`,
            href: part.intro ? part.intro.out : null,
            label: part.title,
            items: part.chapters.map((ch) => ({ href: ch.out, label: ch.label, num: ch.num })),
        })
    }

    if (structure.back.length) {
        entries.push({
            title: 'ضمیمے',
            items: structure.back.map((b) => ({ href: b.out, label: b.title })),
        })
    }

    fs.writeFileSync(path.join(outDir, 'index.html'), renderIndex({ book, entries }), 'utf8')

    // --- copy cover image ---
    if (cfg.coverSource) {
        const coverSrc = path.join(SRC_ROOT, cfg.coverSource)
        if (fs.existsSync(coverSrc)) {
            ensureDir(path.join(PUBLIC_DIR, 'covers'))
            fs.copyFileSync(coverSrc, path.join(PUBLIC_DIR, 'covers', cfg.coverOut))
        } else {
            console.warn(`  ! cover image not found: ${coverSrc}`)
            book.coverOut = null
        }
    }

    // --- verify every internal link / image target exists ---
    const broken = []
    for (const file of fs.readdirSync(outDir).filter((f) => f.endsWith('.html'))) {
        const html = readText(path.join(outDir, file))
        for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
            const target = m[1]
            if (!target || /^(https?:|mailto:|#|\/)/.test(target)) continue
            if (!fs.existsSync(path.join(outDir, target))) {
                broken.push(`${file} → ${target}`)
            }
        }
    }
    const uniqueBroken = [...new Set(broken)]

    // --- report ---
    console.log(`\n📚 ${cfg.id}`)
    console.log(`   title      : ${cfg.titleUrdu}`)
    console.log(`   out dir    : ${path.relative(REPO_ROOT, outDir)}`)
    console.log(`   pages      : ${written + 1} (incl. index.html)`)
    console.log(`   parts      : ${structure.parts.length}`)
    console.log(`   chapters   : ${totalChapters}`)
    console.log(`   appendices : ${structure.back.length}`)
    console.log(`   images     : ${ctx.copiedCount} copied`)
    console.log(`   links      : ${uniqueBroken.length ? `❌ ${uniqueBroken.length} broken` : '✅ all resolve'}`)
    if (ctx.missing.length) {
        const uniq = [...new Set(ctx.missing)]
        console.log(`   ⚠ missing  : ${uniq.length}`)
        for (const m of uniq.slice(0, 25)) console.log(`        - ${m}`)
        if (uniq.length > 25) console.log(`        … and ${uniq.length - 25} more`)
    }
    for (const b of uniqueBroken.slice(0, 25)) console.log(`        - ${b}`)

    return {
        written,
        totalChapters,
        missing: [...new Set(ctx.missing)],
        broken: uniqueBroken,
        images: ctx.copiedCount,
    }
}

/* ---------------------------------------------------------------
 * Main
 * --------------------------------------------------------------- */
function main() {
    const filter = process.argv[2]
    if (!fs.existsSync(SRC_ROOT)) {
        console.error(`Source root not found: ${SRC_ROOT}`)
        console.error('Set NEW_BOOKS_DIR to the folder that holds the book folders.')
        process.exit(1)
    }

    const targets = filter ? BOOKS.filter((b) => b.id.includes(filter)) : BOOKS
    if (!targets.length) {
        console.error(`No book matches "${filter}". Known ids: ${BOOKS.map((b) => b.id).join(', ')}`)
        process.exit(1)
    }

    const results = []
    for (const cfg of targets) {
        results.push({ id: cfg.id, ...buildBook(cfg) })
    }

    const missingTotal = results.reduce((n, r) => n + r.missing.length, 0)
    const brokenTotal = results.reduce((n, r) => n + r.broken.length, 0)
    console.log('\n──────────────────────────────────────────────')
    console.log(`✅ Built ${results.length} book(s); ${missingTotal} missing image reference(s).`)
    console.log(brokenTotal ? `❌ ${brokenTotal} broken link(s).` : '✅ All internal links resolve.')
    if (missingTotal || brokenTotal) process.exitCode = 2
}

main()
