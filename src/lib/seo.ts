import type { Page } from '@/components/Navigation'
import { books } from '@/components/Books'
import { blogPosts, type BlogPost } from '@/data/blog'
import { getCalculator } from '@/data/calculators'
import { masterCourse, masterSeo } from '@/data/masterCourse'

const SITE = 'https://tradeed.online'

interface RouteMeta {
  title: string
  description: string
  index?: boolean
}

// Har page ka unique title + meta description (Google ke liye duplicate tags band).
const ROUTES: Partial<Record<Page, RouteMeta>> = {
  landing: {
    title: 'TradeEd — Trading Seekhein Urdu Mein | Free Books & Courses',
    description:
      'Urdu mein trading seekhein: 40+ free trading books, courses, AI tools, risk calculator, glossary aur live sessions ke sath — zero se professional tak.',
  },
  courses: {
    title: 'Trading Courses in Urdu — Zero se Professional | TradeEd',
    description:
      'Binance, forex, crypto futures, price action aur risk management ke practical Urdu courses — beginner course ka pehla module bilkul free.',
  },
  'master-course': {
    title: masterSeo.title,
    description: masterSeo.description,
  },
  books: {
    title: '40+ Free Trading Books in Urdu | TradeEd',
    description:
      'Free Urdu trading books: crypto futures, spot trading, Binance complete training, forex, candlesticks, SMC aur risk management — parhna shuru karein.',
  },
  blog: {
    title: 'Trading Blog in Urdu — Risk, Psychology, Crypto & Forex | TradeEd',
    description:
      'Roman Urdu trading articles: risk management, trading psychology, candlestick patterns, Binance P2P guide aur trading journal — practical guides.',
  },
  pricing: {
    title: 'Plans & Pricing — Free aur Premium PKR 1,499 | TradeEd',
    description:
      'TradeEd Free aur Premium plan: 40+ free books aur beginner course ka pehla module free; Premium PKR 1,499/month — saare courses, certificates, AI tools.',
  },
  glossary: {
    title: 'Trading Glossary in Urdu — Trading Terms Samjhein | TradeEd',
    description:
      'Trading ke terms Roman Urdu mein: pips, leverage, liquidation, order types aur bohot kuch — asaan wazahat ke sath trading glossary.',
  },
  calculator: {
    title: 'Free Trading Calculators — Position Size, Risk, P&L | TradeEd',
    description:
      'Free trading calculators: position size, risk-reward, leverage, P&L aur compounding — formula aur Roman Urdu example ke sath trade se pehle poora hisaab.',
  },
  mentor: {
    title: 'AI Trading Mentor (Roman Urdu) | TradeEd',
    description:
      'Trading ke sawal jawab Roman Urdu mein: knowledge base + AI mentor — risk, charts, psychology aur strategies seekhein.',
  },
  'ai-tools': {
    title: 'AI Trading Tools — Signal & Analysis | TradeEd',
    description:
      'AI se trading signals aur market analysis: BTCUSDT setups, confidence score aur risk-reward ke sath AI trading tools.',
  },
  'live-sessions': {
    title: 'Live Trading Sessions & Recordings | TradeEd',
    description:
      'TradeEd ki live trading sessions — schedule sab ke liye free, join aur past recordings Premium members ke liye.',
  },
  journal: {
    title: 'Trading Journal — Apne Trades Track Karein | TradeEd',
    description:
      'Trading journal banayein aur apne trades record karein — mistakes identify karke apni trading improve karein.',
  },
  liquidation: {
    title: 'Crypto Liquidation Heatmap — Live Liquidation Zones | TradeEd',
    description:
      'Free liquidation heatmap: BTC, ETH, SOL ka estimated liquidation zones live — long/short clusters, funding aur open interest ke sath Roman Urdu guide.',
  },
  market: {
    title: 'Crypto Market Overview — Live Prices, Dominance & Fear Greed | TradeEd',
    description:
      'Live crypto market overview: top 12 coins ki prices, total market cap, BTC/ETH dominance aur fear & greed index — Roman Urdu ke sath, har 60 second update.',
  },
  certificates: {
    title: 'Course Certificates | TradeEd',
    description:
      'TradeEd courses mukammal karein aur course certificate hasil karein — apni trading education ka proof.',
  },
  about: {
    title: 'About TradeEd — M. Aslam Khan | Urdu Trading Education',
    description:
      'TradeEd ki kahani: M. Aslam Khan ki Urdu trading books aur education platform — Pakistani traders ke liye practical Roman Urdu resources.',
  },
  roadmap: {
    title: 'Trading Roadmap — Beginner se Pro Tak | TradeEd Urdu Guide',
    description:
      'Trading kaise seekhein: 7-step Urdu roadmap — basics, technical analysis, risk management, psychology, backtesting, demo trading aur live trading tak ka poora rasta.',
  },
  contact: {
    title: 'Contact TradeEd | TradeEd',
    description:
      'TradeEd se rabta karein — WhatsApp, Telegram, YouTube aur email. Sawaal, suggestions ya support ke liye contact karein.',
  },
  hire: {
    title: 'Hire M. Aslam Khan — Web Developer for Trading & Business Websites',
    description:
      'Hire an experienced web developer: trading, education and business websites built with React, Next.js, Tailwind and Supabase — fixed quotes, fast delivery, free consultation.',
  },
  privacy: { title: 'Privacy Policy | TradeEd', description: 'TradeEd ki privacy policy — aapka data kaise use aur protect hota hai.' },
  terms: { title: 'Terms & Conditions | TradeEd', description: 'TradeEd ke terms and conditions — platform ke istemal ki shartein.' },
  disclaimer: { title: 'Risk Disclaimer | TradeEd', description: 'Trading risk disclaimer — trading mein significant risk hota hai, educational content only.' },
  dashboard: { title: 'Dashboard | TradeEd', description: 'TradeEd student dashboard.', index: false },
  admin: { title: 'Admin | TradeEd', description: 'Admin panel.', index: false },
  subscribe: { title: 'Subscribe to a Plan | TradeEd', description: 'TradeEd premium plan subscribe karein.', index: false },
  'not-found': { title: 'Page Nahi Mili | TradeEd', description: 'Page nahi mili.', index: false },
}

const upsertMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

const upsertLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

const setRobots = (index: boolean) =>
  upsertMeta('name', 'robots', index ? 'index, follow' : 'noindex, nofollow')

const setJsonLd = (data: unknown | null) => {
  const ID = 'seo-dynamic-ld'
  let el = document.getElementById(ID) as HTMLScriptElement | null
  if (!data) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('script')
    el.id = ID
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

const breadcrumb = (name: string, path: string) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
    { '@type': 'ListItem', position: 2, name, item: `${SITE}${path}` },
  ],
})

export interface SeoInput {
  page: Page
  path: string
  post?: BlogPost | null
  course?: { title: string; description?: string } | null
  tool?: { name?: string; description?: string } | null
  calcSlug?: string | null
  /** DOM-free callers (build-time prerender) ke liye fallback jab document.title na ho */
  fallbackTitle?: string
}

export interface PageSeo {
  title: string
  description: string
  index: boolean
  ogType: 'website' | 'article'
  ogImage: string
  keywords?: string
  jsonLd: unknown
}

// Pure SEO calculation — koi DOM access nahi, isliye Node (prerender script)
// mein bhi chal sakti hai. applyPageSeo ise browser mein document par apply karta hai.
export function buildPageSeo({
  page,
  path,
  post,
  course,
  tool,
  calcSlug,
  fallbackTitle = '',
}: SeoInput): PageSeo {
  let meta: RouteMeta | undefined
  let title = ''
  let description = ''
  let jsonLd: unknown | null = null
  let index = true

  if (page === 'blog-post' && post) {
    title = `${post.title} | TradeEd`
    description = post.excerpt
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      inLanguage: 'ur-Latn',
      author: { '@type': 'Person', name: 'M. Aslam Khan' },
      publisher: { '@type': 'Organization', name: 'TradeEd', url: `${SITE}/` },
      mainEntityOfPage: `${SITE}${path}`,
      image: post.hero ? `${SITE}${post.hero}` : undefined,
    }
  } else if (page === 'course-detail' && course) {
    title = `${course.title} — Urdu Trading Course | TradeEd`
    description = (
      course.description ||
      `Urdu trading course: ${course.title} — practical video lessons ke sath zero se professional tak.`
    )
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 155)
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.title,
      description: course.description || undefined,
      inLanguage: 'ur-Latn',
      url: `${SITE}${path}`,
      provider: { '@type': 'Organization', name: 'TradeEd', url: `${SITE}/` },
      educationalLevel: 'Beginner to Advanced',
    }
  } else if (page === 'master-course') {
    meta = ROUTES[page]
    title = meta?.title || masterSeo.title
    description = meta?.description || masterSeo.description
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: masterCourse.title,
      description: masterCourse.description,
      inLanguage: 'ur-Latn',
      url: `${SITE}${path}`,
      provider: { '@type': 'Organization', name: 'TradeEd', url: `${SITE}/` },
      creator: { '@type': 'Person', name: 'M. Aslam Khan' },
      educationalLevel: 'Beginner to Advanced',
    }
  } else if (page === 'ai-tool-detail') {
    title = `${tool?.name || 'AI Trading Tool'} — Free AI Tool | TradeEd`
    description =
      tool?.description ||
      'AI trading tool — signals aur market analysis hasil karein, Roman Urdu ke sath practical trading tools.'
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool?.name || 'TradeEd AI Tool',
      description,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'PKR' },
    }
  } else {
    meta = ROUTES[page]
    if (meta) {
      title = meta.title
      description = meta.description
      index = meta.index !== false
  } else if (page === 'calculator-detail') {
    const calc = calcSlug ? getCalculator(calcSlug) : undefined
    title = calc?.seoTitle || 'Free Trading Calculator | TradeEd'
    description =
      calc?.seoDesc ||
      'Free trading calculator — position size, risk aur P&L ka hisaab Roman Urdu ke sath.'
    jsonLd = calc
      ? {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: calc.title,
          description: calc.seoDesc,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web',
          inLanguage: 'ur-Latn',
          url: `${SITE}${path}`,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'PKR' },
        }
      : null
  } else {
      // ai-tool-detail / unknown — fallback title (browser mein document.title)
      title = fallbackTitle
      description = ''
    }
  }

  // Books/blog list pages par ItemList schema — Google ko pages dikhata hai.
  if (page === 'books' && !jsonLd) {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Trading Books in Urdu',
      numberOfItems: books.length,
      itemListElement: books.slice(0, 30).map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.title,
        url: b.href.startsWith('/') ? `${SITE}${b.href}` : b.href,
      })),
    }
  } else if (page === 'blog' && !jsonLd) {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Trading Blog in Urdu',
      url: `${SITE}/blog`,
      hasPart: blogPosts.map((p) => ({
        '@type': 'BlogPosting',
        headline: p.title,
        datePublished: p.date,
        url: `${SITE}/blog/${p.slug}`,
      })),
    }
  } else if (page === 'roadmap' && !jsonLd) {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'Trading Kaise Seekhein — 7-Step Urdu Roadmap',
      description:
        'Beginner se professional trading tak ka 7-step roadmap: basics, technical analysis, risk management, psychology, backtesting, demo trading aur live trading.',
      inLanguage: 'ur-Latn',
      totalTime: 'P6M',
      estimatedCost: { '@type': 'MonetaryAmount', price: '0', priceCurrency: 'PKR' },
      step: [
        { '@type': 'HowToStep', name: 'Trading Basics & Market Samajh', text: 'Market basics, orders, candlesticks aur exchange setup seekhein (2-3 hafte).' },
        { '@type': 'HowToStep', name: 'Technical Analysis', text: 'Support/resistance, chart patterns aur indicators seekhein (3-4 hafte).' },
        { '@type': 'HowToStep', name: 'Risk Management', text: 'Position sizing, stop loss aur 1% risk rule seekhein (2 hafte).' },
        { '@type': 'HowToStep', name: 'Trading Psychology', text: 'FOMO, revenge trading aur discipline par kaam karein (1-2 hafte).' },
        { '@type': 'HowToStep', name: 'Strategy & Backtesting', text: 'Apni strategy likhein aur historical data par test karein (3-4 hafte).' },
        { '@type': 'HowToStep', name: 'Demo Trading', text: '1-2 mahine demo account par practice karein aur trades journal mein log karein.' },
        { '@type': 'HowToStep', name: 'Live Trading', text: 'Chhote capital se 1% risk rule ke saath live trading shuru karein.' },
      ],
    }
  } else if (page === 'landing') {
    jsonLd = null // index.html ki WebSite/Organization schema hi chalegi
  } else if (!jsonLd && title) {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description: description || undefined,
      url: `${SITE}${path}`,
      inLanguage: 'ur-Latn',
    }
  }

  // Breadcrumb parhne wali pages par
  if (index && path && path !== '/' && title) {
    const name = title.split('|')[0].split('—')[0].trim() || title
    jsonLd = Array.isArray(jsonLd)
      ? jsonLd
      : { '@graph': [jsonLd, breadcrumb(name, path)].filter(Boolean) }
  }

  const ogImage =
    page === 'blog-post' && post?.hero
      ? `${SITE}${post.hero}`
      : page === 'master-course'
        ? `${SITE}${masterSeo.ogImage}`
        : `${SITE}/hero-banner.webp`
  const keywords = post?.tags?.length ? post.tags.join(', ') : undefined
  return {
    title,
    description,
    index,
    ogType: page === 'blog-post' ? 'article' : 'website',
    ogImage,
    keywords,
    jsonLd,
  }
}

export function applyPageSeo(input: SeoInput) {
  const seo = buildPageSeo({ ...input, fallbackTitle: input.fallbackTitle ?? document.title })

  document.title = seo.title || document.title
  upsertLink('canonical', `${SITE}${input.path}`)
  setRobots(seo.index && input.path !== '/subscribe')
  if (seo.description) upsertMeta('name', 'description', seo.description)
  upsertMeta('property', 'og:title', document.title)
  if (seo.description) upsertMeta('property', 'og:description', seo.description)
  upsertMeta('property', 'og:url', `${SITE}${input.path}`)
  upsertMeta('property', 'og:type', seo.ogType)
  upsertMeta('property', 'og:image', seo.ogImage)
  upsertMeta('name', 'twitter:title', document.title)
  if (seo.description) upsertMeta('name', 'twitter:description', seo.description)
  upsertMeta('name', 'twitter:image', seo.ogImage)
  if (seo.keywords) upsertMeta('name', 'keywords', seo.keywords)
  setJsonLd(seo.jsonLd)
}
