import { useState } from 'react'
import { Check, X, Zap, Star, Crown, Sparkles, ArrowRight, CreditCard } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/cn'

interface Plan {
  id: string
  name: string
  price: number
  period: string
  color: string
  bgGradient: string
  borderColor: string
  icon: typeof Zap
  iconColor: string
  popular?: boolean
  features: { label: string; included: boolean }[]
}

const plans: Plan[] = [
  {
    id: 'FREE',
    name: 'Free',
    price: 0,
    period: 'forever',
    color: 'text-slate-600',
    bgGradient: 'from-slate-50 to-slate-100',
    borderColor: 'border-slate-200',
    icon: Star,
    iconColor: 'text-slate-500',
    features: [
      { label: 'Free video lectures only', included: true },
      { label: 'Free books', included: true },
      { label: 'Risk Calculator', included: true },
      { label: 'Trading Glossary', included: true },
      { label: 'Trading Journal (limited)', included: true },
      { label: 'All video lectures', included: false },
      { label: 'Course certificates', included: false },
      { label: 'AI Trading Tools', included: false },
      { label: 'Live Sessions', included: false },
      { label: 'Premium books', included: false },
    ],
  },
  {
    id: 'STARTER',
    name: 'Starter',
    price: 10,
    period: 'month',
    color: 'text-blue-600',
    bgGradient: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-300',
    icon: Zap,
    iconColor: 'text-blue-500',
    popular: true,
    features: [
      { label: 'All video lectures', included: true },
      { label: 'All books', included: true },
      { label: 'Course certificates', included: true },
      { label: 'Risk Calculator', included: true },
      { label: 'Trading Glossary', included: true },
      { label: 'Trading Journal', included: true },
      { label: 'Free video lectures only', included: false },
      { label: 'AI Trading Tools', included: false },
      { label: 'Live Sessions', included: false },
    ],
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    price: 50,
    period: 'month',
    color: 'text-amber-600',
    bgGradient: 'from-amber-50 to-amber-100',
    borderColor: 'border-amber-300',
    icon: Crown,
    iconColor: 'text-amber-500',
    features: [
      { label: 'All video lectures', included: true },
      { label: 'All books', included: true },
      { label: 'Course certificates', included: true },
      { label: 'AI Trading Tools', included: true },
      { label: 'Live Sessions', included: true },
      { label: 'Risk Calculator', included: true },
      { label: 'Trading Glossary', included: true },
      { label: 'Trading Journal', included: true },
      { label: 'Priority support', included: true },
    ],
  },
]

interface PricingProps {
  currentPlan: string
  user: { email: string; plan?: string } | null
  onBack: () => void
}

export function Pricing({ currentPlan, user, onBack }: PricingProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleUpgrade = async (planId: string) => {
    if (!user) return
    if (planId === currentPlan) return
    setSelected(planId)
    setProcessing(true)
    // Simulate upgrade — in production this would call a payment gateway
    await new Promise((r) => setTimeout(r, 1500))
    alert(`✨ ${planId === 'STARTER' ? 'Starter' : 'Premium'} plan selected! Payment integration will be added soon.`)
    setProcessing(false)
    setSelected(null)
  }

  const planNames: Record<string, string> = { FREE: 'Free', STARTER: 'Starter', PREMIUM: 'Premium' }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-10 text-center">
          <div className="mb-2 flex items-center justify-center gap-3">
            <Sparkles className="h-7 w-7 text-amber-500" />
            <h1 className="text-3xl font-bold tracking-tight">Choose Your Plan</h1>
          </div>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Unlock the full potential of TradeEd. Pick the plan that fits your trading journey.
            {user && (
              <span className="ml-2 font-medium text-foreground">
                Current plan: <span className="text-primary">{planNames[currentPlan] || 'Free'}</span>
              </span>
            )}
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan
            const Icon = plan.icon
            return (
              <Card
                key={plan.id}
                className={cn(
                  'relative overflow-hidden transition-all duration-300',
                  plan.popular && 'ring-2 ring-primary shadow-lg scale-[1.02]',
                  isCurrent && 'ring-2 ring-emerald-400',
                )}
              >
                {plan.popular && (
                  <div className="absolute right-0 top-0 bg-primary px-4 py-1.5 text-xs font-semibold text-white">
                    POPULAR
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute right-0 top-0 bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white">
                    CURRENT
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="mb-4 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm">
                      <Icon className={cn('h-6 w-6', plan.iconColor)} />
                    </div>
                    <h2 className="text-xl font-bold">{plan.name}</h2>
                    <div className="mt-2">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                    {plan.price === 0 && <span className="text-sm text-muted-foreground">No credit card needed</span>}
                  </div>

                  <Separator className="mb-4" />

                  <ul className="space-y-3">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        {f.included ? (
                          <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                        ) : (
                          <X className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                        )}
                        <span className={f.included ? '' : 'text-muted-foreground/50'}>{f.label}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={cn('mt-6 w-full gap-2', plan.popular && '')}
                    variant={plan.popular || !isCurrent ? 'default' : 'outline'}
                    disabled={isCurrent || processing}
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    {processing && selected === plan.id ? (
                      <>Processing...</>
                    ) : isCurrent ? (
                      'Current Plan'
                    ) : (
                      <>
                        {plan.price === 0 ? 'Get Started' : 'Subscribe'}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mx-auto mt-8 max-w-3xl">
          <CardContent className="p-6 text-center">
            <h3 className="mb-2 font-semibold">Enterprise / Group Plans</h3>
            <p className="mb-4 text-muted-foreground">
              Contact us for team discounts, institutional access, or custom plans.
            </p>
            <Button variant="outline" asChild>
              <a href="mailto:jamalkhanlashari005@gmail.com">Contact Sales</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}