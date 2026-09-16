// ─────────────────────────────────────────────────────────────────────────────
// ROUTE TABLE
// ─────────────────────────────────────────────────────────────────────────────
// Every page in the app has a real URL. Before this, "navigation" was just a
// string held in React state, so all pages shared one address: a student could
// not share a link to a course, a refresh dumped them back on the landing page,
// and search engines saw a single bare URL.
//
// Keeping the path knowledge in one file means the router, the navigation bar
// and the per-page metadata can never disagree about what a page is called.
// ─────────────────────────────────────────────────────────────────────────────
import { matchPath } from 'react-router-dom'

export type Page =
    | 'landing'
    | 'courses'
    | 'course-detail'
    | 'dashboard'
    | 'live-sessions'
    | 'ai-tools'
    | 'admin'
    | 'books'
    | 'calculator'
    | 'glossary'
    | 'journal'
    | 'certificates'
    | 'pricing'
    | 'subscribe'
    | 'legal'

/** Canonical URL for each page. `:courseId` is filled in by `pathForPage`. */
export const PAGE_PATHS: Record<Page, string> = {
    landing: '/',
    courses: '/courses',
    'course-detail': '/courses/:courseId',
    dashboard: '/dashboard',
    'live-sessions': '/live-sessions',
    'ai-tools': '/ai-tools',
    admin: '/admin',
    books: '/books',
    calculator: '/calculator',
    glossary: '/glossary',
    journal: '/journal',
    certificates: '/certificates',
    pricing: '/pricing',
    subscribe: '/subscribe',
    legal: '/legal',
}

/**
 * Title and description per page. These become the browser tab title and the
 * document description, so a shared link describes itself instead of showing
 * one generic site-wide title for every page.
 */
export const PAGE_META: Record<Page, { title: string; description: string }> = {
    landing: {
        title: 'TradeEd — Learn Crypto, Forex & Trading',
        description:
            'Structured trading education: video courses, a book library, live sessions, a risk calculator and a trading journal.',
    },
    courses: {
        title: 'Courses — TradeEd',
        description:
            'Browse structured trading courses by level, from beginner crypto basics to advanced price action and risk management.',
    },
    'course-detail': {
        title: 'Course — TradeEd',
        description: 'Course outline, lessons and progress.',
    },
    dashboard: {
        title: 'Dashboard — TradeEd',
        description: 'Your enrolled courses, progress and upcoming live sessions.',
    },
    'live-sessions': {
        title: 'Live Sessions — TradeEd',
        description: 'Scheduled live sessions with your instructor and the join links for each one.',
    },
    'ai-tools': {
        title: 'AI Tools — TradeEd',
        description: 'A curated hub of AI trading tools for signals, scanning and market analysis.',
    },
    admin: {
        title: 'Admin — TradeEd',
        description: 'Manage courses, modules, lessons, live sessions and subscription requests.',
    },
    books: {
        title: 'Books — TradeEd',
        description: 'A trading book library covering crypto, forex, price action and risk management.',
    },
    calculator: {
        title: 'Risk Calculator — TradeEd',
        description: 'Work out position size, risk/reward and liquidation levels before you enter a trade.',
    },
    glossary: {
        title: 'Glossary — TradeEd',
        description: 'Plain-language definitions of the trading terms used throughout the courses.',
    },
    journal: {
        title: 'Trading Journal — TradeEd',
        description: 'Log your trades and track your win rate, average risk/reward and results over time.',
    },
    certificates: {
        title: 'Certificates — TradeEd',
        description: 'Printable certificates for the courses you have completed.',
    },
    pricing: {
        title: 'Plans — TradeEd',
        description: 'Compare the free, Starter and Premium plans and what each one unlocks.',
    },
    subscribe: {
        title: 'Subscribe — TradeEd',
        description: 'Send your fee to our JazzCash or Easypaisa account and upload the receipt to activate your plan.',
    },
    legal: {
        title: 'Policies & Disclaimer — TradeEd',
        description:
            'Terms of use, refund policy, privacy notice and the educational risk disclaimer for TradeEd.',
    },
}

/**
 * Order matters: the more specific patterns are listed first so that
 * `/courses/:courseId` is tested before `/courses`.
 */
const MATCHERS: { page: Page; pattern: string }[] = [
    { page: 'course-detail', pattern: '/courses/:courseId' },
    { page: 'courses', pattern: '/courses' },
    { page: 'dashboard', pattern: '/dashboard' },
    { page: 'live-sessions', pattern: '/live-sessions' },
    { page: 'ai-tools', pattern: '/ai-tools' },
    { page: 'admin', pattern: '/admin' },
    { page: 'books', pattern: '/books' },
    { page: 'calculator', pattern: '/calculator' },
    { page: 'glossary', pattern: '/glossary' },
    { page: 'journal', pattern: '/journal' },
    { page: 'certificates', pattern: '/certificates' },
    { page: 'pricing', pattern: '/pricing' },
    { page: 'subscribe', pattern: '/subscribe' },
    { page: 'legal', pattern: '/legal' },
    { page: 'landing', pattern: '/' },
]

export interface MatchedRoute {
    page: Page
    /** Present only on `/courses/:courseId`. */
    courseId?: string
    /** False when the URL matched nothing, so the caller can correct the address. */
    matched: boolean
}

/** Resolve a URL pathname to a page (and course id, when there is one). */
export function pageFromPath(pathname: string): MatchedRoute {
    for (const { page, pattern } of MATCHERS) {
        const match = matchPath({ path: pattern, end: true }, pathname)
        if (match) return { page, courseId: match.params.courseId, matched: true }
    }
    return { page: 'landing', matched: false }
}

/** Build the URL for a page. */
export function pathForPage(page: Page, param?: string): string {
    if (page === 'course-detail') {
        return param ? `/courses/${encodeURIComponent(param)}` : '/courses'
    }
    return PAGE_PATHS[page]
}

/**
 * First path segments that belong to the app itself. Anything else in front of
 * these is treated as a mount path.
 */
const KNOWN_ROOTS = new Set([
    'courses',
    'dashboard',
    'live-sessions',
    'ai-tools',
    'admin',
    'books',
    'calculator',
    'glossary',
    'journal',
    'certificates',
    'pricing',
    'subscribe',
    'legal',
])

/**
 * The app is sometimes served from a sub-path rather than a domain root (for
 * example when it is embedded in a preview URL such as `/abc123/`). Reading the
 * mount path from the current location keeps routing correct in both cases
 * without a hard-coded base URL.
 */
export function detectBasename(): string {
    if (typeof window === 'undefined') return '/'
    const segments = window.location.pathname.split('/').filter(Boolean)
    if (segments.length === 0) return '/'
    if (KNOWN_ROOTS.has(segments[0])) return '/'
    return `/${segments[0]}`
}
