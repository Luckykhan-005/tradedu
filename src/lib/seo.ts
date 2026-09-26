import type { Page } from '@/components/Navigation'
import { books } from '@/components/Books'
import { blogPosts, type BlogPost } from '@/data/blog'

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
      'Urdu mein trading seekhein: 25+ free trading books, courses, AI tools, risk calculator, glossary aur live sessions ke sath — zero se professional tak.',
  },
  courses: {
    title: 'Trading Courses in Urdu — Zero se Professional | TradeEd',
    description:
      'Binance, forex, crypto futures, price action aur risk management ke practical Urdu courses — har course ka pehla module bilkul free.',
  },
  books: {
    title: '25+ Free Trading Books in Urdu | TradeEd',
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
      'TradeEd Free aur Premium plan: 25+ free books aur courses ka pehla module free; Premium PKR 1,499/month — saare courses, certificates, AI tools.',
  },
  glossary: {
    title: 'Trading Glossary in Urdu — Trading Terms Samjhein | TradeEd',
    description:
      'Trading ke terms Roman Urdu mein: pips, leverage, liquidation, order types aur bohot kuch — asaan wazahat ke sath trading glossary.',
  },
  calculator: {
    title: 'Futures & Risk Calculator — Free Trading Tool | TradeEd',
    description:
      'Position size, risk-reward aur leverage calculate karein — free trading risk calculator Roman Urdu ke sath, galat trade se pehle hisaab lagayein.',
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
  contact: {
    title: 'Contact TradeEd | TradeEd',
    description:
      'TradeEd se rabta karein — WhatsApp, Telegram, YouTube aur email. Sawaal, suggestions ya support ke liye contact karein.',
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

interface SeoInput {
  page: Page
  path: string
  post?: BlogPost | null
  course?: { title: string; description?: string } | null
  tool?: { name?: string; description?: string } | null
}

export function applyPageSeo({ page, path, post, course, tool }: SeoInput) {
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
    description =
      (course.description || `Urdu trading course: ${course.title} — practical video lessons ke sath zero se professional tak seekhein.`).slice(0, 155)
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.title,
      description: course.description,
      inLanguage: 'ur-Latn',
      provider: { '@type': 'Organization', name: 'TradeEd', url: `${SITE}/` },
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
    } else {
      // ai-tool-detail / unknown — dynamic title jo abhi browser me hai, wahi rehne do
      title = document.title
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

  document.title = title || document.title
  upsertLink('canonical', `${SITE}${path}`)
  setRobots(index && path !== '/subscribe')
  if (description) upsertMeta('name', 'description', description)
  upsertMeta('property', 'og:title', document.title)
  if (description) upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:url', `${SITE}${path}`)
  upsertMeta('name', 'twitter:title', document.title)
  if (description) upsertMeta('name', 'twitter:description', description)
  setJsonLd(jsonLd)
}
