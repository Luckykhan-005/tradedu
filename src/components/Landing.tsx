import {
  TrendingUp,
  BookOpen,
  Award,
  Play,
  ArrowRight,
  BarChart3,
  Shield,
  Zap,
  ChevronRight,
  Calculator,
  NotebookPen,
  Library,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PAGE_PATHS } from '@/lib/routes'

interface LandingProps {
  onNavigateToCourses: () => void
  onSignIn: () => void
}

const features = [
  {
    icon: BarChart3,
    title: 'Structured Courses',
    description: 'Every course is organised into modules and lessons, from beginner to advanced.',
  },
  {
    icon: Play,
    title: 'Video Lessons',
    description: 'Watch at your own pace — pause, rewind and revisit a lesson whenever you need to.',
  },
  {
    icon: Shield,
    title: 'Risk Management',
    description: 'Learn position sizing and capital protection before you risk real money.',
  },
  {
    icon: Zap,
    title: 'Live Sessions',
    description: 'Join scheduled live sessions with your instructor on the Premium plan.',
  },
]

// These describe what the platform actually offers. Invented statistics ("12,500+
// students", "94% success rate") and testimonials from people who never used the
// site damage trust the moment a new student checks them, so they are replaced
// with capabilities a visitor can verify for themselves.
const highlights = [
  {
    icon: Play,
    title: 'Structured Video Lectures',
    description: 'Lessons are organised into modules so you always know what to study next.',
  },
  {
    icon: Library,
    title: 'Free + Premium Book Library',
    description: 'Read full trading books in the browser, with beginner titles open to everyone.',
  },
  {
    icon: Calculator,
    title: 'Risk & Position Calculator',
    description: 'Size every trade correctly before you enter — available on the free plan.',
  },
  {
    icon: NotebookPen,
    title: 'Trading Journal',
    description: 'Log trades, review results and build a record you can actually learn from.',
  },
]

// The per-level lesson counts were invented. Students can see the real counts
// on the courses page, so the cards link there instead of quoting a number.
const levels = [
  {
    level: 'Beginner',
    title: 'Trading Foundations',
    description: 'Start from zero. Learn market basics, chart reading, and your first trading strategy.',
    icon: BookOpen,
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    level: 'Intermediate',
    title: 'Strategy Development',
    description: 'Build systematic strategies, master technical indicators, and develop your edge.',
    icon: BarChart3,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    level: 'Advanced',
    title: 'Professional Trading',
    description: 'Advanced price action, smart money concepts, risk control and trading psychology.',
    icon: TrendingUp,
    color: 'bg-purple-100 text-purple-700',
  },
]

export function Landing({ onNavigateToCourses, onSignIn }: LandingProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section — Banner Image */}
      <section className="relative overflow-hidden bg-black">
        <img
          src="/hero-banner.png"
          alt="TradeEd — Crypto & Forex Trading Education"
          className="w-full h-auto object-cover max-h-[600px] md:max-h-[700px]"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 md:p-12">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onNavigateToCourses}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 gap-2 shadow-lg"
            >
              Browse Courses
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              onClick={onSignIn}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold px-8 backdrop-blur-sm"
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </section>

      {/* What the platform includes — verifiable claims, not marketing numbers */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => (
              <div key={item.title} className="flex items-start gap-3 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-sm text-muted-foreground">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Learning Path</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Whether you're just starting out or looking to refine advanced strategies,
              we have a path designed for you.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {levels.map((level) => (
              <Card
                key={level.level}
                className="group cursor-pointer border-2 hover:border-primary/20 hover:shadow-lg transition-all"
                onClick={onNavigateToCourses}
              >
                <CardContent className="p-6">
                  <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-4 ${level.color}`}>
                    <level.icon className="h-3.5 w-3.5" />
                    {level.level}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{level.title}</h3>
                  <p className="text-muted-foreground mb-4">{level.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Browse courses</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our platform combines world-class content with practical tools to accelerate your trading journey.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — the manual payment model, stated plainly up front */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How You Get Access</h2>
            <p className="text-muted-foreground text-lg">
              No online payment gateway and no card details — we verify every payment ourselves.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                  1
                </div>
                <h3 className="mb-2 font-bold">Send the fee directly</h3>
                <p className="text-sm text-muted-foreground">
                  Transfer the plan amount to our JazzCash or Easypaisa account — the numbers are shown
                  on the subscribe page.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                  2
                </div>
                <h3 className="mb-2 font-bold">Upload your receipt</h3>
                <p className="text-sm text-muted-foreground">
                  Submit the screenshot of your transfer along with your details on the subscribe form.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                  3
                </div>
                <h3 className="mb-2 font-bold">We activate your account</h3>
                <p className="text-sm text-muted-foreground">
                  Once the payment is confirmed, your plan is activated manually — usually within 24 hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <Award className="h-12 w-12 mx-auto mb-6 text-emerald-300" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Trading Journey?</h2>
          <p className="text-white/80 text-lg mb-8">
            Create a free account to access the beginner course, the risk calculator and the glossary —
            no card and no payment required.
          </p>
          <Button
            size="lg"
            onClick={onSignIn}
            className="bg-white text-primary hover:bg-white/90 font-semibold px-10 gap-2"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 font-bold text-lg text-primary">
              <TrendingUp className="h-5 w-5" />
              TradeEd
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              {/* These used to be dead <span> labels — "Privacy" and "Contact"
                  pointed nowhere. Everything now resolves to a real page. */}
              <Link to={PAGE_PATHS.courses} className="transition-colors hover:text-primary">
                Courses
              </Link>
              <Link to={PAGE_PATHS.pricing} className="transition-colors hover:text-primary">
                Plans
              </Link>
              <Link to={PAGE_PATHS.glossary} className="transition-colors hover:text-primary">
                Glossary
              </Link>
              <Link to={PAGE_PATHS.legal} className="transition-colors hover:text-primary">
                Policies & Disclaimer
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2026 TradeEd. All rights reserved.
            </div>
          </div>
          <p className="mt-6 border-t border-border pt-6 text-center text-xs text-muted-foreground">
            TradeEd provides trading education only. Nothing on this site is financial advice, and
            trading carries a risk of losing your capital. Read the full{' '}
            <Link to={PAGE_PATHS.legal} className="underline hover:text-primary">
              risk disclaimer and policies
            </Link>
            .
          </p>
        </div>
      </footer>
    </div>
  )
}
