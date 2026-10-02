import {
  Code2,
  Rocket,
  Smartphone,
  Wrench,
  Search,
  ShoppingCart,
  CheckCircle2,
  MessageCircle,
  Mail,
  ArrowRight,
  ExternalLink,
  Clock,
  Users,
  Award,
  Zap,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/cn'
import type { Page } from './Navigation'

interface HireMeProps {
  onNavigate: (page: Page) => void
}

const WHATSAPP =
  'https://wa.me/923208427368?text=' +
  encodeURIComponent('Hi! I would like to get a website built — I came from your Hire Me page.')

function ButtonLink({
  href,
  variant = 'default',
  size = 'lg',
  newTab = true,
  className,
  children,
}: {
  href: string
  variant?: 'default' | 'outline'
  size?: 'lg' | 'default'
  newTab?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        variant === 'outline'
          ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
          : 'bg-primary text-primary-foreground hover:bg-primary/90',
        size === 'lg' ? 'h-11 rounded-md px-8' : 'h-10 px-4 py-2',
        className
      )}
    >
      {children}
    </a>
  )
}

const portfolio = [
  { title: 'SaaS Landing Page', cat: 'SaaS / Marketing', img: '/portfolio/thumbs/saas-landing.webp', url: 'https://tradeed.online/portfolio/saas-landing/' },
  { title: 'AI Dashboard & CRM', cat: 'Web App / SaaS', img: '/portfolio/thumbs/ai-dashboard.webp', url: 'https://tradeed.online/portfolio/ai-dashboard/' },
  { title: 'E-commerce Store', cat: 'Retail / E-commerce', img: '/portfolio/thumbs/ecommerce.webp', url: 'https://tradeed.online/portfolio/ecommerce/' },
  { title: 'AI Startup Landing', cat: 'Startup / AI', img: '/portfolio/thumbs/startup.webp', url: 'https://tradeed.online/portfolio/startup/' },
  { title: 'Restaurant Website', cat: 'Local Business', img: '/portfolio/thumbs/restaurant.webp', url: 'https://tradeed.online/portfolio/restaurant/' },
  { title: 'Real Estate Platform', cat: 'Real Estate', img: '/portfolio/thumbs/real-estate.webp', url: 'https://tradeed.online/portfolio/real-estate/' },
  { title: 'Creative Agency Site', cat: 'Agency', img: '/portfolio/thumbs/agency.webp', url: 'https://tradeed.online/portfolio/agency/' },
]

const services = [
  {
    icon: TrendingUp,
    title: 'Trading & Education Websites',
    desc: 'Complete websites for trading academies, courses, signal providers and fintech brands — just like tradeed.online.',
    tags: ['React', 'Supabase', 'Courses'],
  },
  {
    icon: Rocket,
    title: 'Landing Pages',
    desc: 'High-converting single pages for your product, service or campaign. Fast, mobile-first and eye-catching.',
    tags: ['24-48 hours', 'Mobile-first', 'Fast'],
  },
  {
    icon: ShoppingCart,
    title: 'E-commerce Stores',
    desc: 'Online stores on Shopify or WordPress (WooCommerce) — products, payment gateway and order management included.',
    tags: ['Shopify', 'WooCommerce', 'Payments'],
  },
  {
    icon: Code2,
    title: 'Custom Web Apps',
    desc: 'Dashboards, tools, portals and custom React/Next.js applications — built exactly to your idea.',
    tags: ['React', 'Next.js', 'Supabase'],
  },
  {
    icon: Search,
    title: 'SEO & Speed Optimization',
    desc: 'Improve your existing website ranking and speed — Core Web Vitals, meta tags and technical SEO.',
    tags: ['Google ranking', 'Core Vitals'],
  },
  {
    icon: Wrench,
    title: 'Maintenance & Support',
    desc: 'Website updates, backups, edits and security — regular care on a simple monthly plan.',
    tags: ['Monthly', 'Updates', 'Security'],
  },
]

