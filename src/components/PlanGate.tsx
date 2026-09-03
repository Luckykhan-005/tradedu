import { Lock, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PlanGateProps {
  requiredPlan: 'STARTER' | 'PREMIUM'
  currentPlan?: string
  onUpgrade?: () => void
  onSignIn?: () => void
}

const planMeta: Record<string, { name: string; price: string }> = {
  STARTER: { name: 'Starter', price: '$10/month' },
  PREMIUM: { name: 'Premium', price: '$50/month' },
}

export function PlanGate({ requiredPlan, currentPlan, onUpgrade, onSignIn }: PlanGateProps) {
  const meta = planMeta[requiredPlan]
  const isSignedIn = !!currentPlan

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <Card className="w-full border-primary/20">
        <CardContent className="p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Premium Feature</h1>
          <p className="mb-6 text-muted-foreground">
            This feature requires the <span className="font-semibold text-foreground">{meta.name}</span> plan
            ({meta.price}). Upgrade to unlock unlimited access.
          </p>
          <div className="flex flex-col gap-3">
            {isSignedIn ? (
              <Button onClick={onUpgrade} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Upgrade to {meta.name}
              </Button>
            ) : (
              <>
                <Button onClick={onSignIn} className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Sign In to View Plans
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}