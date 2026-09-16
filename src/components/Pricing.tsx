import { Check, X, Zap, Star, Crown, Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/cn'
import { PLAN_CATALOG, PAYMENT_CONTACT, planNameOf } from '@/lib/payment'

/**
 * Prices, names and entitlements live in src/lib/payment.ts (PLAN_CATALOG).
 * The presentation metadata below (colors, icons) is the only thing defined
 * here, so the pricing table, the subscribe form and the payment instructions
 * can never drift apart and quote a student two different amounts.
 */
type Plan = (typeof PLAN_CATALOG)[number] & {
  color: string
  bgGradient: string
  borderColor: string
  icon: typeof Zap
  iconColor: string
  popular?: boolean
}

const styleMeta: Record<string, Pick<Plan, 'color' | 'bgGradient' | 'borderColor' | 'icon' | 'iconColor' | 'popular'>> = {
  FREE: {
    color: 'text-slate-600',
    bgGradient: 'from-slate-50 to-slate-100',
    borderColor: 'border-slate-200',
    icon: Star,
    iconColor: 'text-slate-500',
  },
  STARTER: {
    color: 'text-blue-600',
    bgGradient: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-300',
    icon: Zap,
    iconColor: 'text-blue-500',
    popular: true,
  },
  PREMIUM: {
    color: 'text-amber-600',
    bgGradient: 'from-amber-50 to-amber-100',
    borderColor: 'border-amber-300',
    icon: Crown,
    iconColor: 'text-amber-500',
  },
}

const plans: Plan[] = PLAN_CATALOG.map((p) => ({ ...p, ...styleMeta[p.id] }))

interface PricingProps {
  currentPlan: string
  user: { email: string; plan?: string } | null
  onBack: () => void
  onSubscribe: (plan: string) => void
}

export function Pricing({ currentPlan, user, onSubscribe }: PricingProps) {
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
                Current plan: <span className="text-primary">{planNameOf(currentPlan)}</span>
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
                  plan.id === 'PREMIUM' && !plan.popular && 'ring-2 ring-amber-400 shadow-lg',
                  isCurrent && 'ring-2 ring-emerald-400',
                )}
              >
                {plan.popular && (
                  <div className="absolute right-0 top-0 bg-primary px-4 py-1.5 text-xs font-semibold text-white">
                    POPULAR
                  </div>
                )}
                {plan.id === 'PREMIUM' && (
                  <div className="absolute right-0 top-0 bg-amber-500 px-4 py-1.5 text-xs font-semibold text-white">
                    TOP TIER
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
                      <span className={cn('font-bold', plan.price === 0 ? 'text-2xl' : 'text-3xl')}>
                        {plan.display}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-muted-foreground"> /{plan.period}</span>
                      )}
                    </div>
                    {plan.price > 0 && (
                      <span className="text-sm text-muted-foreground">
                        Paid by JazzCash or Easypaisa transfer
                      </span>
                    )}
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
                    className="mt-6 w-full gap-2"
                    variant={plan.popular || !isCurrent ? 'default' : 'outline'}
                    disabled={isCurrent}
                    onClick={() => onSubscribe(plan.id)}
                  >
                    {isCurrent ? (
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
            <a href={`mailto:${PAYMENT_CONTACT.email}`}>
              <Button variant="outline">Contact Sales</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}