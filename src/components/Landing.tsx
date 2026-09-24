import {
  TrendingUp,
  BookOpen,
  Users,
  Award,
  Play,
  ArrowRight,
  BarChart3,
  Shield,
  Zap,
  Star,
  ChevronRight,
  Library,
  Calculator,
  Youtube,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface LandingProps {
  onNavigateToCourses: () => void
  onNavigateToBooks: () => void
  onSignIn: () => void
}

const stats = [
  { label: 'Urdu Books', value: '25+' },
  { label: 'Total Chapters', value: '500+' },
  { label: 'Daily Videos', value: 'YouTube' },
  { label: 'Language', value: 'Urdu' },
]

const features = [
  {
    icon: BookOpen,
    title: 'Expert-Led Courses',
    description: 'Professional traders se seekhein — structured courses, beginner se advanced tak.',
  },
  {
    icon: Library,
    title: '25+ Urdu Books',
    description: 'Trading ki har topic par detail books — spot, futures, risk management, psychology.',
  },
  {
    icon: Play,
    title: 'Daily YouTube Videos',
    description: 'Rozana trading videos Urdu mein — market analysis, tutorials, live sessions.',
  },
  {
    icon: Shield,
    title: 'Risk Management',
    description: 'Capital protection ki skills — profitable trading ki foundation.',
  },
  {
    icon: Calculator,
    title: 'Free Trading Tools',
    description: 'Risk calculator, position size calculator — sab kuch free.',
  },
  {
    icon: Zap,
    title: 'AI-Powered Learning',
    description: 'AI tools se personalized learning experience.',
  },
]

const bookCategories = [
  { name: 'Crypto Trading', count: '8 books', icon: TrendingUp },
  { name: 'Forex Trading', count: '5 books', icon: BarChart3 },
  { name: 'Risk Management', count: '3 books', icon: Shield },
  { name: 'Trading Psychology', count: '3 books', icon: Award },
  { name: 'Technical Analysis', count: '4 books', icon: BarChart3 },
  { name: 'Platform Guides', count: '3 books', icon: BookOpen },
]

export function Landing({ onNavigateToCourses, onNavigateToBooks, onSignIn }: LandingProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background via-background to-card">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-32">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="space-y-6 text-center md:text-left">
              <Badge variant="secondary" className="gap-1.5">
                <Star className="h-3 w-3 fill-primary text-primary" />
                Trading Education in Urdu
              </Badge>
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                Trading seekhein{' '}
                <span className="text-highlight">Urdu mein</span>,{' '}
                zero se professional tak
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                25+ books, structured courses, daily YouTube videos aur free trading tools —
                sab kuch Urdu mein. Pakistani traders ke liye, Pakistani traders dwara.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
                <Button size="lg" onClick={onNavigateToCourses} className="gap-2 px-8">
                  Browse Courses
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={onNavigateToBooks} className="gap-2 px-8">
                  <Library className="h-5 w-5" />
                  View Books
                </Button>
              </div>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  Free to start
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  No credit card
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  Urdu content
                </span>
              </div>
            </div>

            {/* Hero stats card */}
            <div className="relative">
              <Card className="overflow-hidden border-primary/20 shadow-2xl">
                <div className="bg-gradient-to-br from-primary/10 via-card to-card p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">TradeEd Platform</h3>
                      <p className="text-xs text-muted-foreground">Everything in one place</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat) => (
                      <div key={stat.label} className="rounded-lg border border-border bg-card/50 p-4">
                        <div className="text-2xl font-bold text-primary">{stat.value}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Books Showcase */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">25+ Urdu Books</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Trading ki har topic par mukammal books — diagrams, examples aur quizzes ke saath.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {bookCategories.map((cat) => (
              <Card
                key={cat.name}
                className="group cursor-pointer transition-all hover:border-highlight/60 hover:shadow-lg"
                onClick={onNavigateToBooks}
              >
                <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-highlight/20">
                    <cat.icon className="h-6 w-6 text-primary transition-colors group-hover:text-highlight" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{cat.count}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-card/50 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Learning se le kar practice tak — sab tools ek hi jagah.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-md transition-shadow">
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

      {/* YouTube CTA */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Card className="overflow-hidden border-primary/30">
            <div className="grid md:grid-cols-2 md:items-center">
              <div className="p-8 md:p-12 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                    <Youtube className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">TradeEd YouTube</h3>
                    <p className="text-xs text-muted-foreground">Daily trading videos</p>
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Rozana market analysis aur tutorials
                </h2>
                <p className="text-muted-foreground">
                  YouTube par daily videos — market updates, trading tutorials, live sessions
                  aur Q&amp;A. Subscribe karein aur notifications on karein.
                </p>
                <Button
                  size="lg"
                  className="gap-2 bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => window.open('https://youtube.com/@TradeEd', '_blank')}
                >
                  <Youtube className="h-5 w-5" />
                  Subscribe on YouTube
                </Button>
              </div>
              <div className="bg-gradient-to-br from-red-500/10 via-card to-card p-8 md:p-12">
                <div className="space-y-4">
                  {[
                    'Daily market analysis (Urdu)',
                    'Step-by-step trading tutorials',
                    'Live trading sessions',
                    'Q&A sessions with students',
                    'Book reviews aur summaries',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                        <Play className="h-3 w-3 text-red-500" />
                      </div>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary/90 to-primary text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <Award className="h-12 w-12 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Trading Journey?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Free se shuru karein — koi credit card nahi chahiye. Urdu mein seekhein,
            apni speed par.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              onClick={onSignIn}
              className="border-2 border-transparent bg-background text-foreground hover:bg-background/90 active:bg-background/80 font-semibold px-10 gap-2"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              onClick={onNavigateToCourses}
              className="border-2 border-primary-foreground/70 bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground hover:text-primary active:bg-primary-foreground/80 font-semibold px-10 gap-2"
            >
              <BookOpen className="h-5 w-5" />
              Explore Courses
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
