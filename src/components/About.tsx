import { TrendingUp, BookOpen, Users, Award, Target, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface AboutProps {
  onNavigate: (page: 'landing' | 'courses' | 'contact') => void
}

export function About({ onNavigate }: AboutProps) {
  const handleNav = (p: string) => {
    onNavigate(p as 'landing' | 'courses' | 'contact')
  }

  const values = [
    {
      icon: Target,
      title: 'Practical Education',
      description: 'Hum theory nahi, practical skills sikhate hain. Har lesson real market examples ke saath.',
    },
    {
      icon: Heart,
      title: 'Urdu First',
      description: ' Pakistani students ke liye Urdu mein content — koi language barrier nahi.',
    },
    {
      icon: Award,
      title: 'Quality Content',
      description: '25+ books, 500+ chapters, har topic deep aur detailed coverage.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Discord aur Telegram par students ka community — sawalat ke jawab milte hain.',
    },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <TrendingUp className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">About TradeEd</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Trading education in Urdu — simple, practical, honest.
        </p>
      </div>

      {/* Story */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
        <h2>Hamari Story</h2>
        <p>
          TradeEd ki shuruaat ek masle se hui: Pakistani trading students ke liye quality content
          Urdu mein nahi milta tha. English courses mehenge the aur language barrier ki wajah se
          concepts clear nahi hote the.
        </p>
        <p>
          <strong>M. Aslam Khan</strong> ne 2026 mein TradeEd ki bunyad rakhi — ek mission ke saath:
          <em> har Pakistani trader ko professional-level trading education Urdu mein mile</em>.
        </p>
        <p>
          Aaj TradeEd 25+ se zyada books, structured courses, live sessions, AI tools aur ek
          supportive community offer karta hai — sab kuch Urdu mein.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-16">
        {[
          { label: 'Books Published', value: '25+' },
          { label: 'Total Chapters', value: '500+' },
          { label: 'YouTube Videos', value: 'Daily' },
          { label: 'Languages', value: 'Urdu' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Values */}
      <h2 className="text-2xl font-bold mb-8">Hamari Values</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-16">
        {values.map((v) => (
          <Card key={v.title}>
            <CardContent className="flex gap-4 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <v.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{v.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Author */}
      <Card className="mb-16">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-4">About the Author</h2>
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
              AK
            </div>
            <div>
              <h3 className="font-semibold text-lg">M. Aslam Khan</h3>
              <p className="text-sm text-muted-foreground mb-3">Trading Educator & Author</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                M. Aslam Khan ek professional trader aur educator hain. Unka focus trading
                education ko Urdu mein accessible banana hai. Unhon ne trading ke har aspect par
                detail se likha hai — basics se le kar advanced strategies, risk management,
                trading psychology aur platform guides (Binance, Discord) tak.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" onClick={() => handleNav('courses')}>
            <BookOpen className="mr-2 h-4 w-4" />
            Browse Courses
          </Button>
          <Button size="lg" variant="outline" onClick={() => handleNav('contact')}>
            Get in Touch
          </Button>
        </div>
      </div>
    </div>
  )
}