const packages = [
  {
    name: 'Starter',
    price: '$79',
    for: 'Landing page / 1-page site',
    features: [
      '1 responsive page',
      'Contact form / WhatsApp button',
      'Basic SEO (title + description)',
      '3-day delivery',
      '2 revisions',
    ],
    highlight: false,
  },
  {
    name: 'Business',
    price: '$199',
    for: '5-8 page business website',
    features: [
      '5-8 pages (Home, About, Services...)',
      'Blog or portfolio section',
      'Contact form + Google Maps',
      'Full on-page SEO',
      'Speed optimization',
      '7-day delivery',
      'Unlimited revisions (within 7 days)',
    ],
    highlight: true,
  },
  {
    name: 'Custom App',
    price: '$499+',
    for: 'Web app / e-commerce / custom',
    features: [
      'Custom design or built from your Figma file',
      'Database + user accounts',
      'Admin dashboard',
      'Payment integration',
      '14-21 days (depending on scope)',
      '30 days free support',
    ],
    highlight: false,
  },
]

const steps = [
  {
    n: '1',
    title: 'Free Consultation',
    desc: 'We understand your needs over WhatsApp or email — what you want, budget and timeline.',
  },
  {
    n: '2',
    title: 'Scope & Fixed Quote',
    desc: 'A clear plan: what gets built, how much, and by when. No surprise hidden costs.',
  },
  {
    n: '3',
    title: 'Build & Updates',
    desc: 'Updates at every step — design approval, then pages, then final review.',
  },
  {
    n: '4',
    title: 'Launch & Support',
    desc: 'Live on your domain/hosting, plus a walkthrough of how to manage it — 30 days free support.',
  },
]

const faqs = [
  {
    q: 'How long does it take?',
    a: 'Landing page: 2-3 days, business website: 7-10 days, custom app: 2-3 weeks depending on scope. Express delivery is available for rush orders.',
  },
  {
    q: 'How does payment work?',
    a: '50% advance, 50% on delivery — bank transfer, EasyPaisa/JazzCash or PayPal. Invoice at every milestone.',
  },
  {
    q: 'Are domain and hosting included?',
    a: 'Buy the domain/hosting in your own name (GoDaddy/Namecheap) — I will handle the setup. I can also suggest the best options for your budget.',
  },
  {
    q: 'I have no technical knowledge — is that still okay?',
    a: 'Absolutely. You just bring the idea — design, code and deployment are all handled by me. On delivery I walk you through everything in one call.',
  },
]

