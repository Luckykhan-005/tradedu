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
  encodeURIComponent('Salam! Mujhe apni website banwani hai — Hire Me page se aaya/aayi hun.')

// Button jaisa anchor (project ka Button asChild support nahi karta)
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

const services = [
  {
    icon: TrendingUp,
    title: 'Trading & Education Websites',
    desc: 'Trading academies, courses, signal providers aur fintech brands ke liye complete websites — jese tradeed.online.',
    tags: ['React', 'Supabase', 'Courses'],
  },
  {
    icon: Rocket,
    title: 'Landing Pages',
    desc: 'High-converting single pages — product, service ya campaign ke liye. Fast, mobile-first aur eye-catching.',
    tags: ['24-48 hours', 'Mobile-first', 'Fast'],
  },
  {
    icon: ShoppingCart,
    title: 'E-commerce Stores',
    desc: 'Shopify ya WordPress (WooCommerce) par online store — products, payment gateway aur order management ke sath.',
    tags: ['Shopify', 'WooCommerce', 'Payments'],
  },
  {
    icon: Code2,
    title: 'Custom Web Apps',
    desc: 'Dashboards, tools, portals aur custom React/Next.js applications — aap ke idea ke mutabiq bana kar dein.',
    tags: ['React', 'Next.js', 'Supabase'],
  },
  {
    icon: Search,
    title: 'SEO & Speed Optimization',
    desc: 'Maujooda website ki ranking aur speed improve karein — Core Web Vitals, meta tags aur technical SEO.',
    tags: ['Google ranking', 'Core Vitals'],
  },
  {
    icon: Wrench,
    title: 'Maintenance & Support',
    desc: 'Website ki updates, backups, edits aur security — monthly plan par regular care.',
    tags: ['Monthly', 'Updates', 'Security'],
  },
]

const packages = [
  {
    name: 'Starter',
    price: '$79',
    for: 'Landing page /1-page site',
    features: [
      '1 responsive page',
      'Contact form / WhatsApp button',
      'Basic SEO (title + description)',
      '3 din mein delivery',
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
      'Blog ya portfolio section',
      'Contact form + Google Maps',
      'Full on-page SEO',
      'Speed optimization',
      '7 din mein delivery',
      'Unlimited revisions (7 din tak)',
    ],
    highlight: true,
  },
  {
    name: 'Custom App',
    price: '$499+',
    for: 'Web app / e-commerce / custom',
    features: [
      'Custom design ya Figma se build',
      'Database + user accounts',
      'Admin dashboard',
      'Payment integration',
      '14-21 din (scope ke mutabiq)',
      '30 din free support',
    ],
    highlight: false,
  },
]

const steps = [
  {
    n: '1',
    title: 'Free Consultation',
    desc: 'WhatsApp ya email par aap ki zaroorat samjhein — kya chahiye, budget aur timeline.',
  },
  {
    n: '2',
    title: 'Scope & Fixed Quote',
    desc: 'Clear plan: kya kya banega, kitne ka aur kab tak. Surprise koi hidden cost nahi.',
  },
  {
    n: '3',
    title: 'Build & Updates',
    desc: 'Har step par update — design approve, phir pages, phir final review.',
  },
  {
    n: '4',
    title: 'Launch & Support',
    desc: 'Domain/hosting par live karein, sikhayein kaise manage karein — 30 din free support.',
  },
]

const faqs = [
  {
    q: 'Kitna time lagta hai?',
    a: 'Landing page 2-3 din, business website 7-10 din, custom app scope ke mutabiq 2-3 hafte. Rush order par express delivery bhi mumkin hai.',
  },
  {
    q: 'Payment kaise karein?',
    a: '50% advance, 50% delivery par — bank transfer, EasyPaisa/JazzCash ya PayPal. Har milestone par invoice.',
  },
  {
    q: 'Domain aur hosting shamil hai?',
    a: 'Domain/hosting aap apne naam se khareedein (GoDaddy/Namecheap) — main setup sambhal lunga. Chahen toh best options bhi suggest karunga.',
  },
  {
    q: 'Mujhe technical knowledge nahi hai — phir bhi?',
    a: 'Bilkul. Aap sirf idea dein — design, code, deploy sab main karunga. Delivery par ek call mein poora system sikhata hun.',
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
          Aap ki website? <span className="text-primary">Main bana dun.</span>
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
            Main <strong className="text-foreground">M. Aslam Khan</strong> — trading educator aur
            web developer.{' '}
            <a
              href="https://tradeed.online"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              tradeed.online
            </a>{' '}
            (mera apna platform) khud maine design aur develop kiya — trading, education aur fintech
            websites meri speciality hai.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href={WHATSAPP}>
            <MessageCircle className="h-4 w-4" /> WhatsApp par baat karein
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
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> 24 ghante mein jawab</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Free consultation</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Fixed quote — koi hidden cost nahi</span>
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
                tradeed.online live dekhein →
              </a>
            </div>
            <h2 className="text-2xl font-bold">TradeEd — Urdu Trading Education Platform</h2>
            <p className="mt-2 text-muted-foreground">
              Mera apna full production platform: courses, payments, blog, AI tools aur calculators —
              sab kuch React + Tailwind + Supabase par. Har roz hazaron students use karte hain.
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
              <div className="text-2xl font-bold text-primary">25+</div>
              <div className="text-xs text-muted-foreground">Books</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <section className="mt-16">
        <h2 className="text-center text-3xl font-bold">Main kya bana sakta hun</h2>
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
        <h2 className="text-center text-3xl font-bold">Mujhe kyun choose karein?</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Award, title: 'Trading domain expert', desc: 'Aap ki trading/fintech website ko samajhne wala developer — sirf design nahi, business sense bhi.' },
            { icon: Zap, title: 'Fast delivery', desc: 'Landing page 48 ghante mein. Timeline maintain — late hone par update pehle se.' },
            { icon: Smartphone, title: 'Mobile-first design', desc: '90% traffic mobile se aata hai — har page pehle mobile par perfect, phir desktop.' },
            { icon: Users, title: 'Roman Urdu communication', desc: 'Koi technical jargon nahi — aap ki zubaan mein samjhaunga, aap approve karein, phir kaam.' },
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
          Starting prices — final quote project ke scope ke mutabiq
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
                  Order shuru karein <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="mt-16">
        <h2 className="text-center text-3xl font-bold">Kaam kaise hota hai</h2>
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
        <h2 className="text-center text-3xl font-bold">Aam sawalat</h2>
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
          <h2 className="text-2xl font-bold">Aaj hi shuru karein</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Ek message bhejein — 24 ghante mein jawab, free consultation aur fixed quote.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href={WHATSAPP}>
              <MessageCircle className="h-4 w-4" /> WhatsApp: 0320-8427368
            </ButtonLink>
            <Button size="lg" variant="outline" onClick={() => onNavigate('contact')}>
              Contact form bharein <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
