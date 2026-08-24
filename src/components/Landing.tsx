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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface LandingProps {
  onNavigateToCourses: () => void
  onSignIn: () => void
}

const features = [
  {
    icon: BarChart3,
    title: 'Expert-Led Courses',
    description: 'Learn from professional traders with decades of real market experience.',
  },
  {
    icon: Play,
    title: 'Video Lessons',
    description: 'High-quality video content you can pause, rewind, and revisit anytime.',
  },
  {
    icon: Shield,
    title: 'Risk Management',
    description: 'Master the art of protecting your capital — the #1 skill of profitable traders.',
  },
  {
    icon: Zap,
    title: 'Live Trading Sessions',
    description: 'Watch real trades happen in real-time with our experienced instructors.',
  },
]

const stats = [
  { label: 'Active Students', value: '12,500+' },
  { label: 'Video Lessons', value: '350+' },
  { label: 'Expert Instructors', value: '15' },
  { label: 'Success Rate', value: '94%' },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Day Trader',
    text: 'TradeEd completely transformed my approach to the markets. I went from losing money consistently to becoming profitable within 3 months.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Swing Trader',
    text: 'The risk management module alone saved me thousands. This is the education every trader needs before risking real capital.',
    rating: 5,
  },
  {
    name: 'Ayesha Khan',
    role: 'Options Trader',
    text: 'The live sessions are incredible. Seeing a pro trade in real-time and explaining their thought process is worth 10x the price.',
    rating: 5,
  },
]

const levels = [
  {
    level: 'Beginner',
    title: 'Trading Foundations',
    description: 'Start from zero. Learn market basics, chart reading, and your first trading strategy.',
    icon: BookOpen,
    courses: 8,
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    level: 'Intermediate',
    title: 'Strategy Development',
    description: 'Build systematic strategies, master technical indicators, and develop your edge.',
    icon: BarChart3,
    courses: 12,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    level: 'Advanced',
    title: 'Professional Trading',
    description: 'Advanced options, algorithmic concepts, portfolio management, and psychology.',
    icon: TrendingUp,
    courses: 10,
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

      {/* Stats Bar */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
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
                    <span className="text-sm text-muted-foreground">{level.courses} courses</span>
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

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Thousands of Traders</h2>
            <p className="text-muted-foreground text-lg">
              Hear from students who transformed their trading with TradeEd.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <Award className="h-12 w-12 mx-auto mb-6 text-emerald-300" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Trading Journey?</h2>
          <p className="text-white/80 text-lg mb-8">
            Join 12,500+ students already learning with TradeEd. Start with our free beginner course — no credit card required.
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
              <span>About</span>
              <span>Courses</span>
              <span>Blog</span>
              <span>Contact</span>
              <span>Privacy</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2026 TradeEd. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