export function HireMe({ onNavigate }: HireMeProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      {/* Hero */}
      <div className="text-center">
        <Badge variant="secondary" className="mb-4">
          <Users className="mr-1.5 h-3.5 w-3.5" /> Available for freelance work
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Your website? <span className="text-primary">I will build it.</span>
        </h1>
        <div className="mx-auto mt-7 flex max-w-3xl items-center gap-5 text-left">
          <span className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/60 via-primary/25 to-primary/5 p-1.5 sm:h-32 sm:w-32">
            <img
              src="/profile/aslam-khan.webp"
              alt="M. Aslam Khan — Web Developer & Trading Educator"
              className="h-full w-full rounded-full border-2 border-background object-cover"
              onError={(e) => {
                const parent = e.currentTarget.parentElement
                if (parent) parent.style.display = 'none'
              }}
            />
          </span>
          <p className="text-base text-muted-foreground sm:text-lg">
            I am <strong className="text-foreground">M. Aslam Khan</strong> — trading educator and
            web developer.{' '}
            <a
              href="https://tradeed.online"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              tradeed.online
            </a>{' '}
            (my own platform) was designed and developed by me — trading, education and fintech
            websites are my specialty.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href={WHATSAPP}>
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </ButtonLink>
          <ButtonLink
            href="mailto:info@tradeed.online?subject=Website%20project%20enquiry"
            variant="outline"
            newTab={false}
          >
            <Mail className="h-4 w-4" /> info@tradeed.online
          </ButtonLink>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Reply within 24 hours</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Free consultation</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Fixed quote — no hidden costs</span>
        </div>
      </div>

      {/* Portfolio proof */}
      <Card className="mt-14 overflow-hidden border-primary/40">
        <CardContent className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground">Flagship Project</Badge>
              <a
                href="https://tradeed.online"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline"
              >
                See tradeed.online live →
              </a>
            </div>
            <h2 className="text-2xl font-bold">TradeEd — Urdu Trading Education Platform</h2>
            <p className="mt-2 text-muted-foreground">
              My own full production platform: courses, payments, blog, AI tools and calculators —
              all built with React + Tailwind + Supabase. Thousands of students use it every day.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Auth + Payments', 'SEO', 'Dark Mode'].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center sm:gap-6">
            <div>
              <div className="text-2xl font-bold text-primary">3</div>
              <div className="text-xs text-muted-foreground">Courses</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">27</div>
              <div className="text-xs text-muted-foreground">Blogs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">40+</div>
              <div className="text-xs text-muted-foreground">Books</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio */}
      <section className="mt-16">
        <h2 className="text-center text-3xl font-bold">Selected Work</h2>
        <p className="mt-2 text-center text-muted-foreground">
          Live demos — click any card to open the full site. Every build is fast and fully responsive.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {portfolio.map((p) => (
            <a
              key={p.title}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/50"
            >
              <div className="aspect-[16/10] overflow-hidden border-b border-border">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">{p.cat}</div>
                <div className="mt-1 flex items-center justify-between">
                  <h3 className="font-semibold">{p.title}</h3>
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="mt-16">
        <h2 className="text-center text-3xl font-bold">What I can build for you</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Card key={s.title} className="transition-all hover:-translate-y-1 hover:border-primary/50">
              <CardContent className="p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <span key={t} className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why me */}
      <section className="mt-16">
        <h2 className="text-center text-3xl font-bold">Why work with me?</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Award, title: 'Trading domain expert', desc: 'A developer who understands your trading/fintech website — not just design, but business sense too.' },
            { icon: Zap, title: 'Fast delivery', desc: 'Landing page in 48 hours. Timelines kept — and you hear from me first if anything changes.' },
            { icon: Smartphone, title: 'Mobile-first design', desc: '90% of traffic comes from mobile — every page is perfect on mobile first, then desktop.' },
            { icon: Users, title: 'Clear communication', desc: 'No technical jargon — I explain things simply, you approve, then I build.' },
          ].map((w) => (
            <Card key={w.title}>
              <CardContent className="p-5">
                <w.icon className="mb-2 h-5 w-5 text-primary" />
                <h3 className="font-semibold">{w.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{w.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="mt-16">
        <h2 className="text-center text-3xl font-bold">Packages</h2>
        <p className="mt-2 text-center text-muted-foreground">
          Starting prices — final quote depends on project scope
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {packages.map((p) => (
            <Card key={p.name} className={p.highlight ? 'relative border-primary shadow-lg' : ''}>
              {p.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              <CardContent className="p-6">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.for}</p>
                <div className="my-4 text-4xl font-bold text-primary">{p.price}</div>
                <ul className="space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  href={WHATSAPP}
                  size="default"
                  variant={p.highlight ? 'default' : 'outline'}
                  className="mt-6 w-full"
                >
                  Start your order <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="mt-16">
        <h2 className="text-center text-3xl font-bold">How it works</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <Card key={s.n}>
              <CardContent className="p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {s.n}
                </div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="text-center text-3xl font-bold">Frequently asked questions</h2>
        <div className="mx-auto mt-8 max-w-3xl space-y-3">
          {faqs.map((f) => (
            <Card key={f.q}>
              <CardContent className="p-5">
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <Card className="mt-16 border-primary/40 bg-primary/5">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold">Let's start today</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Send one message — reply within 24 hours, free consultation and a fixed quote.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href={WHATSAPP}>
              <MessageCircle className="h-4 w-4" /> WhatsApp: 0320-8427368
            </ButtonLink>
            <Button size="lg" variant="outline" onClick={() => onNavigate('contact')}>
              Fill out the contact form <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
